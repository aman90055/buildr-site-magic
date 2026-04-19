/**
 * Lazy loaders for heavy libraries (pdf-lib, pdfjs-dist).
 * These libraries are only loaded when a tool actually needs them,
 * keeping the initial bundle smaller and homepage load faster.
 */

let pdfLibPromise: Promise<typeof import("pdf-lib")> | null = null;
let pdfjsPromise: Promise<typeof import("pdfjs-dist")> | null = null;

export const loadPDFLib = () => {
  if (!pdfLibPromise) {
    pdfLibPromise = import("pdf-lib");
  }
  return pdfLibPromise;
};

export const loadPDFJS = () => {
  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      const pdfjs = await import("pdfjs-dist");
      // Configure worker (same-origin, ESM)
      const workerSrc = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
      pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
      return pdfjs;
    })();
  }
  return pdfjsPromise;
};
