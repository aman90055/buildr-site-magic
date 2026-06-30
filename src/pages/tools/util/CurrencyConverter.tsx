import { useState, useEffect } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CURRENCIES = ["USD","EUR","GBP","INR","JPY","CNY","AUD","CAD","CHF","SGD","AED","SAR","HKD","KRW","BRL","ZAR","RUB","MXN","TRY","NZD"];

export default function CurrencyConverter() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [amt, setAmt] = useState(100);
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    // Free, no-key public API
    fetch(`https://open.er-api.com/v6/latest/${from}`)
      .then(r => r.json())
      .then(j => {
        if (cancelled) return;
        if (j?.rates?.[to]) {
          setRate(j.rates[to]);
          setUpdated(j.time_last_update_utc || "");
        }
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [from, to]);

  return (
    <ToolShell
      title="Currency Converter — Live Exchange Rates | DocuNova"
      description="Free live currency converter. Convert USD, EUR, GBP, INR and 20+ currencies with real-time exchange rates."
      heading="Currency Converter"
      intro="Live rates powered by the open exchange-rate API. Updated daily."
      canonical="https://docunova-ai.lovable.app/tools/currency-converter"
      faqs={[{ q: "Are these rates real-time?", a: "Rates refresh daily from open.er-api.com. For high-frequency trading use a paid provider." }]}
      related={[{ name: "Unit Converter", href: "/tools/unit-converter" }, { name: "GST Calculator", href: "/tools/gst-calculator" }]}
    >
      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <div><Label>Amount</Label><Input type="number" value={amt} onChange={e => setAmt(+e.target.value)} /></div>
        <div>
          <Label>From</Label>
          <Select value={from} onValueChange={setFrom}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>To</Label>
          <Select value={to} onValueChange={setTo}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="p-4 rounded-lg border bg-muted/40 text-center">
        {loading ? <div className="text-muted-foreground">Fetching live rate…</div> : rate ? (
          <>
            <div className="text-sm text-muted-foreground">{amt} {from} =</div>
            <div className="text-3xl font-bold">{(amt * rate).toLocaleString(undefined, { maximumFractionDigits: 4 })} {to}</div>
            <div className="text-xs text-muted-foreground mt-2">1 {from} = {rate.toFixed(6)} {to}{updated && ` · Updated ${updated}`}</div>
          </>
        ) : <div className="text-destructive">Could not fetch rate. Try again.</div>}
      </div>
    </ToolShell>
  );
}
