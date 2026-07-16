import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { TOOLS, SITE } from "./list-tools";

export default defineTool({
  name: "get_tool_info",
  title: "Get tool info",
  description: "Get details about a single Docunova AI tool by its slug (e.g. \"/merge\", \"/ai-translator\").",
  inputSchema: {
    slug: z.string().min(1).describe("Tool slug starting with '/', e.g. '/merge'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const normalized = slug.startsWith("/") ? slug : `/${slug}`;
    const tool = TOOLS.find((t) => t.slug === normalized);
    if (!tool) {
      return {
        content: [{ type: "text", text: `No tool found for slug "${normalized}". Use list_tools to discover valid slugs.` }],
        isError: true,
      };
    }
    const info = {
      ...tool,
      url: `${SITE}${tool.slug}`,
      description: `${tool.name} — free, private, in-browser. No signup, no watermark, no file-size limit.`,
      pricing: "Free forever",
      privacy: "Processed entirely in the user's browser when possible; AI tools use Docunova AI's secure gateway.",
    };
    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});
