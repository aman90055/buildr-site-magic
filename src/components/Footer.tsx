import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-foreground text-lg mb-4">PDF Tools</h3>
            <p className="text-muted-foreground">
              Free online tools to work with PDF files. Merge, split, compress, and convert.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Tools</h4>
            <ul className="space-y-2">
              <li><Link to="/merge" className="text-muted-foreground hover:text-foreground transition-colors">Merge PDF</Link></li>
              <li><Link to="/split" className="text-muted-foreground hover:text-foreground transition-colors">Split PDF</Link></li>
              <li><Link to="/compress" className="text-muted-foreground hover:text-foreground transition-colors">Compress PDF</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PDF Tools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
