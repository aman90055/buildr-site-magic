import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Sparkles, Zap } from "lucide-react";

const Newsletter = () => (
  <>
    <Helmet>
      <title>Newsletter — The Docunova AI Suite</title>
      <meta name="description" content="Get product updates, new AI tools, and pro tips delivered to your inbox. No spam." />
      <link rel="canonical" href="https://document-edit-in.lovable.app/newsletter" />
    </Helmet>
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 container max-w-3xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">The The Docunova AI Suite Newsletter</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            New tools, AI features, productivity tips and exclusive offers — delivered twice a month. Unsubscribe anytime.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <NewsletterForm />
          </CardContent>
        </Card>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: Sparkles, title: "First access", desc: "Be first to try new AI tools, beta features and templates." },
            { icon: Zap, title: "Workflow tips", desc: "Real productivity tricks from power users — short, no fluff." },
            { icon: Mail, title: "Zero spam", desc: "2 emails / month max. One-click unsubscribe, always." },
          ].map((p) => (
            <Card key={p.title}>
              <CardContent className="pt-6 text-center">
                <p.icon className="w-6 h-6 mx-auto text-primary mb-2" />
                <h3 className="font-semibold mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  </>
);

export default Newsletter;
