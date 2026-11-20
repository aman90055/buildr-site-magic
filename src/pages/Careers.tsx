import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, GraduationCap, Mail } from "lucide-react";

const CAREERS_EMAIL = "documentai999@gmail.com";
const mailto = (subject: string) =>
  `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(subject)}`;

export default function Careers() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <meta name="robots" content="noindex, follow" />
        <title>Careers & Internships — Docunova</title>
        <meta
          name="description"
          content="Docunova has no open jobs or internships right now. You can email your CV and we will reply if a suitable role opens."
        />
        <link rel="canonical" href="https://docunova.online/careers" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-16 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Careers & Internships</h1>
        <p className="text-muted-foreground text-lg mb-10">
          Docunova is a small, independent project run by its founder, Aman Vishwakarma, from India.
        </p>

        <Card className="p-6 mb-6 border-primary/40">
          <h2 className="text-xl font-semibold mb-2">Current openings</h2>
          <p className="text-muted-foreground">
            There are no open jobs or internships right now. We will list any real opening here, with
            the role, the work involved, whether it is paid and the closing date.
          </p>
        </Card>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card className="p-6">
            <Briefcase className="w-5 h-5 text-primary mb-3" aria-hidden="true" />
            <h2 className="font-semibold mb-2">Jobs</h2>
            <p className="text-sm text-muted-foreground mb-4">
              If you work on web apps, PDF processing, design or writing and want to be considered
              later, send your CV and a short note about your work.
            </p>
            <Button asChild variant="outline" size="sm">
              <a href={mailto("Job interest — Docunova")}>Send your CV</a>
            </Button>
          </Card>
          <Card className="p-6">
            <GraduationCap className="w-5 h-5 text-primary mb-3" aria-hidden="true" />
            <h2 className="font-semibold mb-2">Internships</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Students can send their CV, college, available months and links to their projects. We
              keep these on file and reply only if an internship opens.
            </p>
            <Button asChild variant="outline" size="sm">
              <a href={mailto("Internship interest — Docunova")}>Send your CV</a>
            </Button>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="font-semibold mb-2">Please note</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>We never ask for money to apply or to join.</li>
            <li>We only contact you from {CAREERS_EMAIL}.</li>
          </ul>
          <Button asChild className="mt-4">
            <a href={`mailto:${CAREERS_EMAIL}`}>
              <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
              {CAREERS_EMAIL}
            </a>
          </Button>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
