import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Copy, Link as LinkIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Link { id: string; label: string; url: string; }

const PLATFORMS = [
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/your-id" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/your-handle" },
  { key: "twitter", label: "Twitter / X", placeholder: "https://x.com/your-handle" },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/your-page" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@your-channel" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@your-handle" },
  { key: "github", label: "GitHub", placeholder: "https://github.com/your-username" },
  { key: "website", label: "Website", placeholder: "https://your-site.com" },
  { key: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/91xxxxxxxxxx" },
  { key: "telegram", label: "Telegram", placeholder: "https://t.me/your-handle" },
];

export default function SocialLinksHub() {
  const [name, setName] = useState("Your Name");
  const [tagline, setTagline] = useState("Builder · Creator · Open to collaborate");
  const [links, setLinks] = useState<Link[]>([]);
  const [draft, setDraft] = useState<Record<string, string>>({});

  const add = (key: string, label: string) => {
    const url = draft[key]?.trim();
    if (!url) return;
    setLinks([...links, { id: crypto.randomUUID(), label, url }]);
    setDraft({ ...draft, [key]: "" });
  };

  const remove = (id: string) => setLinks(links.filter(l => l.id !== id));

  const exportHTML = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name} — Links</title><style>body{font-family:system-ui;background:#0f172a;color:#fff;display:flex;flex-direction:column;align-items:center;padding:48px 16px;margin:0}h1{font-size:32px;margin:8px 0}p{opacity:.8}a{display:block;width:min(420px,100%);text-align:center;padding:14px;margin:8px 0;background:rgba(255,255,255,.08);border-radius:12px;color:#fff;text-decoration:none;backdrop-filter:blur(8px)}a:hover{background:rgba(255,255,255,.16)}</style></head><body><h1>${name}</h1><p>${tagline}</p>${links.map(l => `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`).join("")}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "my-links.html"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolShell
      title="Social Links Hub — Build Your Own Linktree Page | DocuNova"
      description="Create a free Linktree-style landing page for all your social profiles. Export as standalone HTML."
      heading="Social Links Hub"
      intro="Add LinkedIn, Instagram, YouTube, GitHub and more — export a single shareable page."
      canonical="https://docunova-ai.lovable.app/tools/social-links-hub"
      faqs={[{ q: "Is this like Linktree?", a: "Yes — but the exported HTML is yours to host anywhere (Netlify, GitHub Pages, your own domain) with no platform lock-in." }]}
      related={[{ name: "Bio Generator", href: "/tools/bio-generator" }, { name: "Username Generator", href: "/tools/username-generator" }]}
    >
      <div className="grid md:grid-cols-2 gap-3 mb-4">
        <div><Label>Display name</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
        <div><Label>Tagline</Label><Input value={tagline} onChange={e => setTagline(e.target.value)} /></div>
      </div>
      <div className="grid md:grid-cols-2 gap-2 mb-4">
        {PLATFORMS.map(p => (
          <div key={p.key} className="flex gap-2">
            <Input placeholder={p.placeholder} value={draft[p.key] || ""} onChange={e => setDraft({ ...draft, [p.key]: e.target.value })} />
            <Button size="sm" variant="secondary" onClick={() => add(p.key, p.label)}>Add</Button>
          </div>
        ))}
      </div>
      {links.length > 0 && (
        <>
          <div className="text-sm font-semibold mb-2">Preview</div>
          <Card className="p-6 bg-gradient-to-b from-slate-900 to-slate-950 text-white mb-3">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold">{name}</h3>
              <p className="text-sm opacity-80">{tagline}</p>
            </div>
            <div className="space-y-2 max-w-sm mx-auto">
              {links.map(l => (
                <div key={l.id} className="flex items-center gap-2">
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="flex-1 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-center text-sm backdrop-blur"><LinkIcon className="h-3 w-3 inline mr-1" />{l.label}</a>
                  <Button size="icon" variant="ghost" onClick={() => remove(l.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              ))}
            </div>
          </Card>
          <Button onClick={exportHTML}><Copy className="h-4 w-4 mr-1" />Export as HTML</Button>
        </>
      )}
    </ToolShell>
  );
}
