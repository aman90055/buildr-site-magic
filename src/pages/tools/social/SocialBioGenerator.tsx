import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const TEMPLATES: Record<string, (n: string, r: string, k: string) => string[]> = {
  Instagram: (n, r, k) => [
    `✨ ${n} | ${r}\n📌 ${k}\n🌎 DM for collabs`,
    `${n} 🌸\n${r}\nLover of ${k} ✨\n📩 hello@${n.toLowerCase().replace(/\s/g, "")}.com`,
    `📍 ${r}\n🧠 ${k}\n💫 New post every week`,
  ],
  LinkedIn: (n, r, k) => [
    `${r} | Helping people with ${k}. Connect to collaborate.`,
    `${r} • ${k} specialist • Open to opportunities. Let's connect.`,
    `Driven ${r} passionate about ${k}. Building, learning, sharing.`,
  ],
  Twitter: (n, r, k) => [
    `${r} | tweeting about ${k} 🚀`,
    `🧠 ${r} · 📈 ${k} · ✍️ thoughts in public`,
    `${r}. I help people with ${k}. DMs open.`,
  ],
  YouTube: (n, r, k) => [
    `Welcome to ${n}! 🎬\nWeekly videos on ${k}. Subscribe for more!`,
    `${r} sharing everything about ${k}. New uploads every Friday.`,
    `Your destination for ${k}. ${r} · 100% original content.`,
  ],
};

export default function SocialBioGenerator() {
  const [platform, setPlatform] = useState("Instagram");
  const [name, setName] = useState("Alex");
  const [role, setRole] = useState("Content Creator");
  const [keywords, setKeywords] = useState("travel, design");
  const [results, setResults] = useState<string[]>([]);

  const gen = () => setResults(TEMPLATES[platform](name, role, keywords));
  const copy = (t: string) => { navigator.clipboard.writeText(t); toast({ title: "Copied" }); };

  return (
    <ToolShell
      title="Social Media Bio Generator — Instagram, LinkedIn, Twitter, YouTube | DocuNova"
      description="Generate catchy bios for Instagram, LinkedIn, Twitter and YouTube in seconds."
      heading="Social Bio Generator"
      intro="Pick a platform, add a few details, and get ready-to-paste bio variants."
      canonical="https://docunova-ai.lovable.app/tools/bio-generator"
      faqs={[{ q: "Can I use these bios commercially?", a: "Yes — the generated text is yours to use freely on any profile." }]}
      related={[{ name: "Hashtag Generator", href: "/tools/hashtag-generator" }, { name: "Username Generator", href: "/tools/username-generator" }]}
    >
      <div className="grid md:grid-cols-4 gap-3 mb-3">
        <div>
          <Label>Platform</Label>
          <Select value={platform} onValueChange={setPlatform}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{Object.keys(TEMPLATES).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Your name</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
        <div><Label>Role</Label><Input value={role} onChange={e => setRole(e.target.value)} /></div>
        <div><Label>Keywords</Label><Input value={keywords} onChange={e => setKeywords(e.target.value)} /></div>
      </div>
      <Button onClick={gen} className="mb-4">Generate Bios</Button>
      <div className="space-y-3">
        {results.map((r, i) => (
          <div key={i} className="p-3 rounded-lg border bg-muted/40 flex gap-2">
            <pre className="whitespace-pre-wrap text-sm flex-1 font-sans">{r}</pre>
            <Button size="icon" variant="ghost" onClick={() => copy(r)}><Copy className="h-3 w-3" /></Button>
          </div>
        ))}
      </div>
    </ToolShell>
  );
}
