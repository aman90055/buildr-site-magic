import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ProtectPDF = () => {
  return (
    <>
      <Helmet>
        <title>Protect PDF - Password Lock Your Documents</title>
        <meta
          name="description"
          content="Add password protection to your PDF files. Secure your documents with encryption. Free PDF protection tool."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Protect PDF
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Add password protection to secure your PDF documents.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-card border border-border rounded-2xl p-12 text-center animate-fade-in-up">
                <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                  <Lock className="w-12 h-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Coming Soon
                </h2>
                <p className="text-muted-foreground mb-8">
                  PDF password protection is coming soon. Explore our other tools while you wait!
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link to="/merge">
                    <Button variant="outline">
                      Merge PDFs
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/compress">
                    <Button variant="outline">
                      Compress PDF
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/convert">
                    <Button variant="outline">
                      Convert PDF
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

export default ProtectPDF;
