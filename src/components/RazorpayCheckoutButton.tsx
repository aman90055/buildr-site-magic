import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { CreditCard, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutButtonProps {
  plan: "basic" | "pro" | "enterprise";
  amount: number;
  planName: string;
  className?: string;
}

const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const RazorpayCheckoutButton = ({ plan, amount, planName, className }: RazorpayCheckoutButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!user) {
      toast.error("Please sign in first");
      navigate("/auth");
      return;
    }
    setLoading(true);
    try {
      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Razorpay SDK failed to load");

      const { data: order, error } = await supabase.functions.invoke("razorpay-create-order", {
        body: { plan, currency: "INR" },
      });
      if (error || !order?.order_id) throw new Error(error?.message || "Failed to create order");

      const rzp = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "PDF Tools Premium",
        description: `${planName} Plan`,
        order_id: order.order_id,
        prefill: { email: user.email },
        theme: { color: "#3b82f6" },
        handler: async (response: any) => {
          const { data, error: vErr } = await supabase.functions.invoke("razorpay-verify-payment", {
            body: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan,
              amount,
            },
          });
          if (vErr || !data?.success) {
            toast.error("Payment verification failed. Contact support.");
            return;
          }
          toast.success(`${planName} activated! Valid till ${new Date(data.expires_at).toLocaleDateString()}`);
          setTimeout(() => navigate("/dashboard"), 1500);
        },
        modal: { ondismiss: () => setLoading(false) },
      });

      rzp.on("payment.failed", (resp: any) => {
        toast.error(`Payment failed: ${resp.error?.description || "Unknown"}`);
        setLoading(false);
      });

      rzp.open();
    } catch (e) {
      toast.error((e as Error).message);
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePay} disabled={loading} className={className} size="lg">
      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
      Pay ₹{amount} with Razorpay
    </Button>
  );
};

export default RazorpayCheckoutButton;
