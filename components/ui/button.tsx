"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

type HTMLButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragOver"
  | "onDragEnter"
  | "onDragLeave"
  | "onPointerEnter"
  | "onPointerLeave"
  | "onPointerOver"
  | "onPointerOut"
  | "onTransitionEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
>;

export interface ButtonProps extends HTMLButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variants = {
      primary: "bg-primary text-white hover:bg-primary/95 shadow-sm active:bg-primary/90",
      secondary: "bg-muted text-foreground hover:bg-muted/80 shadow-sm border border-border",
      outline: "bg-transparent text-foreground border border-border hover:bg-muted/50",
      ghost: "bg-transparent text-foreground hover:bg-muted/50",
      destructive: "bg-danger text-white hover:bg-danger/95 shadow-sm active:bg-danger/90",
    };

    const sizes = {
      sm: "h-9 px-3.5 text-sm",
      md: "h-11 px-5 text-base",
      lg: "h-13 px-7 text-lg",
    };

    const isBtnDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        whileHover={isBtnDisabled ? {} : { scale: 1.01 }}
        whileTap={isBtnDisabled ? {} : { scale: 0.99 }}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={isBtnDisabled}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Spinner
              size="sm"
              variant={
                variant === "primary" || variant === "destructive"
                  ? "white"
                  : "primary"
              }
            />
            <span>Please wait...</span>
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
