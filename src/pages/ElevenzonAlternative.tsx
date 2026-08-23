import AlternativeLanding from "@/components/AlternativeLanding";

const ElevenzonAlternative = () => (
  <AlternativeLanding
    brand="11zon"
    path="/11zon-alternative"
    metaTitle="Free 11zon Alternative — Image Resizer & PDF Converter"
    metaDescription="A clean 11zon alternative: compress and resize images, convert WebP, PNG and JPG, and run 100+ PDF tools free in your browser with no size limits."
    h1="A free 11zon alternative for image and PDF conversion"
    intro={[
      "People arrive at 11zon-style sites for fast, single-purpose jobs: resize an image to a fixed pixel size, compress a photo under 200 KB for a form, convert WebP to PNG, or turn a stack of JPGs into one PDF. Docunova AI covers the same jobs with the same one-page flow — drop the file, set the option, download — plus the full PDF toolset and AI text tools alongside it.",
      "Image work here is done with the browser's own Canvas and image decoding pipeline. That means the pixels are resampled and re-encoded on your machine, output size is previewed before you commit, and there is no queue, watermark or task counter. The same applies to PDF operations, which use pdf-lib and pdf.js inside a Web Worker so big files do not freeze the tab.",
    ]}
    comparison={[
      { feature: "Price", docunova: "All tools free, no task quota", typical: "Free with ad-supported limits or paid upgrades" },
      { feature: "Image size cap", docunova: "None enforced; bounded by device memory", typical: "Frequently capped per file or per batch" },
      { feature: "Processing location", docunova: "Local, in your browser tab", typical: "Often server-side upload" },
      { feature: "Output control", docunova: "Quality slider with live output-size preview", typical: "Fixed presets in many cases" },
      { feature: "Beyond images", docunova: "100+ PDF, document and AI tools in one place", typical: "Mostly isolated single-purpose pages" },
      { feature: "Watermarks", docunova: "Never added to output", typical: "Sometimes added on free tiers" },
    ]}
    tools={[
      { name: "Image Resizer", to: "/resize-image", blurb: "Resize by pixels or percentage with aspect-ratio lock." },
      { name: "Compress Image", to: "/compress-image", blurb: "Hit a target file size with a live size preview." },
      { name: "WebP to PNG", to: "/webp-to-png", blurb: "Lossless PNG output with transparency preserved." },
      { name: "WebP to JPG", to: "/webp-to-jpg", blurb: "Universally compatible JPG for older software." },
      { name: "PNG to JPG", to: "/png-to-jpg", blurb: "Shrink screenshots and exports dramatically." },
      { name: "JPG to PDF", to: "/image-to-pdf", blurb: "Batch photos into a single tidy PDF document." },
      { name: "Crop Image", to: "/crop-image", blurb: "Freehand or fixed-ratio cropping in the browser." },
      { name: "Compress PDF", to: "/compress", blurb: "Get a PDF under a portal's upload limit." },
    ]}
    sections={[
      {
        heading: "Choosing the right image format",
        body: [
          "PNG is lossless and supports transparency, which makes it correct for logos, icons, screenshots of text and anything with hard edges. JPG is lossy and much smaller for photographs, but it degrades text and flat colour and cannot hold an alpha channel. WebP usually beats both on size at a similar visual quality, and every current browser supports it — but plenty of desktop applications, print shops, government portals and older CMS installations still reject it, which is why WebP to PNG and WebP to JPG are among the most-searched conversions on the web.",
          "A practical rule: keep your archive copy in PNG or the original camera format, publish WebP or JPG, and convert on demand rather than re-compressing an already-compressed file. Every lossy re-encode discards more detail permanently.",
        ],
      },
      {
        heading: "Hitting a strict upload limit",
        body: [
          "Exam portals, visa applications and job forms often demand something like \"JPG under 100 KB, 200×230 pixels\". Do it in two steps and in this order: resize first with Image Resizer so you are not compressing pixels you are about to throw away, then open Compress Image and lower quality until the previewed output clears the limit. Around quality 60–75 a photograph typically still looks clean; below 40, edges and text start to smear.",
          "For PDFs the equivalent path is Compress PDF, which rewrites the document with object-stream compression and downsampled images above the aggressive threshold, and shows you the resulting size before download.",
        ],
      },
      {
        heading: "One workspace instead of a dozen tabs",
        body: [
          "The usual pattern with single-purpose converter sites is a browser full of tabs, each with its own layout, ad placement and quirks. Docunova AI keeps one consistent interface across every tool, adds a Cmd/Ctrl+K search to jump straight to the one you need, and links related tools at the bottom of each page so a resize can flow into a PDF export without hunting for another site.",
        ],
      },
    ]}
    faqs={[
      { q: "Are the image tools free without limits?", a: "Yes. No task quota, no watermark, and no enforced file-size cap — processing happens locally, so your device memory is the only bound." },
      { q: "Does converting WebP to PNG lose quality?", a: "No further loss is introduced: PNG is lossless, so the decoded WebP pixels are stored exactly. Any loss already baked into a lossy WebP cannot be recovered." },
      { q: "Is transparency preserved?", a: "Yes for PNG output. Converting to JPG flattens transparency onto a white background, because JPG has no alpha channel." },
      { q: "Can I convert several images at once?", a: "Batch input is supported on the converter and JPG-to-PDF tools; results download individually or as one PDF." },
      { q: "Do you keep my images?", a: "No. Image tools run in your browser; nothing is uploaded or stored." },
      { q: "Is this affiliated with 11zon?", a: "No. Docunova AI is an independent product. 11zon is referenced only for comparison." },
    ]}
  />
);

export default ElevenzonAlternative;
