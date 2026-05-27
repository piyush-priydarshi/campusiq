"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, Columns, MapPin, Award, BookOpen, Layers } from "lucide-react";
import { College } from "@/types/college";
import { useAuthStore } from "@/store/authStore";
import { useSavedStore } from "@/store/savedStore";
import { useCompareStore } from "@/store/compareStore";
import { RatingStars } from "@/components/shared/RatingStars";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface CollegeCardProps {
  college: College;
}

export function CollegeCard({ college }: CollegeCardProps) {
  const [mounted, setMounted] = useState(false);
  const { user, openAuthModal } = useAuthStore();
  const { toggleSavedCollege, isCollegeSaved } = useSavedStore();
  const { compareIds, addCompareId, removeCompareId, isComparing } = useCompareStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSaved = mounted ? isCollegeSaved(college.id) : false;
  const isCompared = mounted ? isComparing(college.id) : false;

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      openAuthModal();
      return;
    }
    toggleSavedCollege(college.id);
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCompared) {
      removeCompareId(college.id);
    } else {
      const added = addCompareId(college.id);
      if (!added && compareIds.length >= 3) {
        alert("Comparison limit reached. You can compare up to 3 colleges at once.");
      }
    }
  };

  const popularCourse = college.courses.find((c) => c.popular) || college.courses[0];
  const getDurationYears = (duration: string): number => {
    const match = duration.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : 4;
  };
  const formattedFee = popularCourse
    ? `${(popularCourse.totalFees / 
        getDurationYears(popularCourse.duration) / 100000
      ).toFixed(2)}L`
    : "—";

  // Calculate standard annual fee from total fee
  const years = popularCourse
    ? parseFloat(popularCourse.duration) || 4
    : 4;
  const annualFee = popularCourse
    ? Math.round(popularCourse.totalFees / years)
    : 0;

  const formatLakhs = (val: number) => {
    if (!val) return "—";
    return `₹${(val / 100000).toFixed(2)}L`;
  };

  return (
    <div className="group bg-surface-100 border border-border hover:border-primary transition-all duration-300 flex flex-col justify-between p-5 rounded-[2px]">
      {/* Header tags and actions */}
      <div>
        <div className="flex justify-between items-start gap-4">
          <Badge variant="gold" className="text-[8px]">
            NIRF Rank {college.nirfRank}
          </Badge>

          <div className="flex items-center gap-1.5">
            {/* Compare Selector button */}
            <button
              onClick={handleCompareToggle}
              className={cn(
                "p-1.5 border transition-all duration-200 rounded-[2px]",
                isCompared
                  ? "bg-secondary/15 border-secondary text-secondary"
                  : "bg-surface-200 border-border text-text-secondary hover:text-text-primary hover:border-border-accent"
              )}
              title={isCompared ? "Remove from comparison" : "Add to comparison"}
            >
              <Columns className="w-3.5 h-3.5" />
            </button>

            {/* Bookmark button */}
            <button
              onClick={handleSaveToggle}
              className={cn(
                "p-1.5 border transition-all duration-200 rounded-[2px]",
                isSaved
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-surface-200 border-border text-text-secondary hover:text-text-primary hover:border-border-accent"
              )}
              title={isSaved ? "Remove bookmark" : "Bookmark college"}
            >
              <Bookmark className={cn("w-3.5 h-3.5", isSaved && "fill-current")} />
            </button>
          </div>
        </div>

        {/* title details */}
        <div className="mt-4 space-y-1">
          <Link href={`/colleges/${college.id}`}>
            <h3 title={college.name} className="font-serif text-base font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-1 leading-snug">
              {college.name}
            </h3>
          </Link>
          <div className="flex items-center text-text-secondary gap-1 text-[11px] font-sans">
            <MapPin className="w-3 h-3 text-secondary" />
            <span>{college.location}</span>
          </div>
        </div>

        {/* Rating Block */}
        <div className="mt-3.5 flex items-center gap-2">
          <RatingStars rating={college.rating} />
          <span className="font-mono text-[10px] text-text-secondary font-medium">
            {college.rating.toFixed(1)}
          </span>
        </div>

        {/* Dotted Divider */}
        <div className="border-t border-dashed border-border/80 my-4" />

        {/* Course stats section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="font-mono text-[9px] text-text-secondary uppercase tracking-widest block">
              Top Stream
            </span>
            <div className="flex items-center gap-1 text-text-primary font-sans text-xs font-medium">
              <BookOpen className="w-3 h-3 text-primary flex-shrink-0" />
              <span className="truncate">{popularCourse?.name || "Multiple"}</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="font-mono text-[9px] text-text-secondary uppercase tracking-widest block">
              Accepted Exams
            </span>
            <div className="flex items-center gap-1 text-text-primary font-mono text-[10px] font-medium">
              <Layers className="w-3 h-3 text-secondary flex-shrink-0" />
              <span className="truncate">{college.entranceExams.slice(0, 2).join(", ")}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Dotted Divider */}
        <div className="border-t border-dashed border-border/80 my-4" />

        {/* Footer info: Fee details + Action link */}
        <div className="flex justify-between items-center gap-3 pt-1">
          <div className="space-y-0.5">
            <span className="font-mono text-[8px] text-text-secondary uppercase tracking-widest block">
              Avg Annual Fee
            </span>
            <span className="font-mono text-xs font-semibold text-text-primary tracking-wide">
              {annualFee > 0 ? formatLakhs(annualFee) : "—"}/yr
            </span>
          </div>

          <Link href={`/colleges/${college.id}`}>
            <Button variant="outline" size="sm" className="group-hover:border-primary group-hover:bg-surface-200">
              Overview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
