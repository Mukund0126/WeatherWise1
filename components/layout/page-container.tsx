import React from "react";
import { cn } from "@/lib/utils";

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function PageContainer({
  size = "lg",
  className,
  children,
  ...props
}: PageContainerProps) {
  const sizes = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    xl: "max-w-[96rem]",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex-1 flex flex-col",
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
export default PageContainer;
