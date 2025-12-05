import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PenTool, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const SignPDF = () => (
  <>
    <Helmet>
      <title>Sign PDF - Add Digital Signature to PDF Online</title>
      <meta name="description" content="Add digital signatures to your PDF documents online. Free PDF signing tool." />
    </Helmet>
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-purple/10 mb-4">
              <PenTool className="w-8 h-8 text-brand-purple" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Sign PDF</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Add your digital signature to PDF documents.</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-12 text-center animate-fade-in-up">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Coming Soon</h2>
              <p className="text-muted-foreground mb-8">This feature is under development.</p>
              <Link to="/edit-pdf"><Button variant="outline">Try Edit PDF<ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  </>
);

export default SignPDF;
