import LegalPage from "@/components/LegalPage";

const DMCA = () => (
  <LegalPage
    slug="dmca"
    title="DMCA & Copyright Policy"
    description="How to report copyright infringement on Document Edit Pro AI and how we handle takedown notices and counter-notices under the DMCA."
    updated="2026-06-30"
    intro="Document Edit Pro AI respects intellectual property rights. We respond to clear notices of alleged copyright infringement in accordance with the U.S. Digital Millennium Copyright Act (DMCA) and equivalent laws in other jurisdictions."
    sections={[
      {
        id: "policy",
        heading: "1. Our Policy",
        body: `If you believe content available through our Service infringes a copyright you own or control, please send us a written DMCA notice using the format below. We will review every complete notice and remove or disable access to infringing material as appropriate. We may also terminate accounts of repeat infringers.`,
      },
      {
        id: "what-to-include",
        heading: "2. What a Valid DMCA Notice Must Include",
        body: `Your notice must contain all of the following:

- A physical or electronic signature of the copyright owner or an authorised agent
- Identification of the copyrighted work claimed to be infringed (or a representative list for multiple works)
- The URL or other specific location of the allegedly infringing material on our Service
- Your full name, postal address, telephone number, and email address
- A statement that you have a good-faith belief that the use of the material is not authorised by the copyright owner, its agent, or the law
- A statement, under penalty of perjury, that the information in the notice is accurate and that you are the owner or authorised to act on the owner's behalf

Incomplete notices may delay our response.`,
      },
      {
        id: "submit",
        heading: "3. How to Submit a Notice",
        body: `Send DMCA notices through our contact form with the subject line "DMCA Takedown Notice". You can also send a written notice to our registered postal address available on request via the contact form.

We do not accept DMCA notices through social media or unverified third parties.`,
      },
      {
        id: "counter",
        heading: "4. Counter-Notice",
        body: `If your content was removed and you believe it was a mistake or that you have a valid licence to use the material, you may submit a counter-notice. A valid counter-notice must include:

- Your physical or electronic signature
- Identification of the removed material and where it appeared before removal
- A statement under penalty of perjury that you have a good-faith belief the removal was a mistake or misidentification
- Your full name, postal address, telephone number, and email address
- A statement that you consent to the jurisdiction of the courts of your district (or, if outside the United States, of any judicial district where the Service is accessible)

We may restore the content if the original complainant does not file a court action within ten business days of our forwarding your counter-notice.`,
      },
      {
        id: "false-claims",
        heading: "5. False Claims",
        body: `Submitting a knowingly false DMCA notice or counter-notice may expose you to liability for damages, including costs and attorneys' fees, under Section 512(f) of the DMCA. Please consult a qualified attorney before submitting either.`,
      },
      {
        id: "repeat-infringers",
        heading: "6. Repeat Infringers",
        body: `In line with our policy and applicable law, we terminate accounts of users who repeatedly infringe the copyright of others.`,
      },
      {
        id: "contact",
        heading: "7. Contact",
        body: `Use our contact form for all copyright-related correspondence. We aim to acknowledge complete DMCA notices within 48 business hours.`,
      },
    ]}
  />
);

export default DMCA;
