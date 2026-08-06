import React from "react";
import { cn } from "@/lib/utils";

export type SectionContainerProps = React.HTMLAttributes<HTMLDivElement>;

export function SectionContainer({
  className,
  children,
  ...props
}: SectionContainerProps) {
  return (
    <section
      className={cn(
        "py-6 md:py-10 border-b border-border last:border-0",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
export default SectionContainer;
