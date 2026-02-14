import { Layers } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const FlattenPDF = () => (
  <ToolPageTemplate
    title="Flatten PDF"
    description="Flatten PDF form fields and annotations into a static, non-editable document."
    metaTitle="Flatten PDF - Remove Form Fields | PDF Tools"
    metaDescription="Flatten PDF forms and annotations into static documents for secure sharing."
    icon={Layers}
    color="from-indigo-500 to-indigo-600"
    category="Edit PDF"
    acceptedFormats="PDF"
    features={["Flatten all form fields", "Lock annotations permanently", "Reduce file size", "Prevent editing of filled forms", "Batch flatten multiple PDFs", "Preserve visual appearance"]}
    howItWorks={["Upload PDF with form fields", "Select elements to flatten", "Process the document", "Download the flattened PDF"]}
  />
);
export default FlattenPDF;
