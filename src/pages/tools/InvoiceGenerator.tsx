import { Receipt } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const InvoiceGenerator = () => (
  <ToolPageTemplate
    title="Invoice Generator"
    description="Create professional invoices in PDF format with automatic calculations."
    metaTitle="Invoice Generator - Create PDF Invoices | PDF Tools"
    metaDescription="Generate professional PDF invoices with automatic tax calculations."
    icon={Receipt}
    color="from-green-500 to-green-600"
    category="Document Tools"
    acceptedFormats="N/A - Create from scratch"
    features={["Professional invoice templates", "Auto tax calculation", "Multiple currency support", "Company logo support", "Itemized line items", "Recurring invoice templates"]}
    howItWorks={["Choose an invoice template", "Enter business and client details", "Add items and prices", "Download PDF invoice"]}
  />
);
export default InvoiceGenerator;
