import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const transforms: Record<string, (s: string) => string> = {
  UPPERCASE: s => s.toUpperCase(),
  lowercase: s => s.toLowerCase(),
  "Title Case": s => s.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase()),
  "Sentence case": s => s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase()),
  "camelCase": s => s.toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase()),
  "PascalCase": s => (" " + s).toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase()),
  "snake_case": s => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""),
  "kebab-case": s => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  "iNVERSE cASE": s => [...s].map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(""),
  "Reverse": s => [...s].reverse().join(""),
};

export default function TextCase() {
  const [text, setText] = useState("");
  const copy = (val: string) => { navigator.clipboard.writeText(val); toast({ title: "Copied" }); };

  return (
    <ToolShell
      title="Text Case Converter — UPPER, lower, camel, snake, kebab | DocuNova"
      description="Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case and more."
      heading="Text Case Converter"
      intro="Paste text and copy any case style instantly."
      canonical="https://docunova-ai.lovable.app/tools/text-case"
      faqs={[{ q: "What's the difference between camelCase and PascalCase?", a: "camelCase starts lowercase (myVariable). PascalCase starts uppercase (MyClass)." }]}
      related={[{ name: "Word Counter", href: "/tools/text-counter" }, { name: "Lorem Ipsum", href: "/tools/lorem-ipsum" }]}
    >
      <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="Type or paste text…" className="min-h-[150px] mb-4" />
      <div className="grid md:grid-cols-2 gap-3">
        {Object.entries(transforms).map(([name, fn]) => {
          const out = fn(text);
          return (
            <div key={name} className="p-3 rounded-lg border bg-muted/40">
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs font-medium text-muted-foreground">{name}</div>
                <Button size="icon" variant="ghost" onClick={() => copy(out)}><Copy className="h-3 w-3" /></Button>
              </div>
              <div className="text-sm break-words font-mono">{out || "—"}</div>
            </div>
          );
        })}
      </div>
    </ToolShell>
  );
}
