import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { 
  Image, FileText, Presentation, Table, Code,
  FileImage, FileType, FileSpreadsheet, FileBadge,
  LogIn, LogOut, User, Loader2, Sparkles, Brain, Search, LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import AIBadge from "./AIBadge";
import ThemeToggle from "./ThemeToggle";
import SearchDialog from "./SearchDialog";

const convertToPdfTools = [
  { title: "JPG to PDF", href: "/image-to-pdf", icon: Image, description: "AI-optimized conversion", ai: true },
  { title: "Word to PDF", href: "/tools/word-to-pdf", icon: FileText, description: "Perfect formatting" },
  { title: "PowerPoint to PDF", href: "/tools/powerpoint-to-pdf", icon: Presentation, description: "Preserve animations" },
  { title: "Excel to PDF", href: "/tools/excel-to-pdf", icon: Table, description: "Keep formulas" },
  { title: "HTML to PDF", href: "/tools/html-to-pdf", icon: Code, description: "Web to document" },
];

const convertFromPdfTools = [
  { title: "PDF to JPG", href: "/pdf-to-image", icon: FileImage, description: "AI-enhanced export", ai: true },
  { title: "PDF to Word", href: "/tools/pdf-to-word", icon: FileType, description: "Smart conversion", ai: true },
  { title: "PDF to PowerPoint", href: "/tools/pdf-to-powerpoint", icon: Presentation, description: "Editable slides" },
  { title: "PDF to Excel", href: "/tools/pdf-to-excel", icon: FileSpreadsheet, description: "Extract tables", ai: true },
  { title: "PDF to PDF/A", href: "/tools/pdf-to-pdfa", icon: FileBadge, description: "Archive format" },
];

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    }
  };

  return (
    <>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-xl font-display font-bold text-foreground">
              <div className="w-9 h-9 rounded-xl bg-gradient-ai flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span>PDF Tools</span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-brand-ai/10 text-brand-ai rounded-full">
                2026
              </span>
            </Link>
          
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/merge" className="text-muted-foreground hover:text-foreground transition-colors px-3 py-2 text-sm font-medium">
                  Merge
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/split" className="text-muted-foreground hover:text-foreground transition-colors px-3 py-2 text-sm font-medium">
                  Split
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/compress" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors px-3 py-2 text-sm font-medium">
                  <Brain className="w-3.5 h-3.5 text-brand-ai" />
                  Compress
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/ocr" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors px-3 py-2 text-sm font-medium">
                  <Brain className="w-3.5 h-3.5 text-brand-ai" />
                  AI OCR
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-muted-foreground hover:text-foreground text-sm font-medium">
                  Convert to PDF
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-1 p-4 glass-card rounded-2xl shadow-card-hover">
                    {convertToPdfTools.map((tool) => (
                      <li key={tool.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={tool.href}
                            className={cn(
                              "flex items-center gap-3 select-none rounded-xl p-3 leading-none no-underline outline-none transition-colors",
                              "hover:bg-muted focus:bg-muted"
                            )}
                          >
                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                              <tool.icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-medium leading-none">{tool.title}</div>
                                {tool.ai && <AIBadge variant="inline" glow={false} />}
                              </div>
                              <p className="line-clamp-1 text-xs leading-snug text-muted-foreground mt-1">
                                {tool.description}
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-muted-foreground hover:text-foreground text-sm font-medium">
                  Convert from PDF
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-1 p-4 glass-card rounded-2xl shadow-card-hover">
                    {convertFromPdfTools.map((tool) => (
                      <li key={tool.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={tool.href}
                            className={cn(
                              "flex items-center gap-3 select-none rounded-xl p-3 leading-none no-underline outline-none transition-colors",
                              "hover:bg-muted focus:bg-muted"
                            )}
                          >
                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                              <tool.icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-medium leading-none">{tool.title}</div>
                                {tool.ai && <AIBadge variant="inline" glow={false} />}
                              </div>
                              <p className="line-clamp-1 text-xs leading-snug text-muted-foreground mt-1">
                                {tool.description}
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-xl hidden sm:inline-flex"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
                <span className="text-muted-foreground">Search</span>
                <kbd className="ml-1 px-1.5 py-0.5 bg-muted text-[10px] rounded">⌘K</kbd>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden rounded-xl"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
              </Button>

              <ThemeToggle />
              
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline max-w-[120px] truncate">
                        {user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-card rounded-xl">
                    <DropdownMenuItem asChild className="gap-2 cursor-pointer rounded-lg">
                      <Link to="/dashboard">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="gap-2 cursor-pointer rounded-lg">
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild className="gap-2 rounded-xl hidden sm:inline-flex">
                    <Link to="/auth">
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="rounded-xl bg-gradient-ai hover:opacity-90 transition-opacity font-display font-semibold">
                    <Link to="/merge">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
