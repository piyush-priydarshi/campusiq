"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { X, Columns, ArrowRight, Trash2 } from "lucide-react";
import { useCompareStore } from "@/store/compareStore";
import { College } from "@/types/college";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function CompareBar() {
  const [mounted, setMounted] = useState(false);
  const { compareIds, removeCompareId, clearCompare } = useCompareStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch names and locations of compared colleges dynamically
  const { data: colleges = [] } = useQuery<College[]>({
    queryKey: ["compare-bar-colleges", compareIds],
    queryFn: async () => {
      if (compareIds.length === 0) return [];
      const res = await fetch(`/api/compare?ids=${encodeURIComponent(compareIds.join(","))}`);
      if (!res.ok) {
        throw new Error("Failed to load details for comparison drawer");
      }
      return res.json();
    },
    enabled: mounted && compareIds.length > 0,
  });

  if (!mounted || compareIds.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-surface-100 border-t border-border py-4 px-4 md:px-8 shadow-none transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Summary Title */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-surface-200 border border-border text-primary rounded-[2px]">
            <Columns className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h4 className="font-mono text-[10px] text-text-secondary uppercase tracking-widest font-semibold">
              Active Comparison
            </h4>
            <p className="font-sans text-xs text-text-primary">
              Analyzing <span className="font-mono text-[11px] font-semibold text-primary">{compareIds.length}/3</span> institutions
            </p>
          </div>
        </div>

        {/* Center: Compared Cards list */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 my-1 md:my-0">
          {compareIds.map((id) => {
            const college = colleges.find((c) => c.id === id);
            return (
              <div
                key={id}
                className="flex items-center bg-surface-200 border border-border pl-3 pr-1.5 py-1.5 rounded-[2px] transition-all duration-200 group hover:border-border-accent max-w-[200px]"
              >
                <div className="text-left truncate mr-3">
                  <span className="font-serif text-[11px] text-text-primary font-medium block truncate leading-tight">
                    {college?.name || "Loading..."}
                  </span>
                  <span className="font-sans text-[9px] text-text-secondary block truncate">
                    {college?.location || "India"}
                  </span>
                </div>
                <button
                  onClick={() => removeCompareId(id)}
                  className="p-1 text-text-secondary hover:text-destructive hover:bg-surface-100 rounded-[2px] transition-all"
                  title="Remove from comparison"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}

          {/* Add filler slot if compareIds.length < 3 */}
          {compareIds.length < 3 && (
            <div className="hidden lg:flex items-center justify-center border border-border border-dashed px-4 py-3 rounded-[2px] text-[10px] font-mono tracking-wider text-text-secondary bg-transparent w-[180px] h-[39px]">
              Slot Open
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCompare}
            className="text-text-secondary hover:text-destructive flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </Button>

          <Link href={`/compare?ids=${compareIds.join(",")}`} className="w-full md:w-auto">
            <Button
              variant="primary"
              size="md"
              className="w-full md:w-auto font-semibold flex items-center gap-2 shadow-none py-2"
            >
              <span>Compare Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
