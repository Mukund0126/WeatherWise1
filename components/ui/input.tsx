import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leadingIcon,
      trailingIcon,
      className,
      type = "text",
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const defaultId = React.useId();
    const inputId = id || defaultId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <Label htmlFor={inputId} className={disabled ? "opacity-50" : ""}>
            {label}
          </Label>
        )}
        <div className="relative flex items-center">
          {leadingIcon && (
            <div className="absolute left-3.5 text-muted-foreground/80 select-none flex items-center justify-center pointer-events-none">
              {leadingIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            id={inputId}
            disabled={disabled}
            className={cn(
              "w-full h-11 bg-card text-foreground border border-border rounded-lg px-4 text-base transition-all placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:bg-muted/40 disabled:cursor-not-allowed",
              leadingIcon && "pl-10",
              trailingIcon && "pr-10",
              error && "border-danger focus:ring-danger/20 focus:border-danger",
              className
            )}
            {...props}
          />
          {trailingIcon && (
            <div className="absolute right-3.5 text-muted-foreground/80 select-none flex items-center justify-center pointer-events-none">
              {trailingIcon}
            </div>
          )}
        </div>
        {error && (
          <span className="text-xs text-danger font-medium mt-0.5 leading-none">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
