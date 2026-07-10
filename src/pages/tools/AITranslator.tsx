import { useEffect, useMemo, useState } from "react";
import { Languages, Star, Clock, ChevronsUpDown, ChevronsDownUp, ArrowLeftRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AITextTool from "@/components/AITextTool";

const ALL_LANGUAGES = [
  "Afrikaans","Albanian","Amharic","Arabic","Armenian","Azerbaijani",
  "Basque","Bengali","Belarusian","Bosnian","Bulgarian",
  "Catalan","Cebuano","Chinese (Simplified)","Chinese (Traditional)","Corsican","Croatian","Czech",
  "Danish","Dutch",
  "English","Esperanto","Estonian",
  "Finnish","French",
  "Galician","Georgian","German","Greek","Gujarati",
  "Haitian Creole","Hausa","Hawaiian","Hebrew","Hindi","Hmong","Hungarian",
  "Icelandic","Igbo","Indonesian","Irish","Italian",
  "Japanese","Javanese",
  "Kannada","Kazakh","Khmer","Korean","Kurdish","Kyrgyz",
  "Lao","Latin","Latvian","Lithuanian","Luxembourgish",
  "Macedonian","Malagasy","Malay","Malayalam","Maltese","Maori","Marathi","Mongolian",
  "Nepali","Norwegian","Nyanja",
  "Pashto","Persian","Polish","Portuguese","Punjabi",
  "Romanian","Russian",
  "Samoan","Scots Gaelic","Serbian","Sesotho","Shona","Sindhi","Sinhala","Slovak","Slovenian","Somali","Spanish","Sundanese","Swahili","Swedish",
  "Tagalog","Tajik","Tamil","Tatar","Telugu","Thai","Turkish",
  "Ukrainian","Urdu","Uzbek",
  "Vietnamese",
  "Welsh",
  "Xhosa",
  "Yiddish","Yoruba",
  "Zulu",
];

const POPULAR = ["English", "Hindi", "Spanish", "French", "German", "Chinese (Simplified)", "Arabic", "Portuguese"];

const LS_TARGET = "translator:targetLang";
const LS_SOURCE = "translator:sourceLang";
const LS_FAVS = "translator:favLangs";
const LS_RECENT = "translator:recentLangs";
const LS_SHOWALL = "translator:showAll";

const readLS = <T,>(k: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};

const AITranslator = () => {
  const [sourceLang, setSourceLang] = useState<string>(() => readLS<string>(LS_SOURCE, "Auto Detect"));
  const [targetLang, setTargetLang] = useState<string>(() => readLS<string>(LS_TARGET, "Hindi"));
  const [favorites, setFavorites] = useState<string[]>(() => readLS<string[]>(LS_FAVS, ["Hindi", "English"]));
  const [recents, setRecents] = useState<string[]>(() => readLS<string[]>(LS_RECENT, []));
  const [showAll, setShowAll] = useState<boolean>(() => readLS<boolean>(LS_SHOWALL, false));
  const [search, setSearch] = useState("");

  // Auto-save settings
  useEffect(() => localStorage.setItem(LS_TARGET, JSON.stringify(targetLang)), [targetLang]);
  useEffect(() => localStorage.setItem(LS_SOURCE, JSON.stringify(sourceLang)), [sourceLang]);
  useEffect(() => localStorage.setItem(LS_FAVS, JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem(LS_RECENT, JSON.stringify(recents)), [recents]);
  useEffect(() => localStorage.setItem(LS_SHOWALL, JSON.stringify(showAll)), [showAll]);

  // Record target lang in recents when it changes
  useEffect(() => {
    setRecents((prev) => {
      const next = [targetLang, ...prev.filter((l) => l !== targetLang)].slice(0, 6);
      return next;
    });
  }, [targetLang]);

  const toggleFavorite = (lang: string) => {
    setFavorites((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const swap = () => {
    if (sourceLang === "Auto Detect") return;
    const s = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(s);
  };

  const filteredLangs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ALL_LANGUAGES;
    return ALL_LANGUAGES.filter((l) => l.toLowerCase().includes(q));
  }, [search]);

  const visibleLangs = showAll ? filteredLangs : filteredLangs.slice(0, 20);

  const systemPrompt =
    sourceLang === "Auto Detect"
      ? `You are a professional translator. Detect the source language automatically and translate the given text to ${targetLang}. Preserve original meaning, tone, and formatting. IMPORTANT: Output ONLY the translated text — no explanations, no language labels, no quotes, no prefixes, no notes. If the input is already in ${targetLang}, still output the same text once (never repeat it).`
      : `You are a professional translator. Translate the given text from ${sourceLang} to ${targetLang}. Preserve original meaning, tone, and formatting. IMPORTANT: Output ONLY the translated text — no explanations, no language labels, no quotes, no prefixes, no notes. Never repeat the output.`;

  const LANG_TO_BCP47: Record<string, string> = {
    English: "en-US", Hindi: "hi-IN", Spanish: "es-ES", French: "fr-FR", German: "de-DE",
    "Chinese (Simplified)": "zh-CN", "Chinese (Traditional)": "zh-TW", Arabic: "ar-SA",
    Portuguese: "pt-PT", Russian: "ru-RU", Japanese: "ja-JP", Korean: "ko-KR", Italian: "it-IT",
    Dutch: "nl-NL", Turkish: "tr-TR", Polish: "pl-PL", Swedish: "sv-SE", Danish: "da-DK",
    Norwegian: "nb-NO", Finnish: "fi-FI", Greek: "el-GR", Hebrew: "he-IL", Thai: "th-TH",
    Vietnamese: "vi-VN", Indonesian: "id-ID", Malay: "ms-MY", Tamil: "ta-IN", Telugu: "te-IN",
    Bengali: "bn-IN", Marathi: "mr-IN", Gujarati: "gu-IN", Urdu: "ur-PK", Punjabi: "pa-IN",
    Kannada: "kn-IN", Malayalam: "ml-IN", Ukrainian: "uk-UA", Czech: "cs-CZ", Romanian: "ro-RO",
    Hungarian: "hu-HU", Filipino: "fil-PH", Tagalog: "fil-PH",
  };
  const speakLang = LANG_TO_BCP47[targetLang];

  return (
    <AITextTool
      title="AI Translator"
      description="Translate text to any language while preserving meaning and context."
      metaTitle="AI Translator - Translate Text | PDF Tools"
      metaDescription="Translate text to 100+ languages with AI. Save favorites and recent languages for quick access."
      icon={Languages}
      gradient="from-blue-500 to-cyan-600"
      systemPrompt={systemPrompt}
      inputLabel="Text to Translate"
      inputPlaceholder="Paste the text you want to translate..."
      outputLabel="Translation"
      actionLabel={`Translate to ${targetLang}`}
      extraInput={
        <div className="space-y-4">
          {/* Source / Target row */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-2 sm:gap-3 items-end">
            <div className="space-y-2">
              <Label>From</Label>
              <Select value={sourceLang} onValueChange={setSourceLang}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Auto Detect">Auto Detect</SelectItem>
                  {ALL_LANGUAGES.map((l) => (
                    <SelectItem key={`src-${l}`} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center sm:pb-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={swap}
                disabled={sourceLang === "Auto Detect"}
                aria-label="Swap languages"
                title={sourceLang === "Auto Detect" ? "Set a source language to swap" : "Swap languages"}
              >
                <ArrowLeftRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label>To</Label>
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {favorites.length > 0 && (
                    <SelectGroup>
                      <SelectLabel className="flex items-center gap-1.5"><Star className="w-3 h-3" /> Favorites</SelectLabel>
                      {favorites.map((l) => (
                        <SelectItem key={`fav-${l}`} value={l}>{l}</SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                  {recents.length > 0 && (
                    <SelectGroup>
                      <SelectLabel className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Recent</SelectLabel>
                      {recents.map((l) => (
                        <SelectItem key={`rec-${l}`} value={l}>{l}</SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                  <SelectGroup>
                    <SelectLabel>All Languages</SelectLabel>
                    {ALL_LANGUAGES.map((l) => (
                      <SelectItem key={`all-${l}`} value={l}>{l}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Favorites quick-pick chips */}
          {favorites.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Star className="w-3 h-3" /> Favorites
              </div>
              <div className="flex flex-wrap gap-1.5">
                {favorites.map((l) => (
                  <Button
                    key={`favchip-${l}`}
                    type="button"
                    size="sm"
                    variant={l === targetLang ? "default" : "secondary"}
                    className="h-8 rounded-full text-xs"
                    onClick={() => setTargetLang(l)}
                  >
                    {l}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Recents chips */}
          {recents.length > 1 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" /> Recent
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recents.slice(0, 6).map((l) => (
                  <Button
                    key={`recchip-${l}`}
                    type="button"
                    size="sm"
                    variant={l === targetLang ? "default" : "outline"}
                    className="h-8 rounded-full text-xs"
                    onClick={() => setTargetLang(l)}
                  >
                    {l}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Popular / browse with show all + collapse */}
          <div className="space-y-2 rounded-xl border border-border/50 p-3 bg-muted/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label className="text-sm">Browse languages</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => setShowAll((s) => !s)}
              >
                {showAll ? (
                  <>
                    <ChevronsDownUp className="w-4 h-4" /> Collapse list
                  </>
                ) : (
                  <>
                    <ChevronsUpDown className="w-4 h-4" /> Show all ({ALL_LANGUAGES.length})
                  </>
                )}
              </Button>
            </div>

            {showAll && (
              <Input
                placeholder="Search language..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9"
              />
            )}

            <div
              className={`flex flex-wrap gap-1.5 ${showAll ? "max-h-64 overflow-y-auto pr-1" : ""}`}
            >
              {(showAll ? visibleLangs : POPULAR).map((l) => {
                const isFav = favorites.includes(l);
                const isActive = l === targetLang;
                return (
                  <div key={`browse-${l}`} className="inline-flex items-center">
                    <Button
                      type="button"
                      size="sm"
                      variant={isActive ? "default" : "outline"}
                      className="h-8 rounded-l-full rounded-r-none text-xs pr-2"
                      onClick={() => setTargetLang(l)}
                    >
                      {l}
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant={isActive ? "default" : "outline"}
                      className="h-8 w-8 rounded-r-full rounded-l-none border-l-0"
                      onClick={() => toggleFavorite(l)}
                      aria-label={isFav ? `Remove ${l} from favorites` : `Add ${l} to favorites`}
                      title={isFav ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                );
              })}
              {showAll && visibleLangs.length === 0 && (
                <div className="text-sm text-muted-foreground py-2">No languages match "{search}".</div>
              )}
            </div>
          </div>
        </div>
      }
    />
  );
};

export default AITranslator;
