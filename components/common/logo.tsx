import React from "react";
import { cn } from "@/lib/utils";

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true, className, ...props }: LogoProps) {
  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const textSizes = {
    sm: "text-base font-semibold tracking-tight",
    md: "text-xl font-bold tracking-tight",
    lg: "text-2xl font-extrabold tracking-tight",
    xl: "text-4xl font-extrabold tracking-tight",
  };

  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)} {...props}>
      {/* Brand Icon */}
      <svg
        className={cn(iconSizes[size], "text-primary")}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Core Sun Circle */}
        <circle cx="16" cy="16" r="6" className="fill-current" />
        {/* Outer Orbit / Weather Ring */}
        <path
          d="M16 2C8.26801 2 2 8.26801 2 16C2 17.5 2.2 19 2.6 20.4L5.4 19.4C5.1 18.3 5 17.2 5 16C5 9.92487 9.92487 5 16 5C22.0751 5 27 9.92487 27 16C27 22.0751 22.0751 27 16 27C14.8 27 13.7 26.9 12.6 26.6L11.6 29.4C13 29.8 14.5 30 16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2Z"
          fill="currentColor"
          fillOpacity="0.3"
        />
        {/* AI spark details */}
        <path
          d="M25 9.5L23.5 11L22 9.5L23.5 8L25 9.5Z"
          className="fill-current"
        />
        <path
          d="M10 23.5L8.5 25L7 23.5L8.5 22L10 23.5Z"
          className="fill-current"
        />
      </svg>
      {showText && (
        <span className={cn(textSizes[size], "text-foreground font-sans font-bold")}>
          Weather<span className="text-primary">Wise</span>
        </span>
      )}
    </div>
  );
}
export default Logo;
