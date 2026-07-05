import LegalPage from "@/components/LegalPage";

const AIUsage = () => (
  <LegalPage
    slug="ai-usage-policy"
    title="AI Usage Policy"
    description="How The Docunova AI Suite uses artificial intelligence responsibly — what we do, what we do not do, what models we use, and your responsibilities as a user."
    updated="2026-06-30"
    intro="We use AI to make documents easier to work with — summarising, translating, extracting, polishing, and answering questions about your files. This policy explains how we use AI responsibly and what you can expect."
    sections={[
      {
        id: "where-we-use-ai",
        heading: "1. Where We Use AI",
        body: `AI powers the following features on The Docunova AI Suite:

- PDF and document summarisation
- Translation across 15+ languages
- Grammar, tone, and rewriting suggestions
- Data extraction from invoices, resumes, and tables
- Chat over your uploaded documents
- Smart compression level recommendations
- Optional cover letter, resume, and email drafting

Every AI-powered feature is labelled in the interface so you know when AI is involved.`,
      },
      {
        id: "models",
        heading: "2. Models We Use",
        body: `We route AI workloads through the Lovable AI Gateway, which gives us access to leading models from providers such as Google (Gemini family) and OpenAI (GPT family). The exact model used for each feature can change as better models become available; the underlying responsibility for accuracy, safety, and bias-mitigation stays with us.

We do not use customer files to train or fine-tune third-party models.`,
      },
      {
        id: "data-handling",
        heading: "3. How Your Data Is Handled",
        body: `When you use an AI feature:

- Files are sent over an encrypted connection (HTTPS / TLS 1.2+) to our backend
- Only the content required to answer the request leaves the browser
- Files are retained only as long as needed to generate the response, then deleted — typically within minutes
- We do not sell your prompts or files, ever

You can read more in our Privacy Policy.`,
      },
      {
        id: "your-responsibilities",
        heading: "4. Your Responsibilities",
        body: `You agree NOT to use our AI tools to:

- Generate content that is illegal, harmful, hateful, sexual involving minors, or designed to harass
- Impersonate any person or organisation without authorisation
- Produce political disinformation, deepfakes, or content designed to manipulate elections
- Provide professional advice (legal, medical, financial, safety) without competent human review
- Bypass safety filters or attempt prompt injection against our systems

Violations may result in feature throttling, account suspension, or termination, depending on severity.`,
      },
      {
        id: "limitations",
        heading: "5. Known Limitations of AI",
        body: `Even the best models can produce:

- Plausible-sounding but incorrect statements (hallucinations)
- Outdated information for fast-moving topics
- Subtle translation or transcription errors, especially for low-resource languages or noisy scans
- Biased phrasing reflecting biases in training data

Always review AI output before relying on it for any important decision. AI is a co-pilot, not a replacement for human judgement.`,
      },
      {
        id: "human-oversight",
        heading: "6. Human Oversight",
        body: `Our editorial team reviews AI behaviour periodically — sampling outputs, monitoring abuse signals, and updating prompts and safety filters. Users can report problematic output at any time through the in-product feedback control or our contact form, and we treat every report seriously.`,
      },
      {
        id: "rate-limits",
        heading: "7. Rate Limits & Fair Use",
        body: `To keep AI features available to everyone we apply rate limits per IP and per account. Limits scale up for Premium users. Excessive automated requests, scraping, or attempts to resell our AI capacity are prohibited.`,
      },
      {
        id: "transparency",
        heading: "8. Transparency",
        body: `We commit to:

- Labelling AI-assisted features clearly in the UI
- Explaining significant model or policy changes in our changelog
- Disclosing major incidents that affect AI output quality or safety
- Inviting external feedback on this policy

This policy will continue to evolve alongside the technology.`,
      },
      {
        id: "contact",
        heading: "9. Contact",
        body: `For questions about our AI use, to report misuse, or to suggest improvements, please reach out through our contact form. We respond to AI-related queries within 48 business hours.`,
      },
    ]}
  />
);

export default AIUsage;
