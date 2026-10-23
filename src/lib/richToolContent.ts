import toolContent from "@/data/toolContent.json";

export interface RichToolContent {
  name: string;
  category: string;
  introduction?: string;
  whatIsIt?: string;
  whyUse?: string;
  tutorial?: string[];
  bestPractices?: string[];
  mistakes?: string[];
  proTips?: string[];
  useCases?: string[];
  faqs?: { q: string; a: string }[];
}

const DATA = toolContent as Record<string, RichToolContent>;
const verifiedGuides: Record<string, RichToolContent> = {
  "/pdf-to-word": { name: "PDF to Word", category: "convert", whatIsIt: "Extract selectable PDF text into a real editable DOCX. Original images, fonts and layout are not reproduced.", tutorial: ["Choose a PDF with selectable text.", "Click Convert to Word.", "Download Word (.docx) and check the paragraphs."], bestPractices: ["Use OCR first for scans.", "Review reading order in multi-column pages.", "Keep the original PDF for its layout."] },
  "/pdf-to-excel": { name: "PDF to Excel", category: "convert", whatIsIt: "Extract PDF text rows into a real XLSX workbook. Complex table structures may need manual cleanup.", tutorial: ["Choose a text PDF.", "Click Extract Data.", "Download Excel (.xlsx) and check the cells."], bestPractices: ["Use OCR first for scans.", "Check columns and numeric values.", "This tool does not recreate formulas."] },
  "/pdf-to-powerpoint": { name: "PDF to PowerPoint", category: "convert", whatIsIt: "Build a PPTX with one image-based slide per PDF page. Text inside the page image is not editable.", tutorial: ["Choose a PDF.", "Click Convert to Slides.", "Download PowerPoint (.pptx)."], bestPractices: ["Check image clarity.", "Portrait pages leave space beside the image.", "Add new text boxes in PowerPoint for annotations."] },
  "/pdf-to-epub": { name: "PDF to EPUB", category: "convert", whatIsIt: "Package selectable PDF text as an EPUB 3 ebook. Original illustrations and page design are not retained.", tutorial: ["Choose a text PDF.", "Click Convert to eBook.", "Download EPUB and open it in an ebook reader."], bestPractices: ["Use OCR first for scans.", "Check text order before sharing.", "Keep fixed-layout magazines as PDF."] },
  "/word-to-pdf": { name: "Word to PDF", category: "convert", whatIsIt: "Read DOCX text and export it as image-based PDF pages. Original styling and images are not retained.", tutorial: ["Upload DOCX, TXT or Markdown, or paste text.", "Review the extracted text.", "Convert to PDF and download."], bestPractices: ["Save older DOC files as DOCX first.", "Use Word export for exact formatting.", "Check every output page."] },
  "/excel-to-pdf": { name: "Excel to PDF", category: "convert", whatIsIt: "Read XLSX worksheet values or CSV/TSV cells and create image-based PDF pages. Original charts and formatting are not retained.", tutorial: ["Upload XLSX, CSV or TSV.", "Review the extracted values.", "Convert to PDF and download."], bestPractices: ["Save older XLS files as XLSX first.", "Review cached formula results.", "Check wide rows before printing."] },
  "/powerpoint-to-pdf": { name: "PowerPoint to PDF", category: "convert", whatIsIt: "Import PPTX slide text and create readable PDF pages. Pictures, animations and original slide design are not reproduced.", tutorial: ["Upload PPTX or create slide text.", "Review the titles and content.", "Create PDF Presentation and download."], bestPractices: ["Save older PPT files as PPTX first.", "Use PowerPoint export for exact appearance.", "Long slide text may span more than one page."] },
  "/redact-pdf": { name: "Redact PDF", category: "security", whatIsIt: "Black out complete lines containing exact text. Output pages are rebuilt as images without original text, links or attachments.", tutorial: ["Choose a PDF with selectable text.", "Enter exact text occurring on one line.", "Redact PDF, download, and inspect every page."], bestPractices: ["Scanned text is not detected.", "Search and visually check the output.", "The whole matching line is removed, not only the phrase."] },
  "/compare-pdf": { name: "Compare PDF", category: "documents", whatIsIt: "Compare text and rendered appearance page by page, including images and scans. Results flag changed pages, not individual words.", tutorial: ["Choose the first and second PDF.", "Click Compare PDFs.", "Read the page-level change report."], bestPractices: ["Unlock protected PDFs first.", "Review changed pages in the original files.", "No differences means the tested text and page appearance match, not identical metadata."] },
  "/repair-pdf": { name: "Repair PDF", category: "organize", whatIsIt: "Recover pages the PDF viewer can still render into a new image-only PDF. Severely truncated files may be unrecoverable.", tutorial: ["Choose the damaged PDF.", "Click Repair PDF.", "Download and inspect recovered pages."], bestPractices: ["Text selection, forms and links are not retained.", "Keep the damaged original.", "Download the source again if recovery fails."] },
  "/pdf-to-pdfa": { name: "PDF to PDF/A", category: "convert", whatIsIt: "Add PDF/A-2B metadata and an embedded colour profile. This is preparation, not a compliance certificate.", tutorial: ["Choose a readable PDF.", "Convert to PDF/A.", "Download and independently validate before archive submission."], bestPractices: ["Missing source fonts are not embedded by this step.", "Unlock encrypted PDFs first.", "Formal archives may require additional corrections."] },
};

export const getRichContent = (slug: string): RichToolContent | null =>
  verifiedGuides[slug] ?? DATA[slug] ?? null;

export const AUTHOR = {
  name: "Aman Vishwakarma",
  role: "Founder & Lead Engineer",
  url: "https://github.com/aman90055",
};

export const LAST_UPDATED = "2026-09-15";

export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(3, Math.round(words / 220));
}
