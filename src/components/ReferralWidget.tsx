import { Link } from "react-router-dom";
import { useReferral } from "@/hooks/useReferral";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Gift, Copy, Users, Star, ArrowRight } from "lucide-react";

const ReferralWidget = () => {
  const { stats, loading, copyReferralLink } = useReferral();

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
      <div className="bg-gradient-ai p-4 text-white">
        <CardTitle className="flex items-center gap-2 text-white text-base">
          <Gift className="w-5 h-5" /> Refer & Earn
        </CardTitle>
      </div>
      <CardContent className="pt-4 space-y-4">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold">{stats?.successful_referrals || 0}</p>
                <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                  <Users className="w-3 h-3" /> Referrals
                </p>
              </div>
              <div>
                <p className="text-lg font-bold text-yellow-500">{stats?.total_points || 0}</p>
                <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                  <Star className="w-3 h-3" /> Points
                </p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-500">{stats?.total_credits || 0}</p>
                <p className="text-[10px] text-muted-foreground">Credits</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={copyReferralLink} variant="outline" size="sm" className="flex-1 gap-1 text-xs">
                <Copy className="w-3 h-3" /> Copy Link
              </Button>
              <Button asChild size="sm" className="flex-1 gap-1 text-xs bg-gradient-ai hover:opacity-90">
                <Link to="/refer"><ArrowRight className="w-3 h-3" /> Details</Link>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferralWidget;
