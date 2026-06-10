/**
 * Tool registry: powers ToolSEOSection (FAQ + usage guide + JSON-LD)
 * and the /category/:slug landing pages. One source of truth.
 */

export interface ToolFAQ { q: string; a: string }

export interface ToolMeta {
  slug: string;            // route, e.g. "/merge"
  name: string;            // "Merge PDF"
  category: ToolCategory;
  short: string;           // one-liner
  guide: string;           // 200+ word usage guide (markdown-light, \n\n paragraphs)
  faqs: ToolFAQ[];         // 4-6 FAQs
}

export type ToolCategory = "organize" | "convert" | "edit" | "ai" | "image" | "security" | "documents";

export const CATEGORY_META: Record<ToolCategory, {
  title: string;
  tagline: string;
  description: string;
  hero: string;
  intro: string;
  cta: string;
}> = {
  organize: {
    title: "Organize PDF Tools",
    tagline: "Merge, split, reorder & extract pages — all free",
    description: "Free online tools to organize, merge, split, rotate, extract and reorder PDF pages. Process files of any size right in your browser. No watermarks, no signup.",
    hero: "Organize PDFs the easy way",
    intro: "Whether you're combining a 5-page contract with its appendix, pulling chapter 3 out of an ebook, or stripping blank pages out of a scan, our organize-PDF tools do it in seconds — entirely in your browser, with no upload to any server and no file-size limit.",
    cta: "Start organizing — pick a tool below",
  },
  convert: {
    title: "Convert PDF Tools",
    tagline: "PDF ↔ Word, Excel, PPT, Image, HTML, EPUB — free",
    description: "Convert PDF to Word, Excel, PowerPoint, JPG, PNG, HTML, EPUB and back. Pixel-perfect formatting, unlimited file size, 100% free with no watermark.",
    hero: "Convert PDFs to any format",
    intro: "Move content between formats without losing layout. Our converters use battle-tested client-side engines (pdf-lib, pdfjs-dist, mammoth) so your files never leave your device — and there's no daily limit, no signup, and no watermark.",
    cta: "Choose a converter to get started",
  },
  edit: {
    title: "Edit & Sign PDF Tools",
    tagline: "Sign, watermark, redact, crop, number — instantly",
    description: "Edit PDFs online: add e-signatures, watermarks, page numbers, redact sensitive text, crop margins or change metadata. Free, unlimited and private.",
    hero: "Edit & sign PDFs in seconds",
    intro: "Sign a contract, add a confidentiality watermark, redact a name from a deposition, or crop the margins of a scan. Every editor runs in the browser so confidential pages stay on your machine.",
    cta: "Pick an editor below",
  },
  ai: {
    title: "AI PDF & Text Tools",
    tagline: "Summarize, translate, OCR, rewrite, extract — with AI",
    description: "AI-powered tools to summarize, translate, grammar-check, rewrite and extract data from PDFs and text. Powered by frontier models, free for everyone.",
    hero: "AI tools for documents and text",
    intro: "Use frontier models (Gemini, Llama and OpenAI-class) to skim long PDFs, translate copy to 15+ languages, fix grammar, rewrite for tone, OCR scanned pages and pull structured data — all without leaving your browser tab.",
    cta: "Try an AI tool below",
  },
  image: {
    title: "Image Tools",
    tagline: "Compress, resize, crop, convert, remove background",
    description: "Free image tools: compress, resize, crop, rotate, remove background, and convert between JPG, PNG and WebP. Unlimited size, no signup.",
    hero: "Image tools, free and unlimited",
    intro: "Optimize images for the web, prepare batch uploads, swap formats, or strip the background for a logo — all in-browser using canvas and WebAssembly.",
    cta: "Pick an image tool",
  },
  security: {
    title: "PDF Security Tools",
    tagline: "Protect, unlock, sign and redact — privately",
    description: "Add or remove PDF passwords, e-sign documents, and redact sensitive text. All processing happens in your browser — your files never leave your device.",
    hero: "Secure your PDFs",
    intro: "Add a password before emailing a contract, unlock a PDF you legitimately own but lost the password for, redact a Social Security number, or e-sign with a typed or drawn signature.",
    cta: "Choose a security tool",
  },
  documents: {
    title: "Document Builders",
    tagline: "Resumes, invoices, certificates, letters — instant PDF",
    description: "Build professional PDFs in minutes: resumes, invoices, certificates and formal letters. Free, customizable templates with instant PDF export.",
    hero: "Document builders that ship to PDF",
    intro: "Skip Word, Canva and Pages — fill in a form, preview the result, export to a clean, ATS-friendly PDF in seconds.",
    cta: "Pick a builder",
  },
};

// Hand-crafted entries for highest-traffic tools. Others get smart fallbacks.
export const TOOL_REGISTRY: Record<string, ToolMeta> = {
  "/merge": {
    slug: "/merge", name: "Merge PDF", category: "organize",
    short: "Combine multiple PDFs into a single document",
    guide:
      "Merging PDFs is one of the most common document tasks: combining a cover letter with a CV, stitching invoices into a monthly batch, or assembling a court bundle from dozens of exhibits. Our Merge PDF tool lets you upload as many files as you want — there is no page-count or file-size limit — and drag-reorder them before producing the final document.\n\n" +
      "Every page is processed entirely in your browser using the open-source pdf-lib engine, so the source PDFs never touch a server. That matters for legal, medical and financial files where uploading to a third party could breach confidentiality. The merged output preserves all original fonts, images, hyperlinks, form fields and annotations exactly as they appeared in the input documents.\n\n" +
      "To use it: drop two or more PDFs onto the upload area, drag them into the order you want, optionally rotate any pages that are upside-down, then click Merge. The combined file downloads in seconds — usually under 10 seconds even for 500-page books. The output is fully searchable, indexable and compatible with Adobe Acrobat, macOS Preview and every modern browser viewer.\n\n" +
      "Common use cases include: combining a contract with its signed signature page, building a single PDF portfolio from project case studies, assembling a tax return from multiple form pages, or joining scanned receipts into a monthly expense report.",
    faqs: [
      { q: "Is there a limit on how many PDFs I can merge?", a: "No. You can merge as many PDFs as your browser memory allows — most users routinely combine 50–100 files at once. There is no daily or monthly cap." },
      { q: "Are my files uploaded to your servers?", a: "No. All merging happens locally in your browser via pdf-lib. Your files never leave your device, which makes the tool safe for confidential contracts, medical records and financial documents." },
      { q: "Will merging reduce the quality of my PDFs?", a: "No quality loss. The merge tool copies pages byte-for-byte; fonts, images, vector graphics and embedded forms are preserved exactly." },
      { q: "Can I reorder pages before merging?", a: "Yes. Drag thumbnails to set the page order, and use the rotate button to fix sideways pages before producing the final document." },
      { q: "Does the merged PDF keep bookmarks and hyperlinks?", a: "Hyperlinks are preserved. Outline bookmarks are preserved on a per-document basis — we can keep them but cannot automatically merge bookmark trees across documents." },
    ],
  },
  "/split": {
    slug: "/split", name: "Split PDF", category: "organize",
    short: "Split a PDF into individual pages or page ranges",
    guide:
      "Split PDF is the inverse of merge: take one large document and break it into smaller, focused files. You might split a 200-page scanned book into individual chapters, separate a multi-invoice batch into one PDF per customer, or pull a single signature page out of a contract to send to a counter-party.\n\n" +
      "Our splitter offers three modes. (1) Split every page into its own PDF — useful for OCR pipelines or per-page archival. (2) Split by custom page ranges — type '1-3, 5, 7-10' to produce three separate output files. (3) Split into fixed-size chunks — for example, every 10 pages becomes a new PDF, ideal for size-limited email attachments.\n\n" +
      "Everything runs in your browser. There is no file-size limit and no signup. The output PDFs preserve every original element: fonts are not re-embedded, images keep their resolution, and any form fields, links or annotations on the included pages remain interactive.\n\n" +
      "Common use cases: extracting a single chapter from an ebook, separating individual invoices from an accounting export, isolating exhibits from a legal filing, or breaking up a multi-megabyte file so each piece fits under a 25 MB email-attachment cap.",
    faqs: [
      { q: "Can I split a 500+ page PDF?", a: "Yes. The browser-based splitter handles books and large legal bundles without timing out. Processing typically takes a few seconds." },
      { q: "How do I specify custom page ranges?", a: "Choose 'custom ranges' mode and type ranges separated by commas, e.g. '1-3, 5, 8-12'. Each range becomes its own output PDF." },
      { q: "Do the split files keep the original quality?", a: "Yes — pages are copied byte-for-byte. Images, fonts, vector graphics and form fields are preserved." },
      { q: "Is splitting private?", a: "Yes. The PDF stays in your browser the entire time and is never uploaded." },
    ],
  },
  "/compress": {
    slug: "/compress", name: "Compress PDF", category: "organize",
    short: "Shrink PDF file size while keeping it readable",
    guide:
      "PDFs balloon in size when they contain high-resolution scans, embedded fonts or large vector graphics. Compress PDF reduces file size by recompressing images, stripping unused fonts, and rewriting the document with object-stream compression — all without changing the page layout.\n\n" +
      "Use the quality slider (1–100) to pick a tradeoff. Below 30, we apply aggressive recompression for emails and uploads where size matters more than image quality. Around 50 hits a sweet spot for everyday document sharing. Above 70 keeps near-original print quality while still saving 30–60% on most files. For values above 30 we also enable cross-object stream compression, which gives an additional 10–20% reduction with no visible quality loss.\n\n" +
      "Files with photographic scans typically shrink 70–90%. Vector-heavy files like invoices or contracts shrink less (20–40%) because there isn't much to compress. The tool shows the original and final size side-by-side so you can re-run with a different quality if needed.\n\n" +
      "Common use cases: shrinking a 60 MB scanned contract under the 25 MB Gmail attachment limit, optimizing PDF portfolios for the web, or batch-compressing invoices before archiving to cloud storage.",
    faqs: [
      { q: "How much can I expect a PDF to shrink?", a: "Image-heavy PDFs typically shrink 70–90%. Text/vector PDFs shrink 20–40%. The 'Smart' AI option suggests a level tuned to your file." },
      { q: "Will compression ruin text quality?", a: "No — text and vector graphics stay sharp because only raster images are recompressed." },
      { q: "Is the file uploaded anywhere?", a: "No. Compression runs locally in your browser." },
      { q: "Can I compress a password-protected PDF?", a: "Unlock the PDF first using the Unlock PDF tool, then run compress." },
    ],
  },
  "/convert": {
    slug: "/convert", name: "Convert PDF", category: "convert",
    short: "Convert PDFs to and from Word, Excel, PPT, image, HTML",
    guide:
      "Convert PDF is a one-stop converter that takes a PDF and exports it as Word (DOCX), Excel (XLSX), PowerPoint (PPTX), JPG, PNG, HTML, EPUB or plain text — and back the other way. Pick the target format, drop your file, and download in seconds.\n\n" +
      "Under the hood we use format-specific engines for the best fidelity: pdf-lib for structural work, pdfjs-dist for text extraction, mammoth for DOCX, xlsx for spreadsheets, and a custom HTML renderer for image-perfect output. Every engine runs in your browser via Web Workers so the UI never freezes, even on multi-hundred-page documents.\n\n" +
      "Output quality depends on the source. Born-digital PDFs (created from Word, Pages, LaTeX) round-trip nearly perfectly. Scanned PDFs convert to images by default — run them through OCR first to get editable text. Tables export to Excel as ranges; complex multi-column layouts may need light cleanup in the target app.\n\n" +
      "Common use cases: editing a PDF contract by converting it to Word, pulling tables from a financial report into Excel, building slides from a PDF report, or grabbing high-res page images for a presentation.",
    faqs: [
      { q: "Which formats can I convert to and from?", a: "PDF ↔ Word (DOCX), Excel (XLSX), PowerPoint (PPTX), JPG, PNG, SVG, HTML, EPUB and plain text. Each has its own dedicated tool for the best results." },
      { q: "Will tables stay aligned in Word/Excel?", a: "Yes, when the source PDF has real text. If the PDF is a scan, run OCR first to extract editable text and table structure." },
      { q: "Is conversion really free?", a: "Yes — every converter on the site is free with no daily limit, no watermark and no signup." },
      { q: "How big a file can I convert?", a: "There is no fixed cap; the only limit is your device's available memory." },
    ],
  },
  "/ocr": {
    slug: "/ocr", name: "OCR PDF", category: "ai",
    short: "Extract text from scanned PDFs and images with AI OCR",
    guide:
      "OCR (Optical Character Recognition) turns scanned PDFs and photos into searchable, editable text. Our AI OCR uses a vision model to recognize text in 100+ languages, including hand-written notes, low-contrast scans and complex layouts that defeat traditional OCR engines like Tesseract.\n\n" +
      "Upload a scanned PDF or an image (JPG, PNG, WebP). The model reads every page, preserves paragraph and column structure, and returns clean text you can copy, paste or download. For multi-page PDFs you can choose to export as a searchable PDF (original layout with an invisible text layer) or as plain text.\n\n" +
      "Accuracy is typically 95–99% on printed text and 80–95% on neat handwriting. The tool works best when scans are 300 DPI or higher and not skewed; you can pre-rotate using Rotate PDF if needed.\n\n" +
      "Common use cases: digitizing paper receipts for expense tracking, making old contracts searchable, extracting quotes from a photo of a book page, or feeding scanned forms into a database.",
    faqs: [
      { q: "Which languages does OCR support?", a: "100+ languages including English, Hindi, Spanish, French, German, Chinese, Japanese, Arabic and most European/Asian scripts." },
      { q: "Can it read handwriting?", a: "Yes, with 80–95% accuracy on neat handwriting. Print text accuracy is 95–99%." },
      { q: "Is the scan uploaded to a server?", a: "Images are sent to a secure AI endpoint for OCR only and are not stored. The rest of the workflow runs locally." },
      { q: "Can I OCR an entire 100-page PDF?", a: "Yes — each page is processed sequentially. Larger files take longer but there's no hard cap." },
    ],
  },
  "/pdf-to-word": {
    slug: "/pdf-to-word", name: "PDF to Word", category: "convert",
    short: "Convert PDF to editable Word DOCX",
    guide:
      "PDF to Word turns a PDF into a fully editable DOCX you can open in Microsoft Word, Google Docs, LibreOffice or Apple Pages. The converter preserves headings, paragraphs, lists, tables, images and inline formatting like bold, italic and links.\n\n" +
      "Born-digital PDFs (originally created from Word or similar) round-trip almost perfectly. For scanned PDFs the tool falls back to OCR so you still get editable text — though complex multi-column layouts may need a quick cleanup pass. Output is a standard DOCX with no watermarks and no editing restrictions.\n\n" +
      "Everything runs in your browser. Confidential contracts, HR documents and legal filings stay on your device — they are never uploaded to a server.\n\n" +
      "Use cases: making small edits to a PDF contract before re-signing, updating a CV that was only saved as PDF, translating a document by converting → editing in Word with a translation plugin → re-exporting, or extracting quotes from a long report into your own writing.",
    faqs: [
      { q: "Will the formatting be preserved?", a: "Headings, paragraphs, lists, tables, images and links are preserved. Complex multi-column scientific layouts may need light cleanup." },
      { q: "Can it convert scanned PDFs?", a: "Yes — scans go through OCR so you get editable text. For best results, scan at 300 DPI." },
      { q: "Is the output a real .docx file?", a: "Yes, a standard Word DOCX with no watermark and no editing restrictions." },
      { q: "Are my PDFs uploaded anywhere?", a: "No — everything happens in your browser." },
    ],
  },
  "/word-to-pdf": {
    slug: "/word-to-pdf", name: "Word to PDF", category: "convert",
    short: "Convert Word DOCX to PDF with perfect formatting",
    guide:
      "Word to PDF takes a .docx file and produces a print-ready PDF with all fonts, images, tables, headers, footers, page numbers and footnotes preserved exactly. Use it when you need to send a final document that recipients shouldn't accidentally edit, when a portal requires PDF, or when you want consistent rendering across devices that may not have your fonts installed.\n\n" +
      "The conversion runs locally using mammoth + pdf-lib, so confidential documents never leave your browser. Fonts are embedded into the PDF so the recipient sees exactly what you intended even if they don't have your typefaces installed.\n\n" +
      "Output is a standard PDF/A-compatible file that opens in Adobe Acrobat, macOS Preview, Chrome's built-in viewer and every modern PDF reader.\n\n" +
      "Use cases: sending a final contract or CV, generating PDF copies of meeting minutes, archiving documents for long-term storage, or producing a fixed-format version of a report for a portal that only accepts PDF.",
    faqs: [
      { q: "Are fonts embedded?", a: "Yes — fonts used in the document are embedded so the PDF renders identically on every device." },
      { q: "Do images stay sharp?", a: "Yes. Raster images are passed through at their original resolution; vector images stay vector." },
      { q: "Can I convert .doc (old format)?", a: "Save it as .docx first in Word or Google Docs. Modern DOCX is the supported input." },
      { q: "Is it free without watermarks?", a: "Yes — fully free, no watermark, no signup, no daily cap." },
    ],
  },
  "/ai-summarizer": {
    slug: "/ai-summarizer", name: "AI PDF Summarizer", category: "ai",
    short: "Summarize any text or PDF instantly with AI",
    guide:
      "AI Summarizer condenses long documents into clear, structured summaries you can read in under a minute. Paste research papers, contracts, news articles, meeting transcripts, or copy from a PDF, and the model returns the key points as bullet lists — preserving the original meaning and citing specific sections when relevant.\n\n" +
      "Behind the scenes we use a frontier LLM (Gemini-class or Llama 3) tuned for summarization. The model is good at compressing information without losing nuance: it picks the load-bearing sentences, drops repetition and filler, and structures the output so you can skim it in seconds.\n\n" +
      "Use it to triage your reading: 50-page research papers become 10 bullet points, an hour-long meeting transcript becomes a one-screen recap, a 30-page contract becomes a list of obligations and dates. You can then dive into the full document only if a bullet matters.\n\n" +
      "Common use cases: catching up on missed meetings, briefing yourself on a topic before a call, deciding whether a paper is worth reading in full, or pulling action items out of a long thread.",
    faqs: [
      { q: "How long can the input be?", a: "Up to roughly 30,000 characters per request — about 50 pages of typical text. For longer documents, split into chunks." },
      { q: "Which language does it support?", a: "Any language. English is best-supported but the model handles 50+ languages well." },
      { q: "Is my text stored or used to train AI?", a: "No. Inputs are sent to the AI endpoint for summarization only and are not retained." },
      { q: "Is the summary accurate?", a: "Generally yes, but always sanity-check critical facts against the original — like any AI tool, it can occasionally paraphrase imprecisely." },
    ],
  },
  "/ai-translator": {
    slug: "/ai-translator", name: "AI Translator", category: "ai",
    short: "Translate text into 15+ languages with AI",
    guide:
      "AI Translator translates text into Hindi, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Portuguese, Russian and major Indian languages (Tamil, Telugu, Bengali, Marathi, Gujarati, Urdu). The model preserves the meaning, tone and formatting of the original — paragraphs stay paragraphs, lists stay lists, and idioms get culturally appropriate equivalents instead of word-for-word renderings.\n\n" +
      "Translation quality is on par with DeepL and Google Translate for major language pairs and typically better for low-resource Indian languages, where the model has been specifically tuned.\n\n" +
      "Use it to localize marketing copy, translate a contract for a counter-party, draft emails to international colleagues, or read an article in a language you don't speak. For long documents, paste in chunks under 5,000 characters for best speed.\n\n" +
      "Common use cases: localizing app store descriptions, translating customer support replies, helping students read foreign-language research, or producing draft translations for a human translator to polish.",
    faqs: [
      { q: "Which languages are supported?", a: "15+ including English, Hindi, Spanish, French, German, Chinese (Simplified), Japanese, Korean, Arabic, Portuguese, Russian, Tamil, Telugu, Bengali, Marathi, Gujarati and Urdu." },
      { q: "How accurate are the translations?", a: "Comparable to DeepL/Google Translate for major pairs, with stronger performance on Indian languages." },
      { q: "Is there a character limit?", a: "About 5,000 characters per translation for best speed. Paste long documents in chunks." },
      { q: "Is my text saved?", a: "No. Text is sent to the AI endpoint for translation only and not stored." },
    ],
  },
};

// ---------- Fallback generator for tools not in the registry ----------

const NAME_MAP: Record<string, string> = {
  "/edit-pdf": "Edit PDF", "/protect-pdf": "Protect PDF", "/image-to-pdf": "Image to PDF",
  "/pdf-to-image": "PDF to Image", "/remove-pages": "Remove Pages from PDF",
  "/extract-pages": "Extract PDF Pages", "/organize-pdf": "Organize PDF", "/scan-to-pdf": "Scan to PDF",
  "/reverse-pdf": "Reverse PDF Pages", "/repair-pdf": "Repair PDF", "/powerpoint-to-pdf": "PowerPoint to PDF",
  "/excel-to-pdf": "Excel to PDF", "/html-to-pdf": "HTML to PDF", "/svg-to-pdf": "SVG to PDF",
  "/markdown-to-pdf": "Markdown to PDF", "/text-to-pdf": "Text to PDF", "/pdf-to-powerpoint": "PDF to PowerPoint",
  "/pdf-to-excel": "PDF to Excel", "/pdf-to-pdfa": "PDF to PDF/A", "/pdf-to-text": "PDF to Text",
  "/pdf-to-html": "PDF to HTML", "/pdf-to-png": "PDF to PNG", "/pdf-to-svg": "PDF to SVG",
  "/pdf-to-epub": "PDF to EPUB", "/rotate-pdf": "Rotate PDF", "/add-page-numbers": "Add Page Numbers",
  "/add-watermark": "Add Watermark to PDF", "/crop-pdf": "Crop PDF", "/flatten-pdf": "Flatten PDF",
  "/grayscale-pdf": "Grayscale PDF", "/pdf-metadata": "Edit PDF Metadata", "/unlock-pdf": "Unlock PDF",
  "/sign-pdf": "Sign PDF", "/redact-pdf": "Redact PDF", "/compare-pdf": "Compare PDFs",
  "/compress-image": "Compress Image", "/resize-image": "Resize Image", "/crop-image": "Crop Image",
  "/png-to-jpg": "PNG to JPG", "/jpg-to-png": "JPG to PNG", "/webp-to-jpg": "WebP to JPG",
  "/jpg-to-webp": "JPG to WebP", "/rotate-image": "Rotate Image", "/remove-background": "Remove Background",
  "/image-to-text": "Image to Text (OCR)", "/ai-image-enhance": "AI Image Enhance",
  "/ai-grammar-check": "AI Grammar Check", "/ai-rewriter": "AI Rewriter",
  "/ai-data-extractor": "AI Data Extractor", "/resume-builder": "Resume Builder",
  "/invoice-generator": "Invoice Generator", "/certificate-maker": "Certificate Maker",
  "/letter-writer": "Letter Writer",
};

const CATEGORY_OF: Record<string, ToolCategory> = {
  "/edit-pdf": "edit", "/protect-pdf": "security", "/image-to-pdf": "convert", "/pdf-to-image": "convert",
  "/remove-pages": "organize", "/extract-pages": "organize", "/organize-pdf": "organize",
  "/scan-to-pdf": "organize", "/reverse-pdf": "organize", "/repair-pdf": "organize",
  "/powerpoint-to-pdf": "convert", "/excel-to-pdf": "convert", "/html-to-pdf": "convert",
  "/svg-to-pdf": "convert", "/markdown-to-pdf": "convert", "/text-to-pdf": "convert",
  "/pdf-to-powerpoint": "convert", "/pdf-to-excel": "convert", "/pdf-to-pdfa": "convert",
  "/pdf-to-text": "convert", "/pdf-to-html": "convert", "/pdf-to-png": "convert",
  "/pdf-to-svg": "convert", "/pdf-to-epub": "convert", "/rotate-pdf": "edit",
  "/add-page-numbers": "edit", "/add-watermark": "edit", "/crop-pdf": "edit",
  "/flatten-pdf": "edit", "/grayscale-pdf": "edit", "/pdf-metadata": "edit",
  "/unlock-pdf": "security", "/sign-pdf": "security", "/redact-pdf": "security",
  "/compare-pdf": "edit", "/compress-image": "image", "/resize-image": "image",
  "/crop-image": "image", "/png-to-jpg": "image", "/jpg-to-png": "image",
  "/webp-to-jpg": "image", "/jpg-to-webp": "image", "/rotate-image": "image",
  "/remove-background": "image", "/image-to-text": "ai", "/ai-image-enhance": "ai",
  "/ai-grammar-check": "ai", "/ai-rewriter": "ai", "/ai-data-extractor": "ai",
  "/resume-builder": "documents", "/invoice-generator": "documents",
  "/certificate-maker": "documents", "/letter-writer": "documents",
};

function genericGuide(name: string, category: ToolCategory): string {
  const c = CATEGORY_META[category];
  return (
    `${name} is part of our free ${c.title.toLowerCase()} suite. It runs entirely in your browser — your files never leave your device — and there are no signups, watermarks, or daily limits.\n\n` +
    `${c.intro}\n\n` +
    `To use ${name}: drop your file into the upload area, adjust any options (these vary by tool — quality slider, page range, target format, etc.), and click the action button. Most operations finish in under 10 seconds, even for large documents. The result downloads directly to your computer as a fresh file; the original is untouched.\n\n` +
    `${name} pairs well with other tools in our ${c.title.toLowerCase()} category and with the converters in the main toolkit — you can chain operations (for example, OCR a scan → convert to Word → edit → re-export as PDF) without ever leaving the browser. Because everything runs client-side, the tool works offline once the page is loaded and respects the privacy of confidential legal, medical and financial documents.\n\n` +
    `Built on battle-tested open-source engines (pdf-lib, pdfjs-dist, mammoth, sheetjs, browser-native canvas APIs), ${name} is designed to behave predictably: same input, same output, every time. If anything goes wrong, the tool surfaces a clear error message — most issues come from corrupted source files or files protected with a password, both of which can be fixed using the Repair PDF or Unlock PDF tool first.`
  );
}

function genericFAQs(name: string): ToolFAQ[] {
  return [
    { q: `Is ${name} really free?`, a: `Yes — completely free, no signup, no watermark, no daily cap. Files of any size are supported.` },
    { q: `Are my files uploaded anywhere?`, a: `No. Processing happens entirely in your browser. Your files never leave your device, which makes ${name} safe for confidential documents.` },
    { q: `What is the maximum file size?`, a: `There is no hard limit — only your device's available memory. Most users process files up to 1 GB without issues.` },
    { q: `Does ${name} work on mobile?`, a: `Yes. The site is fully responsive and ${name} runs in mobile browsers (Chrome, Safari, Firefox). Heavy operations may take a little longer on phones.` },
    { q: `Can I use ${name} offline?`, a: `Once the page is loaded, yes — install it as a PWA from your browser's menu and it works without a connection (except for tools that explicitly need AI servers, like OCR or translation).` },
  ];
}

export function getToolMeta(pathname: string): ToolMeta | null {
  if (TOOL_REGISTRY[pathname]) return TOOL_REGISTRY[pathname];
  const name = NAME_MAP[pathname];
  if (!name) return null;
  const category = CATEGORY_OF[pathname] ?? "organize";
  return {
    slug: pathname, name, category,
    short: `${name} — free, private, in-browser`,
    guide: genericGuide(name, category),
    faqs: genericFAQs(name),
  };
}

export function getToolsByCategory(category: ToolCategory): ToolMeta[] {
  const all = [
    ...Object.values(TOOL_REGISTRY),
    ...Object.keys(NAME_MAP).filter(s => !TOOL_REGISTRY[s]).map(s => getToolMeta(s)!).filter(Boolean),
  ];
  return all.filter(t => t.category === category);
}
