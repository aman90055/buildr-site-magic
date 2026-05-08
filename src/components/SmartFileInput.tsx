import { useCallback, useState } from "react";
import { Upload, FileUp, Sparkles } from "lucide-react";
import CameraCapture from "@/components/CameraCapture";
import { usePremium } from "@/hooks/usePremium";
import { filterFilesBySize } from "@/lib/fileSizeLimit";

interface SmartFileInputProps {
  onFilesAdded: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  /** Show camera button (only useful when accepting images). Default: auto-detect from accept. */
  showCamera?: boolean;
  /** Visual label for the accepted format chips, e.g. ["JPG", "PNG", "WEBP"] */
  formats?: string[];
  /** Title text shown in the dropzone */
  title?: string;
  /** Subtitle shown below title */
  subtitle?: string;
}

/**
 * Universal upload zone — drag/drop + browse + camera capture, glassmorphism UI,
 * smooth hover/drag animations. Use this on any tool page that accepts files.
 */
const SmartFileInput = ({
  onFilesAdded,
  accept = "*/*",
  multiple = false,
  disabled,
  showCamera,
  formats,
  title,
  subtitle,
}: SmartFileInputProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { isPremium } = usePremium();

  // Auto-detect: if accept includes "image" then camera makes sense.
  const cameraEnabled =
    showCamera ?? (accept.includes("image") || accept.includes("*"));

  const validate = (files: File[]) => {
    let filtered = files;
    if (accept && accept !== "*/*") {
      const acceptList = accept.split(",").map((s) => s.trim().toLowerCase());
      filtered = files.filter((f) => {
        const name = f.name.toLowerCase();
        const type = f.type.toLowerCase();
        return acceptList.some((a) =>
          a.startsWith(".") ? name.endsWith(a) : type.includes(a.replace("/*", ""))
        );
      });
    }
    return filterFilesBySize(filtered, isPremium);
  };

  const onDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const onDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items?.length) setIsDragging(true);
  }, []);
  const onDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;
      const files = validate(Array.from(e.dataTransfer.files));
      if (files.length) onFilesAdded(multiple ? files : [files[0]]);
    },
    [onFilesAdded, disabled, multiple]
  );
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const files = validate(Array.from(e.target.files || []));
    if (files.length) onFilesAdded(multiple ? files : [files[0]]);
    e.target.value = "";
  };

  return (
    <div
      onDragEnter={onDragIn}
      onDragLeave={onDragOut}
      onDragOver={onDrag}
      onDrop={onDrop}
      className={`
        relative overflow-hidden border-2 border-dashed rounded-2xl p-10 text-center
        transition-all duration-300 backdrop-blur-sm
        ${isDragging
          ? "border-primary bg-primary/10 scale-[1.015] shadow-[0_0_40px_-10px_hsl(var(--primary)/0.5)]"
          : "border-border/60 hover:border-primary/50 hover:bg-secondary/40 bg-card/30"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {/* Decorative glow */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
          isDragging ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 blur-2xl" />
      </div>

      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={onChange}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
      />

      <div className="relative flex flex-col items-center gap-4 pointer-events-none">
        <div
          className={`
            w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300
            ${isDragging
              ? "bg-gradient-to-br from-primary to-accent text-primary-foreground scale-110 rotate-3"
              : "bg-secondary text-muted-foreground"}
          `}
        >
          {isDragging ? (
            <Sparkles className="w-9 h-9 animate-pulse" />
          ) : (
            <FileUp className="w-9 h-9" />
          )}
        </div>

        <div>
          <p className="text-lg font-semibold text-foreground mb-1">
            {isDragging
              ? "Drop to upload"
              : title ?? "Drag & drop files here"}
          </p>
          <p className="text-sm text-muted-foreground">
            {subtitle ?? "or click anywhere to browse"}
          </p>
        </div>

        {formats && formats.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
            {formats.map((f) => (
              <span
                key={f}
                className="px-2 py-0.5 rounded-md bg-secondary/80 text-muted-foreground font-medium"
              >
                {f}
              </span>
            ))}
          </div>
        )}
      </div>

      {cameraEnabled && (
        <div className="relative z-20 mt-5 pt-5 border-t border-border/50 flex items-center justify-center gap-3">
          <span className="text-xs text-muted-foreground">or</span>
          <CameraCapture
            onCapture={(file) => onFilesAdded([file])}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
};

export default SmartFileInput;
