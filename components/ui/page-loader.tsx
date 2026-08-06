import React from "react";
import { Spinner } from "@/components/ui/spinner";
import { Logo } from "@/components/common/logo";
import { cn } from "@/lib/utils";

export interface PageLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  tagline?: string;
}

export function PageLoader({
  tagline = "AI-Powered Weather Intelligence",
  className,
  ...props
}: PageLoaderProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-6 select-none",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-6">
        <Logo size="xl" showText={true} />
        {tagline && (
          <span className="text-muted-foreground text-base font-medium tracking-wide">
            {tagline}
          </span>
        )}
        <Spinner size="md" className="mt-4" />
      </div>
    </div>
  );
}
export default PageLoader;
