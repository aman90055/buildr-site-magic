import toolContent from "@/data/toolContent.json";

export interface RichToolContent {
  name: string;
  category: string;
  introduction?: string;
  whatIsIt?: string;
  whyUse?: string;
  tutorial?: string[];
  bestPractices?: string[];
  mistakes?: string[];
  proTips?: string[];
  useCases?: string[];
  faqs?: { q: string; a: string }[];
}

const DATA = toolContent as Record<string, RichToolContent>;

export const getRichContent = (slug: string): RichToolContent | null =>
  DATA[slug] ?? null;

export const AUTHOR = {
  name: "Aman Vishwakarma",
  role: "Founder & Lead Engineer",
  url: "https://github.com/aman90055",
};

export const LAST_UPDATED = "2026-07-15";

export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(3, Math.round(words / 220));
}
