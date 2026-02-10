import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface ReferralStats {
  referral_code: string;
  total_referrals: number;
  successful_referrals: number;
  total_points: number;
  total_credits: number;
  discount_percent: number;
}

interface Referral {
  id: string;
  referral_code: string;
  referred_email: string | null;
  status: string;
  created_at: string;
  completed_at: string | null;
}

interface Reward {
  id: string;
  reward_type: string;
  amount: number;
  description: string | null;
  redeemed: boolean;
  created_at: string;
}

export function useReferral() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  const generateCode = useCallback(() => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "REF-";
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  }, []);

  const fetchData = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      // Get or create stats
      let { data: statsData } = await supabase
        .from("user_referral_stats")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!statsData) {
        const code = generateCode();
        const { data: newStats, error } = await supabase
          .from("user_referral_stats")
          .insert({ user_id: user.id, referral_code: code })
          .select()
          .single();
        if (error) throw error;
        statsData = newStats;
      }
      setStats(statsData as ReferralStats);

      // Fetch referrals
      const { data: refData } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      setReferrals((refData || []) as Referral[]);

      // Fetch rewards
      const { data: rewardData } = await supabase
        .from("referral_rewards")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      setRewards((rewardData || []) as Reward[]);
    } catch (err) {
      console.error("Referral fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user, generateCode]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const copyReferralLink = useCallback(() => {
    if (!stats) return;
    const link = `${window.location.origin}?ref=${stats.referral_code}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Link copied!", description: "Share this link with friends to earn rewards." });
  }, [stats]);

  const shareReferral = useCallback(async () => {
    if (!stats) return;
    const link = `${window.location.origin}?ref=${stats.referral_code}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join PDF Tools",
          text: "Try this amazing PDF tools platform! Use my referral link:",
          url: link,
        });
      } catch {}
    } else {
      copyReferralLink();
    }
  }, [stats, copyReferralLink]);

  return { stats, referrals, rewards, loading, copyReferralLink, shareReferral, refetch: fetchData };
}
