import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-foreground">
            PDF Tools
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/merge" className="text-muted-foreground hover:text-foreground transition-colors">
              Merge PDF
            </Link>
            <Link to="/split" className="text-muted-foreground hover:text-foreground transition-colors">
              Split PDF
            </Link>
            <Link to="/compress" className="text-muted-foreground hover:text-foreground transition-colors">
              Compress PDF
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link to="/merge">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
