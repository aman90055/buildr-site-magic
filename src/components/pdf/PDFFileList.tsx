import { FileText, GripVertical, X } from "lucide-react";
import type { PDFFile } from "@/pages/PDFMerge";

interface PDFFileListProps {
  files: PDFFile[];
  onRemove: (id: string) => void;
  onReorder: (files: PDFFile[]) => void;
  disabled?: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const PDFFileList = ({ files, onRemove, onReorder, disabled }: PDFFileListProps) => {
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    
    if (dragIndex === dropIndex) return;

    const newFiles = [...files];
    const [draggedFile] = newFiles.splice(dragIndex, 1);
    newFiles.splice(dropIndex, 0, draggedFile);
    onReorder(newFiles);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-secondary/50 border-b border-border">
        <h3 className="font-medium text-foreground">
          {files.length} {files.length === 1 ? "file" : "files"} selected
        </h3>
        <p className="text-sm text-muted-foreground">
          Drag to reorder • Files will be merged in this order
        </p>
      </div>

      <ul className="divide-y divide-border">
        {files.map((file, index) => (
          <li
            key={file.id}
            draggable={!disabled}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`
              flex items-center gap-3 px-4 py-3 bg-card transition-colors
              ${!disabled ? "hover:bg-secondary/30 cursor-grab active:cursor-grabbing" : ""}
            `}
          >
            <div className="text-muted-foreground">
              <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex-shrink-0 w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-destructive" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{file.name}</p>
              <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>

            <span className="flex-shrink-0 w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-xs font-medium text-muted-foreground">
              {index + 1}
            </span>

            <button
              onClick={() => onRemove(file.id)}
              disabled={disabled}
              className="flex-shrink-0 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
              aria-label={`Remove ${file.name}`}
            >
              <X className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PDFFileList;
