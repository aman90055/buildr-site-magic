import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const POOL: Record<string, string[]> = {
  travel: ["wanderlust","travelgram","instatravel","explore","adventure","traveltheworld","vacation","trip","tourist","passportready","traveldiaries","backpacker","getaway","roadtrip","beach","mountains"],
  food: ["foodporn","foodie","instafood","yummy","delicious","foodstagram","foodlover","homecooking","recipe","tasty","foodphotography","brunch","chef","streetfood","vegan","dessert"],
  fitness: ["fitfam","gymlife","workout","fitness","fitspo","bodybuilding","gymmotivation","fitnessmotivation","cardio","yoga","running","strongereveryday","gains","healthylifestyle","crossfit"],
  fashion: ["ootd","style","fashionblogger","instafashion","streetstyle","outfitoftheday","fashionista","trendy","stylish","menswear","womenswear","luxury","minimal","aesthetic","look"],
  tech: ["technology","tech","coding","developer","programmer","webdev","javascript","ai","startup","innovation","techie","gadgets","apple","android","saas","opensource"],
  business: ["entrepreneur","businessowner","startup","hustle","success","marketing","branding","leadership","sales","ceo","smallbusiness","money","mindset","growth","networking"],
  photography: ["photography","photooftheday","photographer","portrait","landscape","streetphotography","blackandwhite","naturephotography","canon","sony","nikon","instagood","beautiful","picoftheday"],
  art: ["art","artist","artwork","illustration","drawing","painting","digitalart","sketch","creative","design","artgallery","contemporaryart","fineart","instaart","artistsoninstagram"],
};

export default function HashtagGenerator() {
  const [topic, setTopic] = useState("travel");
  const [list, setList] = useState<string[]>([]);

  const gen = () => {
    const k = topic.toLowerCase().trim();
    const matched = Object.keys(POOL).filter(c => k.includes(c) || c.includes(k));
    const pool = matched.length ? matched.flatMap(c => POOL[c]) : Object.values(POOL).flat();
    const base = k.replace(/[^a-z0-9]/g, "");
    const custom = base ? [base, base + "lover", base + "life", base + "daily", "love" + base, "best" + base] : [];
    const all = [...new Set([...custom, ...pool])].sort(() => Math.random() - 0.5).slice(0, 30);
    setList(all);
  };

  const copyAll = () => { navigator.clipboard.writeText(list.map(t => "#" + t).join(" ")); toast({ title: `${list.length} hashtags copied` }); };

  return (
    <ToolShell
      title="Hashtag Generator — Instagram, TikTok, Twitter | DocuNova"
      description="Generate 30 trending hashtags for any topic. Perfect for Instagram, TikTok, Twitter and LinkedIn growth."
      heading="Hashtag Generator"
      intro="Enter a topic to get a ready-to-paste set of 30 relevant hashtags."
      canonical="https://docunova-ai.lovable.app/tools/hashtag-generator"
      faqs={[{ q: "How many hashtags should I use on Instagram?", a: "Instagram recommends 3–5 highly relevant hashtags. We provide 30 so you can rotate them across posts." }]}
      related={[{ name: "Bio Generator", href: "/tools/bio-generator" }, { name: "Username Generator", href: "/tools/username-generator" }]}
    >
      <div className="flex gap-2 mb-4 items-end">
        <div className="flex-1"><Label>Topic or keyword</Label><Input value={topic} onChange={e => setTopic(e.target.value)} /></div>
        <Button onClick={gen}>Generate</Button>
        {list.length > 0 && <Button variant="secondary" onClick={copyAll}><Copy className="h-4 w-4 mr-1" />Copy all</Button>}
      </div>
      <div className="flex flex-wrap gap-2">
        {list.map((t, i) => (
          <button key={i} onClick={() => { navigator.clipboard.writeText("#" + t); toast({ title: "Copied" }); }} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm hover:bg-primary/20">#{t}</button>
        ))}
      </div>
    </ToolShell>
  );
}
