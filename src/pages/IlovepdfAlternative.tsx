import AlternativeLanding from "@/components/AlternativeLanding";

const IlovepdfAlternative = () => (
  <AlternativeLanding
    brand="iLovePDF"
    path="/ilovepdf-alternative"
    metaTitle="Free iLovePDF Alternative — Merge, Split & Compress PDF"
    metaDescription="Looking for an iLovePDF alternative? Docunova AI runs 100+ PDF tools free in your browser — merge, split, compress, convert and sign with no page or size limits."
    h1="A free iLovePDF alternative that runs in your browser"
    intro={[
      "If you searched for i love pdf, ilovepdf or simply \"pdf converter\", you are almost certainly after one thing: a page where you drop a file, pick an action, and download the result seconds later. Docunova AI does exactly that for more than 100 document jobs — merging, splitting, compressing, converting, OCR, signing and AI summarising — without an account and without a paid tier standing between you and the download button.",
      "The important structural difference is where the work happens. Most of Docunova AI's PDF and image tools execute inside your own browser tab using pdf-lib, pdf.js and the Canvas API. Your document is read into memory locally, transformed locally, and handed back to you as a download. Nothing is queued on a conversion server for those tools, which is why there is no upload progress bar for a 400 MB scan and no daily task counter to run out of.",
    ]}
    comparison={[
      { feature: "Price", docunova: "Every tool free, no paid tier required", typical: "Free tier with daily task limits, paid plans above it" },
      { feature: "File size", docunova: "No enforced size cap — limited only by your device memory", typical: "Commonly capped in the free tier" },
      { feature: "Where files are processed", docunova: "In-browser for PDF and image tools; files never leave your device", typical: "Usually uploaded to a conversion server" },
      { feature: "Account", docunova: "Not required for any tool", typical: "Often required beyond a few tasks" },
      { feature: "AI features", docunova: "Summarise, translate, OCR, rewrite, data extraction included", typical: "Varies; often a separate paid add-on" },
      { feature: "Tool count", docunova: "100+ across PDF, image, AI, and document generation", typical: "Focused mainly on core PDF conversions" },
    ]}
    tools={[
      { name: "Merge PDF", to: "/merge", blurb: "Combine any number of PDFs, reorder pages by drag and drop." },
      { name: "Split PDF", to: "/split", blurb: "Split by range, by page count or extract single pages." },
      { name: "Compress PDF", to: "/compress", blurb: "1–100 quality slider with object-stream compression." },
      { name: "PDF to Word", to: "/pdf-to-word", blurb: "Editable DOCX output with layout and text preserved." },
      { name: "JPG to PDF", to: "/image-to-pdf", blurb: "Batch images into one PDF with margin and page-size control." },
      { name: "PDF to JPG", to: "/pdf-to-image", blurb: "Export every page as a high-resolution JPG or PNG." },
      { name: "Sign PDF", to: "/sign-pdf", blurb: "Draw, type or upload a signature and place it on any page." },
      { name: "OCR PDF", to: "/ocr", blurb: "Turn scans and photos into selectable, searchable text." },
    ]}
    sections={[
      {
        heading: "Why in-browser processing matters for confidential documents",
        body: [
          "Contracts, medical scans, salary slips and ID documents are exactly the files people are most nervous about uploading. When a tool processes a PDF server-side, the file must travel over the network, exist on disk or in memory on that server, and then be deleted according to that provider's retention policy. That policy may be perfectly good — but you are trusting it.",
          "Docunova AI removes that step for the PDF and image tools. The page loads a WebAssembly/JavaScript PDF engine, then reads your file with the FileReader API. Heavy operations run inside a dedicated Web Worker so the interface stays responsive on large files. The only data that leaves your device is for the explicitly AI-powered tools (summarise, translate, OCR, rewrite), where text has to reach a model to be processed at all — and those tools tell you so before you run them.",
        ],
      },
      {
        heading: "How to switch: the five most common workflows",
        body: [
          "Combining scanned pages: open Merge PDF, drop all the files at once, drag the thumbnails into the right order, then download. If your pages came from a phone camera, run Image to PDF first, then merge.",
          "Shrinking a file for an upload form: open Compress PDF and start at quality 60. Government and university portals usually cap attachments at 1–2 MB; the size preview updates as you move the slider so you can stop as soon as you clear the limit.",
          "Editing a PDF you were sent: PDF to Word gives you an editable DOCX; if you only need to fill boxes and sign, PDF Filler and Sign PDF are faster and keep the original layout intact.",
          "Extracting text from a photo or scan: OCR PDF and Image to Text both return copyable text and a downloadable TXT file.",
          "Preparing images for the web: Compress Image, Resize Image and the WebP converters handle bulk work without a desktop editor.",
        ],
      },
      {
        heading: "Where a desktop application is still the better choice",
        body: [
          "Being honest about limits is part of being useful. Browser-based tools depend on your device's available memory, so a 2 GB PDF with thousands of embedded images may be slower in a tab than in a native application on a workstation. Complex prepress work — colour separation, PDF/X output intents, font subsetting for print — belongs in professional desktop software. Docunova AI targets the everyday 95%: reorganise, convert, compress, sign, read and summarise.",
        ],
      },
    ]}
    faqs={[
      { q: "Is Docunova AI really free?", a: "Yes. Every tool is usable without payment and without an account. Optional premium and donation options exist to support hosting, but they do not unlock tools." },
      { q: "Is there a file size or page limit?", a: "No enforced limit. The practical ceiling is your device's memory, since PDF and image processing happens locally in the browser." },
      { q: "Do my files get uploaded?", a: "Not for PDF and image tools — those run entirely in your browser. AI tools (summarise, translate, OCR, rewrite) send text to a model because that is required for them to work." },
      { q: "Does it work on a phone?", a: "Yes. The interface is responsive, installable as a PWA, and several tools can capture pages directly from your device camera." },
      { q: "Can I use it offline?", a: "Once loaded, many browser-side tools continue to work if your connection drops. AI tools need connectivity." },
      { q: "Is it affiliated with iLovePDF?", a: "No. Docunova AI is an independent product built by Aman Vishwakarma. iLovePDF is a trademark of its respective owner and is referenced here only for comparison." },
    ]}
  />
);

export default IlovepdfAlternative;
