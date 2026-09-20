import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { canonicalFor, getToolSeo } from "@/lib/toolSeo";

interface ToolHeadProps {
  /** Fallback title when the route has no entry in TOOL_SEO */
  metaTitle: string;
  /** Fallback description when the route has no entry in TOOL_SEO */
  metaDescription: string;
  jsonLd?: Record<string, unknown>[];
}

/**
 * Head tags for tool pages: unique title + meta description from TOOL_SEO
 * (falling back to the page's own props) and a self-referencing canonical
 * derived from the current route.
 */
const ToolHead = ({ metaTitle, metaDescription, jsonLd = [] }: ToolHeadProps) => {
  const { pathname } = useLocation();
  const seo = getToolSeo(pathname);
  const title = seo?.title ?? metaTitle;
  const description = seo?.description ?? metaDescription;
  const url = canonicalFor(pathname);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="The Docunova AI Suite" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default ToolHead;
