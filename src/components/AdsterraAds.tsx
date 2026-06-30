import { useEffect, useRef } from "react";

/**
 * Adsterra Native Banner (container-based)
 */
export const AdsterraNative = () => {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !ref.current) return;
    loaded.current = true;
    const s = document.createElement("script");
    s.async = true;
    s.setAttribute("data-cfasync", "false");
    s.src =
      "//pl29713522.effectivecpmnetwork.com/155691d0aff80d6fc9b1187a19ffefe3/invoke.js";
    ref.current.appendChild(s);
  }, []);

  return (
    <div ref={ref} className="my-6 flex justify-center w-full overflow-hidden">
      <div id="container-155691d0aff80d6fc9b1187a19ffefe3" />
    </div>
  );
};

/**
 * Adsterra Banner 728x90 (iframe)
 */
export const AdsterraBanner728 = () => {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !ref.current) return;
    loaded.current = true;
    const cfg = document.createElement("script");
    cfg.text = `atOptions = { 'key':'c9ba4b0fe96b924859e1b8da1f258722','format':'iframe','height':90,'width':728,'params':{} };`;
    const inv = document.createElement("script");
    inv.src =
      "//www.highperformanceformat.com/c9ba4b0fe96b924859e1b8da1f258722/invoke.js";
    ref.current.appendChild(cfg);
    ref.current.appendChild(inv);
  }, []);

  return (
    <div
      ref={ref}
      className="my-6 flex justify-center w-full overflow-hidden"
      style={{ minHeight: 90 }}
    />
  );
};

/**
 * Loads Adsterra Social Bar + Popunder globally (once).
 */
export const AdsterraGlobalScripts = () => {
  useEffect(() => {
    const w = window as unknown as { __adsterraLoaded?: boolean };
    if (w.__adsterraLoaded) return;
    w.__adsterraLoaded = true;

    const urls = [
      "//pl29713523.effectivecpmnetwork.com/95/81/e8/9581e8ee045c8057cf31d3832cf5423a.js",
      "//pl29713521.effectivecpmnetwork.com/a3/b3/9f/a3b39ff884c02ad5a6a9e13e0b265ef1.js",
    ];
    urls.forEach((src) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      document.body.appendChild(s);
    });
  }, []);

  return null;
};
