import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  FileText, FileType2, Brain, Image as ImageIcon, FileSignature,
  Wrench, Trophy, BookOpen, Mail, Globe, ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: FileText,
    title: "PDF Tools",
    desc: "Merge, Split, Compress, OCR, Protect, Unlock, Watermark, Rotate, Organize Pages, Sign PDFs, Extract Pages, Add Page Numbers, and more.",
    href: "/category/organize",
    color: "from-brand-blue to-brand-cyan",
  },
  {
    icon: FileType2,
    title: "File Converters",
    desc: "PDF ↔ Word, Excel, PowerPoint, JPG, PNG, TXT, HTML and many other formats.",
    href: "/category/convert",
    color: "from-brand-green to-brand-cyan",
  },
  {
    icon: Brain,
    title: "AI Tools",
    desc: "AI PDF Chat, Document Summarizer, Translator, Resume Analyzer, Contract Review, Proposal Generator, Content Writer.",
    href: "/category/ai",
    color: "from-brand-purple to-brand-pink",
  },
  {
    icon: ImageIcon,
    title: "Image Tools",
    desc: "Resize, Compress, Crop, Background Removal, Image Upscaling, Format Conversion, and Optimization.",
    href: "/category/image",
    color: "from-brand-orange to-brand-pink",
  },
  {
    icon: FileSignature,
    title: "Document Tools",
    desc: "Invoice Generator, NDA Generator, Offer Letter, Certificates, Templates, Agreements, and Business Documents.",
    href: "/category/documents",
    color: "from-brand-blue to-brand-purple",
  },
  {
    icon: Wrench,
    title: "Developer & Utility",
    desc: "JSON Formatter, Base64 Encoder, QR Generator, URL Encoder, Calculators, Unit Converters, EMI Calculator, and more.",
    href: "/category/edit",
    color: "from-brand-cyan to-brand-green",
  },
];

const whyUs = [
  "100+ Professional Tools",
  "No Daily Limits on Core Features",
  "AI PDF Chat & Smart Summaries",
  "Google Login, Email OTP & Phone OTP",
  "Cloud Storage & Document History",
  "Team Workspaces & Shared Access",
  "Multi-Language Support",
  "Fast, Secure & Scalable Infrastructure",
];

// Testimonials moved to TestimonialsCarousel component

const awards = [
  "Trusted by thousands of users worldwide",
  "Growing AI Productivity Platform",
  "Secure Cloud-Based Document Solution",
  "Modern SaaS Experience with 100+ Tools",
];

const blogPosts = [
  { title: "How to Merge PDFs Online", href: "/merge" },
  { title: "Best AI Tools for Document Analysis", href: "/category/ai" },
  { title: "Resume Optimization Tips", href: "/tools/airewriter" },
  { title: "PDF Security Best Practices", href: "/protect" },
  { title: "Productivity Guides for Teams", href: "/blog" },
  { title: "Cloud Storage & Collaboration Tutorials", href: "/blog" },
];

const HomeSections = () => {
  return (
    <>
      {/* About / Why Choose Us */}
      <section className="py-16 sm:py-20 bg-gradient-hero" aria-label="About Document Edit Pro AI">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-5 bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent">
                About Document Edit Pro AI
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                Document Edit Pro AI is an all-in-one productivity platform designed
                to simplify document management. Whether you need PDF editing,
                AI-powered document analysis, image optimization, file conversion,
                cloud storage, or team collaboration, everything is available in one
                place with a clean and intuitive experience.
              </p>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-display font-bold mb-5">Why Choose Us?</h3>
              <ul className="grid sm:grid-cols-2 gap-3">
                {whyUs.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm sm:text-base">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 sm:py-20" aria-label="Our services">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-3">
              Services
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Everything you need to work with documents, images, and data — in one workspace.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {services.map((s) => (
              <Link key={s.title} to={s.href} className="group">
                <Card className="h-full glass-card hover:shadow-card-hover transition-all duration-500 border-border/40">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <s.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                    <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials handled by TestimonialsCarousel in Index */}

      {/* Awards & Recognition */}
      <section className="py-16 sm:py-20" aria-label="Awards and recognition">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-3">
              Awards & Recognition
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {awards.map((a) => (
              <Card key={a} className="glass-card border-border/40 text-center">
                <CardContent className="p-6">
                  <Trophy className="w-8 h-8 text-brand-orange mx-auto mb-3" />
                  <p className="text-sm font-medium text-foreground/90">{a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-16 sm:py-20 bg-muted/30" aria-label="Latest resources">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-2">
                Latest Resources
              </h2>
              <p className="text-muted-foreground">Tips, tutorials, and guides from our blog.</p>
            </div>
            <Link to="/blog" className="text-primary hover:underline text-sm font-medium inline-flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {blogPosts.map((p) => (
              <Link key={p.title} to={p.href} className="group">
                <Card className="h-full glass-card border-border/40 hover:shadow-card-hover transition-all">
                  <CardContent className="p-6">
                    <BookOpen className="w-6 h-6 text-primary mb-3" />
                    <h3 className="font-display font-semibold group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 sm:py-20" aria-label="Get in touch">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">
            Get in Touch
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mb-8">
            Need help, business inquiries, partnerships, or enterprise solutions?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <a
              href="mailto:documentai999@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl glass-card hover:shadow-card-hover transition-all"
            >
              <Mail className="w-5 h-5 text-primary" />
              <span className="font-medium">documentai999@gmail.com</span>
            </a>
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl glass-card">
              <Globe className="w-5 h-5 text-brand-cyan" />
              <span className="font-medium">Available Worldwide</span>
            </div>
          </div>
          <div className="grid sm:grid-cols-5 gap-3 text-sm">
            {["Help Center", "Knowledge Base", "Ticket Support", "Feature Requests", "Enterprise Consultation"].map((s) => (
              <div key={s} className="px-4 py-2 rounded-full glass-card text-foreground/80">
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeSections;
