import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "teal" | "outline" | "destructive";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-[9px] font-medium tracking-widest uppercase px-2 py-0.5 rounded-[2px]",
        {
          // Default: Dark gray background, warm dark border
          "bg-surface-200 text-text-secondary border border-border":
            variant === "default",
          // Gold Accent Badge
          "bg-surface-200 text-primary border border-primary/40":
            variant === "gold",
          // Teal Accent Badge
          "bg-surface-200 text-secondary border border-secondary/40":
            variant === "teal",
          // Pure Outline
          "bg-transparent text-text-primary border border-border":
            variant === "outline",
          // Destructive
          "bg-surface-200 text-destructive border border-destructive/40":
            variant === "destructive",
        },
        className
      )}
      {...props}
    />
  );
}
