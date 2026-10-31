// Curated help articles the support assistant may quote. Keep these factual:
// only describe behaviour the app actually enforces.
export interface HelpDoc {
  id: string;
  title: string;
  url: string;
  keywords: string[];
  body: string;
}

export const HELP_DOCS: HelpDoc[] = [
  {
    id: "free-access",
    title: "Is Docunova free? Do I need an account?",
    url: "/merge",
    keywords: ["free", "price", "account", "sign in", "login", "signup", "cost"],
    body:
      "Core PDF tools (merge, split, compress, convert, OCR and page tools) can be used for free. Most tools open without signing in. Signing in adds a dashboard with your PDF job history; some AI tools and saved history need an account.",
  },
  {
    id: "privacy",
    title: "Where are my files processed?",
    url: "/privacy",
    keywords: ["privacy", "upload", "server", "secure", "safe", "delete", "stored", "storage"],
    body:
      "Most PDF and image tools run inside your browser, so the file is not sent to our servers for processing. When you are signed in, some tools (for example Merge PDF) save the finished result to your account so you can find it later in your dashboard. AI tools (summarize, translate, AI OCR, chat) send the text or image you choose to an AI service to produce a result.",
  },
  {
    id: "file-size",
    title: "Is there a file size limit?",
    url: "/faq",
    keywords: ["size", "limit", "large", "big", "mb", "slow", "crash", "memory"],
    body:
      "There is no fixed file-size limit. Because files are processed in your browser, very large files depend on your device memory. If a tab freezes, try a desktop browser, close other tabs, or split the file first.",
  },
  {
    id: "merge",
    title: "How to merge PDFs",
    url: "/merge",
    keywords: ["merge", "combine", "join", "order", "reorder"],
    body:
      "Open Merge PDF, add your files, drag to reorder the files (not individual pages), then click Merge and download. To reorder or delete pages inside one PDF, use the Organize or Remove Pages tools first.",
  },
  {
    id: "compress",
    title: "How PDF compression works",
    url: "/compress",
    keywords: ["compress", "reduce", "smaller", "size", "quality", "0%"],
    body:
      "Compress PDF offers levels from light to strong. The lightest level is lossless and keeps text selectable. Stronger levels re-encode images and may turn pages into images. PDFs that are already optimized may shrink very little.",
  },
  {
    id: "split",
    title: "How to split a PDF",
    url: "/split",
    keywords: ["split", "extract", "pages", "separate"],
    body: "Open Split PDF, upload the file, choose page ranges or split every page, then download the results.",
  },
  {
    id: "ocr",
    title: "Image to text (OCR)",
    url: "/ocr",
    keywords: ["ocr", "image to text", "scan", "scanned", "extract text", "photo"],
    body:
      "Image to Text reads text from photos and scanned pages. Accuracy depends on image sharpness and lighting. Clear, straight, well-lit images give the best results.",
  },
  {
    id: "conversions",
    title: "Known limits of format conversions",
    url: "/convert",
    keywords: ["word", "excel", "powerpoint", "docx", "xlsx", "pptx", "convert", "format", "layout"],
    body:
      "PDF to Word, Excel and PowerPoint create real Office files, but complex layouts are approximated: PDF to Excel rebuilds rows from text positions, and Office to PDF produces image-based pages. Redaction masks whole matching lines. PDF/A output should be checked with an external validator if you need certified compliance.",
  },
  {
    id: "password",
    title: "Password protect or unlock a PDF",
    url: "/protect-pdf",
    keywords: ["password", "protect", "unlock", "encrypt", "locked"],
    body:
      "Protect PDF adds an open password in your browser. Unlock PDF removes a password only when you know it; we cannot recover forgotten passwords.",
  },
  {
    id: "premium",
    title: "Premium plans and payment",
    url: "/premium",
    keywords: ["premium", "plan", "upgrade", "pay", "payment", "upi", "razorpay", "subscription", "price"],
    body:
      "Premium plans are listed on the Premium page with current prices. You can pay by UPI and submit your UTR/transaction number for manual verification, or pay online where available. A submitted UPI payment shows as 'pending' until the team verifies it, then your plan becomes active.",
  },
  {
    id: "refunds",
    title: "Refunds and billing problems",
    url: "/contact",
    keywords: ["refund", "money back", "charged", "double", "cancel", "billing", "dispute"],
    body:
      "Refunds and billing problems are handled by a person. Share your registered email and UTR/transaction number and the team will review it.",
  },
  {
    id: "contact",
    title: "Contact support",
    url: "/contact",
    keywords: ["contact", "email", "human", "person", "support", "agent"],
    body: "You can reach the team at documentai999@gmail.com or through the Contact page.",
  },
];

export function searchHelpDocs(query: string, limit = 4) {
  const words = query.toLowerCase().split(/[^a-z0-9%]+/).filter((w) => w.length > 2);
  const scored = HELP_DOCS.map((doc) => {
    const hay = `${doc.title} ${doc.body} ${doc.keywords.join(" ")}`.toLowerCase();
    let score = 0;
    for (const k of doc.keywords) if (query.toLowerCase().includes(k)) score += 3;
    for (const w of words) if (hay.includes(w)) score += 1;
    return { doc, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return scored.map(({ doc }) => ({ title: doc.title, url: doc.url, body: doc.body }));
}
