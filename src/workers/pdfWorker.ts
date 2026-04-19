/// <reference lib="webworker" />
/**
 * PDF Web Worker - offloads heavy pdf-lib operations off the main thread.
 * Keeps UI responsive even when processing 100MB+ files or 50+ page PDFs.
 *
 * Communication: { id, op, payload } -> { id, ok, result | error, progress? }
 */
import { PDFDocument } from "pdf-lib";

type WorkerOp =
  | { id: string; op: "merge"; payload: { files: ArrayBuffer[] } }
  | { id: string; op: "split"; payload: { file: ArrayBuffer; pages: number[] } }
  | { id: string; op: "extractPages"; payload: { file: ArrayBuffer; pages: number[] } }
  | { id: string; op: "rotate"; payload: { file: ArrayBuffer; rotation: number; pages?: number[] } }
  | { id: string; op: "removePages"; payload: { file: ArrayBuffer; pages: number[] } }
  | { id: string; op: "reorder"; payload: { file: ArrayBuffer; order: number[] } };

const ctx = self as unknown as DedicatedWorkerGlobalScope;

function post(id: string, data: Record<string, unknown>) {
  ctx.postMessage({ id, ...data });
}

async function merge(id: string, files: ArrayBuffer[]) {
  const merged = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    const pdf = await PDFDocument.load(files[i]);
    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
    post(id, { progress: ((i + 1) / files.length) * 90 });
  }
  const bytes = await merged.save();
  return bytes.buffer;
}

async function split(id: string, file: ArrayBuffer, pages: number[]) {
  const src = await PDFDocument.load(file);
  const dest = await PDFDocument.create();
  const indices = pages.map((p) => p - 1);
  const copied = await dest.copyPages(src, indices);
  copied.forEach((p, i) => {
    dest.addPage(p);
    post(id, { progress: 30 + ((i + 1) / copied.length) * 60 });
  });
  const bytes = await dest.save();
  return bytes.buffer;
}

async function rotate(id: string, file: ArrayBuffer, rotation: number, pages?: number[]) {
  const pdf = await PDFDocument.load(file);
  const target = pages?.map((p) => p - 1) ?? pdf.getPageIndices();
  target.forEach((idx, i) => {
    const page = pdf.getPage(idx);
    const current = page.getRotation().angle;
    const { degrees } = require("pdf-lib");
    page.setRotation(degrees((current + rotation) % 360));
    post(id, { progress: ((i + 1) / target.length) * 90 });
  });
  const bytes = await pdf.save();
  return bytes.buffer;
}

async function removePages(id: string, file: ArrayBuffer, pages: number[]) {
  const pdf = await PDFDocument.load(file);
  const toRemove = new Set(pages.map((p) => p - 1));
  const indicesDesc = [...toRemove].sort((a, b) => b - a);
  indicesDesc.forEach((idx, i) => {
    pdf.removePage(idx);
    post(id, { progress: ((i + 1) / indicesDesc.length) * 90 });
  });
  const bytes = await pdf.save();
  return bytes.buffer;
}

async function reorder(id: string, file: ArrayBuffer, order: number[]) {
  const src = await PDFDocument.load(file);
  const dest = await PDFDocument.create();
  const indices = order.map((p) => p - 1);
  const copied = await dest.copyPages(src, indices);
  copied.forEach((p, i) => {
    dest.addPage(p);
    post(id, { progress: ((i + 1) / copied.length) * 90 });
  });
  const bytes = await dest.save();
  return bytes.buffer;
}

ctx.addEventListener("message", async (e: MessageEvent<WorkerOp>) => {
  const { id, op, payload } = e.data;
  try {
    let result: ArrayBuffer;
    switch (op) {
      case "merge":
        result = await merge(id, payload.files);
        break;
      case "split":
      case "extractPages":
        result = await split(id, payload.file, payload.pages);
        break;
      case "rotate":
        result = await rotate(id, payload.file, payload.rotation, payload.pages);
        break;
      case "removePages":
        result = await removePages(id, payload.file, payload.pages);
        break;
      case "reorder":
        result = await reorder(id, payload.file, payload.order);
        break;
      default:
        throw new Error(`Unknown op: ${(op as string) ?? "undefined"}`);
    }
    post(id, { ok: true, result, progress: 100 });
    // Transfer the buffer for zero-copy
    ctx.postMessage({ id, done: true });
  } catch (err) {
    post(id, { ok: false, error: err instanceof Error ? err.message : String(err) });
  }
});

export {}; // make this a module
