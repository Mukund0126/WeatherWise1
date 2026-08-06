"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ThemeToggleProps = React.HTMLAttributes<HTMLButtonElement>;

export function ThemeToggle({ className, ...props }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by waiting until client-side mount
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-[38px] w-[38px] rounded-lg border border-border bg-card/50 animate-pulse",
          className
        )}
      />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex items-center justify-center p-2 rounded-lg border border-border bg-card text-foreground cursor-pointer transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20",
        className
      )}
      aria-label="Toggle theme"
      {...props}
    >
      <span className="h-5 w-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="h-[18px] w-[18px] text-warning" />
        ) : (
          <Moon className="h-[18px] w-[18px] text-primary" />
        )}
      </span>
    </button>
  );
}
export default ThemeToggle;
