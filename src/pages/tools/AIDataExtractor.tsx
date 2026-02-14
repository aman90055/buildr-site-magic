import { Database } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const AIDataExtractor = () => (
  <ToolPageTemplate
    title="AI Data Extractor"
    description="Extract tables, charts, and structured data from PDFs into spreadsheet-ready formats."
    metaTitle="AI Data Extractor - Extract Data from PDF | PDF Tools"
    metaDescription="Extract structured data, tables, and charts from PDF documents using AI."
    icon={Database}
    color="from-teal-500 to-emerald-600"
    isAI
    category="AI Tools"
    acceptedFormats="PDF"
    features={["Table detection and extraction", "Chart data recognition", "Export to CSV/Excel", "Multi-page table merging", "Header row detection", "Structured JSON output"]}
    howItWorks={["Upload your PDF with data", "AI identifies tables and data", "Review extracted data", "Download as CSV or Excel"]}
  />
);
export default AIDataExtractor;
