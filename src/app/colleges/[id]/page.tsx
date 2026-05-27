"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCollege } from "@/hooks/useCollege";
import { useAuthStore } from "@/store/authStore";
import { useSavedStore } from "@/store/savedStore";
import { useCompareStore } from "@/store/compareStore";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { RatingStars } from "@/components/shared/RatingStars";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { ErrorState } from "@/components/shared/ErrorState";
import {
  MapPin,
  Calendar,
  Building,
  Award,
  BookOpen,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Bookmark,
  Columns,
  ThumbsUp,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TabType = "overview" | "courses" | "placements" | "reviews";

export default function CollegeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const collegeId = params.id as string;
  const [mounted, setMounted] = useState(false);

  const { data: college, isLoading, isError, refetch } = useCollege(collegeId);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Local state for interactive features
  const [votedReviews, setVotedReviews] = useState<Record<number, boolean>>({});
  const [reviewSort, setReviewSort] = useState<string>("helpful");
  const [courseSortCol, setCourseSortCol] = useState<string>("totalFees");
  const [courseSortAsc, setCourseSortAsc] = useState<boolean>(true);

  // ZUSTAND Client state links
  const { user, openAuthModal } = useAuthStore();
  const { toggleSavedCollege, isCollegeSaved } = useSavedStore();
  const { compareIds, addCompareId, removeCompareId, isComparing } = useCompareStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSaved = mounted && college ? isCollegeSaved(college.id) : false;
  const isCompared = mounted && college ? isComparing(college.id) : false;

  const handleSaveToggle = () => {
    if (!college) return;
    if (!user) {
      openAuthModal();
      return;
    }
    toggleSavedCollege(college.id);
  };

  const handleCompareToggle = () => {
    if (!college) return;
    if (isCompared) {
      removeCompareId(college.id);
    } else {
      const added = addCompareId(college.id);
      if (!added && compareIds.length >= 3) {
        alert("Comparison limit reached. You can compare up to 3 colleges at once.");
      }
    }
  };

  const handleVoteReview = (idx: number) => {
    if (votedReviews[idx]) return; // Limit to single vote per mount session
    setVotedReviews((prev) => ({ ...prev, [idx]: true }));
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="space-y-6 pt-6">
          <div className="h-10 w-24 bg-surface-200 animate-pulse rounded-[2px]" />
          <SkeletonCard className="h-96" />
        </div>
      </PageWrapper>
    );
  }

  if (isError || !college) {
    return (
      <PageWrapper>
        <div className="pt-6">
          <Button onClick={() => router.back()} variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Go Back</span>
          </Button>
          <ErrorState title="Institution Unreachable" onRetry={refetch} />
        </div>
      </PageWrapper>
    );
  }

  // Parse course total fees sorting
  const sortedCourses = [...(college.courses || [])].sort((a, b) => {
    let valA = a[courseSortCol as keyof typeof a];
    let valB = b[courseSortCol as keyof typeof b];

    if (typeof valA === "string") valA = (valA as string).toLowerCase();
    if (typeof valB === "string") valB = (valB as string).toLowerCase();

    if (valA < valB) return courseSortAsc ? -1 : 1;
    if (valA > valB) return courseSortAsc ? 1 : -1;
    return 0;
  });

  const toggleCourseSort = (col: string) => {
    if (courseSortCol === col) {
      setCourseSortAsc(!courseSortAsc);
    } else {
      setCourseSortCol(col);
      setCourseSortAsc(true);
    }
  };

  // Parse review sorting
  const sortedReviews = [...(college.reviews || [])].sort((a, b) => {
    const reviewsArr = college.reviews || [];
    if (reviewSort === "helpful") {
      const voteA = a.helpful + (votedReviews[reviewsArr.indexOf(a)] ? 1 : 0);
      const voteB = b.helpful + (votedReviews[reviewsArr.indexOf(b)] ? 1 : 0);
      return voteB - voteA;
    }
    if (reviewSort === "recent") {
      return parseInt(b.batch) - parseInt(a.batch);
    }
    if (reviewSort === "highest") {
      return b.rating - a.rating;
    }
    if (reviewSort === "lowest") {
      return a.rating - b.rating;
    }
    return 0;
  });

  return (
    <PageWrapper>
      {/* Back button and actions */}
      <div className="flex justify-between items-center mt-2 mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 font-mono text-[9px] text-text-secondary hover:text-text-primary uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-primary" />
          <span>Back to Records</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Compare trigger */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCompareToggle}
            className={cn(isCompared && "border-secondary text-secondary")}
          >
            <Columns className="w-3.5 h-3.5 mr-1.5" />
            <span>{isCompared ? "Remove Compare" : "Compare"}</span>
          </Button>

          {/* Bookmark trigger */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveToggle}
            className={cn(isSaved && "border-primary text-primary")}
          >
            <Bookmark className={cn("w-3.5 h-3.5 mr-1.5", isSaved && "fill-current")} />
            <span>{isSaved ? "Saved" : "Save Record"}</span>
          </Button>
        </div>
      </div>

      {/* Hero Header Section */}
      <section className="bg-surface-100 border border-border p-6 md:p-10 space-y-6 rounded-[2px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="gold">NIRF Rank {college.nirfRank || "—"}</Badge>
              <Badge variant="outline">{college.type || "—"}</Badge>
            </div>
            <h1 className="font-serif text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary leading-tight">
              {college.name}
            </h1>
            <div className="flex flex-wrap items-center text-text-secondary gap-x-4 gap-y-2 text-xs">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-secondary" />
                {college.location || "—"}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                Est. {college.established || "—"}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2.5">
            <div className="flex items-center gap-2">
              <RatingStars rating={college.rating} size={15} />
              <span className="font-mono text-base font-bold text-text-primary">
                {college.rating.toFixed(1)}
              </span>
            </div>
            <span className="font-mono text-[9px] text-text-secondary uppercase tracking-widest">
              ({college.reviewCount} verified audits)
            </span>
          </div>
        </div>

        {/* Dashed line divider */}
        <div className="border-t border-dashed border-border" />

        {/* Quick Stats metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="space-y-1">
            <span className="font-mono text-[9px] text-text-secondary uppercase tracking-widest block">
              NIRF RANKING
            </span>
            <span className="font-mono text-sm md:text-base font-bold text-primary">
              #{college.quickStats.rank || "—"}
            </span>
          </div>
          <div className="space-y-1">
            <span className="font-mono text-[9px] text-text-secondary uppercase tracking-widest block">
              ACCEPTANCE RATE
            </span>
            <span className="font-mono text-sm md:text-base font-bold text-text-primary">
              {college.quickStats.acceptance || "—"}
            </span>
          </div>
          <div className="space-y-1">
            <span className="font-mono text-[9px] text-text-secondary uppercase tracking-widest block">
              TOTAL ENROLLMENT
            </span>
            <span className="font-mono text-sm md:text-base font-bold text-text-primary">
              {college.quickStats.students || "—"}
            </span>
          </div>
          <div className="space-y-1">
            <span className="font-mono text-[9px] text-text-secondary uppercase tracking-widest block">
              CAMPUS LAYOUT
            </span>
            <span className="font-mono text-sm md:text-base font-bold text-text-primary">
              {college.quickStats.campus || "—"}
            </span>
          </div>
        </div>
      </section>

      {/* Tab Menu Selector */}
      <div className="flex bg-surface-100 border border-border p-1 rounded-[2px] mt-6 text-[10px] md:text-xs font-mono tracking-wider font-semibold uppercase justify-between overflow-x-auto scrollbar-none">
        {(["overview", "courses", "placements", "reviews"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-grow py-3 px-4 rounded-[2px] text-center transition-all",
              activeTab === tab
                ? "bg-primary text-background font-bold"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-200"
            )}
          >
            {tab === "courses" ? "Courses & Fees" : tab}
          </button>
        ))}
      </div>

      {/* Tab Content Rendering */}
      <div className="mt-6">
        {/* A: OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 bg-surface-100 border border-border p-6 md:p-8 space-y-6 rounded-[2px]">
              <div className="space-y-3">
                <h2 className="font-serif text-lg font-bold text-text-primary">
                  About the Institution
                </h2>
                <div className="text-xs text-text-secondary leading-relaxed space-y-4 font-sans">
                  {college.about.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                  <p>
                    {college.name} prioritizes multi-disciplinary coursework, combining core studies with elective modules designed in association with key industry bodies. It boasts comprehensive laboratory modules and high research citation capacities, placing it consistently in India&apos;s academic frontline.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              {/* Accreditations list */}
              <div className="bg-surface-100 border border-border p-6 rounded-[2px] space-y-3">
                <h3 className="font-mono text-[10px] text-primary uppercase tracking-widest font-semibold pb-2 border-b border-border">
                  Accreditations
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {college.accreditations.map((acc, i) => (
                    <Badge key={i} variant="teal">
                      {acc}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Entrance Exams */}
              <div className="bg-surface-100 border border-border p-6 rounded-[2px] space-y-3">
                <h3 className="font-mono text-[10px] text-primary uppercase tracking-widest font-semibold pb-2 border-b border-border">
                  Accepted Admissions Tests
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {college.entranceExams.map((ex, i) => (
                    <Badge key={i} variant="outline">
                      {ex}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* B: COURSES & FEES TAB */}
        {activeTab === "courses" && (
          <div className="bg-surface-100 border border-border p-6 md:p-8 rounded-[2px] overflow-x-auto">
            <h2 className="font-serif text-lg font-bold text-text-primary pb-4 mb-4 border-b border-border">
              Academic Curriculums & Fee Indices
            </h2>

            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-border font-mono text-[9px] text-text-secondary uppercase tracking-widest">
                  <th
                    className="pb-3 cursor-pointer hover:text-text-primary transition-colors"
                    onClick={() => toggleCourseSort("name")}
                  >
                    Course Stream {courseSortCol === "name" && (courseSortAsc ? <ChevronUp className="inline w-3 h-3 ml-1" /> : <ChevronDown className="inline w-3 h-3 ml-1" />)}
                  </th>
                  <th className="pb-3 text-center">Duration</th>
                  <th
                    className="pb-3 text-right cursor-pointer hover:text-text-primary transition-colors"
                    onClick={() => toggleCourseSort("totalFees")}
                  >
                    Total Fees {courseSortCol === "totalFees" && (courseSortAsc ? <ChevronUp className="inline w-3 h-3 ml-1" /> : <ChevronDown className="inline w-3 h-3 ml-1" />)}
                  </th>
                  <th
                    className="pb-3 text-right cursor-pointer hover:text-text-primary transition-colors"
                    onClick={() => toggleCourseSort("seats")}
                  >
                    Seats {courseSortCol === "seats" && (courseSortAsc ? <ChevronUp className="inline w-3 h-3 ml-1" /> : <ChevronDown className="inline w-3 h-3 ml-1" />)}
                  </th>
                  <th className="pb-3 text-right pr-4">Acceptance Metric</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedCourses.map((c, idx) => (
                  <tr
                    key={idx}
                    className={cn(
                      "hover:bg-surface-200 transition-colors duration-150",
                      c.popular && "bg-primary/5"
                    )}
                  >
                    <td className="py-3.5 pr-2 font-medium text-text-primary">
                      <div className="flex items-center gap-2">
                        <span>{c.name || "—"}</span>
                        {c.popular && (
                          <Badge variant="gold" className="text-[8px] px-1 py-0 scale-90">
                            Popular Choice
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 text-center text-text-secondary">{c.duration || "—"}</td>
                    <td className="py-3.5 text-right font-mono text-text-primary font-semibold">
                      {c.totalFees ? `₹${(c.totalFees / 100000).toFixed(2)}L` : "—"}
                    </td>
                    <td className="py-3.5 text-right font-mono text-text-secondary">
                      {c.seats || "—"}
                    </td>
                    <td className="py-3.5 text-right font-mono text-text-secondary pr-4">
                      {c.exam || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* C: PLACEMENTS TAB */}
        {activeTab === "placements" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* placement summary metrics */}
            <div className="lg:col-span-7 bg-surface-100 border border-border p-6 md:p-8 space-y-6 rounded-[2px]">
              <h2 className="font-serif text-lg font-bold text-text-primary pb-3 border-b border-border">
                Placement Index
              </h2>

              <div className="grid grid-cols-3 gap-4 text-center py-2">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-text-secondary uppercase tracking-widest block">
                    AVG ANNUAL PACKAGE
                  </span>
                  <span className="font-mono text-base md:text-lg font-bold text-primary">
                    ₹{college.placements.avg.toFixed(2)}LPA
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-text-secondary uppercase tracking-widest block">
                    HIGHEST PACKAGE
                  </span>
                  <span className="font-mono text-base md:text-lg font-bold text-text-primary">
                    ₹{college.placements.highest.toFixed(2)}LPA
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-text-secondary uppercase tracking-widest block">
                    PLACEMENT RATIO
                  </span>
                  <span className="font-mono text-base md:text-lg font-bold text-secondary">
                    {college.placements.percentage}%
                  </span>
                </div>
              </div>

              {/* YoY Placement Comparison using simple premium ASCII-style progress bars */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="font-mono text-[10px] text-text-secondary uppercase tracking-widest font-semibold">
                  Year-over-Year Progression (LPA)
                </h3>
                <div className="space-y-3 font-mono text-[11px]">
                  {(college.placements?.yearwise || []).map((log) => {
                    const maxPossiblePkg = Math.max(...(college.placements?.yearwise || []).map((w) => w.highest || 40));
                    const totalBlocks = 10;
                    const ratio = log.avg / (maxPossiblePkg || 1);
                    const filledCount = Math.max(1, Math.min(totalBlocks, Math.round(ratio * totalBlocks)));
                    const emptyCount = totalBlocks - filledCount;
                    const bar = "█".repeat(filledCount) + "░".repeat(emptyCount);

                    return (
                      <div key={log.year} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-dashed border-border/60">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-text-primary">{log.year}</span>
                          <span className="text-secondary font-mono leading-none tracking-tight">{bar}</span>
                        </div>
                        <div className="flex gap-4 mt-1 sm:mt-0">
                          <span>Avg: <span className="text-primary font-bold">₹{log.avg.toFixed(1)}L</span></span>
                          <span className="text-border">|</span>
                          <span>Max: <span className="text-text-primary font-bold">₹{log.highest.toFixed(1)}L</span></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* recruiters lists panel */}
            <div className="lg:col-span-5 bg-surface-100 border border-border p-6 rounded-[2px] space-y-4">
              <h3 className="font-mono text-[10px] text-primary uppercase tracking-widest font-semibold pb-2 border-b border-border">
                Corporate Recruiters
              </h3>
              <p className="text-[10px] text-text-secondary leading-relaxed font-sans pb-2">
                The institution maintains strong placement linkages with key consultancies, financial hubs, and domestic deep-tech firms. Major recruiters listed on student audit charts:
              </p>
              <div className="flex flex-wrap gap-2">
                {college.placements.topRecruiters.map((rec, i) => (
                  <Badge key={i} variant="outline" className="text-[10px] px-3 py-1 bg-surface-200">
                    {rec}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* D: REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Overall aggregate metrics column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-surface-100 border border-border p-6 rounded-[2px] space-y-4">
                <h3 className="font-mono text-[10px] text-primary uppercase tracking-widest font-semibold pb-2 border-b border-border">
                  Audit Score Summary
                </h3>

                <div className="flex flex-col items-center py-4 bg-surface-200 border border-border rounded-[2px]">
                  <span className="font-serif text-3xl font-bold text-text-primary">
                    {college.rating.toFixed(1)}
                  </span>
                  <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mt-1">
                    OUT OF 5.0
                  </span>
                  <RatingStars rating={college.rating} size={13} className="mt-2" />
                </div>

                {/* Score Categories bars */}
                <div className="space-y-3 pt-2 text-xs font-mono">
                  {/* Since different reviews could have slightly different categories, we'll draw aggregates from college review index[0] structure */}
                  {Object.entries(college.reviews[0]?.categories || { academics: 5, accommodation: 4, placements: 5, infrastructure: 4, social: 5 }).map(([cat, val]) => {
                    const avgScore = college.reviews.reduce((acc, curr) => acc + (curr.categories[cat as keyof typeof curr.categories] || 4), 0) / college.reviews.length;
                    const fillPercent = (avgScore / 5) * 100;

                    return (
                      <div key={cat} className="space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] uppercase tracking-widest">
                          <span className="text-text-secondary">{cat}</span>
                          <span className="text-text-primary font-bold">{avgScore.toFixed(1)}/5.0</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-200 rounded-none overflow-hidden">
                          <div
                            className="h-full bg-secondary"
                            style={{ width: `${fillPercent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Review posts list column */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center bg-surface-100 border border-border px-4 py-3 rounded-[2px]">
                <span className="font-mono text-[9px] text-text-secondary uppercase tracking-widest">
                  Verified audits list ({college.reviews.length})
                </span>

                {/* Sort Option selectors */}
                <select
                  value={reviewSort}
                  onChange={(e) => setReviewSort(e.target.value)}
                  className="bg-surface-200 border border-border px-3 py-1 text-xs text-text-primary focus:outline-none focus:border-primary rounded-[2px] font-mono"
                >
                  <option value="helpful">Helpful Counts</option>
                  <option value="recent">Most Recent Batch</option>
                  <option value="highest">Highest Star Rating</option>
                  <option value="lowest">Lowest Star Rating</option>
                </select>
              </div>

              {/* Review Card loop */}
              {sortedReviews.map((rev, idx) => {
                const globalIndex = college.reviews.indexOf(rev);
                const hasVoted = votedReviews[globalIndex];
                const activeHelpfulCount = rev.helpful + (hasVoted ? 1 : 0);

                return (
                  <div key={idx} className="bg-surface-100 border border-border p-6 space-y-4 rounded-[2px]">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div className="space-y-0.5">
                        <h4 className="font-serif text-sm font-semibold text-text-primary">
                          {rev.author || "Anonymous Audit"}
                        </h4>
                        <p className="font-mono text-[9px] text-text-secondary uppercase tracking-widest">
                          {rev.course || "General Stream"} • Class of {rev.batch || "—"}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <RatingStars rating={rev.rating} size={11} />
                        <span className="font-mono text-[11px] font-bold text-text-primary">
                          {rev.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <p className="font-sans text-xs text-text-secondary leading-relaxed font-light">
                      &ldquo;{rev.text}&rdquo;
                    </p>

                    {/* helpful metrics button */}
                    <div className="flex justify-between items-center pt-2 border-t border-border border-dashed">
                      {/* Breakdown scores miniature indicators */}
                      <div className="flex flex-wrap gap-2 text-[9px] font-mono text-text-secondary uppercase tracking-tight">
                        {Object.entries(rev.categories).slice(0, 3).map(([cat, val]) => (
                          <span key={cat}>
                            {cat.substring(0, 4)}: <span className="text-primary">{val}★</span>
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => handleVoteReview(globalIndex)}
                        disabled={hasVoted}
                        className={cn(
                          "flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest px-2.5 py-1.5 border transition-all duration-200 rounded-[2px]",
                          hasVoted
                            ? "bg-secondary/15 border-secondary text-secondary cursor-default"
                            : "bg-surface-200 border-border text-text-secondary hover:text-text-primary hover:border-border-accent"
                        )}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Helpful ({activeHelpfulCount})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
