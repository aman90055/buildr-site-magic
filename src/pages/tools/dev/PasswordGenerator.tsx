import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?/~",
};

function rand(n: number) { const b = new Uint32Array(1); crypto.getRandomValues(b); return b[0] % n; }

export default function PasswordGenerator() {
  const [length, setLength] = useState(20);
  const [opts, setOpts] = useState({ lower: true, upper: true, digits: true, symbols: true });
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [count, setCount] = useState(5);
  const [passwords, setPasswords] = useState<string[]>([]);

  const generate = () => {
    let pool = "";
    if (opts.lower) pool += SETS.lower;
    if (opts.upper) pool += SETS.upper;
    if (opts.digits) pool += SETS.digits;
    if (opts.symbols) pool += SETS.symbols;
    if (excludeAmbiguous) pool = pool.replace(/[Il1O0|`'"]/g, "");
    if (!pool) { toast({ title: "Pick at least one character set", variant: "destructive" }); return; }
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      let p = "";
      for (let j = 0; j < length; j++) p += pool[rand(pool.length)];
      list.push(p);
    }
    setPasswords(list);
  };

  const entropy = Math.round(length * Math.log2(
    (opts.lower ? 26 : 0) + (opts.upper ? 26 : 0) + (opts.digits ? 10 : 0) + (opts.symbols ? 27 : 0) || 1
  ));
  const strength = entropy < 40 ? "Weak" : entropy < 60 ? "Fair" : entropy < 80 ? "Strong" : "Excellent";

  return (
    <ToolShell
      title="Password Generator — Strong Random Passwords | DocuNova"
      description="Generate cryptographically secure passwords with customizable length and character sets. Bulk generation supported."
      heading="Password Generator"
      intro="Create strong, cryptographically random passwords. Customize length, character sets and avoid ambiguous characters."
      guide={`This tool uses crypto.getRandomValues — the same secure RNG used by browsers for cryptographic operations. Passwords never leave your device.\n\nPassword strength is measured in bits of entropy. A password with 60+ bits resists most offline attacks; 80+ bits is comfortable for high-value accounts. Length matters far more than special characters — a 20-character random lowercase string is much stronger than 8 mixed characters.`}
      faqs={[
        { q: "Are these passwords truly random?", a: "Yes. We use the WebCrypto cryptographically secure RNG, the same one used for SSL/TLS key generation in your browser." },
        { q: "What does 'exclude ambiguous' do?", a: "Removes look-alike characters: I, l, 1, O, 0 and quote-like symbols." },
      ]}
      related={[
        { name: "Hash Generator", href: "/tools/hash-generator" },
        { name: "UUID Generator", href: "/tools/uuid-generator" },
      ]}
      canonical="/tools/password-generator"
    >
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1"><Label>Length: {length}</Label><span className="text-xs text-muted-foreground">{entropy} bits · {strength}</span></div>
          <Slider min={6} max={64} step={1} value={[length]} onValueChange={v => setLength(v[0])} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(["lower", "upper", "digits", "symbols"] as const).map(k => (
            <label key={k} className="flex items-center gap-2 text-sm">
              <Checkbox checked={opts[k]} onCheckedChange={c => setOpts(o => ({ ...o, [k]: !!c }))} />
              {k === "lower" && "a–z"}{k === "upper" && "A–Z"}{k === "digits" && "0–9"}{k === "symbols" && "!@#$"}
            </label>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={excludeAmbiguous} onCheckedChange={c => setExcludeAmbiguous(!!c)} />
          Exclude ambiguous (I, l, 1, O, 0, quotes)
        </label>
        <div className="flex gap-3 items-end">
          <div>
            <Label htmlFor="count">Count</Label>
            <Input id="count" type="number" min={1} max={100} value={count} onChange={e => setCount(parseInt(e.target.value) || 1)} className="w-24" />
          </div>
          <Button onClick={generate}><RefreshCw className="h-4 w-4 mr-2" />Generate</Button>
        </div>
        <div className="space-y-2">
          {passwords.map((p, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-muted/40 font-mono text-sm break-all">
              <span className="flex-1">{p}</span>
              <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(p); toast({ title: "Copied" }); }}><Copy className="h-3 w-3" /></Button>
            </div>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}
