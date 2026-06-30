import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, KeyRound, FileBarChart, Building2, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  { icon: KeyRound, title: "SSO (SAML / Google Workspace)", desc: "Single sign-on for your whole organization." },
  { icon: Users, title: "Teams & departments", desc: "Group members, share workspaces, and assign roles." },
  { icon: Shield, title: "Role-based permissions", desc: "Admin, Member, and Viewer roles with granular access." },
  { icon: FileBarChart, title: "Audit logs", desc: "Track every action with exportable activity logs." },
  { icon: Building2, title: "Org dashboard", desc: "Usage, seats, and billing in one place." },
  { icon: CheckCircle2, title: "Compliance ready", desc: "GDPR-aligned architecture, RLS, encrypted storage." },
];

export default function Enterprise() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Enterprise — Document Edit Pro AI for Teams</title>
        <meta name="description" content="SSO, team management, audit logs, and compliance for teams using Document Edit Pro AI." />
        <link rel="canonical" href="https://docunova-ai.lovable.app/enterprise" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs bg-primary/10 text-primary mb-4">For Teams</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Document tools your <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">whole company</span> can trust
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            SSO, shared workspaces, role-based access, and audit logs — built on a privacy-first, client-side
            architecture so your files never leave your devices.
          </p>
          <div className="flex gap-3 justify-center mt-6">
            <Button size="lg" asChild><a href="mailto:documentai999@gmail.com?subject=Enterprise%20inquiry">Talk to sales</a></Button>
            <Button size="lg" variant="outline" asChild><Link to="/workspace">Open workspace</Link></Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {features.map((f) => (
            <Card key={f.title} className="p-6">
              <f.icon className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-gradient-to-br from-primary/5 to-cyan-500/5 border-primary/20">
          <h2 className="text-2xl font-bold mb-2">Custom pricing for 25+ seats</h2>
          <p className="text-muted-foreground mb-4">Volume discounts, dedicated onboarding, and priority support.</p>
          <Button asChild><a href="mailto:documentai999@gmail.com?subject=Enterprise%20quote">Request a quote</a></Button>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
