import { Award } from "lucide-react";
import ToolPageTemplate from "@/components/ToolPageTemplate";

const CertificateMaker = () => (
  <ToolPageTemplate
    title="Certificate Maker"
    description="Design and generate beautiful certificates for any occasion in PDF format."
    metaTitle="Certificate Maker - Create PDF Certificates | PDF Tools"
    metaDescription="Create professional certificates with customizable templates."
    icon={Award}
    color="from-yellow-500 to-amber-600"
    category="Document Tools"
    acceptedFormats="N/A - Create from scratch"
    features={["Elegant certificate templates", "Custom text and fonts", "Logo and signature placement", "Batch generation with names", "Gold/silver border options", "QR code verification"]}
    howItWorks={["Select a certificate template", "Customize text and design", "Add names for batch generation", "Download PDF certificates"]}
  />
);
export default CertificateMaker;
