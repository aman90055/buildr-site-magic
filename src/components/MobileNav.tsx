import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Menu, X, FileUp, Scissors, Minimize2, ScanText, 
  Image, FileText, Presentation, Table, Code,
  FileImage, FileType, FileSpreadsheet, FileBadge,
  LogIn, LogOut, User, LayoutDashboard, Sparkles, Brain,
  ChevronDown, ChevronUp, Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import AIBadge from "./AIBadge";

const convertToPdfTools = [
  { title: "JPG to PDF", href: "/image-to-pdf", icon: Image, ai: true },
  { title: "Word to PDF", href: "/tools/word-to-pdf", icon: FileText },
  { title: "PowerPoint to PDF", href: "/tools/powerpoint-to-pdf", icon: Presentation },
  { title: "Excel to PDF", href: "/tools/excel-to-pdf", icon: Table },
  { title: "HTML to PDF", href: "/tools/html-to-pdf", icon: Code },
];

const convertFromPdfTools = [
  { title: "PDF to JPG", href: "/pdf-to-image", icon: FileImage, ai: true },
  { title: "PDF to Word", href: "/tools/pdf-to-word", icon: FileType, ai: true },
  { title: "PDF to PowerPoint", href: "/tools/pdf-to-powerpoint", icon: Presentation },
  { title: "PDF to Excel", href: "/tools/pdf-to-excel", icon: FileSpreadsheet, ai: true },
  { title: "PDF to PDF/A", href: "/tools/pdf-to-pdfa", icon: FileBadge },
];

const mainTools = [
  { title: "Merge PDF", href: "/merge", icon: FileUp },
  { title: "Split PDF", href: "/split", icon: Scissors },
  { title: "Compress PDF", href: "/compress", icon: Minimize2, ai: true },
  { title: "AI OCR", href: "/ocr", icon: ScanText, ai: true },
];

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const [convertToOpen, setConvertToOpen] = useState(false);
  const [convertFromOpen, setConvertFromOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

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
    setOpen(false);
  };

  const NavLink = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) => (
    <SheetClose asChild>
      <Link
        to={to}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-colors"
        onClick={onClick}
      >
        {children}
      </Link>
    </SheetClose>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden rounded-xl">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0 glass">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <Link to="/" className="flex items-center gap-2 text-lg font-display font-bold" onClick={() => setOpen(false)}>
              <div className="w-8 h-8 rounded-xl bg-gradient-ai flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span>PDF Tools</span>
            </Link>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {/* Main Tools */}
            <div className="px-4 mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Main Tools</span>
            </div>
            {mainTools.map((tool) => (
              <NavLink key={tool.href} to={tool.href}>
                <tool.icon className="h-5 w-5 text-muted-foreground" />
                <span className="flex-1">{tool.title}</span>
                {tool.ai && <AIBadge variant="inline" glow={false} />}
              </NavLink>
            ))}

            {/* Convert to PDF */}
            <Collapsible open={convertToOpen} onOpenChange={setConvertToOpen} className="mt-4">
              <div className="px-4 mb-2">
                <CollapsibleTrigger className="flex items-center justify-between w-full text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Convert to PDF
                  {convertToOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                {convertToPdfTools.map((tool) => (
                  <NavLink key={tool.href} to={tool.href}>
                    <tool.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="flex-1">{tool.title}</span>
                    {tool.ai && <AIBadge variant="inline" glow={false} />}
                  </NavLink>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Convert from PDF */}
            <Collapsible open={convertFromOpen} onOpenChange={setConvertFromOpen} className="mt-4">
              <div className="px-4 mb-2">
                <CollapsibleTrigger className="flex items-center justify-between w-full text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Convert from PDF
                  {convertFromOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                {convertFromPdfTools.map((tool) => (
                  <NavLink key={tool.href} to={tool.href}>
                    <tool.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="flex-1">{tool.title}</span>
                    {tool.ai && <AIBadge variant="inline" glow={false} />}
                  </NavLink>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </nav>

          {/* Footer / Auth */}
          <div className="border-t border-border/50 p-4">
            {user ? (
              <div className="space-y-2">
                <NavLink to="/dashboard">
                  <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/refer">
                  <Gift className="h-5 w-5 text-muted-foreground" />
                  <span>Refer & Earn</span>
                </NavLink>
                <div className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="truncate">{user.email}</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl gap-2" 
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <NavLink to="/auth">
                  <LogIn className="h-5 w-5 text-muted-foreground" />
                  <span>Sign In</span>
                </NavLink>
                <SheetClose asChild>
                  <Link to="/merge">
                    <Button className="w-full rounded-xl bg-gradient-ai hover:opacity-90 font-display font-semibold">
                      Get Started
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
