"use client";

import React from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export function EmptyState({
  title = "No Matches Found",
  description = "No institutions match your selected parameters. Consider widening your search terms, modifying your maximum fee boundaries, or adjusting accepted exams.",
  onReset,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-border border-dashed bg-surface-100 rounded-[2px] space-y-5">
      <div className="w-10 h-10 flex items-center justify-center bg-surface-200 border border-border text-primary">
        <HelpCircle className="w-5 h-5" />
      </div>

      <div className="space-y-2.5 max-w-sm">
        <h3 className="font-serif text-base font-semibold text-text-primary tracking-wide">
          {title}
        </h3>
        <p className="font-sans text-xs text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>

      {onReset && (
        <Button onClick={onReset} variant="primary" size="sm" className="mt-1">
          Reset Filter Filters
        </Button>
      )}
    </div>
  );
}
