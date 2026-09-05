/**
 * High-level PDF compression engine (iLovePDF / 11zon style).
 *
 * Two passes are attempted and the smallest valid result wins:
 *  1. Lossless structural optimization (object streams, dropped orphan objects).
 *  2. Rasterized rebuild: each page is rendered with pdf.js at a target DPI and
 *     re-encoded as JPEG/WebP, then re-assembled with pdf-lib.
 *
 * A "target size" mode iteratively lowers DPI + image quality until the output
 * fits the requested budget (best effort).
 */
import { loadPDFLib, loadPDFJS } from "@/lib/lazyLoaders";

export type CompressPresetId = "less" | "recommended" | "extreme" | "custom" | "target";

export interface CompressSettings {
  /** 1-100, higher = more compression */
  level: number;
  /** Optional target output size in KB (target mode) */
  targetKB?: number;
  /** Keep text selectable (skips rasterization) */
  losslessOnly?: boolean;
  /** Preferred image codec for rasterized pages */
  codec?: "jpeg" | "webp";
  /** Convert page images to grayscale for extra savings */
  grayscale?: boolean;
}

export interface CompressResult {
  bytes: Uint8Array;
  method: "lossless" | "rasterized";
  scaleUsed: number;
  qualityUsed: number;
  pages: number;
}

export interface CompressProgress {
  (percent: number, label?: string): void;
}

/** Map a 1-100 level to render scale + image quality. */
export const levelToParams = (level: number) => {
  const l = Math.min(100, Math.max(1, level));
  // scale: 2.0 (crisp) -> 0.75 (aggressive)
  const scale = +(2.0 - (l / 100) * 1.25).toFixed(3);
  // quality: 0.92 -> 0.40
  const quality = +(0.92 - (l / 100) * 0.52).toFixed(3);
  return { scale, quality };
};

const canvasToBytes = async (
  canvas: HTMLCanvasElement,
  codec: "jpeg" | "webp",
  quality: number
): Promise<{ bytes: Uint8Array; type: "jpeg" | "webp" }> => {
  const mime = codec === "webp" ? "image/webp" : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, mime, quality)
  );
  if (!blob) throw new Error("Canvas encoding failed");
  const buf = new Uint8Array(await blob.arrayBuffer());
  // Browser may fall back to png if webp unsupported — detect JPEG magic bytes.
  const isJpeg = buf[0] === 0xff && buf[1] === 0xd8;
  return { bytes: buf, type: isJpeg ? "jpeg" : codec === "webp" ? "webp" : "jpeg" };
};

const toGrayscale = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const g = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) | 0;
    d[i] = d[i + 1] = d[i + 2] = g;
  }
  ctx.putImageData(img, 0, 0);
};

/** Pass 1: structural / lossless optimization. */
export const compressLossless = async (buffer: ArrayBuffer): Promise<Uint8Array> => {
  const { PDFDocument } = await loadPDFLib();
  const src = await PDFDocument.load(buffer, { ignoreEncryption: true, updateMetadata: false });
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, src.getPageIndices());
  pages.forEach((p) => out.addPage(p));
  out.setTitle("");
  out.setAuthor("");
  out.setSubject("");
  out.setKeywords([]);
  out.setProducer("Docunova AI");
  out.setCreator("Docunova AI");
  return out.save({ useObjectStreams: true, addDefaultPage: false });
};

/** Pass 2: rasterized rebuild at a given scale/quality. */
const rasterize = async (
  buffer: ArrayBuffer,
  opts: { scale: number; quality: number; codec: "jpeg" | "webp"; grayscale?: boolean },
  onProgress?: CompressProgress
): Promise<{ bytes: Uint8Array; pages: number }> => {
  const pdfjs = await loadPDFJS();
  const { PDFDocument } = await loadPDFLib();

  const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer.slice(0)), stopAtErrors: false })
    .promise;
  const out = await PDFDocument.create();
  const total = doc.numPages;

  for (let i = 1; i <= total; i++) {
    const page = await doc.getPage(i);
    const baseViewport = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: opts.scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvas, canvasContext: ctx, viewport } as never).promise;
    if (opts.grayscale) toGrayscale(ctx, canvas.width, canvas.height);

    const { bytes, type } = await canvasToBytes(canvas, opts.codec, opts.quality);
    const image =
      type === "jpeg" ? await out.embedJpg(bytes) : await out.embedPng(bytes);

    const pdfPage = out.addPage([baseViewport.width, baseViewport.height]);
    pdfPage.drawImage(image, {
      x: 0,
      y: 0,
      width: baseViewport.width,
      height: baseViewport.height,
    });

    canvas.width = 0;
    canvas.height = 0;
    onProgress?.(Math.round((i / total) * 100), `Optimizing page ${i} of ${total}`);
  }

  await doc.cleanup?.();
  const bytes = await out.save({ useObjectStreams: true, addDefaultPage: false });
  return { bytes, pages: total };
};

/**
 * Compress a PDF. Returns the smallest valid output.
 */
export const compressPDF = async (
  file: File,
  settings: CompressSettings,
  onProgress?: CompressProgress
): Promise<CompressResult> => {
  const buffer = await file.arrayBuffer();
  const codec = settings.codec ?? "jpeg";

  onProgress?.(8, "Analyzing document structure");
  let best: CompressResult;
  try {
    const lossless = await compressLossless(buffer.slice(0));
    best = { bytes: lossless, method: "lossless", scaleUsed: 1, qualityUsed: 1, pages: 0 };
  } catch {
    best = {
      bytes: new Uint8Array(buffer.slice(0)),
      method: "lossless",
      scaleUsed: 1,
      qualityUsed: 1,
      pages: 0,
    };
  }

  if (settings.losslessOnly) {
    onProgress?.(100, "Done");
    return best;
  }

  const attempt = async (scale: number, quality: number, from: number, to: number) => {
    const { bytes, pages } = await rasterize(
      buffer.slice(0),
      { scale, quality, codec, grayscale: settings.grayscale },
      (p, label) => onProgress?.(Math.round(from + ((to - from) * p) / 100), label)
    );
    return { bytes, pages, scale, quality };
  };

  // Target-size mode: progressively more aggressive passes.
  if (settings.targetKB && settings.targetKB > 0) {
    const targetBytes = settings.targetKB * 1024;
    if (best.bytes.byteLength <= targetBytes) {
      onProgress?.(100, "Done");
      return best;
    }
    const ladder: Array<[number, number]> = [
      [1.5, 0.8],
      [1.2, 0.65],
      [1.0, 0.5],
      [0.8, 0.4],
      [0.6, 0.3],
      [0.45, 0.22],
    ];
    let bestRaster: CompressResult | null = null;
    for (let i = 0; i < ladder.length; i++) {
      const [scale, quality] = ladder[i];
      const from = 12 + (i * 86) / ladder.length;
      const to = 12 + ((i + 1) * 86) / ladder.length;
      const r = await attempt(scale, quality, from, to);
      const candidate: CompressResult = {
        bytes: r.bytes,
        method: "rasterized",
        scaleUsed: scale,
        qualityUsed: quality,
        pages: r.pages,
      };
      if (!bestRaster || candidate.bytes.byteLength < bestRaster.bytes.byteLength) {
        bestRaster = candidate;
      }
      if (candidate.bytes.byteLength <= targetBytes) break;
    }
    onProgress?.(100, "Done");
    if (bestRaster && bestRaster.bytes.byteLength < best.bytes.byteLength) return bestRaster;
    return best;
  }

  // A single render can be larger than an already image-heavy source PDF.
  // Escalate gently until we get a meaningful reduction, but never push far
  // beyond the level the user actually chose — an aggressive fallback would
  // silently return a blurry file (and cost several extra full renders).
  const baseLevel = Math.min(100, Math.max(1, settings.level));
  const cap = Math.min(100, baseLevel + 20);
  const levels = Array.from(
    new Set([baseLevel, Math.min(cap, baseLevel + 10), cap])
  );
  const meaningfulTarget = file.size * 0.98;

  for (let i = 0; i < levels.length; i++) {
    const { scale, quality } = levelToParams(levels[i]);
    const from = 12 + (i * 86) / levels.length;
    const to = 12 + ((i + 1) * 86) / levels.length;
    const r = await attempt(scale, quality, from, to);
    const raster: CompressResult = {
      bytes: r.bytes,
      method: "rasterized",
      scaleUsed: scale,
      qualityUsed: quality,
      pages: r.pages,
    };
    if (raster.bytes.byteLength < best.bytes.byteLength) best = raster;
    if (best.bytes.byteLength <= meaningfulTarget) break;
  }

  onProgress?.(100, "Done");
  return best;
};

export const PRESETS: Record<
  Exclude<CompressPresetId, "custom" | "target">,
  { label: string; description: string; level: number; losslessOnly?: boolean }
> = {
  less: {
    label: "Less compression",
    description: "Keeps text selectable and searchable, gentle size reduction",
    level: 28,
    losslessOnly: true,
  },
  recommended: {
    label: "Recommended",
    description: "Good quality, big size reduction",
    level: 55,
  },
  extreme: {
    label: "Extreme compression",
    description: "Smallest possible file",
    level: 90,
  },
};
