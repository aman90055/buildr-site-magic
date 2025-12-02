import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PDFSplitDropzone from "@/components/pdf/PDFSplitDropzone";
import PageSelector from "@/components/pdf/PageSelector";
import SplitActions from "@/components/pdf/SplitActions";
import { usePDFSplit } from "@/hooks/usePDFSplit";

const PDFSplit = () => {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  
  const { splitFile, isProcessing, progress, downloadUrl, reset } = usePDFSplit();

  const handleFileAdded = (newFile: File, pageCount: number) => {
    setFile(newFile);
    setTotalPages(pageCount);
    setSelectedPages([]);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setTotalPages(0);
    setSelectedPages([]);
    reset();
  };

  const handleSplit = async () => {
    if (!file || selectedPages.length === 0) return;
    await splitFile(file, selectedPages);
  };

  const handleReset = () => {
    setFile(null);
    setTotalPages(0);
    setSelectedPages([]);
    reset();
  };

  return (
    <>
      <Helmet>
        <title>Split PDF Files Online - Free PDF Page Extractor</title>
        <meta
          name="description"
          content="Extract specific pages from PDF documents. Split PDFs into separate files. Fast, free, and secure."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            {/* Hero Section */}
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Split PDF Files
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Extract specific pages from your PDF. Select the pages you want and download them as a new file.
              </p>
            </div>

            {/* Main Tool Area */}
            <div className="max-w-3xl mx-auto">
              {!downloadUrl ? (
                <div className="space-y-6 animate-fade-in-up">
                  {!file ? (
                    <PDFSplitDropzone onFileAdded={handleFileAdded} disabled={isProcessing} />
                  ) : (
                    <>
                      <div className="bg-card border border-border rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{file.name}</p>
                              <p className="text-sm text-muted-foreground">{totalPages} pages</p>
                            </div>
                          </div>
                          <button
                            onClick={handleRemoveFile}
                            disabled={isProcessing}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <PageSelector
                        totalPages={totalPages}
                        selectedPages={selectedPages}
                        onSelectionChange={setSelectedPages}
                        disabled={isProcessing}
                      />

                      <SplitActions
                        selectedCount={selectedPages.length}
                        totalPages={totalPages}
                        isProcessing={isProcessing}
                        progress={progress}
                        onSplit={handleSplit}
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
                      PDF Split Successfully!
                    </h2>
                    <p className="text-muted-foreground">
                      Extracted {selectedPages.length} pages from your PDF.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={downloadUrl}
                      download="split.pdf"
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
                      Download Split PDF
                    </a>
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                    >
                      Split Another PDF
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

export default PDFSplit;
