import type { ToolGuideProps } from "@/components/ToolGuide";

export const compressGuide: ToolGuideProps = {
  id: "compress-guide",
  title: "How to compress a PDF",
  steps: [
    "Add a PDF by dropping it on the box or choosing it from your device.",
    "Pick a level: Less, Recommended or Extreme.",
    "Press Compress, check the new size, then download the file.",
  ],
  uses: [
    "Students: get an assignment under a portal's upload limit.",
    "Job seekers: make a CV and certificates small enough to email.",
    "Office work: shrink scanned reports before sharing on chat apps.",
  ],
  noteTitle: "Which level should I choose?",
  note:
    "Less compression only cleans up the file's structure, so text and images stay exactly as they are; the saving can be small or zero. Recommended and Extreme shrink images more strongly, which saves more space but can make photos and scans look softer. Text-only PDFs usually shrink very little because there is not much to remove.",
  faqs: [
    { q: "Why did my file barely get smaller?", a: "The PDF may already be optimised or contain mostly text. Try a stronger level if it has images or scans." },
    { q: "Is my file uploaded?", a: "The compression itself runs in your browser. If you use the optional AI suggestion, a short description of the file is sent to get a recommended level." },
    { q: "Will text still be selectable?", a: "With Less compression, yes. Stronger levels can turn image-heavy pages into images, so check the result if you need to copy text." },
    { q: "Is there a size limit?", a: "We do not set one, but very large files can be slow or fail on phones with little memory." },
  ],
};

export const splitGuide: ToolGuideProps = {
  id: "split-guide",
  title: "How to split a PDF",
  steps: [
    "Add one PDF from your device.",
    "Click the page thumbnails you want to keep.",
    "Press Extract to download a new PDF with only those pages.",
  ],
  uses: [
    "Students: pull one chapter out of a long textbook PDF.",
    "Job seekers: send only the needed page of a certificate bundle.",
    "Office work: separate one invoice from a scanned batch.",
  ],
  noteTitle: "What this tool does",
  note:
    "Split here means extracting the pages you select into one new PDF, in their original order. Your original file is not changed. To reorder or rotate pages, use Organize PDF afterwards.",
  faqs: [
    { q: "Are my files uploaded?", a: "No. Pages are extracted in your browser and the file stays on your device." },
    { q: "Does quality change?", a: "No. Pages are copied as they are, so text and images keep their quality." },
    { q: "Can I split a password-protected PDF?", a: "Remove the password first with Unlock PDF (you need to know the password)." },
    { q: "Do I need an account?", a: "No, splitting works without signing in." },
  ],
};

export const ocrGuide: ToolGuideProps = {
  id: "ocr-guide",
  title: "How to extract text from an image",
  steps: [
    "Upload a photo or scan, or take a picture with your camera.",
    "Press Extract Text and wait for the result.",
    "Check the text, then copy it or download it as a file.",
  ],
  uses: [
    "Students: copy notes from a photo of a whiteboard or book page.",
    "Office work: turn a printed letter or receipt into editable text.",
    "Everyone: grab text from a screenshot instead of retyping it.",
  ],
  noteTitle: "Privacy: how OCR works here",
  note:
    "Unlike our PDF tools, OCR does not run only in your browser. The image is sent to an AI service to read the text and is not kept by us afterwards. Avoid uploading documents you are not allowed to share, such as other people's ID cards.",
  faqs: [
    { q: "How accurate is it?", a: "Clear, straight, well-lit photos work best. Handwriting, blur and tiny text lower accuracy, so always proofread the result." },
    { q: "Which languages work?", a: "Common languages including English and Hindi are recognised. Results for rare scripts may be weaker." },
    { q: "Does it keep the layout?", a: "It returns plain text. Tables and columns may need tidying after you copy them." },
    { q: "Is there a usage limit?", a: "To prevent abuse, AI requests are rate-limited, so very frequent use may be paused briefly." },
  ],
};
