import { useCallback, useState } from "react";
import { FileUp } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { toast } from "@/hooks/use-toast";

interface PDFSplitDropzoneProps {
  onFileAdded: (file: File, pageCount: number) => void;
  disabled?: boolean;
}

const PDFSplitDropzone = ({ onFileAdded, disabled }: PDFSplitDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const processFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pageCount = pdf.getPageCount();
      onFileAdded(file, pageCount);
    } catch (error) {
      console.error("Error loading PDF:", error);
      toast({
        title: "Error",
        description: "Failed to load PDF file. Please try another file.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled || isLoading) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0 && files[0].type === "application/pdf") {
        await processFile(files[0]);
      }
    },
    [disabled, isLoading]
  );

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || isLoading) return;
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await processFile(files[0]);
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
        ${disabled || isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <input
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileInput}
        disabled={disabled || isLoading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />

      <div className="flex flex-col items-center gap-4">
        <div className={`
          w-16 h-16 rounded-full flex items-center justify-center transition-colors
          ${isDragging ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}
        `}>
          {isLoading ? (
            <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <FileUp className="w-8 h-8" />
          )}
        </div>

        <div>
          <p className="text-lg font-medium text-foreground mb-1">
            {isLoading ? "Loading PDF..." : isDragging ? "Drop your PDF here" : "Drag & drop a PDF file here"}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to browse from your computer
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 bg-secondary rounded">PDF</span>
          <span>Max 50MB</span>
        </div>
      </div>
    </div>
  );
};

export default PDFSplitDropzone;
