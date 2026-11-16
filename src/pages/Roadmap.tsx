import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, Sparkles } from "lucide-react";

interface Item { title: string; desc: string; status: "shipped" | "in-progress" | "planned"; quarter: string }

const roadmap: Item[] = [
  { title: "Support chat", desc: "Ask questions and get passed to a person when the answer is unclear.", status: "shipped", quarter: "Oct 2026" },
  { title: "Real Office exports", desc: "PDF to Word, Excel and PowerPoint produce DOCX, XLSX and PPTX files.", status: "shipped", quarter: "Oct 2026" },
  { title: "Step-by-step tool guides", desc: "Merge, Compress, Split and Image to Text have guides with steps, limits and FAQs.", status: "shipped", quarter: "Oct 2026" },
  { title: "Guides for more tools", desc: "Same practical guides for PDF to Image, Image to PDF, Protect PDF and Edit PDF.", status: "in-progress", quarter: "Next" },
  { title: "Reorder single pages in Merge PDF", desc: "Today Merge reorders whole files; page-level ordering is planned.", status: "planned", quarter: "Later" },
  { title: "Better table detection in PDF to Excel", desc: "Rows are approximated today; we want cleaner columns for scanned and complex tables.", status: "planned", quarter: "Later" },
  { title: "Text-based Word to PDF", desc: "Office to PDF currently renders pages as images; selectable text output is planned.", status: "planned", quarter: "Later" },
];

const icon = (s: Item["status"]) =>
  s === "shipped" ? <CheckCircle2 className="w-5 h-5 text-green-500" /> :
  s === "in-progress" ? <Clock className="w-5 h-5 text-amber-500" /> :
  <Circle className="w-5 h-5 text-muted-foreground" />;

const Roadmap = () => (
  <>
    <Helmet>
      <title>Public Roadmap — The Docunova AI Suite</title>
      <meta name="description" content="See what's shipped, in progress, and planned for The Docunova AI Suite." />
      <link rel="canonical" href="https://docunova.online/roadmap" />
    </Helmet>
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 container max-w-5xl">
        <div className="text-center mb-12">
          <Badge className="mb-3"><Sparkles className="w-3 h-3 mr-1" /> Public Roadmap</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">What we're building next</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            What shipped recently and what we're working on. Suggest changes through our
            {" "}<Link to="/contact" className="text-primary underline">feedback form</Link>.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {roadmap.map((r) => (
            <Card key={r.title}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-lg flex items-center gap-2">{icon(r.status)} {r.title}</CardTitle>
                  <Badge variant="outline">{r.quarter}</Badge>
                </div>
              </CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{r.desc}</p></CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  </>
);

export default Roadmap;
