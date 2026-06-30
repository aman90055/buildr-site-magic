import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const PREFIX = ["the", "real", "official", "its", "mr", "ms", "im", "thee", "iam"];
const SUFFIX = ["xo", "hq", "pro", "official", "vibes", "world", "yt", "tv", "studio", "lab", "fam"];
const SEP = ["", ".", "_"];

export default function UsernameGenerator() {
  const [base, setBase] = useState("alex");
  const [list, setList] = useState<string[]>([]);

  const gen = () => {
    const b = base.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!b) return;
    const out = new Set<string>();
    for (let i = 0; i < 40; i++) {
      const useP = Math.random() > 0.5, useS = Math.random() > 0.4;
      const p = useP ? PREFIX[Math.floor(Math.random() * PREFIX.length)] : "";
      const s = useS ? SUFFIX[Math.floor(Math.random() * SUFFIX.length)] : "";
      const sep = SEP[Math.floor(Math.random() * SEP.length)];
      const num = Math.random() > 0.5 ? Math.floor(Math.random() * 999) : "";
      const parts = [p, b, s, String(num)].filter(Boolean).join(sep);
      if (parts.length >= 3 && parts.length <= 20) out.add(parts);
    }
    setList([...out].slice(0, 24));
  };

  const copy = (v: string) => { navigator.clipboard.writeText(v); toast({ title: "Copied" }); };

  return (
    <ToolShell
      title="Username Generator — Instagram, Twitter, Gaming Names | DocuNova"
      description="Generate creative usernames for Instagram, Twitter, gaming and brand handles."
      heading="Username Generator"
      intro="Type a name or word and get 24 catchy username ideas."
      canonical="https://docunova-ai.lovable.app/tools/username-generator"
      faqs={[{ q: "Are these usernames available?", a: "We can't check availability across platforms — try a few directly on each network." }]}
      related={[{ name: "Bio Generator", href: "/tools/bio-generator" }, { name: "Hashtag Generator", href: "/tools/hashtag-generator" }]}
    >
      <div className="flex gap-2 mb-4 items-end">
        <div className="flex-1"><Label>Base name or keyword</Label><Input value={base} onChange={e => setBase(e.target.value)} /></div>
        <Button onClick={gen}>Generate</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {list.map((u, i) => (
          <button key={i} onClick={() => copy(u)} className="px-3 py-2 rounded-md border bg-muted/40 text-sm font-mono hover:bg-muted text-left flex items-center justify-between gap-2">
            <span className="truncate">@{u}</span><Copy className="h-3 w-3 opacity-60" />
          </button>
        ))}
      </div>
    </ToolShell>
  );
}
