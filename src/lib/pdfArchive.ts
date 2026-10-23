export async function archivePdf(file: ArrayBuffer): Promise<ArrayBuffer> {
  const { PDFDocument } = await import("@cantoo/pdf-lib");
  const pdf = await PDFDocument.load(file);
  pdf.convertToPDFA({ conformance: "2B" });
  return new Uint8Array(await pdf.save()).buffer as ArrayBuffer;
}