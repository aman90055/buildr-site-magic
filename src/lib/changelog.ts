export type ChangeTag = "feature" | "fix" | "improvement" | "accuracy";

export interface ChangelogEntry {
  /** ISO date (YYYY-MM-DD) the change was made. */
  date: string;
  title: string;
  tags: ChangeTag[];
  items: string[];
}

/** Newest first. Only list changes that actually shipped in the app. */
export const CHANGELOG: ChangelogEntry[] = [
  {
    date: "2026-11-16",
    title: "Donations and cleaner company pages",
    tags: ["feature", "accuracy"],
    items: [
      "Donate dialog now shows a UPI QR code built from the same UPI ID shown beside it, so the code and the ID always match.",
      "Removed placeholder pages for an unreleased developer API, integrations marked \"coming soon\", partner programmes and job listings. Old links now open the closest real page.",
      "Fixed dashboard shortcuts that pointed to missing Protect PDF and Edit PDF pages.",
      "This changelog and the roadmap were rewritten to list only real, dated changes.",
    ],
  },
  {
    date: "2026-11-06",
    title: "New homepage",
    tags: ["improvement"],
    items: [
      "Searchable tool list with one card per working tool, category filters, favourites and recently used tools.",
      "Short privacy section explaining which tools run in your browser, which save results to your account and which use an online AI service.",
      "Plain answers to common questions before you start.",
    ],
  },
  {
    date: "2026-11-05",
    title: "Layout fixes on laptops, tablets and phones",
    tags: ["fix"],
    items: [
      "Sign In and Get Started no longer slide off the edge of the top bar on laptop screens.",
      "The menu button sits at the right edge of the top bar on every screen size.",
      "New homepage title and description in search results.",
    ],
  },
  {
    date: "2026-11-03",
    title: "Corrected FAQ and privacy wording",
    tags: ["accuracy"],
    items: [
      "Removed FAQ claims we could not back up about one-hour file deletion, 14-day refunds, GDPR compliance and 90% compression.",
      "Explained that signed-in users' Merge, Split and Compress results are saved to private account storage.",
      "Compress PDF no longer promises a fixed percentage; results depend on the file.",
    ],
  },
  {
    date: "2026-11-01",
    title: "Invoice Generator fix",
    tags: ["fix"],
    items: [
      "Invoices failed to generate because the PDF font could not print the ₹ sign. Amounts are now written as INR and the download works.",
    ],
  },
  {
    date: "2026-10-31",
    title: "Support chat",
    tags: ["feature"],
    items: [
      "Signed-in users can ask questions at /support. Answers come from our help pages and your own plan or job history.",
      "When the assistant is unsure, or you ask for a person, the conversation is passed to the site owner.",
    ],
  },
  {
    date: "2026-10-30",
    title: "Step-by-step guides",
    tags: ["improvement", "accuracy"],
    items: [
      "Added practical guides under Merge PDF, Compress PDF, Split PDF and Image to Text: steps, common uses, limits and FAQs.",
      "Removed unsupported Image to Text claims such as \"100+ languages\" and \"unlimited\".",
    ],
  },
  {
    date: "2026-10-19",
    title: "Tool repairs",
    tags: ["fix"],
    items: [
      "PDF to Word, Excel and PowerPoint now produce real DOCX, XLSX and PPTX files. PDF to EPUB was added.",
      "Protect and unlock PDF now apply and remove real passwords.",
      "Repaired Compare PDF, text redaction and the repair fallback for damaged files.",
      "Fixed a blank page some signed-in users saw on tool pages.",
    ],
  },
  {
    date: "2026-10-17",
    title: "Clear free access",
    tags: ["accuracy"],
    items: [
      "Start Free now opens Merge PDF straight away; no sign-in is needed for the PDF tools.",
      "Removed homepage wording that mixed free and paid promises.",
    ],
  },
  {
    date: "2026-10-16",
    title: "Ads and consent",
    tags: ["improvement"],
    items: [
      "Ads load only on content pages, and only after you accept marketing cookies. Tool workspaces stay ad-free.",
      "Added Microsoft sign-in alongside email and Google.",
    ],
  },
  {
    date: "2026-09-24",
    title: "Shorter, tool-specific guides",
    tags: ["improvement"],
    items: [
      "Replaced repeated long-form text on tool pages with brief instructions written for each tool.",
      "The homepage's main text and tool links now load even before the app finishes starting.",
    ],
  },
  {
    date: "2026-09-20",
    title: "Clearer page titles",
    tags: ["improvement"],
    items: ["Every tool page now has its own title, description and heading instead of a shared template."],
  },
];
