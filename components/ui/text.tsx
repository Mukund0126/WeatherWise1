import React from "react";
import { cn } from "@/lib/utils";

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg" | "xs";
  as?: "p" | "span" | "div";
}

export function Text({
  variant = "primary",
  size = "md",
  as = "p",
  className,
  children,
  ...props
}: TextProps) {
  const Tag = as;

  const variants = {
    primary: "text-foreground",
    secondary: "text-muted-foreground",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
  };

  const sizes = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <Tag className={cn(variants[variant], sizes[size], className)} {...props}>
      {children}
    </Tag>
  );
}
export default Text;
