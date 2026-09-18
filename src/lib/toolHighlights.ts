/**
 * Shared "popular" tool routes, used to power the Popular filter chip on the
 * home page browser and the /tools page. Keep in sync with PopularTools.tsx.
 */
export const POPULAR_SLUGS: string[] = [
  "/merge",
  "/split",
  "/compress",
  "/ocr",
  "/image-to-pdf",
  "/word-to-pdf",
  "/pdf-to-image",
  "/pdf-to-word",
  "/edit-pdf",
  "/protect-pdf",
  "/sign-pdf",
  "/pdf-filler",
  "/compress-image",
  "/resume-builder",
  "/ai/writing-assistant",
];

export const FAV_STORAGE_KEY = "depai_tool_favorites";
export const RECENT_STORAGE_KEY = "depai_tool_recent";

export function readStoredSlugs(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function writeStoredSlugs(key: string, slugs: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(slugs));
  } catch {
    /* ignore */
  }
}
