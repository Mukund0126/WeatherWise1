import React from "react";
import { cn } from "@/lib/utils";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-lg bg-card/30 backdrop-blur-sm select-none",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="flex items-center justify-center mb-4 text-muted-foreground/80 w-12 h-12 rounded-full bg-muted">
          {icon}
        </div>
      )}
      <Heading level="h4" className="mb-1 text-foreground">
        {title}
      </Heading>
      <Text variant="secondary" className="max-w-xs mb-5 text-sm">
        {description}
      </Text>
      {action && <div>{action}</div>}
    </div>
  );
}
export default EmptyState;
