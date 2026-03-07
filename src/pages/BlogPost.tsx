import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, Twitter, Linkedin, Facebook, FileText, Sparkles, Shield, Zap } from "lucide-react";

const blogPostsData: Record<string, {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  authorRole: string;
  image?: string;
  content: string[];
  relatedPosts: string[];
}> = {
  "ai-powered-compression": {
    title: "Introducing AI-Powered PDF Compression: Reduce File Size by 90%",
    excerpt: "Learn how our new AI compression algorithm analyzes your PDFs and applies intelligent optimization to dramatically reduce file sizes while maintaining quality.",
    date: "January 20, 2026",
    readTime: "5 min read",
    category: "Product Update",
    author: "Aman Vishwakarma",
    authorRole: "Creator & Lead Developer",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=80",
    content: [
      "We're excited to announce a groundbreaking feature that will revolutionize how you handle PDF files: AI-Powered Compression. This innovative technology can reduce your PDF file sizes by up to 90% while maintaining exceptional visual quality.",
      "## How It Works",
      "Our AI compression engine uses advanced machine learning algorithms to analyze each element of your PDF document. Unlike traditional compression methods that apply uniform settings across the entire file, our AI examines images, text, vectors, and embedded fonts individually to determine the optimal compression strategy for each component.",
      "The system identifies redundant data, optimizes image resolution based on actual viewing requirements, and intelligently reduces color depth where it won't affect visual quality. This targeted approach ensures maximum compression without compromising the document's integrity.",
      "## Key Features",
      "**Smart Image Analysis**: The AI detects image types (photographs, diagrams, screenshots) and applies the most suitable compression algorithm for each.",
      "**Text Preservation**: Text elements remain crisp and readable, with fonts optimized for web viewing while maintaining print quality.",
      "**Metadata Optimization**: Unnecessary metadata is stripped while preserving essential document information.",
      "**Batch Processing**: Compress multiple files simultaneously with consistent quality settings.",
      "## Real-World Results",
      "In our testing across thousands of documents, we've seen impressive results:",
      "- **Business Reports**: Average 75% size reduction",
      "- **Image-Heavy PDFs**: Up to 90% reduction",
      "- **Scanned Documents**: 60-80% reduction with improved clarity",
      "- **Presentations**: 70% average reduction",
      "## Getting Started",
      "Using AI compression is simple. Just upload your PDF to our compression tool, select the AI-Powered option, and let our system work its magic. You'll receive a preview of the compressed file with a quality comparison before downloading.",
      "Try it now and experience the future of PDF compression. Your storage space and email recipients will thank you!"
    ],
    relatedPosts: ["merge-pdfs-guide", "ocr-technology", "pdf-security-best-practices"]
  },
  "merge-pdfs-guide": {
    title: "How to Merge Multiple PDFs in Seconds",
    excerpt: "A step-by-step guide to combining multiple PDF documents into one file using our merge tool.",
    date: "January 18, 2026",
    readTime: "3 min read",
    category: "Tutorial",
    author: "Aman Vishwakarma",
    authorRole: "Creator & Lead Developer",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&auto=format&fit=crop&q=80",
    content: [
      "## Why Merge PDFs?",
      "There are countless scenarios where combining PDFs makes life easier:",
      "- Consolidating multiple reports into one comprehensive document",
      "- Combining scanned pages into a single file",
      "- Creating portfolios from separate project files",
      "- Assembling contract documents with attachments",
      "## Step-by-Step Guide",
      "**Step 1: Upload Your Files**",
      "Drag and drop your PDF files onto our merge tool, or click to browse and select them from your device. You can upload as many files as you need.",
      "**Step 2: Arrange the Order**",
      "Once uploaded, you'll see thumbnails of all your PDFs. Simply drag and drop them to arrange the order you want them to appear in the final document.",
      "**Step 3: Preview (Optional)**",
      "Click on any thumbnail to preview the document and ensure you've selected the right files.",
      "**Step 4: Merge**",
      "Hit the Merge button and watch as our system combines all your PDFs into one seamless document. The process typically takes just a few seconds.",
      "**Step 5: Download**",
      "Your merged PDF is ready! Download it directly to your device or save it to your cloud storage.",
      "## Pro Tips",
      "- Use consistent page sizes for the best results",
      "- Check page orientation before merging",
      "- Remove blank pages from individual PDFs first",
      "- Use our organize tool to reorder pages after merging if needed",
      "Start merging your PDFs today and streamline your document workflow!"
    ],
    relatedPosts: ["ai-powered-compression", "organize-pdf-tips", "batch-processing"]
  },
  "ocr-technology": {
    title: "OCR Technology: Extracting Text from Scanned Documents",
    excerpt: "Discover how AI-powered OCR can convert your scanned documents into editable, searchable text.",
    date: "January 15, 2026",
    readTime: "4 min read",
    category: "Feature Guide",
    author: "Aman Vishwakarma",
    authorRole: "Creator & Lead Developer",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&auto=format&fit=crop&q=80",
    content: [
      "## What is OCR?",
      "OCR is a technology that recognizes text within digital images. When you scan a paper document, it becomes an image file – the text isn't actually 'text' that you can select, copy, or edit. OCR analyzes these images and converts the visual representation of characters into actual text data.",
      "## Our AI-Powered Approach",
      "Traditional OCR systems use pattern matching to recognize characters. Our AI-powered OCR goes further by:",
      "**Understanding Context**: The AI considers surrounding words to improve accuracy, especially for unclear characters.",
      "**Learning from Errors**: Our model continuously improves based on corrections and feedback.",
      "**Handling Complex Layouts**: Tables, columns, headers, and footers are accurately identified and preserved.",
      "**Multi-Language Support**: Recognize text in over 100 languages, including mixed-language documents.",
      "## Best Practices for OCR",
      "To get the best results from our OCR tool:",
      "- Use high-resolution scans (300 DPI or higher)",
      "- Ensure good contrast between text and background",
      "- Keep documents flat and well-lit when scanning",
      "- Avoid shadows and reflections",
      "## Use Cases",
      "Our OCR technology is perfect for:",
      "- Digitizing paper archives",
      "- Making scanned contracts searchable",
      "- Extracting data from receipts and invoices",
      "- Converting book pages to editable text",
      "- Accessibility improvements for visually impaired users",
      "Experience the power of AI-driven OCR and unlock the text trapped in your scanned documents!"
    ],
    relatedPosts: ["ai-powered-compression", "scan-to-pdf", "document-accessibility"]
  },
  "pdf-security-best-practices": {
    title: "Best Practices for PDF Security",
    excerpt: "Learn how to protect sensitive documents with passwords, watermarks, and redaction tools.",
    date: "January 12, 2026",
    readTime: "6 min read",
    category: "Security",
    author: "Aman Vishwakarma",
    authorRole: "Creator & Lead Developer",
    content: [
      "In an era of digital document sharing, securing your PDFs is more important than ever. This comprehensive guide covers everything you need to know about protecting sensitive information in PDF files.",
      "## Understanding PDF Security Layers",
      "PDF security isn't just about passwords. There are multiple layers of protection you can apply:",
      "**Document Open Password**: Prevents unauthorized users from viewing the document.",
      "**Permissions Password**: Controls what users can do with the document (print, copy, edit).",
      "**Digital Signatures**: Verify document authenticity and detect modifications.",
      "**Encryption**: Protects document contents from being read by interceptors.",
      "## Password Protection Best Practices",
      "When setting passwords for your PDFs:",
      "- Use strong, unique passwords (12+ characters with mixed types)",
      "- Never share passwords in the same channel as the document",
      "- Use different passwords for opening and permissions",
      "- Consider password managers for team environments",
      "## Watermarking for Protection",
      "Watermarks serve as a visual deterrent and identification tool:",
      "- Add confidentiality notices to sensitive documents",
      "- Include recipient information to track document distribution",
      "- Use semi-transparent watermarks that don't obstruct content",
      "- Consider dynamic watermarks with date/time stamps",
      "## Redaction: Permanently Removing Sensitive Data",
      "Unlike simply covering text with black boxes, proper redaction permanently removes data:",
      "- Always use dedicated redaction tools, not drawing tools",
      "- Verify redactions before sharing",
      "- Save redacted files as new copies to preserve originals",
      "- Remove metadata that might contain sensitive information",
      "## Our Security Tools",
      "Document Editor provides a complete suite of security features:",
      "- **Protect PDF**: Add passwords and set permissions",
      "- **Watermark**: Add custom watermarks to any position",
      "- **Redact**: Permanently remove sensitive content",
      "- **Sign**: Add digital signatures for authenticity",
      "Take control of your document security today!"
    ],
    relatedPosts: ["redaction-guide", "digital-signatures", "compliance-tips"]
  },
  "batch-processing": {
    title: "Speed Up Your Workflow with Batch Processing",
    excerpt: "Process multiple files at once and save hours of manual work with our batch tools.",
    date: "January 10, 2026",
    readTime: "4 min read",
    category: "Productivity",
    author: "Aman Vishwakarma",
    authorRole: "Creator & Lead Developer",
    content: [
      "Time is your most valuable resource. When you're dealing with dozens or hundreds of PDF files, processing them one by one simply isn't practical. That's where batch processing comes in.",
      "## What is Batch Processing?",
      "Batch processing allows you to apply the same operation to multiple files simultaneously. Instead of opening, processing, and saving each file individually, you can queue them all up and let our system handle them in one go.",
      "## Supported Batch Operations",
      "Our platform supports batch processing for:",
      "- **Compression**: Reduce file sizes across all your documents",
      "- **Conversion**: Convert multiple files to PDF or from PDF to other formats",
      "- **Merging**: Combine sets of documents into organized compilations",
      "- **Watermarking**: Apply consistent branding across all materials",
      "- **OCR**: Make entire archives searchable",
      "## How to Use Batch Processing",
      "Getting started is easy:",
      "1. Select the tool you want to use",
      "2. Upload multiple files (drag and drop works great)",
      "3. Configure your settings once",
      "4. Click process and let it run",
      "5. Download all processed files as a ZIP",
      "## Real-World Applications",
      "Our users love batch processing for:",
      "- End-of-month report compilation",
      "- Invoice archiving and compression",
      "- Marketing material watermarking",
      "- Legal document OCR processing",
      "- Image-to-PDF conversion for photo albums",
      "## Tips for Efficient Batch Processing",
      "- Organize files into folders before uploading",
      "- Use consistent naming conventions",
      "- Start with a small batch to verify settings",
      "- Use compression before archiving to save storage space",
      "Supercharge your productivity with batch processing today!"
    ],
    relatedPosts: ["ai-powered-compression", "workflow-automation", "cloud-integration"]
  },
  "image-to-pdf-guide": {
    title: "Converting Images to PDF: Complete Guide",
    excerpt: "Everything you need to know about converting JPG, PNG, and other image formats to PDF.",
    date: "January 8, 2026",
    readTime: "3 min read",
    category: "Tutorial",
    author: "Aman Vishwakarma",
    authorRole: "Creator & Lead Developer",
    content: [
      "Converting images to PDF is one of the most common document tasks. Whether you're creating a photo portfolio, digitizing receipts, or compiling screenshots, our image-to-PDF tool makes it simple.",
      "## Supported Image Formats",
      "Our converter works with all popular image formats:",
      "- JPEG/JPG",
      "- PNG",
      "- WebP",
      "- GIF (static)",
      "- BMP",
      "- TIFF",
      "## Conversion Options",
      "When converting images to PDF, you have control over:",
      "**Page Size**: Choose from standard sizes (A4, Letter, Legal) or custom dimensions.",
      "**Orientation**: Portrait or landscape to match your images.",
      "**Margins**: Add breathing room around your images.",
      "**Image Fitting**: Stretch to fit, maintain aspect ratio, or original size.",
      "**Quality**: Balance between file size and image clarity.",
      "## Creating Multi-Page PDFs",
      "To combine multiple images into one PDF:",
      "1. Upload all your images at once",
      "2. Arrange them in your desired order",
      "3. Choose 'One image per page' or 'Multiple images per page'",
      "4. Convert and download",
      "## Pro Tips",
      "- For best quality, use high-resolution images",
      "- Remove duplicates before converting",
      "- Consider compressing the final PDF for smaller file size",
      "- Use OCR on the resulting PDF to make text searchable",
      "Start converting your images to professional PDFs now!"
    ],
    relatedPosts: ["pdf-to-image", "photo-albums", "scan-to-pdf"]
  },
  "top-10-free-pdf-tools-2026": {
    title: "Top 10 Free PDF Tools You Need in 2026",
    excerpt: "Discover the best free PDF tools available online that can handle merging, splitting, compression and more without any cost.",
    date: "February 1, 2026",
    readTime: "7 min read",
    category: "Tutorial",
    author: "Aman Vishwakarma",
    authorRole: "Creator & Lead Developer",
    content: [
      "The internet is full of PDF tools, but finding truly free ones that deliver quality results can be challenging. Here are the top 10 free PDF tools you absolutely need in 2026.",
      "## 1. PDF Merge Tool",
      "Combine multiple PDF files into one seamless document. Our merge tool handles unlimited files with drag-and-drop reordering.",
      "## 2. PDF Splitter",
      "Extract specific pages or split large documents into smaller, manageable files. Perfect for separating chapters or sections.",
      "## 3. PDF Compressor",
      "Reduce file sizes by up to 90% using AI-powered compression. Ideal for email attachments and web uploads.",
      "## 4. PDF to Word Converter",
      "Convert PDFs to editable Word documents while preserving formatting, tables, and images.",
      "## 5. Image to PDF",
      "Transform JPG, PNG, and other image formats into professional PDF documents with custom page sizes.",
      "## 6. OCR Scanner",
      "Extract text from scanned documents and images using AI-powered optical character recognition.",
      "## 7. PDF Protector",
      "Add passwords, watermarks, and encryption to secure your sensitive documents.",
      "## 8. PDF Editor",
      "Rotate pages, add page numbers, crop, and annotate your PDFs directly in the browser.",
      "## 9. Batch Processor",
      "Process multiple files simultaneously — compress, convert, or watermark dozens of files at once.",
      "## 10. AI Summarizer",
      "Get instant AI-generated summaries of long PDF documents. Perfect for research and quick reviews.",
      "## Why Choose Free Tools?",
      "Free PDF tools have come a long way. With browser-based processing, your files stay secure and private. No software installation needed, no hidden costs.",
      "Try all these tools today on our platform — completely free, no signup required!"
    ],
    relatedPosts: ["merge-pdfs-guide", "ai-powered-compression", "batch-processing"]
  },
  "ai-document-management": {
    title: "How AI is Revolutionizing Document Management",
    excerpt: "Explore how artificial intelligence is transforming the way we create, edit, and manage documents in the modern workplace.",
    date: "February 5, 2026",
    readTime: "6 min read",
    category: "Feature Guide",
    author: "Aman Vishwakarma",
    authorRole: "Creator & Lead Developer",
    content: [
      "Artificial Intelligence is no longer a futuristic concept — it's actively reshaping how businesses and individuals handle documents every day. From smart compression to automatic text extraction, AI is making document management faster, smarter, and more accessible.",
      "## Smart Document Analysis",
      "AI can analyze document structure automatically, identifying headers, tables, images, and text blocks. This understanding enables:",
      "- Automatic table of contents generation",
      "- Intelligent page splitting based on content",
      "- Smart cropping and layout optimization",
      "## AI-Powered OCR",
      "Modern OCR goes beyond simple character recognition. AI-powered OCR can:",
      "**Understand handwriting**: Convert handwritten notes into digital text with high accuracy.",
      "**Handle multiple languages**: Process documents with mixed languages seamlessly.",
      "**Preserve formatting**: Maintain the original document layout during text extraction.",
      "## Intelligent Compression",
      "AI compression analyzes each element of a PDF — images, fonts, vectors — and applies the optimal compression algorithm for each. Results? Up to 90% size reduction with no visible quality loss.",
      "## Automated Workflows",
      "AI enables automation of repetitive document tasks:",
      "- Auto-categorize incoming documents",
      "- Extract key data from invoices and forms",
      "- Translate documents in real-time",
      "- Generate summaries of lengthy reports",
      "## The Future of Document Management",
      "We're just scratching the surface. Upcoming AI capabilities include:",
      "- Real-time collaborative editing with AI suggestions",
      "- Predictive document organization",
      "- Voice-to-document conversion",
      "- Automatic compliance checking",
      "The future of document management is intelligent, automated, and accessible to everyone."
    ],
    relatedPosts: ["ai-powered-compression", "ocr-technology", "batch-processing"]
  },
  "pdf-vs-word-comparison": {
    title: "PDF vs Word: When to Use Which Format",
    excerpt: "A comprehensive comparison of PDF and Word formats to help you choose the right one for every situation.",
    date: "February 10, 2026",
    readTime: "5 min read",
    category: "Tutorial",
    author: "Aman Vishwakarma",
    authorRole: "Creator & Lead Developer",
    content: [
      "PDF and Word are the two most popular document formats in the world. But when should you use each one? This guide breaks down the key differences and helps you make the right choice.",
      "## When to Use PDF",
      "PDFs are ideal when you need:",
      "- **Fixed layout**: Documents look the same on every device and printer",
      "- **Security**: Password protection and encryption for sensitive files",
      "- **Distribution**: Sharing final versions that shouldn't be edited",
      "- **Archiving**: Long-term storage with guaranteed format preservation",
      "- **Legal documents**: Contracts, agreements, and official forms",
      "## When to Use Word",
      "Word documents are better when you need:",
      "- **Collaboration**: Multiple people editing the same document",
      "- **Drafting**: Creating and revising content frequently",
      "- **Templates**: Reusable formats for letters, reports, and proposals",
      "- **Mail merge**: Personalized bulk documents",
      "## Converting Between Formats",
      "Our tools make it easy to switch between formats:",
      "**Word to PDF**: Preserve your formatting perfectly when sharing final documents.",
      "**PDF to Word**: Convert existing PDFs back to editable Word format for modifications.",
      "## Best Practices",
      "- Draft in Word, distribute in PDF",
      "- Always keep an editable Word version as backup",
      "- Use PDF for anything going to print",
      "- Use Word when collaboration is needed",
      "- Compress PDFs before emailing to reduce file size",
      "Choose the right format for every situation and work smarter, not harder!"
    ],
    relatedPosts: ["merge-pdfs-guide", "image-to-pdf-guide", "ai-powered-compression"]
  },
  "secure-business-documents": {
    title: "Secure Your Business Documents: A Complete Guide",
    excerpt: "Essential security practices every business should follow when handling sensitive PDF documents and digital files.",
    date: "February 15, 2026",
    readTime: "8 min read",
    category: "Security",
    author: "Aman Vishwakarma",
    authorRole: "Creator & Lead Developer",
    content: [
      "Data breaches cost businesses millions every year. Proper document security isn't optional — it's essential. This guide covers everything your business needs to know about securing digital documents.",
      "## The Cost of Poor Document Security",
      "According to industry reports:",
      "- The average data breach costs ₹15 crore in India",
      "- 60% of small businesses close within 6 months of a data breach",
      "- Human error accounts for 95% of cybersecurity incidents",
      "## Essential Security Measures",
      "**1. Password Protection**",
      "Always password-protect sensitive PDFs before sharing. Use strong passwords with at least 12 characters combining letters, numbers, and symbols.",
      "**2. Encryption**",
      "Use AES-256 encryption for maximum security. Our Protect PDF tool applies bank-grade encryption to your documents.",
      "**3. Watermarking**",
      "Add watermarks to confidential documents to discourage unauthorized sharing and track document distribution.",
      "**4. Redaction**",
      "When sharing documents with third parties, redact sensitive information like Aadhaar numbers, bank details, and personal data.",
      "**5. Access Controls**",
      "Set permissions to control who can view, print, copy, or edit your documents.",
      "## Document Handling Best Practices",
      "- Never email unencrypted sensitive documents",
      "- Use secure file sharing platforms",
      "- Regularly audit who has access to critical documents",
      "- Implement a document retention policy",
      "- Train employees on document security protocols",
      "## Our Security Tools",
      "PDF Tools provides enterprise-grade security features:",
      "- **Protect PDF**: Password and encryption",
      "- **Watermark**: Custom branding and tracking",
      "- **Redact**: Permanent data removal",
      "- **Sign PDF**: Digital signatures for authenticity",
      "Protect your business today with our free security tools!"
    ],
    relatedPosts: ["pdf-security-best-practices", "ai-powered-compression", "batch-processing"]
  },
  "reduce-pdf-file-size": {
    title: "5 Ways to Reduce PDF File Size Without Losing Quality",
    excerpt: "Learn proven techniques to compress your PDFs effectively while maintaining document quality and readability.",
    date: "February 20, 2026",
    readTime: "4 min read",
    category: "Productivity",
    author: "Aman Vishwakarma",
    authorRole: "Creator & Lead Developer",
    content: [
      "Large PDF files are a common frustration — they're slow to upload, exceed email limits, and eat up storage. Here are 5 proven ways to shrink your PDFs without sacrificing quality.",
      "## 1. Use AI-Powered Compression",
      "Our AI compression tool analyzes every element in your PDF and applies the optimal compression algorithm. Unlike basic compression, AI preserves text sharpness while dramatically reducing image sizes.",
      "- Photos: Up to 90% size reduction",
      "- Diagrams: 70% reduction with zero quality loss",
      "- Text: Remains pixel-perfect",
      "## 2. Remove Unnecessary Elements",
      "PDFs often contain hidden elements that inflate file size:",
      "- Embedded fonts you don't need",
      "- Hidden layers and annotations",
      "- Duplicate images",
      "- Excessive metadata",
      "Our tools can strip these elements automatically.",
      "## 3. Optimize Images Before Embedding",
      "If you're creating PDFs from scratch:",
      "**Resize images** to the actual display size before inserting them. A 4000x3000 photo displayed at 800x600 wastes enormous space.",
      "**Choose the right format**: Use JPEG for photos, PNG for diagrams with text.",
      "**Compress images first** using our Image Compress tool.",
      "## 4. Use Grayscale When Color Isn't Needed",
      "Converting color PDFs to grayscale can reduce file size by 30-50%. Perfect for:",
      "- Internal documents and drafts",
      "- Text-heavy reports",
      "- Documents meant for black-and-white printing",
      "## 5. Split and Merge Strategically",
      "Instead of sending one massive file:",
      "- Split into chapters or sections",
      "- Compress each section independently",
      "- Merge back if needed — the result is often smaller than the original",
      "## Quick Comparison",
      "- **Original file**: 50MB presentation",
      "- **After AI compression**: 8MB (84% reduction)",
      "- **After removing extras**: 6MB (88% reduction)",
      "- **After grayscale**: 4MB (92% reduction)",
      "Start reducing your PDF sizes today — it's free and takes seconds!"
    ],
    relatedPosts: ["ai-powered-compression", "batch-processing", "image-to-pdf-guide"]
  }
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogPostsData[slug] : null;

  if (!post) {
    return (
      <>
        <Helmet>
          <title>Post Not Found - Document Editor Blog</title>
        </Helmet>
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <main className="flex-1 pt-24 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
              <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
              <Button asChild>
                <Link to="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Tutorial": return FileText;
      case "Feature Guide": return Sparkles;
      case "Security": return Shield;
      case "Productivity": return Zap;
      default: return Sparkles;
    }
  };

  const CategoryIcon = getCategoryIcon(post.category);

  const renderContent = (content: string[]) => {
    return content.map((paragraph, index) => {
      if (paragraph.startsWith("## ")) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
            {paragraph.replace("## ", "")}
          </h2>
        );
      }
      if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
        return (
          <p key={index} className="font-semibold mt-4 mb-2">
            {paragraph.replace(/\*\*/g, "")}
          </p>
        );
      }
      if (paragraph.startsWith("- ")) {
        return (
          <li key={index} className="ml-6 mb-2 text-muted-foreground">
            {paragraph.replace("- ", "")}
          </li>
        );
      }
      return (
        <p key={index} className="text-muted-foreground leading-relaxed mb-4">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <>
      <Helmet>
        <title>{post.title} - Document Editor Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 pt-24">
          {/* Hero Section */}
          <section className="py-8">
            <div className="container max-w-4xl mx-auto px-4">
              <Link
                to="/blog"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>

              <Badge variant="secondary" className="mb-4">
                <CategoryIcon className="w-3 h-3 mr-1" />
                {post.category}
              </Badge>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>

              <p className="text-lg text-muted-foreground mb-6">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">AV</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{post.author}</p>
                    <p className="text-xs">{post.authorRole}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>

              {/* Share buttons */}
              <div className="flex items-center gap-4 pb-8 border-b border-border">
                <span className="text-sm text-muted-foreground">Share:</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Image */}
          {post.image && (
            <section className="pb-8">
              <div className="container max-w-4xl mx-auto px-4">
                <div className="aspect-video rounded-xl overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Article Content */}
          <article className="py-8">
            <div className="container max-w-4xl mx-auto px-4">
              <div className="prose prose-lg max-w-none">
                {renderContent(post.content)}
              </div>
            </div>
          </article>

          {/* Author Card */}
          <section className="py-8">
            <div className="container max-w-4xl mx-auto px-4">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-primary">AV</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{post.author}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{post.authorRole}</p>
                      <p className="text-sm text-muted-foreground">
                        Passionate about making document management simple and accessible for everyone. 
                        Building the future of PDF tools with AI-powered solutions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 bg-muted/30">
            <div className="container max-w-2xl mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to try our PDF tools?</h2>
              <p className="text-muted-foreground mb-6">
                Experience the power of AI-driven document processing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/">Get Started Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/blog">Read More Articles</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BlogPost;