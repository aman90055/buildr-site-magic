import { Helmet } from "react-helmet-async";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

const Premium = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "₹99",
      period: "/month",
      description: "Perfect for students & personal use",
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
      features: [
        "Unlimited PDF merging",
        "Compress up to 50MB files",
        "5 AI summaries per day",
        "Remove watermarks",
        "Priority processing",
        "Email support",
      ],
      popular: false,
      upiLink: "upi://pay?pa=7905970907@ibl&pn=PDFTools&am=99&cu=INR&tn=PDFTools-Basic-Plan",
    },
    {
      id: "pro",
      name: "Pro",
      price: "₹249",
      period: "/month",
      description: "Best for professionals & freelancers",
      icon: Crown,
      color: "from-primary to-purple-500",
      features: [
        "Everything in Basic",
        "Unlimited file size",
        "Unlimited AI features",
        "Batch processing (100 files)",
        "OCR with 50+ languages",
        "Priority support",
        "API access",
        "No ads",
      ],
      popular: true,
      upiLink: "upi://pay?pa=7905970907@ibl&pn=PDFTools&am=249&cu=INR&tn=PDFTools-Pro-Plan",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "₹599",
      period: "/month",
      description: "For teams & businesses",
      icon: Shield,
      color: "from-amber-500 to-orange-500",
      features: [
        "Everything in Pro",
        "5 team members",
        "Custom branding",
        "Dedicated support",
        "SLA guarantee",
        "Advanced analytics",
        "Custom integrations",
        "Unlimited batch processing",
      ],
      popular: false,
      upiLink: "upi://pay?pa=amanvishwakarma@upi&pn=PDFTools&am=599&cu=INR&tn=PDFTools-Enterprise-Plan",
    },
  ];

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
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
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
        <title>Premium Plans - PDF Tools | Unlock All Features</title>
        <meta name="description" content="Upgrade to PDF Tools Premium. Get unlimited AI features, batch processing, priority support. Plans start at ₹99/month. Pay via UPI." />
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
                Unlock Full Power
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
                Get unlimited access to all AI-powered PDF tools. No limits, no watermarks, maximum productivity.
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" /> Pay via UPI</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Activate in 24hrs</span>
                <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Cancel anytime</span>
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
                    <CardFooter>
                      <Button 
                        className="w-full group" 
                        variant={plan.popular ? "default" : "outline"}
                        onClick={() => handlePayNow(plan.id)}
                      >
                        Pay with UPI
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
                        {plans.find(p => p.id === selectedPlan)?.name} - {plans.find(p => p.id === selectedPlan)?.price}/month
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

          {/* Trust Signals */}
          <section className="py-16 bg-muted/30">
            <div className="container max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold mb-8">Trusted by 10,000+ Users</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm text-muted-foreground">PDF Tools</div>
                </div>
                <div>
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div>
                  <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div>
                  <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm text-muted-foreground">Secure</div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Premium;
