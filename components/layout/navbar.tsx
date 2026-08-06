"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ROUTES } from "@/constants/routes";
import { User, Bell, Search } from "lucide-react";

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  showProfile?: boolean;
  variant?: "default" | "dashboard";
  searchQuery?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit?: (e: React.FormEvent) => void;
  suggestions?: Array<{ id: number; name: string; region: string; country: string }>;
  onSuggestionSelect?: (cityName: string) => void;
  suggestionsVisible?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function Navbar({
  showProfile = true,
  variant = "default",
  searchQuery = "",
  onSearchChange,
  onSearchSubmit,
  suggestions = [],
  onSuggestionSelect,
  suggestionsVisible = false,
  onFocus,
  onBlur,
  className,
  ...props
}: NavbarProps) {
  const handleAlert = (msg: string) => {
    alert(msg);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md select-none",
        className
      )}
      {...props}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left - Branding Logo & Name */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Logo size="sm" showText={true} />
          </Link>

          {variant === "dashboard" && (
            <Link
              href={ROUTES.DASHBOARD}
              className="hidden md:inline-block text-xs font-bold uppercase tracking-wider text-primary border-l border-border pl-6"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Center - Search Bar */}
        {variant === "dashboard" && (
          <div className="hidden md:block relative max-w-xs w-full">
            <form
              onSubmit={onSearchSubmit}
              className="flex items-center relative w-full"
            >
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search city..."
                value={searchQuery}
                onChange={onSearchChange}
                onFocus={onFocus}
                onBlur={onBlur}
                className="w-full h-9 pl-9 pr-4 rounded-full border border-border bg-background/50 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all"
              />
            </form>

            {suggestionsVisible && suggestions.length > 0 && (
              <div className="absolute top-10 left-0 w-full rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-lg overflow-hidden z-50">
                <ul className="divide-y divide-border/40 max-h-60 overflow-y-auto">
                  {suggestions.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onMouseDown={() => onSuggestionSelect?.(item.name)}
                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-primary/10 transition-colors text-foreground block cursor-pointer"
                      >
                        <span className="font-semibold">{item.name}</span>
                        {(item.region || item.country) && (
                          <span className="text-[10px] text-muted-foreground block truncate">
                            {item.region ? `${item.region}, ` : ""}{item.country}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Right - Controls */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {variant === "dashboard" && (
            <button
              className="h-9 w-9 rounded-full bg-card hover:bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors relative"
              aria-label="Notifications"
              onClick={() => handleAlert("Notifications center is a Sprint 9 placeholder.")}
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            </button>
          )}

          <ThemeToggle />

          {showProfile && (
            <div
              className="h-9 w-9 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground select-none cursor-pointer hover:bg-muted/80 transition-colors"
              role="button"
              aria-label="Profile menu"
              onClick={() => handleAlert("User Profile details is a Sprint 8 placeholder.")}
            >
              <User className="h-4.5 w-4.5" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
export default Navbar;
