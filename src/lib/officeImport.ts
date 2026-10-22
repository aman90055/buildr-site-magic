import Papa from "papaparse";
import { pdfWorker } from "./pdfWorkerClient";

export function parseDelimited(text: string): string[][] {
  const result = Papa.parse<string[]>(text, { skipEmptyLines: true });
  if (result.errors.some(error => error.type === "Quotes")) throw new Error("Invalid quoted CSV data");
  return result.data;
}

export async function readWord(file: File): Promise<string> {
  if (/\.docx$/i.test(file.name)) {
    const mammoth = await import("mammoth");
    return (await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value;
  }
  if (!/\.(txt|md)$/i.test(file.name)) throw new Error("Use DOCX, TXT or Markdown. Save older Word files as DOCX first.");
  return file.text();
}

export async function readSpreadsheet(file: File): Promise<string[][]> {
  if (/\.xlsx$/i.test(file.name)) {
    const { default: ExcelJS } = await import("exceljs");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());
    const rows: string[][] = [];
    workbook.eachSheet(sheet => {
      rows.push([sheet.name]);
      sheet.eachRow(row => {
        const values: string[] = [];
        for (let i = 1; i <= row.cellCount; i++) values.push(row.getCell(i).text);
        rows.push(values);
      });
    });
    return rows;
  }
  if (!/\.(csv|tsv|txt)$/i.test(file.name)) throw new Error("Use XLSX, CSV or TSV. Save older Excel files as XLSX first.");
  return parseDelimited(await file.text());
}

export async function readPresentation(file: File): Promise<{ title: string; content: string }[]> {
  if (!/\.pptx$/i.test(file.name)) throw new Error("Use PPTX. Save older PowerPoint files as PPTX first.");
  const { default: JSZip } = await import("jszip");
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const presentation = new DOMParser().parseFromString(await zip.file("ppt/presentation.xml")?.async("string") || "", "application/xml");
  const relationships = new DOMParser().parseFromString(await zip.file("ppt/_rels/presentation.xml.rels")?.async("string") || "", "application/xml");
  const slides = [];
  for (const id of Array.from(presentation.getElementsByTagNameNS("*", "sldId"))) {
    const rel = Array.from(relationships.getElementsByTagNameNS("*", "Relationship")).find(rel => rel.getAttribute("Id") === id.getAttribute("r:id"));
    const target = rel?.getAttribute("Target");
    if (!target) continue;
    const path = target.startsWith("/") ? target.slice(1) : `ppt/${target}`;
    const entry = zip.file(path);
    if (!entry) continue;
    const xml = new DOMParser().parseFromString(await entry.async("string"), "application/xml");
    const paragraphs = Array.from(xml.getElementsByTagNameNS("*", "p")).map(p => Array.from(p.getElementsByTagNameNS("*", "t")).map(t => t.textContent || "").join("")).filter(Boolean);
    slides.push({ title: paragraphs[0] || `Slide ${slides.length + 1}`, content: paragraphs.slice(1).join("\n") });
  }
  if (!slides.length) throw new Error("No readable slides found in this PPTX.");
  return slides;
}

// Canvas renders Unicode through the browser fonts; rebuilds run in the PDF worker.
export async function textPagesPdf(sections: string[], onProgress: (value: number) => void): Promise<ArrayBuffer> {
  const pages: { image: ArrayBuffer; width: number; height: number }[] = [];
  const canvas = document.createElement("canvas");
  canvas.width = 1190; canvas.height = 1684;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  const reset = () => { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = "#111111"; ctx.font = "24px sans-serif"; };
  const save = async () => {
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Page export failed")), "image/png"));
    pages.push({ image: await blob.arrayBuffer(), width: 595, height: 842 });
  };
  for (const [index, section] of sections.entries()) {
    reset(); let y = 100;
    for (const line of section.split("\n")) {
      let current = "";
      for (const character of line) {
        if (ctx.measureText(current + character).width > 990) {
          ctx.fillText(current, 100, y); y += 36; current = "";
          if (y > 1584) { await save(); reset(); y = 100; }
        }
        current += character;
      }
      ctx.fillText(current, 100, y); y += 36;
      if (y > 1584) { await save(); reset(); y = 100; }
    }
    if (y > 100) await save();
    onProgress((index + 1) / sections.length * 80);
  }
  if (!pages.length) throw new Error("No content to convert");
  return pdfWorker.run({ op: "imagePages", payload: { pages } }, { onProgress: value => onProgress(80 + value * .2) });
}