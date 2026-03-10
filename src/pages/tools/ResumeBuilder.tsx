import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { FileUser, Download, Plus, Trash2 } from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const ResumeBuilder = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");
  const [experiences, setExperiences] = useState([{ title: "", company: "", duration: "", details: "" }]);
  const [education, setEducation] = useState([{ degree: "", institution: "", year: "" }]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const addExp = () => setExperiences([...experiences, { title: "", company: "", duration: "", details: "" }]);
  const removeExp = (i: number) => setExperiences(experiences.filter((_, idx) => idx !== i));
  const addEdu = () => setEducation([...education, { degree: "", institution: "", year: "" }]);
  const removeEdu = (i: number) => setEducation(education.filter((_, idx) => idx !== i));

  const handleGenerate = async () => {
    if (!name) { toast({ title: "Error", description: "Please enter your name.", variant: "destructive" }); return; }
    setIsProcessing(true);
    try {
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
      const page = pdf.addPage([595, 842]);
      const m = 50;
      let y = 790;

      // Name header
      const nameW = bold.widthOfTextAtSize(name.toUpperCase(), 22);
      page.drawText(name.toUpperCase(), { x: (595 - nameW) / 2, y, size: 22, font: bold, color: rgb(0.15, 0.15, 0.5) });
      y -= 20;

      // Contact line
      const contactParts = [email, phone, location].filter(Boolean);
      const contactLine = contactParts.join(" | ");
      const contactW = font.widthOfTextAtSize(contactLine, 9);
      page.drawText(contactLine, { x: (595 - contactW) / 2, y, size: 9, font, color: rgb(0.4, 0.4, 0.4) });
      y -= 20;

      // Divider
      page.drawLine({ start: { x: m, y }, end: { x: 595 - m, y }, thickness: 1, color: rgb(0.7, 0.7, 0.7) });
      y -= 20;

      const drawSection = (title: string) => {
        page.drawText(title.toUpperCase(), { x: m, y, size: 11, font: bold, color: rgb(0.15, 0.15, 0.5) });
        y -= 5;
        page.drawLine({ start: { x: m, y }, end: { x: 595 - m, y }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
        y -= 12;
      };

      // Summary
      if (summary) {
        drawSection("Professional Summary");
        const words = summary.split(" ");
        let cur = "";
        for (const w of words) {
          const test = cur ? `${cur} ${w}` : w;
          if (font.widthOfTextAtSize(test, 10) > 595 - m * 2 && cur) {
            page.drawText(cur, { x: m, y, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
            y -= 14; cur = w;
          } else cur = test;
        }
        if (cur) { page.drawText(cur, { x: m, y, size: 10, font, color: rgb(0.2, 0.2, 0.2) }); y -= 14; }
        y -= 10;
      }

      // Experience
      const validExps = experiences.filter((e) => e.title || e.company);
      if (validExps.length) {
        drawSection("Experience");
        for (const exp of validExps) {
          page.drawText(exp.title, { x: m, y, size: 11, font: bold, color: rgb(0.1, 0.1, 0.1) });
          if (exp.duration) { const dw = font.widthOfTextAtSize(exp.duration, 9); page.drawText(exp.duration, { x: 595 - m - dw, y, size: 9, font, color: rgb(0.4, 0.4, 0.4) }); }
          y -= 14;
          if (exp.company) { page.drawText(exp.company, { x: m, y, size: 10, font, color: rgb(0.3, 0.3, 0.3) }); y -= 14; }
          if (exp.details) { page.drawText(`• ${exp.details}`, { x: m + 10, y, size: 9, font, color: rgb(0.25, 0.25, 0.25) }); y -= 14; }
          y -= 8;
        }
      }

      // Education
      const validEdus = education.filter((e) => e.degree || e.institution);
      if (validEdus.length) {
        drawSection("Education");
        for (const edu of validEdus) {
          page.drawText(edu.degree, { x: m, y, size: 11, font: bold, color: rgb(0.1, 0.1, 0.1) });
          if (edu.year) { const yw = font.widthOfTextAtSize(edu.year, 9); page.drawText(edu.year, { x: 595 - m - yw, y, size: 9, font, color: rgb(0.4, 0.4, 0.4) }); }
          y -= 14;
          if (edu.institution) { page.drawText(edu.institution, { x: m, y, size: 10, font, color: rgb(0.3, 0.3, 0.3) }); y -= 14; }
          y -= 8;
        }
      }

      // Skills
      if (skills) {
        drawSection("Skills");
        page.drawText(skills, { x: m, y, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
      }

      const out = await pdf.save();
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(URL.createObjectURL(blob));
      toast({ title: "Resume Generated!" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to generate resume.", variant: "destructive" });
    } finally { setIsProcessing(false); }
  };

  const handleReset = () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); setDownloadUrl(null); };

  return (
    <>
      <Helmet><title>Resume Builder - Create PDF Resume | PDF Tools</title><meta name="description" content="Build a professional resume in PDF format." /></Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"><FileUser className="w-8 h-8 text-white" /></div>
              <h1 className="text-4xl font-bold text-foreground mb-3">Resume Builder</h1>
              <p className="text-muted-foreground">Build a professional resume in PDF format.</p>
            </div>
            {!downloadUrl ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Full Name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Aman Vishwakarma" /></div>
                  <div className="space-y-2"><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" /></div>
                  <div className="space-y-2"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" /></div>
                  <div className="space-y-2"><Label>Location</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Mumbai, India" /></div>
                </div>
                <div className="space-y-2"><Label>Professional Summary</Label><Textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Brief summary of your career..." rows={3} /></div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Experience</h3>
                  {experiences.map((exp, i) => (
                    <div key={i} className="p-3 border border-border rounded-lg space-y-2">
                      <div className="flex gap-2"><Input placeholder="Job Title" value={exp.title} onChange={(e) => { const u = [...experiences]; u[i].title = e.target.value; setExperiences(u); }} className="flex-1" />{experiences.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeExp(i)}><Trash2 className="w-4 h-4" /></Button>}</div>
                      <div className="grid grid-cols-2 gap-2"><Input placeholder="Company" value={exp.company} onChange={(e) => { const u = [...experiences]; u[i].company = e.target.value; setExperiences(u); }} /><Input placeholder="Duration" value={exp.duration} onChange={(e) => { const u = [...experiences]; u[i].duration = e.target.value; setExperiences(u); }} /></div>
                      <Input placeholder="Key achievement" value={exp.details} onChange={(e) => { const u = [...experiences]; u[i].details = e.target.value; setExperiences(u); }} />
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addExp}><Plus className="w-4 h-4 mr-1" /> Add Experience</Button>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Education</h3>
                  {education.map((edu, i) => (
                    <div key={i} className="flex gap-2 items-end">
                      <Input placeholder="Degree" value={edu.degree} onChange={(e) => { const u = [...education]; u[i].degree = e.target.value; setEducation(u); }} className="flex-1" />
                      <Input placeholder="Institution" value={edu.institution} onChange={(e) => { const u = [...education]; u[i].institution = e.target.value; setEducation(u); }} className="flex-1" />
                      <Input placeholder="Year" value={edu.year} onChange={(e) => { const u = [...education]; u[i].year = e.target.value; setEducation(u); }} className="w-24" />
                      {education.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeEdu(i)}><Trash2 className="w-4 h-4" /></Button>}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addEdu}><Plus className="w-4 h-4 mr-1" /> Add Education</Button>
                </div>

                <div className="space-y-2"><Label>Skills</Label><Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="JavaScript, React, Python, Node.js..." /></div>
                <Button onClick={handleGenerate} disabled={isProcessing} className="w-full" size="lg">{isProcessing ? "Generating..." : "Generate Resume"}</Button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Resume Ready!</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={downloadUrl} download="resume.pdf" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90"><Download className="w-5 h-5" /> Download Resume</a>
                  <Button variant="secondary" onClick={handleReset}>Edit & Rebuild</Button>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ResumeBuilder;
