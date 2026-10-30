const faqs = [
  { q: "Can I change the order of the files?", a: "Yes. After adding files, drag them in the list or use the arrows. The merged PDF follows the order shown. You change the order of whole files, not single pages; to move pages inside a PDF, use Organize PDF after merging." },
  { q: "Are my files uploaded to a server?", a: "No. Merging runs in your browser using your device's memory. Files are not sent to our servers, and closing the tab clears them." },
  { q: "Do I need an account?", a: "No. Merge PDF works without signing in." },
  { q: "Is there a file size or file count limit?", a: "We do not set one. Very large or many files can be slow or fail on phones or older computers because they run out of memory. If that happens, merge in smaller groups." },
  { q: "Will password-protected PDFs work?", a: "Not directly. Remove the password first with Unlock PDF (you need the password), then merge." },
  { q: "Does merging lower the quality?", a: "No. Pages are copied as they are, so text stays selectable and images keep their quality. The merged file is roughly the size of the originals added together; use Compress PDF if it is too big to email." },
];

const MergeGuide = () => (
  <section className="border-t border-border" aria-labelledby="merge-guide">
    <div className="container mx-auto max-w-3xl px-6 py-10 space-y-8">
      <div>
        <h2 id="merge-guide" className="text-2xl font-bold mb-3">How to merge PDF files</h2>
        <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
          <li>Add two or more PDFs by dropping them on the box or choosing them from your device.</li>
          <li>Put the files in the order you want the pages to appear.</li>
          <li>Press Merge, then download the single combined PDF.</li>
        </ol>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Common uses</h3>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>Students: join a cover page, assignment and references into one file to submit.</li>
          <li>Job seekers: send a cover letter, CV and certificates as a single attachment.</li>
          <li>Office work: combine scanned invoices or receipts for a monthly expense claim.</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">How it differs from other merge tools</h3>
        <p className="text-muted-foreground">
          Many popular tools, such as iLovePDF, upload your files to their servers to process them.
          Docunova merges in your browser instead, so files stay on your device. The trade-off: speed
          depends on your device, and very large jobs can run out of memory on phones.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Frequently asked questions</h3>
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q}>
              <p className="font-medium">{f.q}</p>
              <p className="text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default MergeGuide;
