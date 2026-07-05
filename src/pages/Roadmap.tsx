import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, Sparkles } from "lucide-react";

interface Item { title: string; desc: string; status: "shipped" | "in-progress" | "planned"; quarter: string }

const roadmap: Item[] = [
  { title: "AI Smart Compression", desc: "ML-based compression level recommendations.", status: "shipped", quarter: "Q4 2025" },
  { title: "Daily Check-in Rewards", desc: "Earn credits with streak bonuses every day.", status: "shipped", quarter: "Q4 2025" },
  { title: "Razorpay Live Payments", desc: "Indian payments + global cards via Razorpay.", status: "shipped", quarter: "Q1 2026" },
  { title: "Owner Revenue Dashboard", desc: "MTD/LTD revenue, conversions, user analytics.", status: "shipped", quarter: "Q1 2026" },
  { title: "Programmatic SEO Pages", desc: "Auto-generated landing pages for every tool & language.", status: "in-progress", quarter: "Q2 2026" },
  { title: "Team Workspaces", desc: "Share folders, role permissions, audit logs.", status: "planned", quarter: "Q3 2026" },
  { title: "Public REST API + SDK", desc: "Programmatic access to every tool, with rate-limit dashboard.", status: "planned", quarter: "Q3 2026" },
  { title: "Native Mobile Apps", desc: "Android + iOS apps with offline mode and push notifications.", status: "planned", quarter: "Q4 2026" },
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
      <link rel="canonical" href="https://document-edit-in.lovable.app/roadmap" />
    </Helmet>
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 container max-w-5xl">
        <div className="text-center mb-12">
          <Badge className="mb-3"><Sparkles className="w-3 h-3 mr-1" /> Public Roadmap</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">What we're building next</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transparent product development. Vote for what matters via our
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
