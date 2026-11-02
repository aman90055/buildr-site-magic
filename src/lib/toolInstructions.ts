/** Short instructions tied to the controls and output of each tool. */
export const TOOL_STEPS: Record<string, string[]> = {
  "/merge": ["Add at least two PDFs.", "Drag whole files into the required order.", "Merge and download the combined PDF; use Organize PDF to reorder individual pages."],
  "/split": ["Add one PDF.", "Select the page thumbnails you need.", "Extract and download one PDF containing the selected pages."],
  "/compress": ["Add a PDF and choose Less, Recommended or Extreme.", "Compress and compare the original and result sizes.", "Download and check readability and text selection."],
  "/convert": ["Choose the source and target format.", "Open the matching converter and add your input.", "Read its format limitations before downloading the result."],
  "/ocr": ["Add a scanned PDF or image.", "Run OCR; page images are sent for AI recognition.", "Proofread the extracted text before copying or downloading."],
  "/image-to-text": ["Add a clear image of the text.", "Extract text using the AI service.", "Check names and numbers, then copy or download the result."],
  "/invoice-generator": ["Enter sender, client, invoice number and date.", "Add an item description, quantity and price for each line.", "Generate and download the invoice; amounts are in INR and tax is not calculated."],
  "/resume-builder": ["Enter your contact details, experience and education.", "Review the information for accuracy.", "Generate and download your resume PDF."],
  "/certificate-maker": ["Choose the certificate design and enter the event details.", "Enter recipient names.", "Generate certificates and check each name before sharing."],
  "/letter-writer": ["Choose a letter type.", "Enter addresses and the letter content.", "Generate the PDF and review it before sending."],
  "/edit-pdf": ["Open your PDF in the editor.", "Add and position text, images or shapes.", "Export a copy; adding a box does not remove underlying text."],
  "/protect-pdf": ["Choose an unprotected PDF.", "Enter and keep a secure copy of your password.", "Protect the PDF and test opening the downloaded copy."],
  "/unlock-pdf": ["Choose a protected PDF you are authorised to use.", "Enter its correct password.", "Unlock and download the unprotected copy."],
  "/image-to-pdf": ["Add the images you want in the document.", "Arrange the images and choose the available page settings.", "Create and download the PDF."],
  "/pdf-to-image": ["Add a PDF.", "Choose image format and resolution.", "Convert and download the page images."],
  "/remove-pages": ["Add your PDF.", "Select the pages to remove.", "Download and check that the remaining pages are correct."],
  "/extract-pages": ["Add your PDF.", "Choose the pages to keep.", "Extract and download the selection."],
  "/organize-pdf": ["Add a PDF and review its thumbnails.", "Reorder, rotate or remove pages using the available controls.", "Export and check the final page order."],
  "/scan-to-pdf": ["Allow camera access or add document photos.", "Capture clear, straight pages and review the images.", "Create a PDF from the captured pages."],
  "/reverse-pdf": ["Add a PDF with reversed page order.", "Reverse the pages.", "Download and confirm that the last page is now first."],
  "/html-to-pdf": ["Paste HTML into the input.", "Convert the extracted text to PDF.", "Check headings and line breaks; original CSS, images and web layout are not reproduced."],
  "/svg-to-pdf": ["Add SVG files.", "Convert the illustrations to PDF pages.", "Check clarity; the SVG is rendered as an image, not preserved as vector paths."],
  "/markdown-to-pdf": ["Paste Markdown into the input.", "Convert to PDF with basic headings and lists.", "Check the output; complex tables and full Markdown styling are not supported."],
  "/text-to-pdf": ["Paste your text and optionally enter a title.", "Choose the available text size.", "Generate and download the PDF; the built-in font does not support every script or emoji."],
  "/pdf-to-text": ["Add a PDF with selectable text.", "Extract the text.", "Download the text file and review reading order; scans need OCR."],
  "/pdf-to-html": ["Add a PDF with selectable text.", "Convert the extracted text to HTML.", "Review the text and markup; original page design is not reproduced."],
  "/pdf-to-png": ["Add a PDF.", "Choose the available rendering settings.", "Export PNG page images and check resolution."],
  "/pdf-to-svg": ["Add a PDF.", "Render its pages and convert to SVG files.", "Download the files; each SVG contains a page image, not editable vector shapes."],
  "/rotate-pdf": ["Add your PDF.", "Choose the pages and rotation direction.", "Download and check that the pages open upright."],
  "/add-page-numbers": ["Add a PDF.", "Choose numbering and placement options.", "Apply numbers and check that they do not cover page content."],
  "/add-watermark": ["Add a PDF and enter the watermark.", "Adjust the available size, angle and opacity settings.", "Apply and check readability before sharing."],
  "/crop-pdf": ["Add your PDF.", "Set the crop margins.", "Download and check the visible area; cropping is not redaction."],
  "/flatten-pdf": ["Add a PDF.", "Create a new copy with this tool.", "Inspect form appearances carefully; this implementation does not guarantee that every form or annotation is flattened."],
  "/grayscale-pdf": ["Add a colour PDF.", "Convert its pages to grayscale.", "Check charts and text in the downloaded result."],
  "/pdf-metadata": ["Add a PDF and inspect the current information.", "Edit the available title, author, subject and keyword fields.", "Save a copy; metadata editing does not remove identifying text inside pages."],
  "/sign-pdf": ["Add a PDF and create your signature.", "Position the signature using the available controls.", "Download and review it; a drawn signature is not a cryptographic digital certificate."],
  "/pdf-filler": ["Add a PDF form.", "Fill detected fields or position text on a flat form.", "Download and check all entries in a PDF viewer."],
  "/compress-image": ["Add an image.", "Choose quality and compare the result size.", "Download and inspect fine details; reductions vary by image."],
  "/resize-image": ["Add an image.", "Set the required width and height.", "Resize and download; enlarging cannot recover missing detail."],
  "/crop-image": ["Add a photo.", "Select the area to keep.", "Crop and download a copy."],
  "/rotate-image": ["Add an image.", "Choose rotation or flip controls.", "Save the result and check its orientation."],
  "/remove-background": ["Add an image with a white or very light background.", "Remove the light pixels.", "Download PNG and inspect the edges; light parts of the subject may also disappear."],
  "/ai-image-enhance": ["Add an image.", "Adjust brightness, contrast, saturation and sharpness.", "Download PNG; this tool uses local image filters, not AI upscaling."],
  "/photo-text-edit": ["Add a photo to the editor.", "Add, style and position text boxes.", "Export the image or save the project to continue later."],
};

for (const [slug, target] of Object.entries({
  "/png-to-jpg": "JPG", "/jpg-to-png": "PNG", "/webp-to-jpg": "JPG",
  "/webp-to-png": "PNG", "/jpg-to-webp": "WebP",
})) {
  TOOL_STEPS[slug] = ["Add images in the source format.", `Convert to ${target} using the available settings.`, "Download and check the result; JPG does not support transparent backgrounds."];
}

const AI_INPUTS: Record<string, string> = {
  "/ai-summarizer": "Paste the text you want to summarise.",
  "/ai-translator": "Paste text and choose the target language.",
  "/ai-grammar-check": "Paste the writing you want checked.",
  "/ai-rewriter": "Paste your text and choose a tone.",
  "/ai-data-extractor": "Paste source text and specify the fields to extract.",
  "/ai-cover-letter": "Enter the job details and your real experience.",
  "/ai-email-writer": "Describe your email purpose and choose a tone.",
  "/ai-blog-writer": "Enter a topic and the article requirements.",
  "/ai-code-explainer": "Paste a code snippet without passwords or secret keys.",
  "/ai-math-solver": "Enter an equation or word problem.",
  "/ai-idea-generator": "Enter a topic and the kind of ideas you need.",
  "/ai-hashtag-generator": "Describe your post and its topic.",
  "/ai-youtube-titles": "Describe the video and intended audience.",
  "/ai-tweet-generator": "Enter the idea and desired tone for your post.",
  "/ai-resume-analyzer": "Paste your resume and the job description.",
};
for (const [slug, input] of Object.entries(AI_INPUTS)) {
  TOOL_STEPS[slug] = [input, "Run the tool; the submitted text is sent to an AI service.", "Review the response against your source before copying or downloading it."];
}

export function toolPrivacy(slug: string): string {
  if (["/merge", "/split", "/compress"].includes(slug)) {
    return "PDF processing runs in your browser. When signed in, the finished PDF is also uploaded to your private account storage and a job record is saved. Signed-out processing does not save a result to an account. Smart compression sends file statistics for an AI suggestion if you choose it.";
  }
  if ((slug.startsWith("/ai-") && slug !== "/ai-image-enhance") || ["/ocr", "/image-to-text"].includes(slug)) {
    return "The submitted text or image is sent to an AI service. Sign-in and request limits may apply. Do not send information you are not authorised to share; see Privacy & File Processing for account storage and provider handling.";
  }
  return "This operation runs in your browser. Keep your original and download the result before leaving. Account data, support messages and AI features have separate handling described in Privacy & File Processing.";
}