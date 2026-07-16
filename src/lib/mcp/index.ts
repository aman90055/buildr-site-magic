import { defineMcp } from "@lovable.dev/mcp-js";
import listTools from "./tools/list-tools";
import getToolInfo from "./tools/get-tool-info";
import siteInfo from "./tools/site-info";

export default defineMcp({
  name: "docunova-ai-mcp",
  title: "Docunova AI Suite MCP",
  version: "0.1.0",
  instructions:
    "Public tools for exploring the Docunova AI Suite — a free platform of 100+ PDF, document, image, and AI text tools. Use `list_tools` to browse available tools (optionally filtered by category or query), `get_tool_info` to look up a single tool by slug, and `site_info` for high-level facts about the site. All data returned is public.",
  tools: [listTools, getToolInfo, siteInfo],
});
