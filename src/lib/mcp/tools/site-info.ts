import { defineTool } from "@lovable.dev/mcp-js";
import { SITE } from "./list-tools";

export default defineTool({
  name: "site_info",
  title: "Docunova AI site info",
  description: "Get high-level public information about Docunova AI: what it is, main URL, contact, and top categories.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const info = {
      name: "Docunova AI Suite",
      url: SITE,
      tagline: "Free AI-powered PDF, document, image, and text tools — no signup, no watermark, no file-size limit.",
      contact_email: "documentai999@gmail.com",
      categories: ["organize", "convert", "edit", "ai", "image", "security", "documents"],
      pricing: "Free forever",
      founder: "Aman Vishwakarma",
    };
    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});
