import { useState } from "react";
import { Languages } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AITextTool from "@/components/AITextTool";

const AITranslator = () => {
  const [targetLang, setTargetLang] = useState("Hindi");

  return (
    <AITextTool
      title="AI Translator"
      description="Translate text to any language while preserving meaning and context."
      metaTitle="AI Translator - Translate Text | PDF Tools"
      metaDescription="Translate text to 50+ languages with AI."
      icon={Languages}
      gradient="from-blue-500 to-cyan-600"
      systemPrompt={`You are a professional translator. Translate the given text to ${targetLang}. Preserve the original meaning, tone, and formatting. Only output the translated text.`}
      inputLabel="Text to Translate"
      inputPlaceholder="Paste the text you want to translate..."
      outputLabel="Translation"
      actionLabel={`Translate to ${targetLang}`}
      extraInput={
        <div className="space-y-2">
          <Label>Target Language</Label>
          <Select value={targetLang} onValueChange={setTargetLang}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {[
                "Afrikaans", "Albanian", "Amharic", "Arabic", "Armenian", "Azerbaijani",
                "Basque", "Bengali", "Belarusian", "Bosnian", "Bulgarian",
                "Catalan", "Cebuano", "Chinese (Simplified)", "Chinese (Traditional)", "Corsican", "Croatian", "Czech",
                "Danish", "Dutch",
                "English", "Esperanto", "Estonian",
                "Finnish", "French",
                "Galician", "Georgian", "German", "Greek", "Gujarati",
                "Haitian Creole", "Hausa", "Hawaiian", "Hebrew", "Hindi", "Hmong", "Hungarian",
                "Icelandic", "Igbo", "Indonesian", "Irish", "Italian",
                "Japanese", "Javanese",
                "Kannada", "Kazakh", "Khmer", "Korean", "Kurdish", "Kyrgyz",
                "Lao", "Latin", "Latvian", "Lithuanian", "Luxembourgish",
                "Macedonian", "Malagasy", "Malay", "Malayalam", "Maltese", "Maori", "Marathi", "Mongolian",
                "Nepali", "Norwegian", "Nyanja",
                "Pashto", "Persian", "Polish", "Portuguese", "Punjabi",
                "Romanian", "Russian",
                "Samoan", "Scots Gaelic", "Serbian", "Sesotho", "Shona", "Sindhi", "Sinhala", "Slovak", "Slovenian", "Somali", "Spanish", "Sundanese", "Swahili", "Swedish",
                "Tagalog", "Tajik", "Tamil", "Tatar", "Telugu", "Thai", "Turkish",
                "Ukrainian", "Urdu", "Uzbek",
                "Vietnamese",
                "Welsh",
                "Xhosa",
                "Yiddish", "Yoruba",
                "Zulu"
              ].map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    />
  );
};

export default AITranslator;
