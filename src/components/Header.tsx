import { Search, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const navigationItems = [
    "Scores",
    "Latest", 
    "H2H",
    "Stats",
    "Rankings",
    "Players",
    "Tournaments", 
    "Challenger",
    "More"
  ];

  return (
    <header className="bg-background border-b border-border">
      {/* Top Bar */}
      <div className="bg-atp-blue text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <span>IT'S AI & DIGITAL INNOVATION PARTNER</span>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>EN</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* ATP Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-foreground">
                ATP TOUR
              </div>
              <div className="text-xs text-muted-foreground ml-2">
                It all adds up
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              {navigationItems.map((item) => (
                <button
                  key={item}
                  className={`text-sm font-medium transition-colors hover:text-atp-blue ${
                    item === "H2H" 
                      ? "text-atp-blue border-b-2 border-atp-blue pb-4" 
                      : "text-foreground hover:text-atp-blue"
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5" />
            </Button>
            <div className="bg-red-600 text-white px-3 py-1 text-sm font-bold">
              Emirates
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;