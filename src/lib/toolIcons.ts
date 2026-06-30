import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ToolIconMap = Record<string, string>;

let cache: ToolIconMap | null = null;
let inflight: Promise<ToolIconMap> | null = null;
const listeners = new Set<(m: ToolIconMap) => void>();

export async function fetchToolIcons(force = false): Promise<ToolIconMap> {
  if (cache && !force) return cache;
  if (inflight && !force) return inflight;
  inflight = (async () => {
    const { data, error } = await supabase
      .from("tool_icons")
      .select("tool_slug, icon_data_url");
    if (error) {
      console.warn("[toolIcons] fetch failed", error);
      cache = cache ?? {};
      return cache;
    }
    const map: ToolIconMap = {};
    for (const row of data ?? []) map[row.tool_slug] = row.icon_data_url;
    cache = map;
    listeners.forEach((l) => l(map));
    return map;
  })();
  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

export function invalidateToolIcons() {
  cache = null;
}

export function useToolIcons(): ToolIconMap {
  const [map, setMap] = useState<ToolIconMap>(cache ?? {});
  useEffect(() => {
    let mounted = true;
    fetchToolIcons().then((m) => mounted && setMap(m));
    const listener = (m: ToolIconMap) => mounted && setMap({ ...m });
    listeners.add(listener);
    return () => {
      mounted = false;
      listeners.delete(listener);
    };
  }, []);
  return map;
}

export function useToolIcon(slug: string): string | undefined {
  const map = useToolIcons();
  return map[slug];
}
