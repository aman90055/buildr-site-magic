/**
 * Per-tool SEO copy: one unique H1, <title>, meta description and set of
 * page-specific guide facts for every tool route.
 *
 * Single source of truth for:
 *  - ToolHead (title / description / canonical / og:url)
 *  - the "About this tool" guide in ToolSEOSection (facts make each guide unique)
 *  - the H1 rendered by the shared tool wrappers
 *
 * Canonical URLs are always self-referencing: SITE + slug.
 */

export const SITE = "https://docunova.online";

export interface ToolSeo {
  /** Visible page heading — unique across the site */
  h1: string;
  /** <title> — unique, ~50-62 chars + brand */
  title: string;
  /** meta description — unique, ~120-160 chars */
  description: string;
  /** 2-3 page-specific sentences used to build this tool's own guide */
  facts: string[];
}

const B = " | Docunova";

const T = (h1: string, title: string, description: string, facts: string[]): ToolSeo => ({
  h1,
  title: title.endsWith(B) ? title : title + B,
  description,
  facts,
});

export const TOOL_SEO: Record<string, ToolSeo> = {
  "/merge": T(
    "Merge PDF files into one document",
    "Merge PDF — Combine PDF Files Free",
    "Combine two or more PDFs into a single file in your browser. Drag pages into order, keep original quality, no upload and no watermark.",
    [
      "Merge PDF rebuilds a new document with pdf-lib, copying each source page byte-for-byte so text stays selectable and embedded fonts survive.",
      "You can reorder files by dragging the cards before merging, and mix portrait and landscape pages in the same output.",
    ],
  ),
  "/split": T(
    "Split a PDF into separate files",
    "Split PDF — Extract Page Ranges Free",
    "Split one PDF into several files by page range or split every page into its own document. Runs locally, keeps quality, downloads as a ZIP.",
    [
      "Split PDF accepts ranges like 1-3, 7, 10-12 and writes one output file per range, bundled into a ZIP when there is more than one.",
      "Because pages are copied rather than re-rendered, form fields, links and bookmarks inside each range stay intact.",
    ],
  ),
  "/compress": T(
    "Compress PDF and reduce file size",
    "Compress PDF — Shrink File Size Free",
    "Reduce PDF size with Less, Recommended and Extreme presets. Less keeps text selectable; Extreme rasterizes pages for the smallest file.",
    [
      "The compressor has two strategies: a lossless pass that rewrites object streams and strips unused resources, and an adaptive rasterizer for image-heavy scans.",
      "Less compression stays text-safe by design, so a contract you compress can still be searched and copied afterwards.",
    ],
  ),
  "/convert": T(
    "Convert PDF to and from other formats",
    "Convert PDF — All Formats in One Place",
    "One page to convert PDFs to Word, Excel, images, text or HTML and back again. Pick a source format and the matching converter opens.",
    [
      "This hub routes you to the right engine: pdfjs-dist for reading PDFs, mammoth for Word input, SheetJS for spreadsheets and canvas for images.",
      "Conversions are chainable — OCR a scan, convert it to text, then rebuild a clean PDF without leaving the site.",
    ],
  ),
  "/ocr": T(
    "OCR a scanned PDF into searchable text",
    "OCR PDF — Scanned PDF to Text",
    "Turn scanned pages and photos of documents into text you can copy, search and edit. Supports multi-page PDFs and dozens of languages.",
    [
      "Pages are rendered to high-resolution bitmaps in your browser, then the image text is recognised and returned as plain text you can copy or download.",
      "OCR quality depends on the scan: 300 DPI and straight pages read almost perfectly, while skewed phone photos may need a re-shot.",
    ],
  ),
  "/pdf-to-word": T(
    "Convert PDF to editable Word text",
    "PDF to Word — Editable Text Export",
    "Pull the text out of a PDF for editing in Word, Google Docs or Pages. Paragraph order is preserved; output is plain text, not a .docx clone.",
    [
      "The extractor reads the PDF text layer page by page and reflows it into paragraphs — it is honest plain text, not a pixel-perfect .docx rebuild.",
      "For scans with no text layer, run OCR first and then bring the recognised text back here.",
    ],
  ),
  "/word-to-pdf": T(
    "Convert Word documents to PDF",
    "Word to PDF — DOCX to PDF Free",
    "Turn .doc and .docx files into PDFs that look the same everywhere. Headings, lists and tables are preserved, and nothing is uploaded.",
    [
      "Word files are parsed with mammoth into clean HTML, then laid out and printed to PDF so headings, bullet lists and simple tables survive.",
      "Fonts your document references are substituted with close web equivalents, so check the preview before sending a print-critical file.",
    ],
  ),
  "/edit-pdf": T(
    "Edit PDF pages, text boxes and images",
    "Edit PDF Online — Add Text & Shapes",
    "Add text, shapes, highlights and images on top of any PDF page, then export a flattened copy. Works on desktop and mobile browsers.",
    [
      "Edits are drawn as a new content layer over the original page, so the underlying document is never rewritten or degraded.",
      "Use Flatten PDF afterwards if you need the annotations baked in so they cannot be moved by another reader.",
    ],
  ),
  "/protect-pdf": T(
    "Password protect a PDF",
    "Protect PDF — Add Password Encryption",
    "Add an open password to a PDF so only people with the passphrase can read it. Encryption happens on your device; the password never leaves it.",
    [
      "Protection is applied while the document is re-saved locally, which means your passphrase is never transmitted or logged anywhere.",
      "Keep a copy of the password — an encrypted PDF cannot be recovered without it, not even by us.",
    ],
  ),
  "/unlock-pdf": T(
    "Remove a known PDF password",
    "Unlock PDF — Remove Password You Know",
    "Strip the password from a PDF you can already open, so you stop retyping it. Requires the correct passphrase; this is not a cracking tool.",
    [
      "Unlock PDF decrypts the file with the password you supply and writes an unprotected copy — it cannot guess or break unknown passwords.",
      "Owner restrictions such as no-print flags are dropped in the same pass, which is useful for archiving your own documents.",
    ],
  ),
  "/image-to-pdf": T(
    "Convert images into a PDF",
    "Image to PDF — JPG & PNG to PDF",
    "Combine JPG, PNG and WebP photos into one PDF. Choose page size, orientation and margins, and drag thumbnails to set the order.",
    [
      "Each picture is placed on its own page and scaled to fit, so tall receipts and wide screenshots both keep their aspect ratio.",
      "Photos are embedded at their original resolution — compress them first if the PDF needs to fit an email limit.",
    ],
  ),
  "/pdf-to-image": T(
    "Convert PDF pages to images",
    "PDF to Image — Export Pages as JPG/PNG",
    "Render every PDF page as a JPG or PNG at the resolution you pick. Great for slides, thumbnails and pasting pages into presentations.",
    [
      "Pages are rasterized with pdfjs-dist at a scale you choose, from screen-friendly previews up to print-grade 300 DPI exports.",
      "Multi-page documents come back as a ZIP with one numbered image per page.",
    ],
  ),
  "/remove-pages": T(
    "Delete pages from a PDF",
    "Remove Pages from PDF — Delete Pages",
    "Delete blank, duplicate or confidential pages from a PDF and download the trimmed document. Pick pages visually or type a range.",
    [
      "Deletion works on a copy: the pages you keep are copied into a fresh document, so nothing in the original file is modified.",
      "Thumbnails make it easy to spot scanner blanks before you commit to the removal.",
    ],
  ),
  "/extract-pages": T(
    "Extract selected pages from a PDF",
    "Extract PDF Pages — Save a Selection",
    "Pull out the pages you need — one chapter, one invoice, one signature page — and save them as a new PDF without touching the original.",
    [
      "Extraction keeps the selected pages' text layer, links and form fields, so an extracted invoice is still searchable.",
      "Use ranges like 4-9 to lift a whole section, or pick scattered pages to build a summary document.",
    ],
  ),
  "/organize-pdf": T(
    "Reorder and organize PDF pages",
    "Organize PDF — Reorder Pages Visually",
    "Drag page thumbnails to reorder, rotate or drop pages, then export the reorganised PDF. Everything happens in the browser.",
    [
      "The page grid is a live view of the document: every drag, rotate or delete is applied when you export, not before.",
      "It is the fastest way to fix a scan that came out back-to-front or interleaved.",
    ],
  ),
  "/scan-to-pdf": T(
    "Scan documents to PDF with your camera",
    "Scan to PDF — Camera Document Scanner",
    "Use your phone or laptop camera to capture pages and save them as a multi-page PDF. No scanner app and no upload required.",
    [
      "The camera capture flow lets you shoot page after page, review each frame, and drop bad shots before building the PDF.",
      "Shoot on a flat, evenly lit surface — good input here means far better results if you later run OCR.",
    ],
  ),
  "/reverse-pdf": T(
    "Reverse the page order of a PDF",
    "Reverse PDF Pages — Flip Page Order",
    "Flip a PDF so the last page comes first. Fixes documents scanned back-to-front or exported in reverse by a copier.",
    [
      "Reversing copies pages in inverse order into a new document, which is lossless — no re-rendering and no quality change.",
      "Pair it with Organize PDF when only part of the document is out of order.",
    ],
  ),
  "/repair-pdf": T(
    "Repair a damaged or unreadable PDF",
    "Repair PDF — Fix Corrupted Files",
    "Try to recover a PDF that will not open. The tool rebuilds the file structure and salvages every page it can read.",
    [
      "Repair parses the document leniently, rebuilds the cross-reference table and writes a clean file from whatever objects are still valid.",
      "Badly truncated downloads may recover only some pages — repair is a best effort, not a guarantee.",
    ],
  ),
  "/powerpoint-to-pdf": T(
    "Convert PowerPoint slides to PDF",
    "PowerPoint to PDF — PPTX to PDF",
    "Turn .ppt and .pptx decks into a PDF with one slide per page, ready to share or print without PowerPoint installed.",
    [
      "Slide content is read from the deck and laid out one slide per PDF page at 16:9 or 4:3 to match the source.",
      "Animations and transitions cannot survive in a PDF, so each slide is exported in its final state.",
    ],
  ),
  "/excel-to-pdf": T(
    "Convert Excel spreadsheets to PDF",
    "Excel to PDF — XLSX to PDF Free",
    "Convert .xls, .xlsx and .csv sheets into a readable PDF table. Column widths and headers are preserved for printing and sharing.",
    [
      "SheetJS reads each worksheet and the values are typeset as a paginated table, repeating the header row on every page.",
      "Very wide sheets are switched to landscape automatically so columns are not cut off.",
    ],
  ),
  "/html-to-pdf": T(
    "Convert a web page or HTML to PDF",
    "HTML to PDF — Save Web Pages as PDF",
    "Paste HTML or upload an .html file and get a paginated PDF. Useful for archiving receipts, reports and email templates.",
    [
      "The markup is rendered in an isolated frame and printed to PDF, so inline CSS, tables and images appear as they do on screen.",
      "External scripts are not executed, which keeps the conversion predictable and safe.",
    ],
  ),
  "/svg-to-pdf": T(
    "Convert SVG vector files to PDF",
    "SVG to PDF — Vector Graphics to PDF",
    "Turn SVG illustrations, logos and charts into print-ready PDFs at any size, with edges that stay sharp at every zoom level.",
    [
      "SVG paths are drawn at the page scale you pick, so a logo exported here stays crisp on a billboard or a business card.",
      "Fonts referenced by text elements are rasterized if unavailable — convert text to paths first for exact typography.",
    ],
  ),
  "/markdown-to-pdf": T(
    "Convert Markdown to a formatted PDF",
    "Markdown to PDF — MD to PDF Free",
    "Paste Markdown or upload a .md file and download a typeset PDF with headings, lists, tables, quotes and code blocks styled cleanly.",
    [
      "Markdown is converted to HTML and then typeset with a readable document stylesheet — code blocks keep monospaced formatting.",
      "Front-matter is ignored, so notes exported from Obsidian or a static site convert without cleanup.",
    ],
  ),
  "/text-to-pdf": T(
    "Convert plain text to PDF",
    "Text to PDF — TXT to PDF Free",
    "Turn notes, logs or any .txt file into a paginated PDF. Choose font size and page size; long lines wrap instead of being cut.",
    [
      "Text is flowed into pages with proper wrapping and page breaks, so a 200 KB log file becomes a readable document rather than one giant line.",
      "Unicode content such as Hindi or emoji is embedded with a font that supports it.",
    ],
  ),
  "/pdf-to-powerpoint": T(
    "Convert PDF pages to slide images",
    "PDF to PowerPoint — Pages as Slides",
    "Export each PDF page as a slide-sized image you can drop straight into PowerPoint, Keynote or Google Slides. Output is images, not .pptx.",
    [
      "Every page is rendered at 16:9 slide resolution so the images fill a deck without letterboxing.",
      "This is an image export, not an editable .pptx — text on the slides cannot be retyped in PowerPoint.",
    ],
  ),
  "/pdf-to-excel": T(
    "Extract PDF tables to a spreadsheet",
    "PDF to Excel — Tables to CSV/Sheets",
    "Pull tabular data out of a PDF into a CSV you can open in Excel, Numbers or Google Sheets. Best on ruled, machine-generated tables.",
    [
      "Rows are detected from text positions on each page and written as CSV, which Excel and Sheets open directly.",
      "Merged cells and multi-line rows may need a quick manual tidy after import.",
    ],
  ),
  "/pdf-to-pdfa": T(
    "Convert a PDF to PDF/A for archiving",
    "PDF to PDF/A — Archive-Ready PDFs",
    "Produce a PDF/A-flavoured file for long-term archiving and records retention, with metadata written for compliance workflows.",
    [
      "The conversion normalises the document structure and writes archival metadata so the file stays readable decades from now.",
      "Strict validators may still flag exotic source files — check the output if you submit to a formal archive.",
    ],
  ),
  "/pdf-to-text": T(
    "Extract all text from a PDF",
    "PDF to Text — Copy Text from PDF",
    "Get every word out of a PDF as clean .txt, ready for search, analysis or pasting elsewhere. Handles hundreds of pages at once.",
    [
      "The text layer is read page by page and joined with page markers, so you can tell where each page began.",
      "If the result comes back empty the PDF is a scan — run OCR instead.",
    ],
  ),
  "/pdf-to-html": T(
    "Convert a PDF to HTML",
    "PDF to HTML — PDF to Web Page",
    "Turn a PDF into an HTML page you can publish or restyle, with paragraphs, headings and page breaks preserved as markup.",
    [
      "Content is emitted as semantic HTML with one section per page, so it can be dropped into a CMS and restyled with your own CSS.",
      "Complex multi-column layouts are flattened to reading order rather than reproduced pixel-for-pixel.",
    ],
  ),
  "/pdf-to-png": T(
    "Convert PDF pages to PNG images",
    "PDF to PNG — Lossless Page Export",
    "Export PDF pages as lossless PNG images with transparent-safe rendering. Ideal for diagrams, logos and screenshots of pages.",
    [
      "PNG output is lossless, so thin lines in engineering drawings and CAD exports stay crisp instead of turning fuzzy.",
      "Pick a higher scale for print work; PNG files grow quickly, so use JPG for photo-heavy pages.",
    ],
  ),
  "/pdf-to-svg": T(
    "Convert PDF pages to SVG vectors",
    "PDF to SVG — Vector Page Export",
    "Export PDF pages as SVG so text and shapes stay vector and scale infinitely. Perfect for logos and diagrams headed into design tools.",
    [
      "Each page becomes an SVG document with vector paths, ready to open in Figma, Illustrator or Inkscape.",
      "Scanned pages contain only a photo, so their SVG will wrap a bitmap rather than real vectors.",
    ],
  ),
  "/pdf-to-epub": T(
    "Convert a PDF to EPUB reading text",
    "PDF to EPUB — PDF for E-Readers",
    "Turn a text PDF into reflowable reading text for Kindle, Kobo and phone readers, so paragraphs adapt to your screen and font size.",
    [
      "Paragraphs are extracted and reflowed for small screens — the output is reading text, not a full multimedia EPUB package.",
      "Fixed-layout material such as magazines and comics does not reflow well; keep those as PDFs.",
    ],
  ),
  "/rotate-pdf": T(
    "Rotate PDF pages permanently",
    "Rotate PDF — Fix Sideways Pages",
    "Rotate a whole PDF or just the pages that came out sideways, then save the rotation so every reader opens it upright.",
    [
      "Rotation is written into each page's own attributes, so it sticks in every viewer instead of resetting when the file is reopened.",
      "Select individual thumbnails to fix a single landscape page inside an otherwise portrait document.",
    ],
  ),
  "/add-page-numbers": T(
    "Add page numbers to a PDF",
    "Add Page Numbers to PDF — Free",
    "Stamp page numbers onto a PDF with your choice of position, starting number, font size and format like 'Page 3 of 20'.",
    [
      "Numbers are drawn into the page content with pdf-lib, so they print and survive further merging or splitting.",
      "You can skip a cover page by setting the start page, which keeps legal and academic numbering correct.",
    ],
  ),
  "/add-watermark": T(
    "Add a watermark to a PDF",
    "Add Watermark to PDF — Text or Image",
    "Stamp text or a logo across every page — DRAFT, CONFIDENTIAL, a client name — with control over opacity, angle, size and position.",
    [
      "Watermarks are drawn as real page content at the opacity and rotation you choose, so they cannot be toggled off like an annotation.",
      "Place it behind the text to keep the document readable, or in front to discourage copying.",
    ],
  ),
  "/crop-pdf": T(
    "Crop PDF margins and page edges",
    "Crop PDF — Trim Margins & Whitespace",
    "Trim wide margins or scanner edges from PDF pages so the content fills the screen on tablets and e-readers.",
    [
      "Cropping adjusts each page's visible box rather than deleting content, so the trim is reversible if you keep the original.",
      "Apply one crop to every page, or crop a single page that was scanned off-centre.",
    ],
  ),
  "/flatten-pdf": T(
    "Flatten PDF forms and annotations",
    "Flatten PDF — Lock Forms & Markup",
    "Bake form fields, signatures and comments into the page so nobody can edit or clear them. The file still looks identical.",
    [
      "Flattening merges the interactive layer into page content, which is how a filled form becomes a final, tamper-resistant record.",
      "Keep an unflattened copy if you may need to change the answers later.",
    ],
  ),
  "/grayscale-pdf": T(
    "Convert a PDF to grayscale",
    "Grayscale PDF — Black & White Convert",
    "Turn a colour PDF into grayscale for cheaper printing and smaller files, with tones mapped so text stays readable.",
    [
      "Colour is converted using luminance weighting, so coloured headings and charts stay distinguishable instead of merging into one grey.",
      "Grayscale output is often noticeably smaller — a useful step before compressing a colour scan.",
    ],
  ),
  "/pdf-metadata": T(
    "Edit PDF metadata and document info",
    "Edit PDF Metadata — Title & Author",
    "View and rewrite a PDF's title, author, subject, keywords and dates, or strip identifying metadata before sharing the file.",
    [
      "Metadata lives in the document information dictionary; this tool reads it, lets you edit every field and writes it back.",
      "Clearing author and producer fields is a quick privacy win before publishing a document.",
    ],
  ),
  "/sign-pdf": T(
    "Sign a PDF with your own signature",
    "Sign PDF — Draw or Upload Signature",
    "Draw, type or upload your signature, place it anywhere on the page, and download the signed PDF. Nothing is stored after download.",
    [
      "Your signature is drawn on a canvas in the browser and stamped into the page — the image is never uploaded to a server.",
      "Add the date and initials as text, then flatten the file so the signature cannot be dragged away.",
    ],
  ),
  "/pdf-filler": T(
    "Fill in PDF forms online",
    "PDF Filler — Complete Forms Online",
    "Type into PDF form fields or add text anywhere on a flat, non-interactive form, then download the completed document.",
    [
      "Interactive AcroForm fields are detected and filled directly; flat scanned forms get free-placed text boxes instead.",
      "Flatten the result when you are done so the answers are permanent.",
    ],
  ),
  "/redact-pdf": T(
    "Redact sensitive text in a PDF",
    "Redact PDF — Black Out Private Info",
    "Cover names, account numbers and addresses with true redaction boxes, then flatten so the hidden text cannot be copied back out.",
    [
      "Redaction draws opaque boxes and removes the covered text from the content stream — unlike a black highlighter, the words are gone.",
      "Always check the output by searching for the redacted word before you share the file.",
    ],
  ),
  "/compare-pdf": T(
    "Compare two PDFs for differences",
    "Compare PDFs — Spot Text Changes",
    "Put two PDF versions side by side and see which words and paragraphs changed — useful for contracts and revised drafts.",
    [
      "Text is extracted from both files and diffed paragraph by paragraph, with additions and removals highlighted per page.",
      "Scans need OCR first, since comparison works on text rather than pixels.",
    ],
  ),
  "/compress-image": T(
    "Compress images and reduce size",
    "Compress Image — Smaller JPG & PNG",
    "Shrink JPG, PNG and WebP files with a quality slider and live preview, so photos load fast without visible artefacts.",
    [
      "Compression is re-encoded on a canvas in your browser, and the before/after sizes are shown so you can stop at the right quality.",
      "Around 70-80% quality is usually indistinguishable from the original while cutting file size by more than half.",
    ],
  ),
  "/resize-image": T(
    "Resize images to exact dimensions",
    "Resize Image — Set Width & Height",
    "Resize a photo to exact pixels or a percentage, with an aspect-ratio lock so nothing looks stretched.",
    [
      "Scaling uses high-quality canvas interpolation, which keeps edges clean when you shrink large camera photos.",
      "Enlarging beyond the original resolution cannot invent detail — try AI Image Enhance for that.",
    ],
  ),
  "/crop-image": T(
    "Crop images to any size or ratio",
    "Crop Image — Free & Fixed Ratios",
    "Crop photos freehand or to fixed ratios like 1:1, 4:5 and 16:9 for profile pictures, thumbnails and social posts.",
    [
      "The crop box snaps to common social ratios so an avatar or a YouTube thumbnail comes out the right shape first time.",
      "Cropping only discards pixels outside the box, so the kept area keeps its original quality.",
    ],
  ),
  "/png-to-jpg": T(
    "Convert PNG images to JPG",
    "PNG to JPG — Convert with Quality",
    "Convert PNG files to smaller JPGs with a quality setting. Transparent areas are filled with the background colour you choose.",
    [
      "JPG has no transparency, so the tool asks what colour should replace transparent pixels — white by default.",
      "Screenshots with text often stay sharper as PNG; JPG wins for photographs.",
    ],
  ),
  "/jpg-to-png": T(
    "Convert JPG images to PNG",
    "JPG to PNG — Lossless Conversion",
    "Convert JPG photos to lossless PNG, ready for editing, overlays or anywhere transparency support is required.",
    [
      "PNG re-encoding is lossless, so repeated edits no longer add the blockiness that JPG accumulates each time it is saved.",
      "Expect a larger file — PNG stores photographic detail without discarding data.",
    ],
  ),
  "/webp-to-jpg": T(
    "Convert WebP images to JPG",
    "WebP to JPG — Universal Support",
    "Convert WebP files to JPG for apps, printers and older software that cannot read WebP. Quality is adjustable.",
    [
      "WebP is decoded natively by your browser and re-encoded as JPG, so conversion is instant even for large batches.",
      "Animated WebP files export their first frame only.",
    ],
  ),
  "/webp-to-png": T(
    "Convert WebP images to PNG",
    "WebP to PNG — Keep Transparency",
    "Convert WebP to PNG while keeping transparent backgrounds — ideal for logos and icons headed into design tools.",
    [
      "Alpha channels are preserved, so a transparent WebP logo stays transparent as a PNG.",
      "PNG is the safest format when the image will be layered over other artwork.",
    ],
  ),
  "/jpg-to-webp": T(
    "Convert JPG images to WebP",
    "JPG to WebP — Faster Web Images",
    "Convert JPGs to WebP to cut page weight by roughly a quarter to a third at the same visual quality, improving load speed.",
    [
      "WebP encodes photographs more efficiently than JPG, which usually means a 25-35% smaller file at matching quality.",
      "Every current browser supports WebP; keep a JPG fallback only for very old email clients.",
    ],
  ),
  "/rotate-image": T(
    "Rotate and flip images",
    "Rotate Image — Turn & Mirror Photos",
    "Rotate photos in 90° steps or by a custom angle, and flip horizontally or vertically. Corrects sideways phone shots in one click.",
    [
      "Rotation is baked into the pixels rather than stored as an EXIF flag, so the image appears upright in every app.",
      "Custom angles are padded rather than cropped, so no corner of the photo is lost.",
    ],
  ),
  "/remove-background": T(
    "Remove image backgrounds automatically",
    "Remove Background — Transparent PNG",
    "Cut the background out of photos of people, products and pets and download a transparent PNG ready for any design.",
    [
      "Subject detection runs on your device and returns a transparent PNG, so product shots and portraits never leave the browser.",
      "Clean, contrasting backgrounds give the sharpest cut-outs; wispy hair may need a touch-up.",
    ],
  ),
  "/image-to-text": T(
    "Extract text from an image",
    "Image to Text — Photo OCR Online",
    "Read text out of screenshots, photos and scans and copy or download it. Handles receipts, whiteboards, slides and book pages.",
    [
      "The picture is analysed and its text returned with a progress indicator, plus copy and download buttons for the result.",
      "Sharp focus and even lighting matter more than megapixels — a steady close-up beats a distant high-res shot.",
    ],
  ),
  "/photo-text-edit": T(
    "Edit text on top of a photo",
    "Photo Text Editor — Add Text to Images",
    "Add, style and position text over any image with fonts, colours and outlines, and save your project to continue later.",
    [
      "The editor is a canvas workspace: every text box stays movable, and projects can be saved and reopened from your device.",
      "Export as PNG for crisp lettering or JPG when file size matters more.",
    ],
  ),
  "/ai-image-enhance": T(
    "Enhance and upscale images with AI",
    "AI Image Enhance — Sharpen & Upscale",
    "Improve sharpness, lighting and detail in blurry or low-resolution photos, and enlarge them without the usual mush.",
    [
      "Enhancement is an AI request: the image is sent for processing, the result is returned to you, and nothing is retained afterwards.",
      "It reconstructs plausible detail rather than recovering lost data, so treat results as improved, not forensic.",
    ],
  ),
  "/ai-summarizer": T(
    "Summarize long text and documents",
    "AI Summarizer — Key Points in Seconds",
    "Paste a report, article or contract and get a short summary with the key points as bullets, so you can skim before reading in full.",
    [
      "Your text is sent to the AI model for summarising and the response is streamed back; the source is not stored after the request.",
      "Summaries are a reading aid — verify numbers and legal wording against the original document.",
    ],
  ),
  "/ai-translator": T(
    "Translate text into 100+ languages",
    "AI Translator — 100+ Languages Free",
    "Translate text between more than a hundred languages with natural phrasing, dictate input by voice and hear the result read aloud.",
    [
      "Translation is model-based rather than word-by-word, so idioms and tone survive far better than in a dictionary lookup.",
      "Voice input and a speak button are built in, which helps when checking pronunciation.",
    ],
  ),
  "/ai-grammar-check": T(
    "Check grammar, spelling and clarity",
    "AI Grammar Check — Fix Writing Free",
    "Catch grammar, spelling and punctuation mistakes and get clearer phrasing suggestions for emails, essays and posts.",
    [
      "The checker returns a corrected version alongside your original so you can see exactly what changed.",
      "It suggests clarity edits too — accept the ones that keep your own voice.",
    ],
  ),
  "/ai-rewriter": T(
    "Rewrite text in a different tone",
    "AI Rewriter — Rephrase Any Text",
    "Rewrite a paragraph to be formal, friendly, shorter or simpler while keeping the meaning. Good for emails and product copy.",
    [
      "You pick the target tone and the model rephrases rather than paraphrasing mechanically, so the result reads like it was written that way.",
      "Rewriting someone else's text does not make it yours — cite sources where it matters.",
    ],
  ),
  "/ai-data-extractor": T(
    "Extract structured data from documents",
    "AI Data Extractor — Text to Fields",
    "Pull names, dates, totals and line items out of invoices, receipts and emails as clean structured fields ready for a spreadsheet.",
    [
      "You describe the fields you want and the model returns them as structured key-value output you can paste into a sheet.",
      "Always spot-check extracted amounts and dates before importing them into accounting software.",
    ],
  ),
  "/ai-cover-letter": T(
    "Write a tailored cover letter",
    "AI Cover Letter Writer — Free",
    "Turn a job description and your background into a focused one-page cover letter that mirrors the role's own language.",
    [
      "The generator asks for the role and your experience, then drafts a letter structured as hook, evidence and close.",
      "Edit in one specific achievement with real numbers — that is what makes a letter land.",
    ],
  ),
  "/ai-email-writer": T(
    "Write professional emails fast",
    "AI Email Writer — Drafts in Seconds",
    "Describe what you need to say and get a clear, polite email with a subject line — follow-ups, requests, apologies and replies.",
    [
      "Drafts come with a subject line and a tone you choose, from formal client updates to quick internal notes.",
      "Read it once before sending: the model does not know your relationship history with the recipient.",
    ],
  ),
  "/ai-blog-writer": T(
    "Draft a structured blog post",
    "AI Blog Writer — Outlines & Drafts",
    "Turn a topic into a structured draft with headings, intro and conclusion that you can fact-check and make your own.",
    [
      "Output arrives as an outline plus body sections, which is easier to edit than one undifferentiated block of text.",
      "Add your own research and examples before publishing — unverified drafts are exactly what search engines discount.",
    ],
  ),
  "/ai-code-explainer": T(
    "Explain code in plain English",
    "AI Code Explainer — Understand Code",
    "Paste a function or snippet in any language and get a line-by-line explanation of what it does and where it can break.",
    [
      "Explanations walk through control flow and call out likely edge cases, which is useful when reading an unfamiliar codebase.",
      "Never paste secrets or API keys into the box — send only the logic you need explained.",
    ],
  ),
  "/ai-math-solver": T(
    "Solve maths problems step by step",
    "AI Math Solver — Step-by-Step Answers",
    "Enter an equation or word problem and see the working, not just the answer — algebra, calculus, percentages and unit conversions.",
    [
      "Solutions are shown as numbered steps so you can follow the method and check where your own attempt diverged.",
      "Verify the final result independently for graded work; models can slip on long arithmetic.",
    ],
  ),
  "/ai-idea-generator": T(
    "Generate ideas for any project",
    "AI Idea Generator — Brainstorm Fast",
    "Get a list of angles and concepts for content, products, names or campaigns when you need to break a blank page.",
    [
      "Ideas are generated in batches so you can skim many directions quickly instead of polishing one weak option.",
      "Treat the list as raw material for your own judgement rather than a ranked recommendation.",
    ],
  ),
  "/ai-hashtag-generator": T(
    "Generate hashtags for social posts",
    "AI Hashtag Generator — Free Tags",
    "Turn a caption or topic into relevant hashtags for Instagram, LinkedIn, X and TikTok, mixing broad and niche tags.",
    [
      "The mix deliberately blends high-volume and niche tags, which tends to reach further than stacking only popular ones.",
      "Trim the list to the handful that genuinely describe your post — irrelevant tags hurt reach.",
    ],
  ),
  "/ai-youtube-titles": T(
    "Generate YouTube titles and hooks",
    "AI YouTube Title Generator — Free",
    "Get click-worthy title options for your video topic, with lengths that fit search results and the sidebar on mobile.",
    [
      "Titles are produced in several styles — question, number, curiosity, plain descriptive — so you can A/B the framing.",
      "Keep the promise honest: a title that oversells tanks watch time and your channel with it.",
    ],
  ),
  "/ai-tweet-generator": T(
    "Write tweets and short posts",
    "AI Tweet Generator — Posts & Threads",
    "Turn an idea into short posts or a thread that fits the character limit while keeping the point sharp.",
    [
      "Output respects the character limit and can be shaped as a single post or a numbered thread.",
      "Add your own take before posting — generic posts read as generic.",
    ],
  ),
  "/ai-resume-analyzer": T(
    "Analyse your resume against a job",
    "AI Resume Analyzer — Get Feedback",
    "Paste your resume and a job description to see missing keywords, weak bullet points and concrete rewrite suggestions.",
    [
      "The analysis compares your resume to the posting and reports gaps, phrasing issues and formatting risks for automated screeners.",
      "Feedback is advisory — no tool can promise an interview.",
    ],
  ),
  "/resume-builder": T(
    "Build a resume and export to PDF",
    "Resume Builder — Free PDF Resume",
    "Fill in your details and download a clean, ATS-friendly resume PDF. Built locally, so your employment history stays on your device.",
    [
      "The layout is generated with pdf-lib from the fields you type, giving predictable single-column output that screeners can parse.",
      "Nothing is saved to any account — download the PDF before closing the tab.",
    ],
  ),
  "/invoice-generator": T(
    "Create invoices and download as PDF",
    "Invoice Generator — Free PDF Invoices",
    "Create a professional invoice with line items, tax and totals calculated for you, then download it as a PDF to send.",
    [
      "Line totals, tax and the grand total are calculated as you type, and the PDF is built on your device.",
      "Client details are never uploaded, which matters when you bill under an NDA.",
    ],
  ),
  "/certificate-maker": T(
    "Make certificates in bulk",
    "Certificate Maker — Bulk PDF Certificates",
    "Design a certificate once and generate one PDF per recipient from a name list — for courses, events and workshops.",
    [
      "Templates are filled from your recipient list and rendered with pdf-lib, so a hundred certificates take one click.",
      "Recipient names stay in your browser; the batch downloads straight to your computer.",
    ],
  ),
  "/letter-writer": T(
    "Write and export formal letters",
    "Letter Writer — Formal Letter PDFs",
    "Compose resignation, complaint, leave or reference letters with correct structure and export a print-ready PDF.",
    [
      "Address block, date, salutation and sign-off are laid out to standard business format, so the letter looks right at a glance.",
      "Read the draft carefully before sending anything with legal consequences.",
    ],
  ),
};

export const getToolSeo = (pathname: string): ToolSeo | null => {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return TOOL_SEO[clean] ?? null;
};

/** Self-referencing canonical URL for any route. */
export const canonicalFor = (pathname: string): string => {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return `${SITE}${clean}`;
};
