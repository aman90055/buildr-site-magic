import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useProgress - tracks % progress with ETA estimation and abort support.
 * Designed for long-running PDF / image operations.
 */
export const useProgress = () => {
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const startRef = useRef<number>(0);
  const abortRef = useRef<AbortController | null>(null);

  const start = useCallback(() => {
    startRef.current = performance.now();
    abortRef.current = new AbortController();
    setProgress(0);
    setEta("");
    setIsRunning(true);
    return abortRef.current.signal;
  }, []);

  const update = useCallback((percent: number) => {
    const clamped = Math.max(0, Math.min(100, percent));
    setProgress(clamped);
    if (clamped > 2 && clamped < 99) {
      const elapsed = performance.now() - startRef.current;
      const total = (elapsed / clamped) * 100;
      const remainingMs = total - elapsed;
      if (remainingMs > 1000) {
        const seconds = Math.ceil(remainingMs / 1000);
        setEta(seconds > 60 ? `~${Math.ceil(seconds / 60)}m left` : `~${seconds}s left`);
      } else {
        setEta("almost done…");
      }
    }
  }, []);

  const finish = useCallback(() => {
    setProgress(100);
    setEta("");
    setIsRunning(false);
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setIsRunning(false);
    setProgress(0);
    setEta("");
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  return { progress, eta, isRunning, start, update, finish, cancel };
};
