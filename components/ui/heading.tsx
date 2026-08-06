import React from "react";
import { cn } from "@/lib/utils";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function Heading({
  level = "h1",
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = level;

  const styles = {
    h1: "text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground",
    h2: "text-2xl font-bold tracking-tight sm:text-3xl text-foreground",
    h3: "text-xl font-bold tracking-tight sm:text-2xl text-foreground",
    h4: "text-lg font-semibold tracking-tight text-foreground",
    h5: "text-base font-semibold tracking-tight text-foreground",
    h6: "text-sm font-semibold tracking-tight text-foreground",
  };

  return (
    <Tag className={cn(styles[level], className)} {...props}>
      {children}
    </Tag>
  );
}
export default Heading;
