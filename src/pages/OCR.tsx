import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ScanText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const OCR = () => {
  return (
    <>
      <Helmet>
        <title>OCR - Scan to Text | Extract Text from Images & PDFs</title>
        <meta
          name="description"
          content="Extract text from scanned documents and images using OCR. Convert images to editable text. Free online OCR tool."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-4">
                <ScanText className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                OCR - Scan to Text
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Recognize and extract text from scanned documents and images.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-card border border-border rounded-2xl p-12 text-center animate-fade-in-up">
                <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                  <ScanText className="w-12 h-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Coming Soon
                </h2>
                <p className="text-muted-foreground mb-8">
                  Our OCR feature is being developed with AI-powered text recognition. Check out our existing tools!
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link to="/convert">
                    <Button variant="outline">
                      Convert PDF
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/pdf-to-image">
                    <Button variant="outline">
                      PDF to Image
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/image-to-pdf">
                    <Button variant="outline">
                      Image to PDF
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default OCR;
