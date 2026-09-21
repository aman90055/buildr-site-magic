import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { canonicalFor, getToolSeo } from "@/lib/toolSeo";

interface ToolHeadProps {
  /** Fallback title when the route has no entry in TOOL_SEO */
  metaTitle?: string;
  /** Fallback description when the route has no entry in TOOL_SEO */
  metaDescription?: string;
  jsonLd?: Record<string, unknown>[];
}

/**
 * Head tags for tool pages: unique title + meta description from TOOL_SEO
 * (falling back to the page's own props) and a self-referencing canonical
 * derived from the current route.
 *
 * Mounted once globally (via Footer) so every tool route gets exactly one
 * canonical and its own title/description without per-page duplication.
 */
const ToolHead = ({ metaTitle, metaDescription, jsonLd = [] }: ToolHeadProps) => {
  const { pathname } = useLocation();
  const seo = getToolSeo(pathname);
  const title = seo?.title ?? metaTitle;
  const description = seo?.description ?? metaDescription;
  const url = canonicalFor(pathname);

  // index.html ships a sitewide <meta name="description">. Once this route has
  // its own description, drop the static one so crawlers see exactly one.
  useEffect(() => {
    if (!description) return;
    document
      .querySelectorAll('meta[name="description"]:not([data-rh])')
      .forEach((el) => el.remove());
  }, [description]);

  return (
    <Helmet>
      {title ? <title>{title}</title> : null}
      {description ? <meta name="description" content={description} /> : null}
      <link rel="canonical" href={url} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="The Docunova AI Suite" />
      {title ? <meta property="og:title" content={title} /> : null}
      {description ? <meta property="og:description" content={description} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
      {title ? <meta name="twitter:title" content={title} /> : null}
      {description ? <meta name="twitter:description" content={description} /> : null}
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default ToolHead;
