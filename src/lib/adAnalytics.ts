/**
 * Lightweight client-side ad analytics.
 * Tracks impressions + clicks per placement in localStorage.
 * Read by AdminDashboard to show which placements perform best.
 */

const STORAGE_KEY = "site.adStats.v1";

export type AdNetwork = "adsense" | "adsterra";
export type AdEvent = "impression" | "click";

interface AdStatRow {
  network: AdNetwork;
  placement: string;
  impressions: number;
  clicks: number;
  lastSeen: number;
}

type Store = Record<string, AdStatRow>;

const read = (): Store => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

const write = (s: Store) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* quota */
  }
};

const key = (network: AdNetwork, placement: string) => `${network}::${placement}`;

export const trackAdEvent = (
  network: AdNetwork,
  placement: string,
  event: AdEvent,
) => {
  const store = read();
  const k = key(network, placement);
  const row = store[k] ?? {
    network,
    placement,
    impressions: 0,
    clicks: 0,
    lastSeen: 0,
  };
  if (event === "impression") row.impressions += 1;
  else row.clicks += 1;
  row.lastSeen = Date.now();
  store[k] = row;
  write(store);
};

export const getAdStats = (): AdStatRow[] =>
  Object.values(read()).sort(
    (a, b) => b.impressions + b.clicks - (a.impressions + a.clicks),
  );

export const clearAdStats = () => write({});
