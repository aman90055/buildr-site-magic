import LegalPage from "@/components/LegalPage";

const Editorial = () => (
  <LegalPage
    slug="editorial-policy"
    title="Editorial Policy"
    description="How Document Edit Pro AI researches, writes, fact-checks, updates, and corrects content across guides, tutorials, blog posts, and tool pages."
    updated="2026-06-30"
    intro="Trust is earned. This Editorial Policy explains our standards for accuracy, independence, originality, transparency, and corrections across every piece of content we publish."
    sections={[
      {
        id: "mission",
        heading: "1. Our Editorial Mission",
        body: `Our mission is to help readers work with documents, images, and AI confidently — without jargon, fluff, or affiliate-driven nonsense. Every article should leave a reader more capable than when they arrived.`,
      },
      {
        id: "who-writes",
        heading: "2. Who Writes Our Content",
        body: `Content is produced by the Document Edit Pro AI editorial team led by founder Aman Vishwakarma. Contributors are practitioners with hands-on experience in document workflows, AI tooling, and software engineering.

Every author has a public profile page where you can review their background, links, and recent work. Guest contributors are disclosed at the top of the article.`,
      },
      {
        id: "research",
        heading: "3. Research & Fact-Checking",
        body: `Our writing process follows these steps:

- Topic selection — driven by genuine reader questions, search demand, and gaps we notice in the tools we ship
- Primary research — we test every workflow on real files, capture screenshots, and verify behaviour across browsers and operating systems
- Citation — we link to official documentation, peer-reviewed sources, or vendor specs wherever a factual claim is non-obvious
- Peer review — every article is reviewed by at least one second editor before publication

Statistics, prices, and specifications are dated and revisited at least once a quarter.`,
      },
      {
        id: "originality",
        heading: "4. Originality & Plagiarism",
        body: `We do not republish, spin, or auto-generate articles from other websites. Every article on this site is written or substantially edited by a human. AI assistants are sometimes used for outlining or grammar checks, but the final text is reviewed and rewritten by an editor.

We run plagiarism checks on every new article and reject any submission that fails.`,
      },
      {
        id: "ai-assistance",
        heading: "5. Use of AI in Editorial",
        body: `Some research and drafting steps may involve AI assistants. Whenever AI plays a meaningful role in producing a section, we label it clearly and a human editor verifies every factual claim before publication.

Our full AI Usage Policy applies to the content we publish as well as to the tools we ship.`,
      },
      {
        id: "independence",
        heading: "6. Independence & Sponsorship",
        body: `Editorial decisions are independent of commercial relationships. Advertisers, affiliate partners, and sponsors do not get to preview, approve, or influence articles before publication.

When an article is sponsored or contains affiliate links, we disclose this clearly at the top of the page and again next to the relevant link.`,
      },
      {
        id: "updates",
        heading: "7. Updates & Versioning",
        body: `Software changes quickly. We update articles when:

- A tool's UI, pricing, or behaviour changes meaningfully
- A new method makes the existing one obsolete
- A reader reports a confirmed inaccuracy

Each article shows the original publish date and the most recent update date. Substantive updates are summarised in a short change log at the foot of the article.`,
      },
      {
        id: "corrections",
        heading: "8. Corrections",
        body: `If we get something wrong we fix it and say so. Corrections are noted at the bottom of the affected article with the date and a short description of what changed.

To report an error please use our contact form with the article URL and the section in question. We acknowledge reports within 48 business hours.`,
      },
      {
        id: "comments-feedback",
        heading: "9. Reader Feedback",
        body: `We welcome reader feedback through the contact form and through reactions on individual articles. We do not currently host open comments on the site to keep the reading experience free from spam, but every legitimate response receives a human reply.`,
      },
      {
        id: "contact",
        heading: "10. Contact the Editorial Team",
        body: `For story tips, expert contributions, factual corrections, or partnership enquiries please reach out through our contact form and choose the "Editorial" category.`,
      },
    ]}
  />
);

export default Editorial;
