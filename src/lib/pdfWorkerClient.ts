/**
 * PDF Worker Client - typed wrapper around the PDF Web Worker.
 * Provides cancel support, progress callbacks, and per-job promise resolution.
 *
 * Falls back gracefully to main-thread pdf-lib if Web Workers are unavailable.
 */

type ProgressFn = (percent: number) => void;

export type PDFWorkerOp =
  | { op: "merge"; payload: { files: ArrayBuffer[] } }
  | { op: "split"; payload: { file: ArrayBuffer; pages: number[] } }
  | { op: "extractPages"; payload: { file: ArrayBuffer; pages: number[] } }
  | { op: "rotate"; payload: { file: ArrayBuffer; rotation: number; pages?: number[] } }
  | { op: "removePages"; payload: { file: ArrayBuffer; pages: number[] } }
  | { op: "reorder"; payload: { file: ArrayBuffer; order: number[] } };

class PDFWorkerClient {
  private worker: Worker | null = null;
  private pending = new Map<
    string,
    { resolve: (buf: ArrayBuffer) => void; reject: (err: Error) => void; onProgress?: ProgressFn }
  >();

  private getWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker(new URL("../workers/pdfWorker.ts", import.meta.url), {
        type: "module",
      });
      this.worker.addEventListener("message", (e: MessageEvent) => {
        const { id, ok, result, error, progress } = e.data ?? {};
        const job = this.pending.get(id);
        if (!job) return;
        if (typeof progress === "number" && job.onProgress) {
          job.onProgress(progress);
        }
        if (ok === true) {
          this.pending.delete(id);
          job.resolve(result);
        } else if (ok === false) {
          this.pending.delete(id);
          job.reject(new Error(error || "Worker failed"));
        }
      });
      this.worker.addEventListener("error", (e) => {
        // Reject all pending jobs on worker crash
        this.pending.forEach((job) => job.reject(new Error(e.message || "Worker error")));
        this.pending.clear();
        this.worker?.terminate();
        this.worker = null;
      });
    }
    return this.worker;
  }

  /**
   * Run an operation in the worker. Returns the result ArrayBuffer.
   * Pass `signal` from an AbortController for cancellation.
   */
  async run(
    op: PDFWorkerOp,
    options: { onProgress?: ProgressFn; signal?: AbortSignal } = {}
  ): Promise<ArrayBuffer> {
    // If Web Workers unsupported, fallback to main-thread (rare)
    if (typeof Worker === "undefined") {
      return this.runMainThread(op, options.onProgress);
    }

    const id = crypto.randomUUID();
    const worker = this.getWorker();

    return new Promise<ArrayBuffer>((resolve, reject) => {
      this.pending.set(id, { resolve, reject, onProgress: options.onProgress });

      if (options.signal) {
        if (options.signal.aborted) {
          this.pending.delete(id);
          reject(new DOMException("Aborted", "AbortError"));
          return;
        }
        options.signal.addEventListener(
          "abort",
          () => {
            this.pending.delete(id);
            reject(new DOMException("Aborted", "AbortError"));
            // Restart worker to actually stop in-flight work
            this.terminate();
          },
          { once: true }
        );
      }

      // Transfer buffers to avoid copy
      const transfer: Transferable[] = [];
      if (op.op === "merge") transfer.push(...op.payload.files);
      else if ("file" in op.payload) transfer.push(op.payload.file);

      try {
        worker.postMessage({ id, op: op.op, payload: op.payload }, transfer);
      } catch (err) {
        this.pending.delete(id);
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });
  }

  /** Fallback for environments without Worker support. */
  private async runMainThread(op: PDFWorkerOp, onProgress?: ProgressFn): Promise<ArrayBuffer> {
    const { PDFDocument, degrees } = await import("pdf-lib");
    const toAB = (u8: Uint8Array): ArrayBuffer => {
      const out = new ArrayBuffer(u8.byteLength);
      new Uint8Array(out).set(u8);
      return out;
    };
    if (op.op === "merge") {
      const merged = await PDFDocument.create();
      for (let i = 0; i < op.payload.files.length; i++) {
        const pdf = await PDFDocument.load(op.payload.files[i]);
        const pages = await merged.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
        onProgress?.(((i + 1) / op.payload.files.length) * 90);
      }
      onProgress?.(100);
      return toAB(await merged.save());
    }
    if (op.op === "split" || op.op === "extractPages") {
      const src = await PDFDocument.load(op.payload.file);
      const dest = await PDFDocument.create();
      const copied = await dest.copyPages(src, op.payload.pages.map((p) => p - 1));
      copied.forEach((p) => dest.addPage(p));
      onProgress?.(100);
      return toAB(await dest.save());
    }
    if (op.op === "rotate") {
      const pdf = await PDFDocument.load(op.payload.file);
      const target = op.payload.pages?.map((p) => p - 1) ?? pdf.getPageIndices();
      target.forEach((idx) => {
        const page = pdf.getPage(idx);
        page.setRotation(degrees((page.getRotation().angle + op.payload.rotation) % 360));
      });
      onProgress?.(100);
      return toAB(await pdf.save());
    }
    if (op.op === "removePages") {
      const pdf = await PDFDocument.load(op.payload.file);
      [...new Set(op.payload.pages.map((p) => p - 1))]
        .sort((a, b) => b - a)
        .forEach((idx) => pdf.removePage(idx));
      onProgress?.(100);
      return toAB(await pdf.save());
    }
    if (op.op === "reorder") {
      const src = await PDFDocument.load(op.payload.file);
      const dest = await PDFDocument.create();
      const copied = await dest.copyPages(src, op.payload.order.map((p) => p - 1));
      copied.forEach((p) => dest.addPage(p));
      onProgress?.(100);
      return toAB(await dest.save());
    }
    throw new Error("Unsupported op");
  }

  terminate() {
    this.worker?.terminate();
    this.worker = null;
    this.pending.clear();
  }
}

// Singleton — reuse same worker across the app
export const pdfWorker = new PDFWorkerClient();
