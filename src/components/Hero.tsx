import { Button } from "@/components/ui/button";
import { ArrowRight, Files, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { trackCTA } from "@/lib/analytics";
import { PUBLIC_PDF_START_PATH } from "@/lib/homeAccess";
import workspace from "@/assets/home-document-workspace.jpg";

const Hero = () => (
  <section className="relative isolate overflow-hidden border-b border-border" aria-labelledby="home-heading">
    <img src={workspace} alt="" width={1536} height={768} fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover object-center dark:opacity-20" />
    <div className="absolute inset-0 -z-10 bg-background/60 dark:bg-background/70" />
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:py-14">
      <div className="max-w-2xl">
        <p className="mb-4 flex items-center gap-2 text-sm font-medium text-primary"><Files className="h-4 w-4" />Your everyday document workspace</p>
        <h1 id="home-heading" className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">Docunova<br /><span className="text-primary">Free PDF tools online.</span></h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">Merge assignments, split a document or compress an attachment. Get your PDF ready to send, submit or share.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg" className="h-12 rounded-lg px-6"><Link to={PUBLIC_PDF_START_PATH} onClick={() => trackCTA("Start Free", "hero", PUBLIC_PDF_START_PATH)}>Start Free<ArrowRight /></Link></Button>
          <Button asChild variant="outline" size="lg" className="h-12 rounded-lg bg-background/80 px-6"><a href="#tools" onClick={() => trackCTA("Browse tools", "hero", "#tools")}>Browse tools</a></Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-foreground"><span>No sign-in for core PDF tools</span><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand-green" />Browser-based PDF processing</span></div>
        <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted-foreground">Signed-in Merge, Split and Compress results also save to private account storage. AI tools send submitted content online and have separate limits.</p>
      </div>
    </div>
  </section>
);
export default Hero;
