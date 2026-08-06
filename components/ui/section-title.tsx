import React from "react";
import { cn } from "@/lib/utils";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function SectionTitle({
  title,
  subtitle,
  action,
  className,
  ...props
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-6",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-0.5">
        <Heading level="h3">{title}</Heading>
        {subtitle && (
          <Text variant="secondary" size="sm">
            {subtitle}
          </Text>
        )}
      </div>
      {action && <div className="mt-2 sm:mt-0">{action}</div>}
    </div>
  );
}
export default SectionTitle;
