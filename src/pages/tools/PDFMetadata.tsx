import { Info } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const PDFMetadata = () => (
  <ToolPageTemplate
    title="Edit PDF Metadata"
    description="View and edit PDF metadata including title, author, subject, and keywords."
    metaTitle="Edit PDF Metadata - Modify PDF Properties | PDF Tools"
    metaDescription="Edit PDF metadata like title, author, subject, and keywords easily."
    icon={Info}
    color="from-violet-500 to-violet-600"
    category="Edit PDF"
    acceptedFormats="PDF"
    features={["Edit title, author, subject", "Add or modify keywords", "Update creation/modification dates", "View all document properties", "Remove sensitive metadata", "Batch metadata editing"]}
    howItWorks={["Upload your PDF", "View current metadata", "Edit desired fields", "Download updated PDF"]}
  />
);
export default PDFMetadata;
