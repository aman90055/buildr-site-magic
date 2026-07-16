import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface PremiumStatus {
  isPremium: boolean;
  plan: string | null;
  loading: boolean;
}

export const usePremium = (): PremiumStatus => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsPremium(false);
      setPlan(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchStatus = async () => {
      const { data } = await supabase
        .from("user_premium_status")
        .select("plan, is_active")
        .eq("user_id", user.id)
        .maybeSingle();

      if (cancelled) return;
      const active = !!data?.is_active;
      setIsPremium(active);
      setPlan(active ? data?.plan ?? null : null);
      setLoading(false);
    };

    fetchStatus();

    // Realtime: refresh immediately when this user's premium status changes.
    const channel = supabase
      .channel(`premium-status-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_premium_status",
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchStatus()
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { isPremium, plan, loading };
};
