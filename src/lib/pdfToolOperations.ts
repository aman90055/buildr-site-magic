import { openPDFDocument, loadPDFJS } from "./lazyLoaders";
import { pdfWorker } from "./pdfWorkerClient";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

export function textRows(items: TextItem[]): string[][] {
  const rows: { y: number; items: TextItem[] }[] = [];
  for (const item of items.filter((item) => item.str.trim()).sort((a, b) => b.transform[5] - a.transform[5] || a.transform[4] - b.transform[4])) {
    let row = rows.find((row) => Math.abs(row.y - item.transform[5]) <= 3);
    if (!row) { row = { y: item.transform[5], items: [] }; rows.push(row); }
    row.items.push(item);
  }
  return rows.map((row) => row.items.sort((a, b) => a.transform[4] - b.transform[4]).map((item) => item.str));
}

export async function extractPdfRows(file: File, onProgress: (value: number) => void): Promise<string[][]> {
  const pdf = await openPDFDocument(file);
  const rows: string[][] = [];
  try {
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      rows.push(...textRows(content.items.filter((item): item is TextItem => "str" in item)));
      onProgress(i / pdf.numPages * 90);
      page.cleanup();
    }
    if (!rows.length) throw new Error("No selectable text found. Use OCR for scanned PDFs first.");
    return rows;
  } finally { await pdf.cleanup(); }
}

async function renderedPage(pdf: Awaited<ReturnType<typeof openPDFDocument>>, number: number) {
  const page = await pdf.getPage(number);
  const viewport = page.getViewport({ scale: Math.min(2, 2400 / Math.max(page.getViewport({ scale: 1 }).width, page.getViewport({ scale: 1 }).height)) });
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Your browser cannot render this PDF.");
  await page.render({ canvas, canvasContext: context, viewport }).promise;
  return { page, viewport, canvas, context };
}

export async function rasterPdf(file: File, password: string | undefined, onProgress: (value: number) => void, phrase?: string): Promise<ArrayBuffer> {
  const pdfjs = await loadPDFJS();
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), password, stopAtErrors: false }).promise;
  const pages: { image: ArrayBuffer; width: number; height: number }[] = [];
  let matches = 0;
  try {
    for (let number = 1; number <= pdf.numPages; number++) {
      const { page, canvas, context, viewport } = await renderedPage(pdf, number);
      if (phrase) {
        const content = await page.getTextContent();
        const items = content.items.filter((item): item is TextItem => "str" in item);
        const rowItems: TextItem[][] = [];
        for (const item of items) {
          let row = rowItems.find((row) => row[0] && Math.abs(row[0].transform[5] - item.transform[5]) < 3);
          if (!row) { row = []; rowItems.push(row); }
          row.push(item);
        }
        for (const row of rowItems) {
          row.sort((a, b) => a.transform[4] - b.transform[4]);
          const text = row.map((item) => item.str).join(" ").toLocaleLowerCase();
          if (!text.includes(phrase.toLocaleLowerCase().trim())) continue;
          matches++;
          // Conservatively redact the whole matching line, not a guessed substring.
          for (const item of row) {
            const t = pdfjs.Util.transform(viewport.transform, item.transform);
            const height = Math.max(Math.hypot(t[2], t[3]), item.height * viewport.scale, 8);
            const angle = Math.atan2(t[1], t[0]);
            context.save(); context.translate(t[4], t[5]); context.rotate(angle);
            context.fillStyle = "#000000";
            context.fillRect(-3, -height - 3, item.width * viewport.scale + 6, height * 1.5 + 6);
            context.restore();
          }
        }
      }
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Page render failed")), "image/png"));
      const size = page.getViewport({ scale: 1 });
      pages.push({ image: await blob.arrayBuffer(), width: size.width, height: size.height });
      canvas.width = 0; canvas.height = 0; page.cleanup();
      onProgress(number / pdf.numPages * 85);
    }
    if (phrase && !matches) throw new Error("Text not found. Use exact text on one line. Scans need OCR first.");
    return await pdfWorker.run({ op: "imagePages", payload: { pages } }, { onProgress: (value) => onProgress(85 + value * .15) });
  } finally { await pdf.cleanup(); }
}

export async function comparePdfContent(file1: File, file2: File, onProgress: (value: number) => void) {
  const [first, second] = await Promise.all([openPDFDocument(file1), openPDFDocument(file2)]);
  const differences: string[] = [];
  try {
    if (first.numPages !== second.numPages) differences.push(`Page count differs: ${first.numPages} vs ${second.numPages} pages`);
    for (let number = 1; number <= Math.min(first.numPages, second.numPages); number++) {
      const a = await renderedPage(first, number);
      const b = await renderedPage(second, number);
      const [textA, textB] = await Promise.all([a.page.getTextContent(), b.page.getTextContent()]);
      const normalized = (content: typeof textA) => content.items.map((item) => "str" in item ? item.str : "").join(" ").replace(/\s+/g, " ").trim();
      if (normalized(textA) !== normalized(textB)) differences.push(`Page ${number}: text content differs`);
      if (a.canvas.width !== b.canvas.width || a.canvas.height !== b.canvas.height) differences.push(`Page ${number}: dimensions differ`);
      else {
        const pixelsA = a.context.getImageData(0, 0, a.canvas.width, a.canvas.height).data;
        const pixelsB = b.context.getImageData(0, 0, b.canvas.width, b.canvas.height).data;
        if (pixelsA.some((value, index) => Math.abs(value - pixelsB[index]) > 8)) differences.push(`Page ${number}: visible content differs`);
      }
      a.canvas.width = 0; b.canvas.width = 0; a.page.cleanup(); b.page.cleanup();
      onProgress(number / Math.min(first.numPages, second.numPages) * 100);
    }
    return { pdf1Pages: first.numPages, pdf2Pages: second.numPages, pdf1Size: file1.size, pdf2Size: file2.size, differences: differences.length ? differences : ["No text or visible page differences found"] };
  } finally { await Promise.all([first.cleanup(), second.cleanup()]); }
}