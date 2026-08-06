import React from "react";
import { cn } from "@/lib/utils";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: string;
}

export function Divider({
  orientation = "horizontal",
  label,
  className,
  ...props
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        className={cn("h-full w-px bg-border self-stretch", className)}
        role="none"
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        className={cn(
          "w-full flex items-center gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wider select-none",
          className
        )}
        role="separator"
        {...props}
      >
        <div className="h-px flex-1 bg-border" />
        <span>{label}</span>
        <div className="h-px flex-1 bg-border" />
      </div>
    );
  }

  return (
    <div
      className={cn("h-px w-full bg-border", className)}
      role="separator"
      {...props}
    />
  );
}
export default Divider;
