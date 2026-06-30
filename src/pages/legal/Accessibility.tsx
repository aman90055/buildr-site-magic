import LegalPage from "@/components/LegalPage";

const Accessibility = () => (
  <LegalPage
    slug="accessibility"
    title="Accessibility Statement"
    description="Our commitment to making Document Edit Pro AI usable by everyone, including people with disabilities — standards we follow and how to report issues."
    updated="2026-06-30"
    intro="Document Edit Pro AI is committed to digital accessibility. We want every visitor to be able to find, use, and benefit from our tools — including users who rely on assistive technology."
    sections={[
      {
        id: "commitment",
        heading: "1. Our Commitment",
        body: `We aim to conform with the Web Content Accessibility Guidelines (WCAG) 2.2 at the AA level. WCAG is an internationally recognised set of recommendations for improving the accessibility of web content for people with a wide range of disabilities, including blindness, low vision, deafness, limited mobility, learning disabilities, and combinations of these.`,
      },
      {
        id: "measures",
        heading: "2. Measures We Take",
        body: `To meet our commitment we:

- Build with semantic HTML and ARIA attributes where appropriate
- Use design-system colour tokens that meet contrast requirements
- Support keyboard navigation throughout the tool catalogue, dashboard, and checkout
- Provide visible focus indicators on interactive controls
- Test with screen readers (NVDA, VoiceOver, TalkBack) for our highest-traffic flows
- Provide text alternatives for non-text content, including icons and screenshots
- Ensure that document tools respect prefers-reduced-motion
- Offer light and dark themes plus a high-contrast safe palette`,
      },
      {
        id: "known-issues",
        heading: "3. Known Issues",
        body: `Despite our best efforts, parts of the Service may not yet be fully accessible:

- A few complex tool interfaces (PDF page reordering, certificate maker) rely on drag-and-drop and have keyboard alternatives we are still improving
- Some third-party embeds (advertising, payment processors) inherit accessibility from the provider and may lag
- Auto-generated content from very poor scans may not be perfectly screen-readable

We are actively working to address these gaps.`,
      },
      {
        id: "assistive-tech",
        heading: "4. Compatibility",
        body: `Document Edit Pro AI is designed to be compatible with:

- Recent versions of Chrome, Firefox, Safari, and Edge
- Common screen readers including NVDA, JAWS, VoiceOver, and TalkBack
- Modern operating system zoom and high-contrast modes
- Keyboard-only navigation`,
      },
      {
        id: "feedback",
        heading: "5. Feedback",
        body: `If you encounter an accessibility barrier on our website, please tell us. Helpful details include:

- The page URL where the issue occurred
- The assistive technology, browser, and operating system you were using
- A short description of what happened and what you were trying to do

Submit reports through our contact form with the subject "Accessibility". We aim to respond within 5 business days and prioritise fixes that affect critical workflows.`,
      },
      {
        id: "formal-complaints",
        heading: "6. Formal Complaints",
        body: `If we cannot resolve your issue to your satisfaction, you may be entitled to file a complaint with your national equality or disability rights body. We are happy to help you locate the right authority for your country.`,
      },
      {
        id: "contact",
        heading: "7. Contact",
        body: `Reach the accessibility team through our contact form and choose the "Accessibility" category. We treat accessibility feedback as a priority.`,
      },
    ]}
  />
);

export default Accessibility;
