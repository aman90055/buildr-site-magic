import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { onConsentChange } from "@/lib/adConsent";
import { loadGoogleAds, reportMergeVisit } from "@/lib/googleAds";

/** Google Ads tag + Merge page visit; runs only with marketing consent. */
const GoogleAdsTracker = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    loadGoogleAds();
    return onConsentChange(() => loadGoogleAds());
  }, []);
  useEffect(() => {
    if (pathname === "/merge") reportMergeVisit();
  }, [pathname]);
  return null;
};

export default GoogleAdsTracker;
