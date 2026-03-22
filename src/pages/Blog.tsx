import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles, FileText, Zap, Shield } from "lucide-react";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const featuredPost = {
    title: "Introducing AI-Powered PDF Compression: Reduce File Size by 90%",
    excerpt: "Learn how our new AI compression algorithm analyzes your PDFs and applies intelligent optimization to dramatically reduce file sizes while maintaining quality.",
    date: "January 20, 2026",
    readTime: "5 min read",
    category: "Product Update",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
    slug: "ai-powered-compression",
  };

  const blogPosts = [
    {
      title: "How to Merge Multiple PDFs in Seconds",
      excerpt: "A step-by-step guide to combining multiple PDF documents into one file using our merge tool.",
      date: "January 18, 2026",
      readTime: "3 min read",
      category: "Tutorial",
      icon: FileText,
      slug: "merge-pdfs-guide",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=60",
    },
    {
      title: "OCR Technology: Extracting Text from Scanned Documents",
      excerpt: "Discover how AI-powered OCR can convert your scanned documents into editable, searchable text.",
      date: "January 15, 2026",
      readTime: "4 min read",
      category: "Feature Guide",
      icon: Sparkles,
      slug: "ocr-technology",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&auto=format&fit=crop&q=60",
    },
    {
      title: "Best Practices for PDF Security",
      excerpt: "Learn how to protect sensitive documents with passwords, watermarks, and redaction tools.",
      date: "January 12, 2026",
      readTime: "6 min read",
      category: "Security",
      icon: Shield,
      slug: "pdf-security-best-practices",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=600&auto=format&fit=crop&q=60",
    },
    {
      title: "Speed Up Your Workflow with Batch Processing",
      excerpt: "Process multiple files at once and save hours of manual work with our batch tools.",
      date: "January 10, 2026",
      readTime: "4 min read",
      category: "Productivity",
      icon: Zap,
      slug: "batch-processing",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60",
    },
    {
      title: "Converting Images to PDF: Complete Guide",
      excerpt: "Everything you need to know about converting JPG, PNG, and other image formats to PDF.",
      date: "January 8, 2026",
      readTime: "3 min read",
      category: "Tutorial",
      icon: FileText,
      slug: "image-to-pdf-guide",
      image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&auto=format&fit=crop&q=60",
    },
    {
      title: "What's New in Document Editor 2.0",
      excerpt: "Explore all the new features and improvements in our latest major update.",
      date: "January 5, 2026",
      readTime: "5 min read",
      category: "Product Update",
      icon: Sparkles,
      slug: "document-editor-2",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60",
    },
    {
      title: "Top 10 Free PDF Tools You Need in 2026",
      excerpt: "Discover the best free PDF tools available online that can handle merging, splitting, compression and more without any cost.",
      date: "February 1, 2026",
      readTime: "7 min read",
      category: "Tutorial",
      icon: FileText,
      slug: "top-10-free-pdf-tools-2026",
      image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&auto=format&fit=crop&q=60",
    },
    {
      title: "How AI is Revolutionizing Document Management",
      excerpt: "Explore how artificial intelligence is transforming the way we create, edit, and manage documents in the modern workplace.",
      date: "February 5, 2026",
      readTime: "6 min read",
      category: "Feature Guide",
      icon: Sparkles,
      slug: "ai-document-management",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=60",
    },
    {
      title: "PDF vs Word: When to Use Which Format",
      excerpt: "A comprehensive comparison of PDF and Word formats to help you choose the right one for every situation.",
      date: "February 10, 2026",
      readTime: "5 min read",
      category: "Tutorial",
      icon: FileText,
      slug: "pdf-vs-word-comparison",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&auto=format&fit=crop&q=60",
    },
    {
      title: "Secure Your Business Documents: A Complete Guide",
      excerpt: "Essential security practices every business should follow when handling sensitive PDF documents and digital files.",
      date: "February 15, 2026",
      readTime: "8 min read",
      category: "Security",
      icon: Shield,
      slug: "secure-business-documents",
      image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=600&auto=format&fit=crop&q=60",
    },
    {
      title: "5 Ways to Reduce PDF File Size Without Losing Quality",
      excerpt: "Learn proven techniques to compress your PDFs effectively while maintaining document quality and readability.",
      date: "February 20, 2026",
      readTime: "4 min read",
      category: "Productivity",
      icon: Zap,
      slug: "reduce-pdf-file-size",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=60",
    },
    {
      title: "Making PDFs Accessible: A Complete Guide for 2026",
      excerpt: "Learn how to create accessible PDF documents that comply with WCAG guidelines and work for everyone.",
      date: "March 1, 2026",
      readTime: "7 min read",
      category: "Tutorial",
      icon: FileText,
      slug: "pdf-accessibility-guide",
      image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&auto=format&fit=crop&q=60",
    },
    {
      title: "Digital Signatures in PDFs: Everything You Need to Know",
      excerpt: "A comprehensive guide to adding legally binding digital signatures to your PDF documents.",
      date: "March 5, 2026",
      readTime: "6 min read",
      category: "Security",
      icon: Shield,
      slug: "digital-signature-guide",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=60",
    },
    {
      title: "Creating and Filling PDF Forms: Ultimate Guide",
      excerpt: "Master the art of creating fillable PDF forms and learn how to efficiently fill, submit, and manage form data.",
      date: "March 10, 2026",
      readTime: "5 min read",
      category: "Feature Guide",
      icon: Sparkles,
      slug: "pdf-forms-guide",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=60",
    },
    {
      title: "How to Optimize PDFs for Search Engines (PDF SEO)",
      excerpt: "Learn proven techniques to make your PDF documents rank higher in Google search results.",
      date: "March 15, 2026",
      readTime: "8 min read",
      category: "Tutorial",
      icon: FileText,
      slug: "pdf-seo-optimization",
      image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=600&auto=format&fit=crop&q=60",
    },
    {
      title: "Edit PDFs on Mobile: Best Tips & Tools for 2026",
      excerpt: "Complete guide to editing, merging, and converting PDFs on your smartphone.",
      date: "March 20, 2026",
      readTime: "5 min read",
      category: "Productivity",
      icon: Zap,
      slug: "mobile-pdf-editing",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=60",
    },
  ];

  const categories = ["All", "Tutorial", "Product Update", "Feature Guide", "Security", "Productivity"];

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const showFeaturedPost = selectedCategory === "All" || featuredPost.category === selectedCategory;

  return (
    <>
      <Helmet>
        <title>Blog - Document Editor | PDF Tips, Tutorials & Updates</title>
        <meta name="description" content="Stay updated with the latest PDF tips, tutorials, and product updates from Document Editor. Learn how to make the most of our AI-powered tools." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 pt-24">
          {/* Hero Section */}
          <section className="py-16">
            <div className="container max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Blog
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  Tips, Tutorials & Updates
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Learn how to make the most of our PDF tools with guides, tips, and the latest product updates.
                </p>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap justify-center gap-2 mb-12">
                {categories.map((category, index) => (
                  <Button
                    key={index}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                    {category !== "All" && (
                      <span className="ml-1.5 text-xs opacity-70">
                        ({blogPosts.filter(p => p.category === category).length})
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Post */}
          {showFeaturedPost && (
            <section className="pb-16">
              <div className="container max-w-6xl mx-auto px-4">
                <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="aspect-video md:aspect-auto relative overflow-hidden">
                      <img
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent md:bg-gradient-to-r" />
                    </div>
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <Badge variant="secondary" className="w-fit mb-4">
                        {featuredPost.category}
                      </Badge>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        {featuredPost.title}
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {featuredPost.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {featuredPost.readTime}
                        </span>
                      </div>
                      <Button asChild className="w-fit group">
                        <Link to={`/blog/${featuredPost.slug}`}>
                          Read Article
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </section>
          )}

          {/* Blog Grid */}
          <section className="pb-20">
            <div className="container max-w-6xl mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8">
                {selectedCategory === "All" ? "Latest Articles" : `${selectedCategory} Articles`}
                <span className="ml-2 text-lg font-normal text-muted-foreground">
                  ({filteredPosts.length})
                </span>
              </h2>
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No articles found in this category.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSelectedCategory("All")}
                  >
                    View All Articles
                  </Button>
                </div>
              ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post, index) => (
                  <Link key={index} to={`/blog/${post.slug}`}>
                    <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all hover:-translate-y-1 group cursor-pointer overflow-hidden">
                      {post.image && (
                        <div className="aspect-video overflow-hidden">
                          <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        </div>
                      )}
                      <CardHeader>
                         {!post.image && (
                           <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                             <post.icon className="w-6 h-6 text-primary" />
                           </div>
                         )}
                      <Badge variant="outline" className="w-fit mb-2">
                        {post.category}
                      </Badge>
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                    </CardContent>
                    <CardFooter className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
              )}

              {/* Load More */}
              {filteredPosts.length > 0 && (
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg">
                    Load More Articles
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Newsletter */}
          <section className="py-16 bg-muted/30">
            <div className="container max-w-2xl mx-auto px-4 text-center">
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                <Sparkles className="w-3 h-3 mr-1" />
                Newsletter
              </Badge>
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-muted-foreground mb-8">
                Subscribe to our newsletter for the latest tips, tutorials, and product updates.
              </p>
              <NewsletterForm />
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
