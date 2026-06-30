import LegalPage from "@/components/LegalPage";

const Disclaimer = () => (
  <LegalPage
    slug="disclaimer"
    title="Disclaimer"
    description="Information on Document Edit Pro AI is provided for general purposes. This Disclaimer outlines the limits of our content, AI output, and third-party links."
    updated="2026-06-30"
    intro="The information, tools, and AI outputs on Document Edit Pro AI are provided in good faith and for general informational and productivity purposes only. This Disclaimer sets out the boundaries of that information."
    sections={[
      {
        id: "general",
        heading: "1. General Information",
        body: `Articles, tutorials, FAQs, blog posts, and tool descriptions on this website are intended to help you understand how to work with documents, images, and AI. They are not professional advice. Always consult a qualified professional for advice tailored to your specific legal, financial, medical, or safety situation.`,
      },
      {
        id: "ai-output",
        heading: "2. AI-Generated Output",
        body: `Several of our tools use generative AI models. AI output can be incomplete, outdated, biased, or factually incorrect. We make no guarantee that AI summaries, translations, grammar suggestions, extractions, or chat responses are accurate or fit for any particular purpose.

You are responsible for reviewing AI output before relying on it for any important decision.`,
      },
      {
        id: "tool-results",
        heading: "3. Tool Results",
        body: `Our PDF, image, and document tools are designed to handle a wide range of files, but document specifications vary. Edge cases — unusual encryption, malformed files, exotic fonts, mixed-language scans, or extremely large documents — may produce imperfect output. Always keep a backup of your original file before processing.

We are not responsible for data loss caused by user error, third-party software, or input files that violate the relevant format specification.`,
      },
      {
        id: "external-links",
        heading: "4. External Links",
        body: `Our site occasionally links to third-party websites for reference or convenience. We do not control and are not responsible for the accuracy, legality, or privacy practices of those websites. Inclusion of a link does not imply endorsement.`,
      },
      {
        id: "affiliate-disclosure",
        heading: "5. Affiliate & Sponsorship Disclosure",
        body: `Some pages may contain affiliate links or paid placements. If you click such a link and complete an action, we may earn a commission at no extra cost to you. We only feature products and services we believe are useful to our audience. Sponsored content is labelled clearly.`,
      },
      {
        id: "no-warranty",
        heading: "6. No Warranty",
        body: `To the maximum extent permitted by law, Document Edit Pro AI disclaims all warranties — express, implied, or statutory — including warranties of accuracy, merchantability, non-infringement, and fitness for a particular purpose, in relation to any content on this site.

Use the Service and its content at your own risk.`,
      },
      {
        id: "contact",
        heading: "7. Contact",
        body: `If you believe any piece of content is inaccurate, please report it through our contact form. We take corrections seriously and update content promptly when warranted.`,
      },
    ]}
  />
);

export default Disclaimer;
