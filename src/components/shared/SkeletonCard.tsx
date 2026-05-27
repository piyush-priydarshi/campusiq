import React from "react";
import { cn } from "@/lib/utils";

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-surface-100 border border-border p-5 space-y-4 rounded-[2px]",
        className
      )}
    >
      {/* Upper tag section */}
      <div className="flex justify-between items-start">
        <div className="h-4 w-20 bg-surface-200 rounded-[2px]" />
        <div className="h-5 w-5 bg-surface-200 rounded-[2px]" />
      </div>

      {/* Name and location */}
      <div className="space-y-2">
        <div className="h-6 w-5/6 bg-surface-200 rounded-[2px]" />
        <div className="h-3.5 w-1/3 bg-surface-200 rounded-[2px]" />
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-border/60 my-2" />

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-3 w-14 bg-surface-200 rounded-[2px]" />
          <div className="h-4 w-24 bg-surface-200 rounded-[2px]" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-14 bg-surface-200 rounded-[2px]" />
          <div className="h-4 w-24 bg-surface-200 rounded-[2px]" />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-border/60 my-2" />

      {/* Card Footer */}
      <div className="flex justify-between items-center pt-1">
        <div className="h-4.5 w-24 bg-surface-200 rounded-[2px]" />
        <div className="h-7 w-20 bg-surface-200 rounded-[2px]" />
      </div>
    </div>
  );
}
