import { useSyncExternalStore } from "react";

/**
 * Whether this visitor should see ads.
 * "pending" until sign-in and premium status are known, so ads never load
 * for a paying user before their status arrives.
 */
export type AdStatus = "pending" | "ads" | "ad-free";

let status: AdStatus = "pending";
const listeners = new Set<() => void>();

export const getAdStatus = (): AdStatus => status;

export const setAdStatus = (next: AdStatus) => {
  if (next === status) return;
  status = next;
  if (typeof document !== "undefined") {
    if (next === "ad-free") document.documentElement.dataset.adFree = "true";
    else delete document.documentElement.dataset.adFree;
  }
  listeners.forEach((l) => l());
};

/** Decide the ad status from auth + premium state. */
export const resolveAdStatus = (authLoading: boolean, premiumLoading: boolean, isPremium: boolean): AdStatus => {
  if (authLoading || premiumLoading) return "pending";
  return isPremium ? "ad-free" : "ads";
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useAdStatus = (): AdStatus => useSyncExternalStore(subscribe, getAdStatus, getAdStatus);
