import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PDFDropzone from "@/components/pdf/PDFDropzone";
import PDFFileList from "@/components/pdf/PDFFileList";
import MergeActions from "@/components/pdf/MergeActions";
import { usePDFMerge } from "@/hooks/usePDFMerge";

export interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
  preview?: string;
}

const PDFMerge = () => {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const { mergeFiles, isProcessing, progress, downloadUrl, reset } = usePDFMerge();

  const handleFilesAdded = (newFiles: File[]) => {
    const pdfFiles: PDFFile[] = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size,
    }));
    setFiles((prev) => [...prev, ...pdfFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleReorder = (newFiles: PDFFile[]) => {
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    await mergeFiles(files.map((f) => f.file));
  };

  const handleReset = () => {
    setFiles([]);
    reset();
  };

  return (
    <>
      <Helmet>
        <title>Merge PDF Files Online - Free PDF Merger Tool</title>
        <meta
          name="description"
          content="Combine multiple PDF files into one document. Fast, free, and secure PDF merger tool. No registration required."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            {/* Hero Section */}
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Merge PDF Files
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Combine multiple PDF documents into a single file. Drag and drop to reorder pages.
              </p>
            </div>

            {/* Main Tool Area */}
            <div className="max-w-3xl mx-auto">
              {!downloadUrl ? (
                <div className="space-y-6 animate-fade-in-up">
                  <PDFDropzone onFilesAdded={handleFilesAdded} disabled={isProcessing} />
                  
                  {files.length > 0 && (
                    <>
                      <PDFFileList
                        files={files}
                        onRemove={handleRemoveFile}
                        onReorder={handleReorder}
                        disabled={isProcessing}
                      />
                      
                      <MergeActions
                        filesCount={files.length}
                        isProcessing={isProcessing}
                        progress={progress}
                        onMerge={handleMerge}
                        onReset={handleReset}
                      />
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">
                      PDF Merged Successfully!
                    </h2>
                    <p className="text-muted-foreground">
                      Your {files.length} PDF files have been combined into one document.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={downloadUrl}
                      download="merged.pdf"
                      className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download Merged PDF
                    </a>
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                    >
                      Merge More Files
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PDFMerge;
