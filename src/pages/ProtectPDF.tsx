import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Lock, Upload, Download, RotateCcw, Eye, EyeOff, Shield } from "lucide-react";
import { usePDFProtect } from "@/hooks/usePDFProtect";

const ProtectPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { protectFile, isProcessing, progress, downloadUrl, reset } = usePDFProtect();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    }
  };

  const handleProtect = async () => {
    if (!file) return;
    if (password !== confirmPassword) {
      return;
    }
    await protectFile(file, password);
  };

  const handleReset = () => {
    setFile(null);
    setPassword("");
    setConfirmPassword("");
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const passwordsMatch = password === confirmPassword && password.length >= 4;

  return (
    <>
      <Helmet>
        <title>Protect PDF - Password Lock Your Documents | Free Online Tool</title>
        <meta
          name="description"
          content="Add password protection to your PDF files. Secure your documents with encryption. Free PDF protection tool."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 mb-4">
                <Lock className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Protect PDF
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Add password protection to secure your PDF documents.
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              {!downloadUrl ? (
                <div className="space-y-6 animate-fade-in-up">
                  {/* File Upload */}
                  <div
                    className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-destructive/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    {file ? (
                      <div className="space-y-2">
                        <Shield className="w-12 h-12 mx-auto text-destructive" />
                        <p className="font-medium text-foreground">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                        <p className="text-lg font-medium text-foreground">
                          Drop a PDF here or click to upload
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Password Fields */}
                  {file && (
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Set Password
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password (min 4 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        
                        {password && confirmPassword && password !== confirmPassword && (
                          <p className="text-sm text-destructive">Passwords do not match</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {file && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={handleProtect}
                        disabled={isProcessing || !passwordsMatch}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        size="lg"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        {isProcessing ? "Protecting..." : "Protect PDF"}
                      </Button>
                      <Button variant="outline" onClick={handleReset} disabled={isProcessing}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                  )}

                  {/* Progress */}
                  {isProcessing && (
                    <div className="space-y-2">
                      <Progress value={progress} className="h-2" />
                      <p className="text-sm text-center text-muted-foreground">
                        Processing... {progress}%
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                    <Shield className="w-10 h-10 text-accent" />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">
                      PDF Protected!
                    </h2>
                    <p className="text-muted-foreground">
                      Your document has been processed and is ready to download.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={downloadUrl}
                      download={`protected_${file?.name}`}
                      className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download Protected PDF
                    </a>
                    <Button onClick={handleReset} variant="outline">
                      Protect Another File
                    </Button>
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

export default ProtectPDF;