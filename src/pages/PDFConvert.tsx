import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PDFConvertDropzone from "@/components/pdf/PDFConvertDropzone";
import ConversionOptions from "@/components/pdf/ConversionOptions";
import ConvertActions from "@/components/pdf/ConvertActions";
import ConversionResult from "@/components/pdf/ConversionResult";
import { usePDFConvert } from "@/hooks/usePDFConvert";

export type ConversionType = "images" | "text";

const PDFConvert = () => {
  const [file, setFile] = useState<File | null>(null);
  const [conversionType, setConversionType] = useState<ConversionType>("images");
  
  const { 
    convertFile, 
    isProcessing, 
    progress, 
    imageUrls, 
    extractedText, 
    reset 
  } = usePDFConvert();

  const handleFileAdded = (newFile: File) => {
    setFile(newFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    reset();
  };

  const handleConvert = async () => {
    if (!file) return;
    await convertFile(file, conversionType);
  };

  const handleReset = () => {
    setFile(null);
    reset();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const hasResults = imageUrls.length > 0 || extractedText;

  return (
    <>
      <Helmet>
        <title>Convert PDF Files Online - PDF to Images & Text</title>
        <meta
          name="description"
          content="Convert PDF files to images or extract text. Transform PDFs to PNG images or plain text. Fast, free, and secure."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            {/* Hero Section */}
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Convert PDF Files
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Transform your PDFs into images or extract text content. Choose your preferred output format.
              </p>
            </div>

            {/* Main Tool Area */}
            <div className="max-w-3xl mx-auto">
              {!hasResults ? (
                <div className="space-y-6 animate-fade-in-up">
                  {!file ? (
                    <PDFConvertDropzone onFileAdded={handleFileAdded} disabled={isProcessing} />
                  ) : (
                    <>
                      <div className="bg-card border border-border rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{file.name}</p>
                              <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
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

                      <ConversionOptions
                        conversionType={conversionType}
                        onTypeChange={setConversionType}
                        disabled={isProcessing}
                      />

                      <ConvertActions
                        isProcessing={isProcessing}
                        progress={progress}
                        conversionType={conversionType}
                        onConvert={handleConvert}
                        onReset={handleReset}
                      />
                    </>
                  )}
                </div>
              ) : (
                <ConversionResult
                  conversionType={conversionType}
                  imageUrls={imageUrls}
                  extractedText={extractedText}
                  onReset={handleReset}
                />
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PDFConvert;