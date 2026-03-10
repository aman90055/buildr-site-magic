import { Database } from "lucide-react";
import AITextTool from "@/components/AITextTool";

const AIDataExtractor = () => (
  <AITextTool
    title="AI Data Extractor"
    description="Extract structured data like names, dates, emails, amounts from unstructured text."
    metaTitle="AI Data Extractor | PDF Tools"
    metaDescription="Extract structured data from text with AI."
    icon={Database}
    gradient="from-teal-500 to-cyan-600"
    systemPrompt="You are a data extraction specialist. Extract all structured data from the given text. Organize it into clear categories: Names, Dates, Emails, Phone Numbers, Addresses, Amounts/Prices, Organizations, and any other relevant data. Present in a clean, organized format."
    inputLabel="Text to Extract From"
    inputPlaceholder="Paste text containing data you want to extract..."
    outputLabel="Extracted Data"
    actionLabel="Extract Data"
  />
);

export default AIDataExtractor;
