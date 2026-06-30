import { useState, useMemo } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Textarea } from "@/components/ui/textarea";

export default function TextCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n+/).filter(p => p.trim()).length;
    const lines = text.split(/\n/).length;
    const readMin = Math.max(1, Math.ceil(words / 220));
    const speakMin = Math.max(1, Math.ceil(words / 130));
    return { chars, charsNoSpace, words, sentences, paragraphs, lines, readMin, speakMin };
  }, [text]);

  return (
    <ToolShell
      title="Word & Character Counter — Free Online Text Counter | DocuNova"
      description="Count words, characters, sentences, paragraphs and reading time instantly. Perfect for essays, blogs and social posts."
      heading="Word & Character Counter"
      intro="Paste any text to see live word, character, sentence and reading-time stats."
      canonical="https://docunova-ai.lovable.app/tools/text-counter"
      faqs={[{ q: "How is reading time calculated?", a: "Average adult reads 220 words/min and speaks 130 words/min — used by Medium and major CMSs." }]}
      related={[{ name: "Text Case Converter", href: "/tools/text-case" }, { name: "Lorem Ipsum", href: "/tools/lorem-ipsum" }]}
    >
      <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste or type your text here…" className="min-h-[200px] mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ["Words", stats.words], ["Characters", stats.chars], ["No-space", stats.charsNoSpace], ["Sentences", stats.sentences],
          ["Paragraphs", stats.paragraphs], ["Lines", stats.lines], ["Read time", `${stats.readMin} min`], ["Speak time", `${stats.speakMin} min`],
        ].map(([k, v]) => (
          <div key={k as string} className="p-3 rounded-lg border bg-muted/40">
            <div className="text-xs text-muted-foreground">{k}</div>
            <div className="text-xl font-bold">{v}</div>
          </div>
        ))}
      </div>
    </ToolShell>
  );
}
