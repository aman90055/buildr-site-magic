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
    content: [
      "Merging PDF files doesn't have to be complicated. With our intuitive merge tool, you can combine multiple documents into a single PDF in just a few clicks. Here's your complete guide to mastering PDF merging.",
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
    content: [
      "Optical Character Recognition (OCR) technology has transformed how we work with scanned documents and images. Our AI-powered OCR system takes this technology to the next level, delivering unprecedented accuracy and speed.",
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