import LegalPage from "@/components/LegalPage";

const Refund = () => (
  <LegalPage
    slug="refund"
    title="Refund Policy"
    description="Our transparent refund policy for Premium subscriptions, credit packs, and one-time purchases on The Docunova AI Suite."
    updated="2026-06-30"
    intro="We want every customer to feel confident upgrading. This Refund Policy explains when refunds are available, how to request one, and how we handle disputes."
    sections={[
      {
        id: "free-tools",
        heading: "1. Free Tools Stay Free",
        body: `All core PDF, image, and document tools are free to use without file-size limits and do not require a refund — there is nothing to charge.

Refunds apply only to paid Premium subscriptions, credit packs, and one-time add-ons.`,
      },
      {
        id: "premium-monthly",
        heading: "2. Premium Subscriptions (Monthly)",
        body: `If you cancel a monthly Premium subscription within 7 calendar days of the initial purchase and have processed fewer than 25 paid AI jobs during that window, you are eligible for a full refund.

After the 7-day window, monthly subscriptions are non-refundable. You can cancel at any time and continue to enjoy Premium features until the end of the current paid month.`,
      },
      {
        id: "premium-annual",
        heading: "3. Premium Subscriptions (Annual)",
        body: `Annual subscriptions are eligible for a full refund within 14 calendar days of purchase, provided fewer than 50 paid AI jobs have been processed during that window.

After the 14-day window we offer a pro-rated refund of any unused full months in genuine hardship cases (job loss, medical emergency, mistaken double-charge). Please contact us through the contact form and describe the situation.`,
      },
      {
        id: "credits",
        heading: "4. Credit Packs",
        body: `Credit packs are refundable within 7 days of purchase only if no credits from that purchase have been used. Partial-use credit packs are non-refundable but credits remain valid as described in your account.`,
      },
      {
        id: "duplicate",
        heading: "5. Duplicate or Mistaken Charges",
        body: `Duplicate charges, currency-conversion mistakes, or technical billing errors are always refunded in full once verified. Please contact us with the order ID and the date of the transaction.`,
      },
      {
        id: "non-refundable",
        heading: "6. What Is Not Refundable",
        body: `The following are non-refundable:

- Subscriptions cancelled after the initial refund window
- Credits that have already been spent
- Charges resulting from misuse, fraud, or violation of our Terms
- Bonus credits granted from check-in streaks, referrals, or promotions`,
      },
      {
        id: "how-to-request",
        heading: "7. How to Request a Refund",
        body: `Submit a refund request through our contact form with:

- The email associated with your account
- The order or payment ID
- The reason for the request

We acknowledge requests within 48 business hours and process approved refunds to the original payment method within 5–10 business days. The exact arrival time depends on your bank or card network.`,
      },
      {
        id: "chargebacks",
        heading: "8. Chargebacks",
        body: `Before filing a chargeback, please contact us — most issues can be resolved quickly. Filing a chargeback while a refund request is in progress may delay resolution and could lead to account suspension under our Terms.`,
      },
      {
        id: "contact",
        heading: "9. Contact",
        body: `For all refund-related questions, reach out through our contact form. We treat every request fairly and on its own merits.`,
      },
    ]}
  />
);

export default Refund;
