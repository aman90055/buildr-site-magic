import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, FileText, Shield, Zap, CreditCard, MessageSquare } from "lucide-react";

const FAQ = () => {
  const faqCategories = [
    {
      title: "General Questions",
      icon: HelpCircle,
      faqs: [
        {
          question: "What is Document Editor?",
          answer: "Document Editor is a comprehensive online platform for all your PDF needs. We offer 25+ tools including merge, split, compress, convert, OCR, and more. Our AI-powered features make document processing faster and smarter than ever before."
        },
        {
          question: "Is Document Editor free to use?",
          answer: "Yes! We offer a generous free tier that allows you to process documents with basic features. For advanced features like AI compression, batch processing, and unlimited file sizes, you can upgrade to our premium plans."
        },
        {
          question: "Do I need to create an account?",
          answer: "You can use many of our tools without creating an account. However, creating a free account gives you access to your processing history, saved settings, and cloud storage for your documents."
        },
        {
          question: "What file formats do you support?",
          answer: "We support PDF, Word (DOC, DOCX), Excel (XLS, XLSX), PowerPoint (PPT, PPTX), images (JPG, PNG, TIFF, BMP, WebP), HTML, and many more formats. Our conversion tools can transform between most common document formats."
        }
      ]
    },
    {
      title: "PDF Tools & Features",
      icon: FileText,
      faqs: [
        {
          question: "How does PDF compression work?",
          answer: "Our compression tool analyzes your PDF and optimizes images, fonts, and other elements to reduce file size while maintaining quality. Our AI-powered compression can achieve up to 90% size reduction by intelligently processing each component."
        },
        {
          question: "Can I merge PDFs with different page sizes?",
          answer: "Yes! Our merge tool handles PDFs with different page sizes, orientations, and formats. The resulting document preserves the original dimensions of each page."
        },
        {
          question: "What is OCR and how accurate is it?",
          answer: "OCR (Optical Character Recognition) converts images of text into actual editable text. Our AI-powered OCR supports 100+ languages and achieves over 99% accuracy on clear documents. It works on scanned documents, photos of text, and image-based PDFs."
        },
        {
          question: "Can I edit text directly in a PDF?",
          answer: "Yes, our Edit PDF tool allows you to add text annotations, comments, and highlights. For full text editing capabilities on scanned documents, use our OCR tool first to convert the content to editable text."
        },
        {
          question: "How do I remove pages from a PDF?",
          answer: "Use our Remove Pages tool. Upload your PDF, select the pages you want to remove (by thumbnail or page number), and download the modified document. You can also use our Split tool to extract specific pages."
        }
      ]
    },
    {
      title: "Security & Privacy",
      icon: Shield,
      faqs: [
        {
          question: "Is my data secure?",
          answer: "Absolutely. All file transfers use 256-bit SSL encryption. Files are processed on secure servers and automatically deleted after processing. We never access, share, or sell your document contents."
        },
        {
          question: "How long do you keep my files?",
          answer: "Uploaded files are automatically deleted from our servers within 1 hour of processing. If you have an account, you can choose to save files to your secure cloud storage for longer periods."
        },
        {
          question: "Can I password-protect my PDFs?",
          answer: "Yes! Our Protect PDF tool lets you add open passwords (to view) and permission passwords (to edit, print, or copy). We use industry-standard AES-256 encryption for maximum security."
        },
        {
          question: "What is PDF redaction?",
          answer: "Redaction permanently removes sensitive information from PDFs. Unlike simply covering text with black boxes, proper redaction completely eliminates the data so it cannot be recovered, even with specialized tools."
        },
        {
          question: "Are you GDPR compliant?",
          answer: "Yes, we are fully GDPR compliant. You have complete control over your data, including the right to access, correct, and delete your information. See our Privacy Policy for details."
        }
      ]
    },
    {
      title: "Performance & Limits",
      icon: Zap,
      faqs: [
        {
          question: "What is the maximum file size I can upload?",
          answer: "Free users can upload files up to 50MB. Premium users have limits up to 500MB per file, with batch processing support for handling multiple large files efficiently."
        },
        {
          question: "How fast is the processing?",
          answer: "Most operations complete in seconds. Larger files or complex operations like OCR may take a bit longer. Our AI-powered tools are optimized for speed without sacrificing quality."
        },
        {
          question: "Can I process multiple files at once?",
          answer: "Yes! Our batch processing feature (available to all users) lets you upload and process multiple files simultaneously. Premium users get faster processing and higher concurrent file limits."
        },
        {
          question: "What browsers are supported?",
          answer: "Document Editor works on all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. For the best experience, we recommend using the latest version of your preferred browser."
        }
      ]
    },
    {
      title: "Pricing & Plans",
      icon: CreditCard,
      faqs: [
        {
          question: "What's included in the free plan?",
          answer: "The free plan includes access to all basic PDF tools, standard compression, file conversions, and limited batch processing. You can process a generous number of documents each month at no cost."
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer: "Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your current billing period."
        },
        {
          question: "Do you offer refunds?",
          answer: "We offer a 14-day money-back guarantee for all new premium subscriptions. If you're not satisfied, contact our support team for a full refund."
        },
        {
          question: "Are there discounts for teams or businesses?",
          answer: "Yes! We offer volume discounts for teams and custom enterprise plans with additional features like SSO, dedicated support, and custom integrations. Contact us for details."
        }
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>FAQ - Document Editor | Frequently Asked Questions</title>
        <meta name="description" content="Find answers to common questions about Document Editor's PDF tools, features, pricing, and security. Get help with merging, compressing, converting, and more." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 pt-24">
          {/* Hero Section */}
          <section className="py-16 md:py-24">
            <div className="container max-w-4xl mx-auto px-4">
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                  <HelpCircle className="w-3 h-3 mr-1" />
                  Help Center
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  Frequently Asked Questions
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Find answers to common questions about our PDF tools and platform. 
                  Can't find what you're looking for? Contact us!
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Categories */}
          <section className="pb-20">
            <div className="container max-w-4xl mx-auto px-4">
              <div className="space-y-8">
                {faqCategories.map((category, categoryIndex) => (
                  <Card key={categoryIndex} className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <category.icon className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold">{category.title}</h2>
                      </div>
                      
                      <Accordion type="single" collapsible className="w-full">
                        {category.faqs.map((faq, faqIndex) => (
                          <AccordionItem 
                            key={faqIndex} 
                            value={`${categoryIndex}-${faqIndex}`}
                            className="border-border/50"
                          >
                            <AccordionTrigger className="text-left hover:no-underline hover:text-primary">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Still Have Questions */}
          <section className="py-16 bg-muted/30">
            <div className="container max-w-2xl mx-auto px-4 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
              <p className="text-muted-foreground mb-8">
                Can't find the answer you're looking for? Our team is here to help!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/contact">Contact Support</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/blog">Read Our Blog</Link>
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

export default FAQ;