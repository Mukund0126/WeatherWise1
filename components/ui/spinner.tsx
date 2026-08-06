import React from "react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "white" | "muted";
}

export function Spinner({ size = "md", variant = "primary", className, ...props }: SpinnerProps) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  const variants = {
    primary: "border-primary/20 border-t-primary",
    white: "border-white/20 border-t-white",
    muted: "border-muted-foreground/20 border-t-muted-foreground",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-solid",
        sizes[size],
        variants[variant],
        className
      )}
      role="status"
      aria-label="loading"
      {...props}
    />
  );
}
export default Spinner;
