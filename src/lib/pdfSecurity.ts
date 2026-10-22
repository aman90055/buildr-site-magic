export async function passwordPdf(file: ArrayBuffer, password: string, mode: "protect" | "unlock") {
  const { PDFDocument } = await import("@cantoo/pdf-lib");
  const source = await PDFDocument.load(file, mode === "unlock" ? { password } : {});
  const output = await PDFDocument.create();
  const pages = await output.copyPages(source, source.getPageIndices());
  pages.forEach(page => output.addPage(page));
  if (mode === "protect") output.encrypt({ userPassword: password, ownerPassword: crypto.randomUUID(), algorithm: "AES-256" });
  return new Uint8Array(await output.save()).buffer as ArrayBuffer;
}