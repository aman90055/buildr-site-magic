import { useState, useCallback, useRef } from "react";
import { FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

interface PDFConvertDropzoneProps {
  onFileAdded: (file: File) => void;
  disabled?: boolean;
}

const PDFConvertDropzone = ({ onFileAdded, disabled }: PDFConvertDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "File exceeds the 50MB limit. Please choose a smaller file.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find((file) => file.type === "application/pdf");

    if (pdfFile && validateFile(pdfFile)) {
      onFileAdded(pdfFile);
    }
  }, [disabled, onFileAdded]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0] && files[0].type === "application/pdf" && validateFile(files[0])) {
      onFileAdded(files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onFileAdded]);

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
        transition-all duration-300 ease-in-out
        ${isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      <div className="flex flex-col items-center gap-4">
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center
          transition-colors duration-300
          ${isDragging ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}
        `}>
          <FileText className="w-8 h-8" />
        </div>

        <div>
          <p className="text-lg font-medium text-foreground mb-1">
            {isDragging ? "Drop your PDF here" : "Drag & drop a PDF file"}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to browse • Max 50MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDFConvertDropzone;