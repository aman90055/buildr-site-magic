import { ArrowDownUp } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const ReversePDF = () => (
  <ToolPageTemplate
    title="Reverse PDF"
    description="Reverse the page order of your PDF document with a single click."
    metaTitle="Reverse PDF - Reverse Page Order | PDF Tools"
    metaDescription="Reverse the page order of any PDF document instantly."
    icon={ArrowDownUp}
    color="from-amber-500 to-amber-600"
    category="Organize PDF"
    acceptedFormats="PDF"
    features={["One-click page reversal", "Preserves all content and formatting", "Works with any PDF size", "Fast processing", "No quality loss", "Batch reverse support"]}
    howItWorks={["Upload your PDF", "Pages are automatically reversed", "Preview the new order", "Download reversed PDF"]}
  />
);
export default ReversePDF;
