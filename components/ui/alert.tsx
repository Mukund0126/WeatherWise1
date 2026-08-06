import React from "react";
import { cn } from "@/lib/utils";
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
}

export function Alert({
  variant = "info",
  title,
  className,
  children,
  ...props
}: AlertProps) {
  const icons = {
    info: <Info className="h-5 w-5 text-primary" />,
    success: <CheckCircle2 className="h-5 w-5 text-success" />,
    warning: <AlertTriangle className="h-5 w-5 text-warning" />,
    error: <AlertCircle className="h-5 w-5 text-danger" />,
  };

  const variants = {
    info: "bg-primary/5 border-primary/20 text-foreground",
    success: "bg-success/5 border-success/20 text-foreground",
    warning: "bg-warning/5 border-warning/20 text-foreground",
    error: "bg-danger/5 border-danger/20 text-foreground",
  };

  return (
    <div
      className={cn(
        "flex gap-3.5 items-start p-4 border rounded-lg bg-card",
        variants[variant],
        className
      )}
      role="alert"
      {...props}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[variant]}</div>
      <div className="flex-1 flex flex-col gap-1">
        {title && (
          <span className="font-semibold text-sm leading-none">{title}</span>
        )}
        <div className="text-xs text-muted-foreground leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
export default Alert;
