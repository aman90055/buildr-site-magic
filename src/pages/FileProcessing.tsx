import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialMeta from "@/components/SocialMeta";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Laptop, Cloud, Database, Trash2, Mail } from "lucide-react";

/**
 * Privacy & File Processing — accurate description of where each kind of
 * processing happens. Keep this page in sync with the actual implementation.
 */
const FileProcessing = () => {
  return (
    <div className="min-h-screen">
      <SocialMeta
        title="Privacy & File Processing — Docunova"
        description="Exactly where your files are processed: which Docunova tools run entirely in your browser, which ones send data to an AI provider, and what we store."
        path="/file-processing"
      />
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mt-4">
          Privacy &amp; file processing
        </h1>
        <p className="text-muted-foreground mt-3">
          Different tools work in different ways, so a single blanket promise would be misleading.
          This page explains exactly what happens to your data for each type of tool.
        </p>

        <Card className="p-6 mt-8">
          <div className="flex items-center gap-3 mb-3">
            <Laptop className="w-5 h-5 text-brand-green" />
            <h2 className="text-xl font-display font-semibold">Tools that run in your browser</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Browser-based PDF and image operations — merge, split, compress, rotate, crop, organise, watermark, page
            numbers, protect/unlock, sign, flatten, redact, image conversion and resizing, plus the
            document builders (resume, invoice, certificate, letter) — are performed locally using
            JavaScript running on your device. The file is read into memory in the browser tab and
            the result is written back to a download. <strong>When signed in, Merge, Split and
            Compress also upload the finished PDF to your private account storage and save a job
            record.</strong> Signed-out use of these tools does not save results to an account.
            Closing the tab or signing out does not delete account files or projects saved on your device.
            No universal automatic file-deletion deadline has been verified.
          </p>
        </Card>

        <Card className="p-6 mt-6">
          <div className="flex items-center gap-3 mb-3">
            <Cloud className="w-5 h-5 text-brand-ai" />
            <h2 className="text-xl font-display font-semibold">Tools that send data to an AI provider</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            The following features cannot run locally and send your input to our AI provider over an
            encrypted connection so it can be processed:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside mt-3 space-y-1">
            <li>OCR / <Link className="text-primary hover:underline" to="/image-to-text">Image to Text</Link> — the image or page you submit is sent</li>
            <li>AI chat, document analysis and summarisation — the text extracted from your document is sent</li>
            <li>AI translation, rewriting, grammar check and data extraction — the text you paste is sent</li>
            <li>Speech-to-text — the audio you record is sent</li>
            <li>AI image generation — your prompt is sent</li>
            <li>Smart compression suggestions — only file statistics are sent, not the file</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-3">
            Provider handling may differ by feature and model; we do not make a blanket promise
            that every AI request has zero retention. Support chat stores conversations and may
            use your account's payment and plan information to answer questions. Please don't paste confidential material into AI tools if
            your organisation forbids third-party processing.
          </p>
        </Card>

        <Card className="p-6 mt-6">
          <div className="flex items-center gap-3 mb-3">
            <Database className="w-5 h-5 text-brand-blue" />
            <h2 className="text-xl font-display font-semibold">What we do store</h2>
          </div>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>Your account email and sign-in metadata, if you create an account</li>
            <li>Job records and finished PDFs saved by signed-in Merge, Split and Compress workflows</li>
            <li>Support chat conversations, including requests for a person to review them</li>
            <li>Contact-form messages and newsletter subscriptions you submit</li>
            <li>Payment verification details you submit for a premium plan</li>
            <li>Anonymous analytics and, with your consent, advertising cookies</li>
          </ul>
        </Card>

        <Card className="p-6 mt-6">
          <div className="flex items-center gap-3 mb-3">
            <Trash2 className="w-5 h-5 text-brand-orange" />
            <h2 className="text-xl font-display font-semibold">Deleting your data</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Email{" "}
            <a className="text-primary hover:underline" href="mailto:documentai999@gmail.com">
              documentai999@gmail.com
            </a>{" "}
            from your account address to request deletion of your account, job records,
            contact messages, support conversations, saved PDF results or newsletter subscription.
            Tell us which records you want removed; this page does not promise an automatic deletion deadline.
            Downloads and projects stored on your device
            must be deleted on your device.
          </p>
        </Card>

        <Card className="p-6 mt-6">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="w-5 h-5 text-brand-purple" />
            <h2 className="text-xl font-display font-semibold">Report a problem</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Found a bug, a broken tool or a security issue? Use the{" "}
            <Link className="text-primary hover:underline" to="/contact">
              contact form
            </Link>{" "}
            or email us directly. Security reports get priority; please don't publish details before
            we've replied.
          </p>
        </Card>

        <p className="text-xs text-muted-foreground mt-8">
          See also the <Link className="text-primary hover:underline" to="/privacy">Privacy Policy</Link>,{" "}
          <Link className="text-primary hover:underline" to="/cookies">Cookie Policy</Link> and{" "}
          <Link className="text-primary hover:underline" to="/ai-usage-policy">AI Usage Policy</Link>.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default FileProcessing;
