import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PRESETS, levelToParams, type CompressPresetId } from "@/lib/pdfCompressEngine";
import { Feather, Gauge, Zap, SlidersHorizontal, Target } from "lucide-react";
import type { CompressionLevel } from "@/pages/PDFCompress";

interface CompressionOptionsProps {
  preset: CompressPresetId;
  onPresetChange: (preset: CompressPresetId) => void;
  compressionLevel: CompressionLevel;
  onLevelChange: (level: CompressionLevel) => void;
  targetKB: number;
  onTargetKBChange: (kb: number) => void;
  grayscale: boolean;
  onGrayscaleChange: (v: boolean) => void;
  disabled?: boolean;
}

const presetOrder: Array<{ id: CompressPresetId; icon: typeof Feather }> = [
  { id: "less", icon: Feather },
  { id: "recommended", icon: Gauge },
  { id: "extreme", icon: Zap },
  { id: "custom", icon: SlidersHorizontal },
  { id: "target", icon: Target },
];

const meta = (id: CompressPresetId) => {
  if (id === "custom")
    return { label: "Custom level", description: "Fine-tune quality with a 1–100 slider" };
  if (id === "target")
    return { label: "Target size", description: "Compress until it fits your size budget" };
  return PRESETS[id as "less" | "recommended" | "extreme"];
};

const CompressionOptions = ({
  preset,
  onPresetChange,
  compressionLevel,
  onLevelChange,
  targetKB,
  onTargetKBChange,
  grayscale,
  onGrayscaleChange,
  disabled,
}: CompressionOptionsProps) => {
  const { scale, quality } = levelToParams(compressionLevel);

  return (
    <div className="glass-card border border-border rounded-xl p-6 space-y-5">
      <div>
        <h3 className="font-semibold text-foreground">Compression level</h3>
        <p className="text-sm text-muted-foreground">
          Pick a preset or dial in exactly how small you need the file.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {presetOrder.map(({ id, icon: Icon }) => {
          const m = meta(id);
          const active = preset === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onPresetChange(id)}
              disabled={disabled}
              aria-pressed={active}
              className={`text-left rounded-xl border p-4 transition-all disabled:opacity-50 ${
                active
                  ? "border-primary bg-primary/10 shadow-[0_0_0_1px_hsl(var(--primary))]"
                  : "border-border bg-card/60 hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <span className="font-medium text-foreground text-sm">{m.label}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-snug">{m.description}</p>
            </button>
          );
        })}
      </div>

      {preset === "custom" && (
        <div className="rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Compression strength</Label>
            <span className="text-sm font-medium text-primary">{compressionLevel}</span>
          </div>
          <Slider
            value={[compressionLevel]}
            onValueChange={(v) => onLevelChange(v[0])}
            min={1}
            max={100}
            step={1}
            disabled={disabled}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Best quality</span>
            <span>Balanced</span>
            <span>Smallest</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Render scale {scale}× · image quality {Math.round(quality * 100)}%
          </p>
        </div>
      )}

      {preset === "target" && (
        <div className="rounded-xl border border-border p-4 space-y-3">
          <Label htmlFor="target-kb" className="text-sm">
            Target file size (KB)
          </Label>
          <Input
            id="target-kb"
            type="number"
            min={20}
            step={10}
            value={targetKB}
            onChange={(e) => onTargetKBChange(Math.max(20, Number(e.target.value) || 0))}
            disabled={disabled}
          />
          <div className="flex flex-wrap gap-2">
            {[100, 200, 500, 1024, 2048].map((kb) => (
              <button
                key={kb}
                type="button"
                onClick={() => onTargetKBChange(kb)}
                disabled={disabled}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                  targetKB === kb
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {kb >= 1024 ? `${kb / 1024} MB` : `${kb} KB`}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            We run multiple passes and stop as soon as the file fits your budget.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl border border-border p-4">
        <div>
          <Label htmlFor="grayscale" className="text-sm">
            Convert to grayscale
          </Label>
          <p className="text-xs text-muted-foreground">
            Extra 20–40% savings on scanned or colourful documents.
          </p>
        </div>
        <Switch
          id="grayscale"
          checked={grayscale}
          onCheckedChange={onGrayscaleChange}
          disabled={disabled || preset === "less"}
        />
      </div>
    </div>
  );
};

export default CompressionOptions;
