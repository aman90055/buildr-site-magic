import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Sparkles, 
  Users, 
  Target, 
  Heart, 
  Rocket, 
  Code, 
  Palette,
  Zap,
  Twitter,
  Linkedin,
  Github
} from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  const team = [
    {
      name: "Aman Vishwakarma",
      role: "Founder & Lead Developer",
      bio: "Full-stack developer passionate about creating tools that simplify document workflows. Building the future of PDF processing with AI.",
      avatar: "AV",
      social: {
        twitter: "https://twitter.com/AmanVishwakarma",
        linkedin: "https://linkedin.com/in/amanvishwakarma",
        github: "https://github.com/amanvishwakarma"
      }
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "Making document processing accessible, fast, and intelligent for everyone around the world."
    },
    {
      icon: Heart,
      title: "User-First",
      description: "Every feature is designed with our users in mind. Your feedback shapes our roadmap."
    },
    {
      icon: Rocket,
      title: "Innovation",
      description: "Leveraging cutting-edge AI to push the boundaries of what's possible with PDF tools."
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Speed and reliability are non-negotiable. Our tools process documents in seconds, not minutes."
    }
  ];

  const stats = [
    { value: "1M+", label: "Documents Processed" },
    { value: "50K+", label: "Happy Users" },
    { value: "20+", label: "PDF Tools" },
    { value: "99.9%", label: "Uptime" }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - PDF Tools | AI-Powered Document Solutions</title>
        <meta name="description" content="Learn about PDF Tools and our mission to revolutionize document processing with AI. Meet the team behind the next-generation PDF tools." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          
          <div className="container relative mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">About PDF Tools</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
              Building the Future of
              <span className="bg-gradient-ai bg-clip-text text-transparent block mt-2">
                Document Processing
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              We're on a mission to make PDF tools smarter, faster, and more accessible. 
              Powered by cutting-edge AI, our platform transforms how the world handles documents.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-display font-bold bg-gradient-ai bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-8 text-center">
                Our Story
              </h2>
              
              <div className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground">
                <p className="text-lg leading-relaxed mb-6">
                  PDF Tools was born from a simple frustration: why are document tools so complicated? 
                  In 2024, we set out to build something different – a platform that combines the power 
                  of artificial intelligence with intuitive design.
                </p>
                
                <p className="text-lg leading-relaxed mb-6">
                  What started as a side project quickly grew into a comprehensive suite of 20+ tools 
                  that handle everything from merging and splitting PDFs to advanced OCR and AI-powered 
                  document analysis. Today, we serve users across the globe, processing millions of 
                  documents every month.
                </p>
                
                <p className="text-lg leading-relaxed">
                  Our commitment to privacy, speed, and accuracy drives everything we do. We believe 
                  that powerful tools should be accessible to everyone – whether you're a student, 
                  a professional, or a business handling thousands of documents daily.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4 text-center">
              Our Values
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              The principles that guide everything we build
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-ai flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4 text-center">
              Meet the Team
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              The people behind PDF Tools
            </p>
            
            <div className="max-w-md mx-auto">
              {team.map((member, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-ai flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl font-display font-bold text-white">
                      {member.avatar}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-display font-bold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-4">{member.role}</p>
                  <p className="text-muted-foreground mb-6">{member.bio}</p>
                  
                  <div className="flex items-center justify-center gap-4">
                    <a 
                      href={member.social.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a 
                      href={member.social.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a 
                      href={member.social.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust PDF Tools for their document processing needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-gradient-ai hover:opacity-90 text-white px-8">
                <Link to="/merge">Try PDF Tools Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/">Explore All Tools</Link>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default About;
