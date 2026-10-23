// The OCR endpoint validates the entire data URL, not the original file size.
export const OCR_DATA_URL_LIMIT = 10_000_000;

export async function prepareOCRImage(dataUrl: string): Promise<string> {
  if (!dataUrl.startsWith("data:image/")) throw new Error("Select a supported image for OCR.");
  if (dataUrl.length <= OCR_DATA_URL_LIMIT) return dataUrl;
  const image = new Image();
  image.src = dataUrl;
  await image.decode();
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, 3200 / Math.max(image.naturalWidth, image.naturalHeight));
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Cannot prepare this image.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  for (const quality of [.9, .75, .6]) {
    const result = canvas.toDataURL("image/jpeg", quality);
    if (result.length <= OCR_DATA_URL_LIMIT) return result;
  }
  throw new Error("This image is too complex for OCR. Crop it into smaller sections.");
}