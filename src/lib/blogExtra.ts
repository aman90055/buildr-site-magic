/**
 * Tool-based blog articles added on 2026-11-21.
 *
 * Each JSON file in src/data/blogExtra holds an array of articles written
 * against the real tool behaviour (see src/lib/toolSeo.ts). Articles link
 * only to routes that exist; src/lib/__tests__/blogExtra.test.ts checks this.
 */
import { TOOL_SEO } from "@/lib/toolSeo";
import { getToolMeta } from "@/lib/toolRegistry";

export interface ExtraBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: "Tutorial" | "Feature Guide" | "Security" | "Productivity" | "Hindi";
  tools: string[];
  relatedPosts: string[];
  content: string[];
}

export interface ResolvedExtraBlogPost extends ExtraBlogPost {
  date: string;
  isoDate: string;
  readTime: string;
  author: string;
  authorRole: string;
}

export const EXTRA_BLOG_ISO_DATE = "2026-11-21";
const DISPLAY_DATE = "November 21, 2026";

const modules = import.meta.glob<{ default: ExtraBlogPost[] }>("../data/blogExtra/*.json", {
  eager: true,
});

export const wordCount = (content: string[]) =>
  content.join(" ").split(/\s+/).filter(Boolean).length;

export const EXTRA_BLOG_POSTS: ResolvedExtraBlogPost[] = Object.keys(modules)
  .sort()
  .flatMap((key) => modules[key].default)
  .map((post) => ({
    ...post,
    date: DISPLAY_DATE,
    isoDate: EXTRA_BLOG_ISO_DATE,
    readTime: `${Math.max(1, Math.round(wordCount(post.content) / 220))} min read`,
    author: "Aman Vishwakarma",
    authorRole: "Creator & Lead Developer",
  }));

export const EXTRA_BLOG_BY_SLUG: Record<string, ResolvedExtraBlogPost> = Object.fromEntries(
  EXTRA_BLOG_POSTS.map((p) => [p.slug, p]),
);

/** Non-tool pages articles may link to. */
export const BLOG_LINKABLE_PAGES = ["/blog", "/help", "/support", "/faq", "/privacy"];

export const isLinkableRoute = (href: string) =>
  href in TOOL_SEO || BLOG_LINKABLE_PAGES.includes(href) || /^\/blog\/[a-z0-9-]+$/.test(href);

/** Readable name for a tool route, from the reviewed tool SEO copy. */
export const toolLabel = (route: string) => getToolMeta(route)?.name ?? TOOL_SEO[route]?.h1 ?? route;
