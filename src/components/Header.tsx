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
  FileImage, FileType, FileSpreadsheet, FileBadge
} from "lucide-react";
import { cn } from "@/lib/utils";

const convertToPdfTools = [
  { title: "JPG to PDF", href: "/image-to-pdf", icon: Image, description: "Convert images to PDF" },
  { title: "Word to PDF", href: "/tools/word-to-pdf", icon: FileText, description: "Convert Word documents" },
  { title: "PowerPoint to PDF", href: "/tools/powerpoint-to-pdf", icon: Presentation, description: "Convert presentations" },
  { title: "Excel to PDF", href: "/tools/excel-to-pdf", icon: Table, description: "Convert spreadsheets" },
  { title: "HTML to PDF", href: "/tools/html-to-pdf", icon: Code, description: "Convert web pages" },
];

const convertFromPdfTools = [
  { title: "PDF to JPG", href: "/pdf-to-image", icon: FileImage, description: "Convert PDF to images" },
  { title: "PDF to Word", href: "/tools/pdf-to-word", icon: FileType, description: "Convert to Word document" },
  { title: "PDF to PowerPoint", href: "/tools/pdf-to-powerpoint", icon: Presentation, description: "Convert to presentation" },
  { title: "PDF to Excel", href: "/tools/pdf-to-excel", icon: FileSpreadsheet, description: "Convert to spreadsheet" },
  { title: "PDF to PDF/A", href: "/tools/pdf-to-pdfa", icon: FileBadge, description: "Convert to archival format" },
];

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-foreground">
            PDF Tools
          </Link>
          
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/merge" className="text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
                  Merge
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/split" className="text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
                  Split
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/compress" className="text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
                  Compress
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-muted-foreground hover:text-foreground">
                  Convert to PDF
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-1 p-4 bg-popover border border-border rounded-lg shadow-lg">
                    {convertToPdfTools.map((tool) => (
                      <li key={tool.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={tool.href}
                            className={cn(
                              "flex items-center gap-3 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors",
                              "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                          >
                            <tool.icon className="h-5 w-5 text-primary" />
                            <div>
                              <div className="text-sm font-medium leading-none">{tool.title}</div>
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
                <NavigationMenuTrigger className="bg-transparent text-muted-foreground hover:text-foreground">
                  Convert from PDF
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-1 p-4 bg-popover border border-border rounded-lg shadow-lg">
                    {convertFromPdfTools.map((tool) => (
                      <li key={tool.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={tool.href}
                            className={cn(
                              "flex items-center gap-3 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors",
                              "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                          >
                            <tool.icon className="h-5 w-5 text-primary" />
                            <div>
                              <div className="text-sm font-medium leading-none">{tool.title}</div>
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
