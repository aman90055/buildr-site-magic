import { useCallback, useState } from "react";
import { FileUp } from "lucide-react";

interface PDFDropzoneProps {
  onFilesAdded: (files: File[]) => void;
  disabled?: boolean;
}

const PDFDropzone = ({ onFilesAdded, disabled }: PDFDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files).filter(
        (file) => file.type === "application/pdf"
      );
      if (files.length > 0) {
        onFilesAdded(files);
      }
    },
    [onFilesAdded, disabled]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const files = Array.from(e.target.files || []).filter(
      (file) => file.type === "application/pdf"
    );
    if (files.length > 0) {
      onFilesAdded(files);
    }
    e.target.value = "";
  };

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
        ${isDragging 
          ? "border-accent bg-accent/5 scale-[1.02]" 
          : "border-border hover:border-accent/50 hover:bg-secondary/50"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <input
        type="file"
        accept=".pdf,application/pdf"
        multiple
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />

      <div className="flex flex-col items-center gap-4">
        <div className={`
          w-16 h-16 rounded-full flex items-center justify-center transition-colors
          ${isDragging ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}
        `}>
          <FileUp className="w-8 h-8" />
        </div>

        <div>
          <p className="text-lg font-medium text-foreground mb-1">
            {isDragging ? "Drop your PDFs here" : "Drag & drop PDF files here"}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to browse from your computer
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 bg-secondary rounded">PDF</span>
          <span>Max 50MB per file</span>
        </div>
      </div>
    </div>
  );
};

export default PDFDropzone;
