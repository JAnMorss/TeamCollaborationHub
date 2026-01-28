import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import MobileNav from "../appLayout/MobileNav";
import { AuthModal } from "../auth/auth-modal";

type AuthTab = "login" | "signup";

export default function Header() {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>("login");
  

  return (
    <header
      className="
        sticky top-0 z-50 w-full
        border-b
        bg-white/95
        text-gray-900
        supports-[backdrop-filter]:bg-white/60
        backdrop-blur
        dark:bg-card
        dark:text-foreground
        dark:border-white/5
        dark:supports-[backdrop-filter]:bg-card/80
      "
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 dark:bg-primary flex items-center justify-center shadow-sm">
              <span className="text-white dark:text-primary-foreground font-bold text-lg">
                T
              </span>
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-foreground">
              TeamHub
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {["Features", "About", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  const el = document.getElementById(item.toLowerCase());
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="text-gray-600 hover:text-gray-900 dark:text-muted-foreground dark:hover:text-foreground transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              className="
                text-gray-600 hover:text-gray-900
                dark:text-muted-foreground dark:hover:text-foreground
              "
              onClick={() => {
                setAuthTab("login");
                setIsAuthOpen(true);
              }}
            >
              Sign In
            </Button>
            <Button 
            className="
              bg-blue-600 hover:bg-blue-700 
              dark:bg-primary dark:hover:bg-primary/90 shadow-sm"
            onClick={() => {
                setAuthTab("signup");
                setIsAuthOpen(true);
              }}
            >
              Get Started
            </Button>
          </div>

          <Button
            onClick={() => setIsSidePanelOpen(true)}
            variant="ghost"
            size="icon"
            className="
              md:hidden
              text-gray-600 hover:text-gray-900
              dark:text-muted-foreground dark:hover:text-foreground
            "
          >
            <Menu className="h-6 w-6" />
          </Button>

          <MobileNav
            isSidePanelOpen={isSidePanelOpen}
            setIsSidePanelOpen={setIsSidePanelOpen}
            onLogin={() => {
              setAuthTab("login");
              setIsAuthOpen(true);
            }}
            onSignup={() => {
              setAuthTab("signup");
              setIsAuthOpen(true);
            }}
          />

          <AuthModal
            open={isAuthOpen}
            onOpenChange={setIsAuthOpen}
            defaultTab={authTab}
          />

        </div>
      </div>
    </header>
  );
}
