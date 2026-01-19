import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import MobileNav from "./MobileNav";

type Props = {};

export default function Header({}: Props) {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  return (
    <header
      className="
        sticky top-0 z-50 w-full
        border-b border-border
        bg-card
        supports-[backdrop-filter]:bg-card/80
        backdrop-blur
      "
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-lg">
                T
              </span>
            </div>
            <span className="text-xl font-semibold text-foreground">
              TeamHub
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {["Features", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="
                  text-muted-foreground
                  hover:text-foreground
                  transition-colors
                "
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              className="
                text-muted-foreground
                hover:text-foreground
              "
            >
              Sign In
            </Button>
            <Button className="shadow-sm">
              Get Started
            </Button>
          </div>

          <Button
            onClick={() => setIsSidePanelOpen(true)}
            variant="ghost"
            size="icon"
            className="
              md:hidden
              text-muted-foreground
              hover:text-foreground
            "
          >
            <Menu className="h-6 w-6" />
          </Button>

          <MobileNav
            isSidePanelOpen={isSidePanelOpen}
            setIsSidePanelOpen={setIsSidePanelOpen}
          />
        </div>
      </div>
    </header>
  );
}
