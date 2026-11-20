import { Button } from "@/components/ui/button";
import { ArrowRight, Files, GripVertical, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { trackCTA } from "@/lib/analytics";
import { PUBLIC_PDF_START_PATH } from "@/lib/homeAccess";
import workspace from "@/assets/home-document-workspace.jpg";

const queue = [
  { name: "assignment-part-1.pdf", pages: 12, tone: "bg-brand-blue/10 text-brand-blue" },
  { name: "lecture-notes-scan.pdf", pages: 8, tone: "bg-brand-cyan/10 text-brand-cyan" },
  { name: "cover-page.pdf", pages: 1, tone: "bg-brand-green/10 text-brand-green" },
];

const Hero = () => (
  <section className="relative isolate overflow-hidden border-b border-border" aria-labelledby="home-heading">
    <img src={workspace} alt="" width={1536} height={768} className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-70 dark:opacity-15" />
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/90 to-background/45 dark:via-background/92 dark:to-background/70" />
    <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
      <div className="max-w-2xl">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-medium text-primary sm:text-sm">
          <Files className="h-4 w-4" />Your everyday document workspace
        </p>
        <h1 id="home-heading" className="font-display text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
          Docunova
          <br />
          <span className="text-gradient">Free PDF tools online.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Merge assignments, split a document or compress an attachment. Get your PDF ready to send, submit or share.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild size="lg" className="h-12 rounded-lg px-6">
            <Link to={PUBLIC_PDF_START_PATH} onClick={() => trackCTA("Start Free", "hero", PUBLIC_PDF_START_PATH)}>Start Free<ArrowRight /></Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 rounded-lg bg-background/80 px-6">
            <a href="#tools" onClick={() => trackCTA("Browse tools", "hero", "#tools")}>Browse tools</a>
          </Button>
        </div>
        <div className="mt-7 flex flex-wrap gap-x-3 gap-y-2 text-sm text-foreground">
          <span className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-card/70 px-3 py-1.5">No sign-in for core PDF tools</span>
          <span className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-card/70 px-3 py-1.5"><ShieldCheck className="h-4 w-4 text-brand-green" />Browser-based PDF processing</span>
        </div>
        <p className="mt-4 max-w-xl text-xs leading-relaxed text-muted-foreground">Signed-in Merge, Split and Compress results also save to private account storage. AI tools send submitted content online and have separate limits.</p>
      </div>
      <div aria-hidden="true" className="relative mx-auto w-full max-w-md lg:max-w-none">
        <div className="rounded-2xl border border-border/60 bg-card/85 p-4 shadow-2xl shadow-primary/10 backdrop-blur-xl sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Files className="h-4 w-4" /></span>
              <div>
                <p className="font-display text-sm font-semibold">Merge PDF</p>
                <p className="text-xs text-muted-foreground">3 files · 21 pages</p>
              </div>
            </div>
            <span className="rounded-full bg-brand-green/10 px-2.5 py-1 text-xs font-medium text-brand-green">Ready</span>
          </div>
          <ul className="space-y-2">
            {queue.map((file) => (
              <li key={file.name} className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/70 px-3 py-2.5">
                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-semibold ${file.tone}`}>PDF</span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{file.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{file.pages} page{file.pages === 1 ? "" : "s"}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-primary/5 px-3 py-2.5">
            <span className="text-xs text-muted-foreground">Order you set, in one file</span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">Merge files<ArrowRight className="h-3 w-3" /></span>
          </div>
        </div>
        <div className="absolute -bottom-4 -left-3 hidden items-center gap-2 rounded-xl border border-border/60 bg-card/90 px-3 py-2 text-xs shadow-lg backdrop-blur-xl sm:flex">
          <Sparkles className="h-3.5 w-3.5 text-brand-cyan" />Runs in your browser
        </div>
      </div>
    </div>
  </section>
);
export default Hero;
