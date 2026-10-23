import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import { wordBlob, excelBlob, epubBlob, escapeXml } from "../officeExport";
import { parseDelimited } from "../officeImport";
import { passwordPdf } from "../pdfSecurity";
import { PDFDocument } from "@cantoo/pdf-lib";

// jsdom Blob lacks arrayBuffer; exporters are tested with the native Blob.
import { Blob as NativeBlob } from "node:buffer";
import { vi } from "vitest";
vi.stubGlobal("Blob", NativeBlob);

describe("real document formats", () => {
  it("exports an editable Word package with the supplied text", async () => {
    const blob = await wordBlob("Secret 12345");
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    expect(await zip.file("word/document.xml")?.async("string")).toContain("Secret 12345");
  });
  it("exports spreadsheet values inside an XLSX workbook", async () => {
    const blob = await excelBlob([["Name", "Value"], ["Jane", "12345"]]);
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    expect(await zip.file("xl/sharedStrings.xml")?.async("string")).toContain("Jane");
  });
  it("builds an EPUB package with an uncompressed first mimetype entry", async () => {
    const blob = await epubBlob("A & B", '<html xmlns="http://www.w3.org/1999/xhtml"><head><title>Book</title></head><body>Text</body></html>');
    const bytes = new Uint8Array(await blob.arrayBuffer());
    expect(new DataView(bytes.buffer).getUint16(8, true)).toBe(0);
    const zip = await JSZip.loadAsync(bytes);
    expect(await zip.file("mimetype")?.async("string")).toBe("application/epub+zip");
    expect(await zip.file("OEBPS/content.opf")?.async("string")).toContain("A &amp; B");
  });
  it("preserves quoted commas and embedded newlines in CSV cells", () => {
    expect(parseDelimited('Name,Note\nJane,"Doe, Jane\nSecond line"')).toEqual([["Name", "Note"], ["Jane", "Doe, Jane\nSecond line"]]);
  });
  it("escapes document text rather than inserting XML markup", () => {
    expect(escapeXml("<private>&")).toBe("&lt;private&gt;&amp;");
  });
});

describe("real PDF passwords", () => {
  it("requires the supplied password and rejects a wrong password", async () => {
    const pdf = await PDFDocument.create();
    pdf.addPage().drawText("Private text");
    const protectedBytes = await passwordPdf(new Uint8Array(await pdf.save()).buffer as ArrayBuffer, "test-pass-123", "protect");
    await expect(PDFDocument.load(protectedBytes)).rejects.toThrow();
    await expect(passwordPdf(protectedBytes, "wrong-pass", "unlock")).rejects.toThrow();
    const unlockedBytes = await passwordPdf(protectedBytes, "test-pass-123", "unlock");
    const unlocked = await PDFDocument.load(unlockedBytes);
    expect(unlocked.isEncrypted).toBe(false);
    expect(unlocked.getPageCount()).toBe(1);
  });
});