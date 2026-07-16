import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listTools from "./tools/list-tools";
import getToolInfo from "./tools/get-tool-info";
import siteInfo from "./tools/site-info";

// The OAuth issuer MUST be the direct Supabase host built from the project ref
// (Vite inlines VITE_SUPABASE_PROJECT_ID at build time, so this stays
// import-safe — no runtime env read at module top level).
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "docunova-ai-mcp",
  title: "Docunova AI Suite MCP",
  version: "0.2.0",
  instructions:
    "Tools for exploring the Docunova AI Suite — a free platform of 100+ PDF, document, image, and AI text tools. Callers sign in as a Docunova AI user; only public catalog data is returned. Use `list_tools` to browse (optionally filtered by category/query), `get_tool_info` to look up a single tool by slug, and `site_info` for high-level site facts.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listTools, getToolInfo, siteInfo],
});
