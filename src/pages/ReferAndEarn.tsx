import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useReferral } from "@/hooks/useReferral";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Gift, Users, Copy, Share2, Star, CreditCard, Percent, Trophy,
  CheckCircle2, Clock, Loader2, Sparkles
} from "lucide-react";

const rewardTiers = [
  { referrals: 1, points: 50, credits: 5, discount: 5, label: "Starter" },
  { referrals: 5, points: 300, credits: 25, discount: 10, label: "Bronze" },
  { referrals: 10, points: 750, credits: 60, discount: 15, label: "Silver" },
  { referrals: 25, points: 2000, credits: 150, discount: 25, label: "Gold" },
  { referrals: 50, points: 5000, credits: 400, discount: 40, label: "Platinum" },
];

const ReferAndEarn = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { stats, referrals, rewards, loading, copyReferralLink, shareReferral } = useReferral();

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentTier = rewardTiers.filter(t => (stats?.successful_referrals || 0) >= t.referrals).pop();
  const nextTier = rewardTiers.find(t => (stats?.successful_referrals || 0) < t.referrals);

  return (
    <>
      <Helmet>
        <title>Refer & Earn | PDF Tools</title>
        <meta name="description" content="Invite friends and earn credits, discounts, and points for every successful referral." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-6xl mx-auto px-4">
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-ai flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Refer & <span className="text-gradient-ai">Earn Rewards</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Share PDF Tools with friends and earn credits, discounts, and points for every successful referral!
              </p>
            </div>

            {/* Referral Code & Share */}
            <Card className="mb-8 bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
              <div className="bg-gradient-ai p-6 text-white">
                <h2 className="text-xl font-bold mb-2">Your Referral Link</h2>
                <p className="text-white/80 text-sm">Share this link and earn rewards when friends sign up</p>
              </div>
              <CardContent className="pt-6">
                {loading ? (
                  <Skeleton className="h-12 w-full" />
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 bg-muted/50 rounded-lg px-4 py-3 font-mono text-sm text-foreground truncate">
                      {window.location.origin}?ref={stats?.referral_code || "..."}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={copyReferralLink} variant="outline" className="gap-2">
                        <Copy className="w-4 h-4" /> Copy
                      </Button>
                      <Button onClick={shareReferral} className="gap-2 bg-gradient-ai hover:opacity-90">
                        <Share2 className="w-4 h-4" /> Share
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Referrals</p>
                      <p className="text-2xl font-bold">{stats?.successful_referrals || 0}</p>
                    </div>
                    <Users className="w-8 h-8 text-primary/50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Points</p>
                      <p className="text-2xl font-bold text-yellow-500">{stats?.total_points || 0}</p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-500/50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Credits</p>
                      <p className="text-2xl font-bold text-green-500">{stats?.total_credits || 0}</p>
                    </div>
                    <CreditCard className="w-8 h-8 text-green-500/50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Discount</p>
                      <p className="text-2xl font-bold text-blue-500">{stats?.discount_percent || 0}%</p>
                    </div>
                    <Percent className="w-8 h-8 text-blue-500/50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* How it Works + Reward Tiers */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { step: "1", title: "Share Your Link", desc: "Copy and share your unique referral link with friends" },
                    { step: "2", title: "Friends Sign Up", desc: "When someone signs up using your link, it's tracked" },
                    { step: "3", title: "Earn Rewards", desc: "Get credits, points, and discounts for each referral" },
                  ].map(({ step, title, desc }) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-ai flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {step}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{title}</p>
                        <p className="text-sm text-muted-foreground">{desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5" /> Reward Tiers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {rewardTiers.map((tier) => {
                    const achieved = (stats?.successful_referrals || 0) >= tier.referrals;
                    return (
                      <div key={tier.label} className={`flex items-center justify-between p-3 rounded-lg ${achieved ? "bg-primary/10 border border-primary/20" : "bg-muted/30"}`}>
                        <div className="flex items-center gap-2">
                          {achieved ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />}
                          <span className={`font-medium text-sm ${achieved ? "text-primary" : "text-muted-foreground"}`}>{tier.label}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{tier.referrals} refs</span>
                          <span>{tier.points} pts</span>
                          <span>{tier.credits} cr</span>
                          <span>{tier.discount}% off</span>
                        </div>
                      </div>
                    );
                  })}
                  {nextTier && (
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      {nextTier.referrals - (stats?.successful_referrals || 0)} more referral{nextTier.referrals - (stats?.successful_referrals || 0) !== 1 ? "s" : ""} to reach <strong>{nextTier.label}</strong>
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Referral History */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Referral History</CardTitle>
                <CardDescription>Track your referral invitations and their status</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div className="flex-1 space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-48" /></div>
                        <Skeleton className="h-6 w-20" />
                      </div>
                    ))}
                  </div>
                ) : referrals.length > 0 ? (
                  <div className="space-y-3">
                    {referrals.map(ref => (
                      <div key={ref.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                        <div>
                          <p className="text-sm font-medium">{ref.referred_email || "Pending signup"}</p>
                          <p className="text-xs text-muted-foreground">{new Date(ref.created_at).toLocaleDateString()}</p>
                        </div>
                        <Badge variant="outline" className={ref.status === "completed" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"}>
                          {ref.status === "completed" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                          {ref.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="font-medium text-foreground mb-2">No referrals yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">Share your link to start earning rewards!</p>
                    <Button onClick={copyReferralLink} className="gap-2"><Copy className="w-4 h-4" /> Copy Referral Link</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ReferAndEarn;
