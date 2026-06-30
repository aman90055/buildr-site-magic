import { Mail } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AITextTool from "@/components/AITextTool";

const AIEmailWriter = () => {
  const [tone, setTone] = useState("Professional");
  return (
    <AITextTool
      title="AI Email Writer"
      description="Compose polished emails in any tone — professional, friendly, formal, or persuasive."
      metaTitle="AI Email Writer - Free Email Generator | Document Edit Pro"
      metaDescription="Write clear, well-structured emails instantly with AI. Choose a tone and topic."
      icon={Mail}
      gradient="from-sky-500 to-blue-600"
      systemPrompt={`You are an expert email writer. Compose a clear, well-structured email in a ${tone.toLowerCase()} tone based on the user's notes. Include a strong subject line, greeting, body, and sign-off. Keep it concise.`}
      inputLabel="What's this email about?"
      inputPlaceholder="e.g., Follow up with a client about delayed invoice payment..."
      outputLabel="Generated Email"
      actionLabel={`Write ${tone} Email`}
      extraInput={
        <div className="space-y-2">
          <Label>Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Professional", "Friendly", "Formal", "Persuasive", "Apologetic", "Concise"].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    />
  );
};

export default AIEmailWriter;
