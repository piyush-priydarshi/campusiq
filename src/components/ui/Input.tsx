import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isMono?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", isMono = false, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex w-full bg-surface-100 border border-border px-4 py-2.5 text-xs text-text-primary placeholder:text-text-secondary transition-all duration-200 focus:outline-none focus:border-primary disabled:opacity-50 disabled:pointer-events-none rounded-[2px]",
          isMono ? "font-mono tracking-wider text-[11px]" : "font-sans",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
