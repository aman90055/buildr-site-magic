import LegalPage from "@/components/LegalPage";

const Terms = () => (
  <LegalPage
    slug="terms"
    title="Terms & Conditions"
    description="The rules that govern your use of The Docunova AI Suite — accounts, acceptable use, payments, liability, and how disputes are handled."
    updated="2026-06-30"
    intro="These Terms set out the agreement between you and The Docunova AI Suite when you use our website, tools, AI features, and paid plans. By using the service you agree to these Terms."
    sections={[
      {
        id: "acceptance",
        heading: "1. Acceptance of Terms",
        body: `By accessing or using The Docunova AI Suite ("the Service"), you confirm that you are at least 13 years old (or the minimum digital-consent age in your country) and that you accept these Terms in full. If you are using the Service on behalf of a company, you confirm that you have authority to bind that company.

If you do not agree to any part of these Terms, please discontinue use of the Service.`,
      },
      {
        id: "the-service",
        heading: "2. The Service We Provide",
        body: `The Docunova AI Suite is a web-based platform that offers free PDF, image, document, and AI-powered productivity tools. Core PDF tools (merge, split, compress, convert, edit, sign, OCR and similar) are provided free of charge with no file size cap. Selected AI features may consume credits or require a Premium plan.

We strive to keep the Service available 24/7 but do not guarantee uninterrupted access. Maintenance, third-party outages, or events outside our reasonable control may cause temporary downtime.`,
      },
      {
        id: "accounts",
        heading: "3. Accounts & Security",
        body: `An account is optional for most free tools. Creating an account unlocks history, favourites, referrals, and Premium features.

You are responsible for:
- Providing accurate registration information
- Keeping your password and OTP codes confidential
- All activity that occurs under your account

Notify us immediately at our contact page if you suspect unauthorised access. We may suspend accounts that show signs of abuse, fraud, or policy violation.`,
      },
      {
        id: "acceptable-use",
        heading: "4. Acceptable Use",
        body: `You agree NOT to use the Service to:
- Process content that is illegal, infringing, defamatory, hateful, or sexually explicit involving minors
- Upload malware, scripts, or files designed to disrupt our systems
- Attempt to reverse-engineer, scrape at scale, or overload our infrastructure
- Resell or rebrand the Service without a written enterprise agreement
- Bypass rate limits, paywalls, credit systems, or security controls

We reserve the right to remove content and terminate accounts that violate these rules.`,
      },
      {
        id: "your-content",
        heading: "5. Your Files & Content",
        body: `You retain full ownership of every file you upload. We never sell your files or use them to train third-party AI models.

Most tools process files entirely in your browser. For tools that require server processing (AI summarisation, OCR, large conversions), files are stored only as long as required to complete the job and are automatically deleted shortly after — typically within minutes.

By uploading content you grant us a limited, revocable, non-exclusive licence to process that content solely to provide the requested tool output.`,
      },
      {
        id: "payments",
        heading: "6. Payments, Plans & Credits",
        body: `Premium plans and credit packs are billed through Razorpay (and other regional processors). All prices are listed on the pricing and premium pages and may include applicable taxes.

By starting a paid subscription you authorise the processor to charge the listed amount on each renewal cycle until you cancel. You can cancel at any time from your account; cancellation takes effect at the end of the current paid period.

Refunds are handled per our published Refund Policy. Credits expire as described in your plan and have no cash value.`,
      },
      {
        id: "ai-output",
        heading: "7. AI-Generated Output",
        body: `AI features (summariser, translator, grammar, rewriter, extractor, chat) may produce inaccurate, incomplete, or biased results. Always review AI output before using it for decisions that have legal, medical, financial, or safety consequences.

You are responsible for the prompts you submit and the way you use AI output. Our full AI Usage Policy describes these responsibilities in more detail.`,
      },
      {
        id: "intellectual-property",
        heading: "8. Intellectual Property",
        body: `The The Docunova AI Suite name, logo, website design, code, written content, illustrations, and trademarks are owned by us or our licensors and protected by applicable laws. You may not copy, scrape, or republish substantial portions of the Service without prior written permission.

Open-source libraries we use are governed by their respective licences, listed in our public dependency manifests.`,
      },
      {
        id: "third-parties",
        heading: "9. Third-Party Services & Links",
        body: `The Service integrates third parties such as Lovable Cloud (backend), Razorpay (payments), Google (sign-in, search, analytics), and Resend (email). We are not responsible for the practices or content of third-party services. Their use is governed by their own terms and privacy policies.`,
      },
      {
        id: "disclaimers",
        heading: "10. Disclaimers",
        body: `The Service is provided "as is" and "as available", without warranties of any kind, whether express, implied, or statutory, including warranties of merchantability, fitness for a particular purpose, and non-infringement, to the maximum extent permitted by law.

We do not warrant that the Service will be uninterrupted, secure, error-free, or that AI output will be accurate. You use the Service at your own risk.`,
      },
      {
        id: "liability",
        heading: "11. Limitation of Liability",
        body: `To the maximum extent permitted by applicable law, The Docunova AI Suite, its founders, employees, and partners will not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenue, data, or goodwill, arising from your use of the Service.

Our total aggregate liability for any claim arising out of or relating to the Service is limited to the greater of (a) the amount you paid us in the 12 months preceding the claim, or (b) USD 50.`,
      },
      {
        id: "indemnity",
        heading: "12. Indemnity",
        body: `You agree to indemnify and hold The Docunova AI Suite harmless from any claim, demand, loss, or expense (including reasonable legal fees) made by a third party arising out of your use of the Service, your content, or your breach of these Terms.`,
      },
      {
        id: "termination",
        heading: "13. Suspension & Termination",
        body: `We may suspend or terminate your account at any time for breach of these Terms, suspected fraud, abuse, or to comply with law. You may close your account at any time from account settings or by contacting us.

Sections of these Terms that by their nature should survive termination (intellectual property, disclaimers, liability, indemnity, governing law) will survive.`,
      },
      {
        id: "changes",
        heading: "14. Changes to These Terms",
        body: `We may update these Terms from time to time. Material changes will be highlighted on this page and, where appropriate, communicated via email or in-product notice. Continued use of the Service after an update means you accept the revised Terms.`,
      },
      {
        id: "governing-law",
        heading: "15. Governing Law & Disputes",
        body: `These Terms are governed by the laws of India, without regard to its conflict-of-laws rules. The courts of India will have exclusive jurisdiction over any dispute arising out of or in connection with these Terms, unless a different mandatory forum is required by your local consumer-protection law.

Before initiating legal action, please contact us so we can attempt to resolve the matter amicably.`,
      },
      {
        id: "contact",
        heading: "16. Contact",
        body: `For questions about these Terms, please use the contact form on our website. We aim to respond within 48 business hours.`,
      },
    ]}
  />
);

export default Terms;
