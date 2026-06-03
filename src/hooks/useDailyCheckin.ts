import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface CheckinRecord {
  checkin_date: string;
  streak_day: number;
  credits_earned: number;
}

export function useDailyCheckin() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [history, setHistory] = useState<CheckinRecord[]>([]);
  const [claimedToday, setClaimedToday] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  const today = new Date().toISOString().slice(0, 10);

  const fetchHistory = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from("daily_checkins")
      .select("checkin_date, streak_day, credits_earned")
      .eq("user_id", user.id)
      .order("checkin_date", { ascending: false })
      .limit(30);
    const rows = (data || []) as CheckinRecord[];
    setHistory(rows);
    const todayRow = rows.find(r => r.checkin_date === today);
    setClaimedToday(!!todayRow);
    setCurrentStreak(rows[0]?.streak_day ?? 0);
    setLoading(false);
  }, [user, today]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const claim = useCallback(async () => {
    if (!user || claiming || claimedToday) return;
    setClaiming(true);
    try {
      const { data, error } = await supabase.rpc("claim_daily_checkin");
      if (error) throw error;
      const result = data as { success: boolean; error?: string; credits_earned?: number; streak_day?: number; bonus?: number };
      if (!result.success) {
        toast({ title: "Already claimed", description: result.error || "Come back tomorrow!" });
        await fetchHistory();
        return;
      }
      toast({
        title: `+${result.credits_earned} credits!`,
        description: `Day ${result.streak_day} streak${result.bonus ? ` • +${result.bonus} bonus!` : ""} 🔥`,
      });
      await fetchHistory();
    } catch (err: any) {
      toast({ title: "Check-in failed", description: err.message, variant: "destructive" });
    } finally {
      setClaiming(false);
    }
  }, [user, claiming, claimedToday, fetchHistory]);

  return { loading, claiming, claimedToday, currentStreak, history, claim, refetch: fetchHistory };
}
