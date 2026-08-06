import React from "react";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-4 flex flex-col gap-0.5", className)}>
      <Heading level="h3" className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
        {title}
      </Heading>
      {description && (
        <Text variant="secondary" size="sm" className="text-xs sm:text-sm">
          {description}
        </Text>
      )}
    </div>
  );
}
export default SectionHeader;
