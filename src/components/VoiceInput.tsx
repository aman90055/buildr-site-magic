import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: string; // ISO-639-1 e.g. "en", "hi"; omit for auto-detect
  size?: "sm" | "default";
  className?: string;
}

/**
 * Mic button: records a single MediaRecorder blob, uploads to the
 * `ai-transcribe` edge function, appends transcript via onTranscript.
 * Complete-file upload (no timeslice fragments) — works across browsers.
 */
const VoiceInput = ({ onTranscript, language, size = "sm", className }: VoiceInputProps) => {
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const stopTracks = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      // Pick a mimeType the browser supports.
      const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"];
      const mimeType = candidates.find((m) => (window as any).MediaRecorder?.isTypeSupported?.(m)) || undefined;
      const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorderRef.current = rec;
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = async () => {
        stopTracks();
        const type = rec.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        if (blob.size < 1500) {
          toast({ title: "Recording too short", description: "Please speak for at least a second.", variant: "destructive" });
          return;
        }
        setUploading(true);
        try {
          const form = new FormData();
          form.append("file", blob, `recording.${type.includes("mp4") ? "mp4" : type.includes("ogg") ? "ogg" : "webm"}`);
          if (language) form.append("language", language);

          const { data: { session } } = await supabase.auth.getSession();
          const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL;
          const ANON = (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY || (import.meta as any).env.VITE_SUPABASE_ANON_KEY;
          const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-transcribe`, {
            method: "POST",
            headers: {
              apikey: ANON,
              Authorization: `Bearer ${session?.access_token || ANON}`,
            },
            body: form,
          });
          if (!res.ok) {
            const t = await res.text().catch(() => "");
            if (res.status === 429) throw new Error("Rate limit — please try again in a moment.");
            if (res.status === 402) throw new Error("AI credits exhausted.");
            throw new Error(t || `Transcription failed (${res.status})`);
          }
          const json = await res.json();
          const text = (json.text || "").trim();
          if (!text) {
            toast({ title: "No speech detected", description: "Try recording again in a quieter place.", variant: "destructive" });
          } else {
            onTranscript(text);
            toast({ title: "Transcribed", description: text.length > 60 ? text.slice(0, 60) + "…" : text });
          }
        } catch (err: any) {
          toast({ title: "Voice input failed", description: err?.message || "Unknown error", variant: "destructive" });
        } finally {
          setUploading(false);
        }
      };
      rec.start(); // single blob at stop() — no timeslice
      setRecording(true);
    } catch (err: any) {
      toast({ title: "Microphone blocked", description: err?.message || "Please allow microphone access.", variant: "destructive" });
      stopTracks();
    }
  };

  const stop = () => {
    setRecording(false);
    try { recorderRef.current?.stop(); } catch {}
  };

  const disabled = uploading;
  const label = uploading ? "Transcribing…" : recording ? "Stop" : "Speak";
  const Icon = uploading ? Loader2 : recording ? Square : Mic;

  return (
    <Button
      type="button"
      variant={recording ? "destructive" : "outline"}
      size={size}
      className={className}
      onClick={recording ? stop : start}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      <Icon className={`w-4 h-4 mr-1 ${uploading ? "animate-spin" : ""}`} />
      {label}
    </Button>
  );
};

export default VoiceInput;
