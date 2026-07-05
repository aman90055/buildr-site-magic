import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialMeta from "@/components/SocialMeta";
import ShareButtons from "@/components/ShareButtons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Briefcase, Globe, Heart, Rocket, Users, Zap } from "lucide-react";

const openings = [
  { title: "Senior Full-Stack Engineer", location: "Remote · Worldwide", type: "Full-time", team: "Engineering" },
  { title: "AI / ML Engineer", location: "Remote · Worldwide", type: "Full-time", team: "AI" },
  { title: "Product Designer", location: "Remote · Worldwide", type: "Full-time", team: "Design" },
  { title: "Growth Marketer", location: "Remote · Worldwide", type: "Full-time", team: "Growth" },
  { title: "DevRel Engineer", location: "Remote · Worldwide", type: "Full-time", team: "Community" },
  { title: "Customer Success Lead", location: "Remote · Worldwide", type: "Full-time", team: "Support" },
];

const values = [
  { icon: Rocket, title: "Ship fast", desc: "Small teams, fewer meetings, real shipped work." },
  { icon: Globe, title: "Remote-first", desc: "Work from anywhere. Async by default." },
  { icon: Heart, title: "Care deeply", desc: "We obsess over user trust and craft." },
  { icon: Zap, title: "Own outcomes", desc: "Less process, more ownership." },
];

const Careers = () => {
  return (
    <div className="min-h-screen">
      <SocialMeta
        title="Careers — The Docunova AI Suite"
        description="Join the team building the world's most loved AI document platform. Remote-first, async, global."
        path="/careers"
      />
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-medium text-primary mb-2">We're hiring</p>
            <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Build the future of documents
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              The Docunova AI Suite powers millions of document workflows every month. Join a small,
              senior, fully-remote team shipping at high velocity.
            </p>
          </div>
          <ShareButtons title="Careers at The Docunova AI Suite" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {values.map((v) => (
            <Card key={v.title} className="p-5 glass-card">
              <v.icon className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-display font-semibold mb-1">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </Card>
          ))}
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" /> Open roles
          </h2>
          <div className="space-y-3">
            {openings.map((o) => (
              <Card
                key={o.title}
                className="p-5 glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-card-hover transition-shadow"
              >
                <div>
                  <h3 className="font-display font-semibold">{o.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {o.team} · {o.location} · {o.type}
                  </p>
                </div>
                <Button asChild>
                  <a href={`mailto:documentai999@gmail.com?subject=Application — ${o.title}`}>
                    Apply
                  </a>
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16 glass-card rounded-2xl p-8 text-center">
          <Users className="w-8 h-8 mx-auto text-primary mb-3" />
          <h2 className="text-2xl font-display font-bold mb-2">Don't see your role?</h2>
          <p className="text-muted-foreground mb-4">
            We're always open to exceptional people. Tell us how you'd help.
          </p>
          <Button asChild>
            <a href="mailto:documentai999@gmail.com?subject=Open application">Send open application</a>
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
