import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const FloatingBackNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  if (isHome) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        className="rounded-full shadow-lg glass-card gap-1.5 px-4"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Back</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="rounded-full shadow-lg gap-1.5 px-4"
        onClick={() => navigate("/")}
        aria-label="Go to home"
      >
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">Home</span>
      </Button>
    </div>
  );
};

export default FloatingBackNav;
