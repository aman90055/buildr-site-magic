import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const RemovePages = () => (
  <>
    <Helmet>
      <title>Remove PDF Pages - Delete Pages from PDF Online</title>
      <meta name="description" content="Remove unwanted pages from your PDF documents. Free online PDF page remover tool." />
    </Helmet>
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <Trash2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Remove Pages</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Delete unwanted pages from your PDF documents.</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-12 text-center animate-fade-in-up">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Coming Soon</h2>
              <p className="text-muted-foreground mb-8">This feature is under development.</p>
              <Link to="/split"><Button variant="outline">Try Split PDF<ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  </>
);

export default RemovePages;
