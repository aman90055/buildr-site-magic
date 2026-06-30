/**
 * Site-wide owner-tunable settings (stored in localStorage).
 * Read by ads + exit-intent components, written by AdminDashboard.
 */

export const SETTINGS_KEYS = {
  adsEnabled: "site.adsEnabled",
  adsterraEnabled: "site.adsterraEnabled",
  exitIntentEnabled: "site.exitIntentEnabled",
  exitIntentCooldownDays: "site.exitIntentCooldownDays",
  exitIntentLastShown: "site.exitIntentLastShown",
} as const;

export const getBool = (key: string, fallback: boolean): boolean => {
  if (typeof window === "undefined") return fallback;
  const v = localStorage.getItem(key);
  if (v === null) return fallback;
  return v === "1" || v === "true";
};

export const setBool = (key: string, val: boolean) => {
  localStorage.setItem(key, val ? "1" : "0");
};

export const getNum = (key: string, fallback: number): number => {
  if (typeof window === "undefined") return fallback;
  const v = localStorage.getItem(key);
  const n = v ? Number(v) : NaN;
  return Number.isFinite(n) ? n : fallback;
};

export const setNum = (key: string, val: number) => {
  localStorage.setItem(key, String(val));
};

export const isAdsEnabled = () => getBool(SETTINGS_KEYS.adsEnabled, true);
export const isAdsterraEnabled = () => getBool(SETTINGS_KEYS.adsterraEnabled, true);
export const isExitIntentEnabled = () => getBool(SETTINGS_KEYS.exitIntentEnabled, true);
export const exitIntentCooldownDays = () => getNum(SETTINGS_KEYS.exitIntentCooldownDays, 3);

export const canShowExitIntent = (): boolean => {
  if (!isExitIntentEnabled()) return false;
  const last = getNum(SETTINGS_KEYS.exitIntentLastShown, 0);
  if (!last) return true;
  const days = exitIntentCooldownDays();
  const ms = days * 24 * 60 * 60 * 1000;
  return Date.now() - last >= ms;
};

export const markExitIntentShown = () => {
  setNum(SETTINGS_KEYS.exitIntentLastShown, Date.now());
};
