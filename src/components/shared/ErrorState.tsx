"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Connection Interrupted",
  message = "An error occurred while loading the directory records. Please check your network and attempt to request the data again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-destructive/30 bg-surface-100 rounded-[2px] space-y-5">
      <div className="w-10 h-10 flex items-center justify-center bg-surface-200 border border-destructive/20 text-destructive">
        <AlertCircle className="w-5 h-5" />
      </div>

      <div className="space-y-2.5 max-w-sm">
        <h3 className="font-serif text-base font-semibold text-text-primary tracking-wide">
          {title}
        </h3>
        <p className="font-sans text-xs text-text-secondary leading-relaxed">
          {message}
        </p>
      </div>

      {onRetry && (
        <Button onClick={onRetry} variant="primary" size="sm" className="mt-1">
          Retry Connection
        </Button>
      )}
    </div>
  );
}
