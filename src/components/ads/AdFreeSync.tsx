import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePremium } from "@/hooks/usePremium";
import { resolveAdStatus, setAdStatus } from "@/lib/adFree";

/** Mounted once: keeps the shared ad status in sync with the visitor's plan. */
const AdFreeSync = () => {
  const { loading: authLoading } = useAuth();
  const { isPremium, loading: premiumLoading } = usePremium();
  useEffect(() => {
    setAdStatus(resolveAdStatus(authLoading, premiumLoading, isPremium));
  }, [authLoading, premiumLoading, isPremium]);
  return null;
};

export default AdFreeSync;
