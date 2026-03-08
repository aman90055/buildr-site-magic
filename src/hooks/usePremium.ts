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

    const fetchStatus = async () => {
      const { data } = await supabase
        .from("user_premium_status")
        .select("plan, is_active")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

      setIsPremium(!!data);
      setPlan(data?.plan || null);
      setLoading(false);
    };

    fetchStatus();
  }, [user]);

  return { isPremium, plan, loading };
};
