import clsx from "clsx";
import { type Dispatch, type SetStateAction } from "react";
import { Button } from "../ui/button";
import Chevron from "@/assets/ChevronLeft.svg?react";

type Props = {
  isSidePanelOpen: boolean;
  setIsSidePanelOpen: Dispatch<SetStateAction<boolean>>;
  className?: string;
};

export default function MobileNav({
  isSidePanelOpen,
  setIsSidePanelOpen,
  className,
}: Props) {
  return (
    <div
      className={clsx(
        "fixed top-0 right-0 z-100 h-screen",
        "w-[var(--sidebar-width)]",
        "bg-sidebar border-l border-border shadow-md",
        "flex flex-col",
        "transition-all duration-300 ease-in-out",
        "md:hidden",
        isSidePanelOpen ? "translate-x-0 " : "translate-x-full hidden",
        className
      )}
    >
      <div className="p-4 pb-2">
        <button
          onClick={() => setIsSidePanelOpen(false)}
          className="mb-8 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Chevron className="size-8 -ml-2" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col gap-2 px-4">
          {["Features", "About", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setIsSidePanelOpen(false)}
              className="group flex items-center px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
            >
              <span className="transition-transform duration-200 group-hover:translate-x-2">
                {item}
              </span>
            </a>
          ))}
        </nav>
      </div>

      <div className="border-t border-border p-4 bg-card">
        <div className="flex flex-col gap-3">
          <Button
            variant="ghost"
            className="h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
          >
            Sign In
          </Button>
          <Button className="shadow-sm hover:shadow-md transition-shadow duration-200">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
