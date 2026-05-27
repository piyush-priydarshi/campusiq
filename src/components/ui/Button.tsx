import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "outline", size = "md", children, style, ...props }, ref) => {
    const isPrimary = variant === "primary";

    return (
      <button
        ref={ref}
        style={isPrimary ? { color: '#0A0A0A', ...style } : style}
        className={cn(
          "inline-flex items-center justify-center font-sans tracking-widest text-[11px] uppercase font-medium transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-primary active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none rounded-[2px]",
          {
            "bg-primary border border-primary hover:opacity-90 font-semibold":
              variant === "primary",
            "bg-secondary text-text-primary border border-secondary hover:opacity-90":
              variant === "secondary",
            "bg-surface-100 text-text-primary border border-border hover:bg-surface-200 hover:text-primary":
              variant === "outline",
            "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-100":
              variant === "ghost",
            "bg-destructive text-text-primary border border-destructive hover:opacity-95":
              variant === "destructive",
          },
          {
            "px-3 py-1.5 text-[9px]": size === "sm",
            "px-5 py-2.5": size === "md",
            "px-7 py-3.5 text-xs": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";