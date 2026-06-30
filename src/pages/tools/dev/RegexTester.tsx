import { useMemo, useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Contact us at hi@docunova.ai or support@example.com.");

  const { error, matches, highlighted } = useMemo(() => {
    if (!pattern) return { error: null, matches: [] as RegExpMatchArray[], highlighted: text };
    let re: RegExp;
    try { re = new RegExp(pattern, flags); } catch (e) { return { error: (e as Error).message, matches: [], highlighted: text }; }
    const m: RegExpMatchArray[] = [];
    if (flags.includes("g")) {
      let r: RegExpExecArray | null;
      while ((r = re.exec(text)) !== null) {
        m.push(r as unknown as RegExpMatchArray);
        if (r.index === re.lastIndex) re.lastIndex++;
      }
    } else {
      const r = text.match(re);
      if (r) m.push(r);
    }
    let highlighted = "";
    if (flags.includes("g")) {
      const reH = new RegExp(pattern, flags);
      highlighted = text.replace(reH, (h) => `<mark>${h}</mark>`);
    } else {
      highlighted = text.replace(re, (h) => `<mark>${h}</mark>`);
    }
    return { error: null, matches: m, highlighted };
  }, [pattern, flags, text]);

  return (
    <ToolShell
      title="Regex Tester — JavaScript RegExp Playground | DocuNova"
      description="Test JavaScript regular expressions live. See matches, capture groups, and highlights as you type."
      heading="Regex Tester"
      intro="Build and debug JavaScript regular expressions. See live matches and capture groups."
      guide={`Regular expressions are a small language for pattern matching in text. This tool uses the same engine as your browser (the JavaScript RegExp object), so anything that works here will work in your application.\n\nCommon flags: g (global, find all), i (case-insensitive), m (multiline ^ and $), s (dotall, . matches newlines), u (unicode), y (sticky).`}
      faqs={[
        { q: "Which regex flavor is this?", a: "JavaScript / ECMAScript. Slightly different from PCRE — for example, look-behinds need ES2018+." },
        { q: "Why am I getting 'Invalid regular expression'?", a: "Common causes: unescaped special chars (. ( [ ?), an unbalanced bracket, or an unsupported lookbehind in an older browser." },
      ]}
      related={[
        { name: "URL Encoder", href: "/tools/url-encoder" },
        { name: "JSON Formatter", href: "/tools/json-formatter" },
        { name: "Lorem Ipsum", href: "/tools/lorem-ipsum" },
      ]}
      canonical="/tools/regex-tester"
    >
      <div className="grid sm:grid-cols-[1fr_120px] gap-3 mb-3">
        <div>
          <Label>Pattern</Label>
          <Input className="font-mono" value={pattern} onChange={e => setPattern(e.target.value)} />
        </div>
        <div>
          <Label>Flags</Label>
          <Input className="font-mono" value={flags} onChange={e => setFlags(e.target.value)} />
        </div>
      </div>
      <Label>Test text</Label>
      <Textarea value={text} onChange={e => setText(e.target.value)} className="min-h-[140px] font-mono text-sm mb-3" />
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{matches.length} match{matches.length === 1 ? "" : "es"}</Badge>
          </div>
          <div className="rounded-md border bg-muted/30 p-3 text-sm whitespace-pre-wrap [&_mark]:bg-primary/30 [&_mark]:text-foreground [&_mark]:rounded [&_mark]:px-0.5" dangerouslySetInnerHTML={{ __html: highlighted }} />
          {matches.length > 0 && (
            <div className="mt-3 space-y-1">
              {matches.map((m, i) => (
                <div key={i} className="text-xs font-mono p-2 rounded bg-muted/40">
                  <span className="text-muted-foreground">[{i}]</span> {m[0]}
                  {m.length > 1 && <span className="text-muted-foreground"> · groups: {m.slice(1).join(" | ")}</span>}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </ToolShell>
  );
}
