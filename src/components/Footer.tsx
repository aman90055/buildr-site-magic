import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

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
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p>Made with AI • Trusted by millions worldwide</p>
            <span className="hidden md:inline">•</span>
            <p className="font-medium text-foreground">Made & Managed by Aman Vishwakarma</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://twitter.com/AmanVishwakarma" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Twitter</a>
            <a href="https://linkedin.com/in/amanvishwakarma" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">LinkedIn</a>
            <a href="https://github.com/amanvishwakarma" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
