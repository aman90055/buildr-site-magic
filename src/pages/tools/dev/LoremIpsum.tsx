import { useMemo, useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");

function pick<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }

function sentence() {
  const len = 6 + Math.floor(Math.random() * 12);
  const parts: string[] = [];
  for (let i = 0; i < len; i++) parts.push(pick(WORDS));
  let s = parts.join(" ");
  s = s.charAt(0).toUpperCase() + s.slice(1) + ".";
  return s;
}
function paragraph(sentences: number) {
  return Array.from({ length: sentences }, sentence).join(" ");
}

export default function LoremIpsum() {
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [count, setCount] = useState(3);
  const [seed, setSeed] = useState(0);

  const output = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    seed;
    if (type === "paragraphs") return Array.from({ length: count }, () => paragraph(4 + Math.floor(Math.random() * 4))).join("\n\n");
    if (type === "sentences") return Array.from({ length: count }, sentence).join(" ");
    const words: string[] = []; for (let i = 0; i < count; i++) words.push(pick(WORDS));
    return words.join(" ");
  }, [type, count, seed]);

  return (
    <ToolShell
      title="Lorem Ipsum Generator | DocuNova"
      description="Generate Lorem Ipsum placeholder text by paragraphs, sentences, or words. Free and unlimited."
      heading="Lorem Ipsum Generator"
      intro="Generate placeholder text by paragraphs, sentences or words for mockups and design."
      guide={`Lorem Ipsum is dummy text used in design and publishing to focus attention on layout rather than content. It originates from a passage by the Roman writer Cicero, scrambled in the 1500s by a printer.\n\nUse it for wireframes, prototypes and design mockups — but always swap in real content before user testing.`}
      faqs={[
        { q: "Can I use Lorem Ipsum in production?", a: "No — replace it with real content before shipping. Search engines may penalize placeholder content." },
      ]}
      related={[
        { name: "Markdown Editor", href: "/tools/markdown-editor" },
        { name: "Word Counter", href: "/tools/word-counter" },
      ]}
      canonical="/tools/lorem-ipsum"
    >
      <div className="grid sm:grid-cols-3 gap-3 mb-3 items-end">
        <div>
          <Label>Type</Label>
          <select className="w-full mt-1 h-10 rounded-md border bg-background px-3" value={type} onChange={e => setType(e.target.value as "paragraphs" | "sentences" | "words")}>
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <div>
          <Label>Count</Label>
          <Input type="number" min={1} max={50} value={count} onChange={e => setCount(parseInt(e.target.value) || 1)} />
        </div>
        <Button onClick={() => setSeed(s => s + 1)}>Regenerate</Button>
      </div>
      <div className="rounded-md border bg-muted/30 p-4 whitespace-pre-wrap text-sm">{output}</div>
      <Button size="sm" variant="outline" className="mt-3" onClick={() => { navigator.clipboard.writeText(output); toast({ title: "Copied" }); }}><Copy className="h-3 w-3 mr-2" />Copy</Button>
    </ToolShell>
  );
}
