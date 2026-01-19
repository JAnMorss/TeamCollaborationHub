import clsx from "clsx";
import { type Dispatch, type SetStateAction } from "react";
import { Button } from "../ui/button";
import Chevron from "@/assets/ChevronLeft.svg?react";

type Props = {
  isSidePanelOpen: boolean;
  setIsSidePanelOpen: Dispatch<SetStateAction<boolean>>;
  className?: string;
};

export default function MobileNav({ isSidePanelOpen, setIsSidePanelOpen, className }: Props) {
  return (
    <div
      className={clsx(
        "fixed top-0 right-0 z-50 h-screen w-[var(--sidebar-width)] bg-card border-l border-border shadow-lg py-8 px-4 overflow-y-auto flex flex-col transition-transform duration-300 lg:hidden",
        isSidePanelOpen ? "translate-x-0" : "translate-x-full",
        className
      )}
    >
      <button
        onClick={() => setIsSidePanelOpen(false)}
        className="mb-8 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Chevron className="size-8 -ml-2" />
      </button>

      <nav className="flex flex-col gap-2">
        {["Features", "About", "Contact"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            onClick={() => setIsSidePanelOpen(false)}
            className="group flex items-center px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
          >
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              {item}
            </span>
          </a>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-border flex flex-col gap-3">
        <Button
          variant="ghost"
          className="h-10 flex items-center justify-center text-muted-foreground hover:text-foreground"
        >
          Sign In
        </Button>
        <Button className="shadow-sm">Get Started</Button>
      </div>
    </div>
  );
}
