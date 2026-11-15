import { useState } from "react";
import { Copy, Check, QrCode, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import qrAsset from "@/assets/donation-upi-qr.jpeg.asset.json";
import { DONATION_RECIPIENT, DONATION_UPI_ID, DONATION_UPI_LINK } from "@/lib/donation";

const DonationDialog = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(DONATION_UPI_ID);
      setCopied(true);
      toast({ title: "UPI ID copied" });
    } catch {
      toast({ title: "Could not copy", description: "Select and copy the UPI ID below.", variant: "destructive" });
    }
  };
  return <Dialog onOpenChange={() => setCopied(false)}>
    <DialogTrigger asChild><Button size="sm" className="h-8 rounded-md px-3 text-xs"><QrCode />UPI / QR Donate</Button></DialogTrigger>
    <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-sm overflow-y-auto rounded-lg p-5">
      <DialogHeader><DialogTitle>Support Docunova</DialogTitle><DialogDescription>Optional donation via UPI. Choose any amount.</DialogDescription></DialogHeader>
      <img src={qrAsset.url} alt="Scan this QR with a UPI app to donate to Aman Vishwakarma" width={787} height={733} className="mx-auto aspect-[787/733] w-full max-w-64 rounded-lg" />
      <div className="text-center"><p className="text-sm font-medium">{DONATION_RECIPIENT}</p><div className="mt-2 flex items-center justify-center gap-2"><span className="select-all font-mono text-sm">{DONATION_UPI_ID}</span><Button size="icon-sm" variant="ghost" aria-label="Copy donation UPI ID" title="Copy UPI ID" onClick={copy}>{copied ? <Check /> : <Copy />}</Button></div></div>
      <Button asChild className="rounded-lg"><a href={DONATION_UPI_LINK}><Smartphone />Open UPI app</a></Button>
      <p className="text-xs leading-relaxed text-muted-foreground">Scan with a UPI app or use the link on your phone. Confirm the recipient in your payment app before paying. Donations do not purchase a plan; this site does not automatically confirm payments.</p>
    </DialogContent>
  </Dialog>;
};
export default DonationDialog;