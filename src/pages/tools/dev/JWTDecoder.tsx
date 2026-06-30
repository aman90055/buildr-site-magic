import { useMemo, useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

function b64urlDecode(s: string) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  try { return decodeURIComponent(escape(atob(s))); } catch { return atob(s); }
}

export default function JWTDecoder() {
  const [token, setToken] = useState("");

  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    const parts = token.trim().split(".");
    if (parts.length < 2) return { error: "Not a valid JWT (need at least 2 dot-separated parts)." };
    try {
      const header = JSON.parse(b64urlDecode(parts[0]));
      const payload = JSON.parse(b64urlDecode(parts[1]));
      const signature = parts[2] || "(none)";
      let expires: string | null = null;
      let expired = false;
      if (typeof payload.exp === "number") {
        const d = new Date(payload.exp * 1000);
        expires = d.toLocaleString();
        expired = d.getTime() < Date.now();
      }
      return { header, payload, signature, expires, expired };
    } catch (e) {
      return { error: "Failed to decode JWT: " + (e as Error).message };
    }
  }, [token]);

  return (
    <ToolShell
      title="JWT Decoder — Decode JSON Web Tokens | DocuNova"
      description="Paste any JWT to inspect its header, payload, and signature. Detects expiration. 100% client-side and private."
      heading="JWT Decoder"
      intro="Paste a JSON Web Token to inspect its header, payload and signature. Decoding happens locally — your token never leaves your browser."
      guide={`JSON Web Tokens (JWTs) are signed credentials with three Base64URL-encoded parts: header, payload, and signature, separated by dots. The header describes the signing algorithm; the payload carries claims like 'sub', 'exp', 'iat'; the signature lets the server verify the token wasn't tampered with.\n\nThis tool only decodes the token — it does not verify the signature, because verification requires the issuer's secret or public key.`}
      faqs={[
        { q: "Does this verify the signature?", a: "No. Verifying requires the signing key, which only the issuer holds. This tool decodes the header and payload so you can inspect the claims." },
        { q: "Is my JWT sent anywhere?", a: "No. Decoding happens entirely in your browser." },
        { q: "What does 'exp' mean?", a: "It's the expiration time as a Unix timestamp (seconds). After this time the token should be rejected by the server." },
      ]}
      related={[
        { name: "Base64", href: "/tools/base64" },
        { name: "Hash Generator", href: "/tools/hash-generator" },
        { name: "UUID Generator", href: "/tools/uuid-generator" },
      ]}
      canonical="/tools/jwt-decoder"
    >
      <Label>JWT</Label>
      <Textarea value={token} onChange={e => setToken(e.target.value)} placeholder="eyJhbGciOi…" className="min-h-[100px] font-mono text-xs mb-4" />
      {decoded && "error" in decoded && (
        <p className="text-sm text-destructive">{decoded.error}</p>
      )}
      {decoded && !("error" in decoded) && (
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Label>Header</Label>
              {decoded.header.alg && <Badge variant="secondary">{decoded.header.alg}</Badge>}
            </div>
            <pre className="rounded-md border bg-muted/40 p-3 text-xs overflow-auto">{JSON.stringify(decoded.header, null, 2)}</pre>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Label>Payload</Label>
              {decoded.expires && (
                <Badge variant={decoded.expired ? "destructive" : "secondary"}>
                  {decoded.expired ? "Expired" : "Expires"} {decoded.expires}
                </Badge>
              )}
            </div>
            <pre className="rounded-md border bg-muted/40 p-3 text-xs overflow-auto">{JSON.stringify(decoded.payload, null, 2)}</pre>
          </div>
          <div>
            <Label>Signature</Label>
            <pre className="rounded-md border bg-muted/40 p-3 text-xs overflow-auto break-all whitespace-pre-wrap">{decoded.signature}</pre>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
