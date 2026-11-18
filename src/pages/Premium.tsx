import { Helmet } from "react-helmet-async";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Crown, Check, Zap, Shield, Sparkles, Star, Upload, 
  IndianRupee, ArrowRight, Clock, FileText, Users 
} from "lucide-react";
import RazorpayCheckoutButton from "@/components/RazorpayCheckoutButton";
import { DAILY_AI_LIMITS, PAID_PLANS, PREMIUM_UPI_ID, planFeatures, planUpiLink } from "@/lib/premiumPlans";

const Premium = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const icons = { basic: Zap, pro: Crown, enterprise: Shield } as const;
  const colors = { basic: "from-blue-500 to-cyan-500", pro: "from-primary to-purple-500", enterprise: "from-amber-500 to-orange-500" } as const;
  const plans = PAID_PLANS.map((p) => ({
    id: p.id,
    name: p.name,
    price: `₹${p.price}`,
    period: "/30 days",
    description: p.description,
    icon: icons[p.id],
    color: colors[p.id],
    features: planFeatures(p),
    popular: !!p.popular,
    upiLink: planUpiLink(p),
  }));

  const handlePayNow = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    setSelectedPlan(planId);
    window.open(plan.upiLink, "_blank");
    setShowVerification(true);
  };

  const handleSubmitVerification = async () => {
    if (!utrNumber.trim() || !email.trim() || !name.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    
    const plan = plans.find(p => p.id === selectedPlan);
    const planName = plan?.name || selectedPlan || "";
    const planAmount = parseInt(plan?.price.replace("₹", "") || "0");

    const { error } = await supabase.from("payment_verifications").insert({
      name: name.trim(),
      email: email.trim(),
      utr_number: utrNumber.trim(),
      plan: planName,
      amount: planAmount,
    });

    if (error) {
      setSubmitting(false);
      toast.error("Submission failed. Please try again.");
      return;
    }

    // Send email notification (non-blocking)
    supabase.functions.invoke("payment-notification", {
      body: { name: name.trim(), email: email.trim(), utr_number: utrNumber.trim(), plan: planName, amount: planAmount },
    }).catch(console.error);

    setSubmitting(false);
    toast.success("Payment verification submitted! We'll activate your plan within 24 hours.");
    setShowVerification(false);
    setUtrNumber("");
    setEmail("");
    setName("");
    setSelectedPlan(null);
  };

  return (
    <>
      <Helmet>
        <title>Docunova Premium — No Ads and Higher AI Limits</title>
        <meta name="description" content="Docunova Premium removes ads and raises your daily AI limit. All PDF tools stay free. Plans from ₹99 for 30 days, paid by UPI." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="The Docunova AI Suite" />
        <meta property="og:title" content="Docunova Premium — No Ads and Higher AI Limits" />
        <meta property="og:description" content="Docunova Premium removes ads and raises your daily AI limit. All PDF tools stay free. Plans from ₹99 for 30 days, paid by UPI." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Docunova Premium — No Ads and Higher AI Limits" />
        <meta name="twitter:description" content="Docunova Premium removes ads and raises your daily AI limit. All PDF tools stay free. Plans from ₹99 for 30 days, paid by UPI." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 pt-24">
          {/* Hero */}
          <section className="py-16 text-center">
            <div className="container max-w-6xl mx-auto px-4">
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                <Crown className="w-3 h-3 mr-1" />
                Premium Plans
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                No ads. More AI each day.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
                Every PDF tool is already free. Premium removes ads and raises how many AI requests you can make per day.
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" /> Pay via UPI</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> UPI payments activated within 24 hours</span>
                <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> No auto-renewal</span>
              </div>
            </div>
          </section>

          {/* Plans */}
          <section className="pb-20">
            <div className="container max-w-6xl mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                  <Card key={plan.id} className={`relative bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all hover:-translate-y-1 ${plan.popular ? 'ring-2 ring-primary shadow-lg shadow-primary/10' : ''}`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground">
                          <Star className="w-3 h-3 mr-1" /> Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pt-8">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mx-auto mb-4`}>
                        <plan.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground">{plan.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                      <RazorpayCheckoutButton
                        plan={plan.id as "basic" | "pro" | "enterprise"}
                        amount={parseInt(plan.price.replace("₹", ""))}
                        planName={plan.name}
                        className="w-full"
                      />
                      <Button
                        className="w-full group"
                        variant="outline"
                        size="sm"
                        onClick={() => handlePayNow(plan.id)}
                      >
                        Or Pay with UPI (manual)
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Payment Verification */}
          {showVerification && (
            <section className="pb-20">
              <div className="container max-w-lg mx-auto px-4">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/30">
                  <CardHeader className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Verify Your Payment</h2>
                    <p className="text-sm text-muted-foreground">
                      Payment karne ke baad, neeche details bhejein. 24 ghante mein plan activate ho jayega.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Aapka naam" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="aapka@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="utr">UTR / Transaction ID</Label>
                      <Input id="utr" placeholder="UPI transaction ID daalein" value={utrNumber} onChange={(e) => setUtrNumber(e.target.value)} />
                    </div>
                    <div>
                      <Label>Selected Plan</Label>
                      <div className="p-3 rounded-lg bg-muted/50 text-sm font-medium flex items-center gap-2">
                        <Crown className="w-4 h-4 text-primary" />
                        {plans.find(p => p.id === selectedPlan)?.name} - {plans.find(p => p.id === selectedPlan)?.price}/30 days
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={handleSubmitVerification} disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit Verification"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </section>
          )}

          {/* What Premium includes */}
          <section className="py-16 bg-muted/30">
            <div className="container max-w-4xl mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6 text-center">What Premium includes</h2>
              <ul className="space-y-3 text-sm text-muted-foreground max-w-2xl mx-auto">
                <li><strong className="text-foreground">No ads.</strong> While your plan is active and you are signed in, Docunova loads no ads on any page.</li>
                <li><strong className="text-foreground">Higher daily AI limit.</strong> AI chat, writing tools, document analysis, Image to Text, image generation and voice typing share one allowance per 24 hours: {DAILY_AI_LIMITS.anonymous} without signing in, {DAILY_AI_LIMITS.free} on a free account, and {DAILY_AI_LIMITS.basic} / {DAILY_AI_LIMITS.pro} / {DAILY_AI_LIMITS.enterprise} on Basic / Pro / Enterprise.</li>
                <li><strong className="text-foreground">Same tools.</strong> PDF and image tools are free for everyone and have no paid-only version.</li>
                <li><strong className="text-foreground">How payment works.</strong> One payment covers 30 days and does not renew automatically. UPI payments go to <span className="font-mono text-foreground">{PREMIUM_UPI_ID}</span>; after you submit the transaction ID, the plan is switched on within 24 hours.</li>
              </ul>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Premium;
