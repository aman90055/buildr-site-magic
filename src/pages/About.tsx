import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Code, Zap, Heart, Target, Users, Award, Rocket } from "lucide-react";

const About = () => {
  const stats = [
    { label: "PDF Tools", value: "25+", icon: Zap },
    { label: "Users Served", value: "10K+", icon: Users },
    { label: "Files Processed", value: "100K+", icon: Target },
    { label: "AI Features", value: "10+", icon: Sparkles },
  ];

  const values = [
    {
      icon: Heart,
      title: "User-First Design",
      description: "Every feature is crafted with the user experience in mind, ensuring simplicity and efficiency."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized processing that handles your documents quickly without compromising quality."
    },
    {
      icon: Award,
      title: "Quality Matters",
      description: "We maintain the highest standards in document processing and AI-powered features."
    },
    {
      icon: Rocket,
      title: "Always Innovating",
      description: "Constantly improving and adding new AI-powered features to stay ahead of the curve."
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - Document Editor | PDF Tools by Aman Vishwakarma</title>
        <meta name="description" content="Learn about Document Editor, the AI-powered PDF platform created by Aman Vishwakarma. Discover our mission to make document editing simple and accessible." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 pt-24">
          {/* Hero Section */}
          <section className="py-16 md:py-24">
            <div className="container max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                  <Sparkles className="w-3 h-3 mr-1" />
                  About Us
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  Making Document Editing Simple
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                  We're on a mission to democratize document editing with AI-powered tools that anyone can use, 
                  from students to professionals.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
                {stats.map((stat, index) => (
                  <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
                    <CardContent className="p-6 text-center">
                      <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Founder Section */}
          <section className="py-16 bg-muted/30">
            <div className="container max-w-6xl mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                    <Code className="w-3 h-3 mr-1" />
                    Founder & Developer
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Aman Vishwakarma
                  </h2>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Hi! I'm Aman Vishwakarma, the creator and lead developer of Document Editor. 
                    As a passionate full-stack developer with a keen interest in AI and document processing, 
                    I started this project to solve a common problem - making PDF editing accessible to everyone.
                  </p>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    What started as a personal project has grown into a comprehensive suite of 25+ tools 
                    that help thousands of users daily. I believe in building products that are not just 
                    functional but delightful to use.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">TypeScript</Badge>
                    <Badge variant="secondary">AI/ML</Badge>
                    <Badge variant="secondary">PDF Processing</Badge>
                    <Badge variant="secondary">Full-Stack</Badge>
                  </div>
                </div>
                <div className="order-1 md:order-2 flex justify-center">
                  <div className="relative">
                    <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-1">
                      <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center border border-border/50">
                        <div className="text-center">
                          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                            <span className="text-5xl font-bold text-primary-foreground">AV</span>
                          </div>
                          <h3 className="text-xl font-semibold">Aman Vishwakarma</h3>
                          <p className="text-sm text-muted-foreground">Founder & Lead Developer</p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="py-16">
            <div className="container max-w-4xl mx-auto px-4">
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                  <Rocket className="w-3 h-3 mr-1" />
                  Our Story
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  From Idea to Impact
                </h2>
              </div>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-muted-foreground text-center leading-relaxed mb-8">
                  Document Editor was born from a simple frustration - why is it so hard to edit a PDF? 
                  In 2024, I set out to create a solution that combines the power of AI with intuitive design.
                </p>
                <p className="text-muted-foreground text-center leading-relaxed mb-8">
                  Today, our platform offers over 25 specialized tools for PDF manipulation, from basic 
                  operations like merge and split to advanced AI-powered features like OCR and smart compression. 
                  Every tool is designed to work seamlessly in your browser, with no software installation required.
                </p>
                <p className="text-muted-foreground text-center leading-relaxed">
                  We're committed to continuous innovation, regularly adding new features and improving 
                  existing ones based on user feedback. Our goal is to be the go-to platform for all 
                  document editing needs.
                </p>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-16 bg-muted/30">
            <div className="container max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                  <Heart className="w-3 h-3 mr-1" />
                  Our Values
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  What We Stand For
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <value.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default About;
