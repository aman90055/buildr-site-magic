import { Helmet } from "react-helmet-async";

interface SocialMetaProps {
  title: string;
  description: string;
  /** Path including leading slash, or full URL */
  path?: string;
  image?: string;
  type?: "website" | "article" | "product";
  author?: string;
  publishedTime?: string;
  /** Optional JSON-LD object */
  jsonLd?: Record<string, unknown>;
}

const SITE = "https://docunova-ai.lovable.app";
const DEFAULT_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/4c64cb5b-c214-4257-8942-2a2d3a959348";

/**
 * Fully optimized social-sharing head tags.
 * Covers Open Graph (LinkedIn, Facebook, WhatsApp, Telegram, Discord, Threads, Pinterest),
 * Twitter Cards, and Article metadata.
 */
const SocialMeta = ({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  author = "Aman Vishwakarma",
  publishedTime,
  jsonLd,
}: SocialMetaProps) => {
  const url = path.startsWith("http") ? path : `${SITE}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph — LinkedIn, Facebook, WhatsApp, Telegram, Discord, Threads */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Document Edit Pro AI" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content="en_US" />

      {/* Article extras (LinkedIn, Facebook) */}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}

      {/* Twitter / X Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@docunova_ai" />
      <meta name="twitter:creator" content="@docunova_ai" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />

      {/* Pinterest rich pin */}
      <meta name="pinterest-rich-pin" content="true" />

      {/* LinkedIn specific */}
      <meta name="author" content={author} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SocialMeta;
