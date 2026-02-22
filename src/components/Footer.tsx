import { Link } from "react-router-dom";
import { Sparkles, Heart, Coffee } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[200px] bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl" />
      
      <div className="container relative mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-display font-bold text-foreground mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-ai flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              PDF Tools
            </Link>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Next-generation AI-powered PDF tools. Merge, split, compress, and convert with unmatched accuracy and speed.
            </p>
            
            {/* Donation Section */}
            <div className="mb-4 p-3 rounded-lg bg-accent/50 border border-border/50">
              <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                <Heart className="w-4 h-4 text-red-500" /> Support Us
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://buymeacoffee.com/amanvishwakarma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[hsl(45,100%,51%)] text-[hsl(0,0%,10%)] text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  <Coffee className="w-3.5 h-3.5" /> Buy Me a Coffee
                </a>
                <a
                  href="upi://pay?pa=amanvishwakarma@upi&pn=Aman%20Vishwakarma&cu=INR"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  ₹ UPI Donate
                </a>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PDF Tools. All rights reserved.
            </p>
          </div>
          
          {/* Tools */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Core Tools</h4>
            <ul className="space-y-3">
              <li><Link to="/merge" className="text-muted-foreground hover:text-foreground transition-colors">Merge PDF</Link></li>
              <li><Link to="/split" className="text-muted-foreground hover:text-foreground transition-colors">Split PDF</Link></li>
              <li><Link to="/compress" className="text-muted-foreground hover:text-foreground transition-colors">Compress PDF</Link></li>
              <li><Link to="/convert" className="text-muted-foreground hover:text-foreground transition-colors">Convert PDF</Link></li>
              <li><Link to="/ocr" className="text-muted-foreground hover:text-foreground transition-colors">OCR PDF</Link></li>
            </ul>
          </div>
          
          {/* More Tools */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">More Tools</h4>
            <ul className="space-y-3">
              <li><Link to="/edit-pdf" className="text-muted-foreground hover:text-foreground transition-colors">Edit PDF</Link></li>
              <li><Link to="/rotate-pdf" className="text-muted-foreground hover:text-foreground transition-colors">Rotate PDF</Link></li>
              <li><Link to="/protect-pdf" className="text-muted-foreground hover:text-foreground transition-colors">Protect PDF</Link></li>
              <li><Link to="/pdf-to-image" className="text-muted-foreground hover:text-foreground transition-colors">PDF to Image</Link></li>
              <li><Link to="/image-to-pdf" className="text-muted-foreground hover:text-foreground transition-colors">Image to PDF</Link></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/refer" className="text-muted-foreground hover:text-foreground transition-colors">Refer & Earn</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p>Made with AI • Trusted by millions worldwide</p>
            <span className="hidden md:inline">•</span>
            <p className="font-medium text-foreground">
              Managed by{" "}
              <Link to="/about" className="underline underline-offset-2 hover:text-primary transition-colors">
                Aman Vishwakarma
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://twitter.com/AmanVishwakarma" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Twitter</a>
            <a href="https://www.linkedin.com/in/aman-vishwakarma-446708294" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">LinkedIn</a>
            <a href="https://github.com/amanvishwakarma" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
