"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type HTMLDivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
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

export interface CardProps extends HTMLDivProps {
  variant?: "default" | "elevated" | "glass";
  isInteractive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      isInteractive = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "rounded-lg border border-border bg-card text-card-foreground shadow-sm overflow-hidden";

    const variants = {
      default: "bg-card border-border",
      elevated: "bg-card border-border shadow-md",
      glass: "bg-card/75 backdrop-blur-md border-border/50",
    };

    if (isInteractive) {
      return (
        <motion.div
          ref={ref as React.Ref<HTMLDivElement>}
          whileHover={{ y: -3, scale: 1.005 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={cn(
            baseStyles,
            variants[variant],
            "cursor-pointer transition-shadow hover:shadow-md",
            className
          )}
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
export default Card;
