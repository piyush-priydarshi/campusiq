"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useCompareStore } from "@/store/compareStore";
import { useAuthStore } from "@/store/authStore";
import { useSavedStore } from "@/store/savedStore";
import { useUrlSync } from "@/hooks/useUrlSync";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { RatingStars } from "@/components/shared/RatingStars";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { College } from "@/types/college";
import collegesList from "@/data/colleges.json";
import { Columns, Plus, X, Search, Link as LinkIcon, Save, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatrixRow {
  key: string;
  label: string;
  isCustom?: boolean;
}

const COMPARISON_ROWS: MatrixRow[] = [
  { key: "location", label: "Location" },
  { key: "type", label: "Stream / Type" },
  { key: "nirfRank", label: "NIRF Ranking" },
  { key: "fees", label: "Popular Course Fees" },
  { key: "avgPkg", label: "Average Package" },
  { key: "highestPkg", label: "Highest Package" },
  { key: "placementPct", label: "Placement Ratio" },
  { key: "acceptanceRate", label: "Acceptance Rate" },
  { key: "campusSize", label: "Campus Layout" },
  { key: "rating", label: "Audit Rating" },
];

function ComparePageContent(){
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setParam } = useUrlSync();
  const [mounted, setMounted] = useState(false);

  // ZUSTAND client stores
  const { compareIds, addCompareId, removeCompareId, clearCompare } = useCompareStore();
  const { user, openAuthModal } = useAuthStore();
  const { saveComparison } = useSavedStore();

  // Search slots inputs dropdown control states
  const [activeSlotIdx, setActiveSlotIdx] = useState<number | null>(null);
  const [searchVal, setSearchVal] = useState("");
  const [comparisonName, setComparisonName] = useState("");
  const [isSavedNotify, setIsSavedNotify] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Sync URL parameters into Zustand compareIds for absolute shareability
    const urlIdsStr = searchParams.get("ids");
    if (urlIdsStr) {
      const parsedIds = urlIdsStr.split(",").map((id) => id.trim().toLowerCase()).filter(Boolean);
      // Overwrite Zustand active comparison with URL IDs
      clearCompare();
      parsedIds.slice(0, 3).forEach((id) => addCompareId(id));
    }
  }, [searchParams, addCompareId, clearCompare]);

  // Query details for all compared colleges
  const { data: colleges = [], isLoading } = useQuery<College[]>({
    queryKey: ["compare-details", compareIds],
    queryFn: async () => {
      if (compareIds.length === 0) return [];
      const res = await fetch(`/api/compare?ids=${encodeURIComponent(compareIds.join(","))}`);
      if (!res.ok) {
        throw new Error("Failed to load colleges comparison details");
      }
      return res.json();
    },
    enabled: mounted && compareIds.length > 0,
  });

  // Write Zustand changes back to URL searchParams
  const updateUrlParams = (ids: string[]) => {
    if (ids.length === 0) {
      setParam("ids", null);
    } else {
      setParam("ids", ids.join(","));
    }
  };

  const handleAddId = (id: string) => {
    const success = addCompareId(id);
    if (success) {
      updateUrlParams([...compareIds, id]);
    }
    setActiveSlotIdx(null);
    setSearchVal("");
  };

  const handleRemoveId = (id: string) => {
    removeCompareId(id);
    updateUrlParams(compareIds.filter((itemId) => itemId !== id));
  };

  const handleCopyLink = () => {
    if (typeof window === "undefined" || compareIds.length === 0) return;
    const shareUrl = `${window.location.origin}/compare?ids=${compareIds.join(",")}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Comparison link copied to clipboard!");
    });
  };

  const handleSaveComparison = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal();
      return;
    }
    if (!comparisonName.trim() || compareIds.length === 0) return;
    saveComparison(comparisonName.trim(), compareIds);
    setComparisonName("");
    setIsSavedNotify(true);
    setTimeout(() => setIsSavedNotify(false), 3000);
  };

  // 4. Winner Highlights Utility Evaluator
  const getWinnerIndex = (rowKey: string, cols: College[]) => {
    if (cols.length < 2) return -1;
    let winnerIdx = -1;

    if (rowKey === "nirfRank") {
      let minRank = Infinity;
      cols.forEach((c, idx) => {
        if (c.nirfRank && c.nirfRank < minRank) {
          minRank = c.nirfRank;
          winnerIdx = idx;
        }
      });
    } else if (rowKey === "fees") {
      let minFee = Infinity;
      cols.forEach((c, idx) => {
        const popularCourse = c.courses.find((course) => course.popular) || c.courses[0];
        const fee = popularCourse?.totalFees || 0;
        if (fee && fee < minFee) {
          minFee = fee;
          winnerIdx = idx;
        }
      });
    } else if (rowKey === "avgPkg") {
      let maxAvg = -Infinity;
      cols.forEach((c, idx) => {
        if (c.placements?.avg && c.placements.avg > maxAvg) {
          maxAvg = c.placements.avg;
          winnerIdx = idx;
        }
      });
    } else if (rowKey === "highestPkg") {
      let maxHighest = -Infinity;
      cols.forEach((c, idx) => {
        if (c.placements?.highest && c.placements.highest > maxHighest) {
          maxHighest = c.placements.highest;
          winnerIdx = idx;
        }
      });
    } else if (rowKey === "placementPct") {
      let maxPct = -Infinity;
      cols.forEach((c, idx) => {
        if (c.placements?.percentage && c.placements.percentage > maxPct) {
          maxPct = c.placements.percentage;
          winnerIdx = idx;
        }
      });
    } else if (rowKey === "acceptanceRate") {
      let minAccept = Infinity;
      cols.forEach((c, idx) => {
        if (c.acceptanceRate && c.acceptanceRate < minAccept) {
          minAccept = c.acceptanceRate;
          winnerIdx = idx;
        }
      });
    } else if (rowKey === "campusSize") {
      let maxCampus = -Infinity;
      cols.forEach((c, idx) => {
        if (c.campusSize && c.campusSize > maxCampus) {
          maxCampus = c.campusSize;
          winnerIdx = idx;
        }
      });
    } else if (rowKey === "rating") {
      let maxRating = -Infinity;
      cols.forEach((c, idx) => {
        if (c.rating && c.rating > maxRating) {
          maxRating = c.rating;
          winnerIdx = idx;
        }
      });
    }

    return winnerIdx;
  };

  const getCellContent = (rowKey: string, college: College) => {
    const popularCourse = college.courses.find((course) => course.popular) || college.courses[0];
    
    switch (rowKey) {
      case "location":
        return college.location;
      case "type":
        return college.type;
      case "nirfRank":
        return college.nirfRank ? `#${college.nirfRank}` : "—";
      case "fees":
        return popularCourse ? `₹${(popularCourse.totalFees / 100000).toFixed(2)}L (${popularCourse.duration})` : "—";
      case "avgPkg":
        return college.placements?.avg ? `₹${college.placements.avg.toFixed(2)} LPA` : "—";
      case "highestPkg":
        return college.placements?.highest ? `₹${college.placements.highest.toFixed(2)} LPA` : "—";
      case "placementPct":
        return college.placements?.percentage ? `${college.placements.percentage}%` : "—";
      case "acceptanceRate":
        return college.quickStats?.acceptance || "—";
      case "campusSize":
        return college.quickStats?.campus || "—";
      case "rating":
        return (
          <div className="flex items-center gap-1">
            <RatingStars rating={college.rating} />
            <span className="font-semibold text-text-primary ml-1">{college.rating.toFixed(1)}</span>
          </div>
        );
      default:
        return "—";
    }
  };

  // Search colleges filter list excluding already compared ones
  const filteredSearchList = collegesList.filter(
    (c) =>
      !compareIds.includes(c.id) &&
      (c.name.toLowerCase().includes(searchVal.toLowerCase()) ||
        c.location.toLowerCase().includes(searchVal.toLowerCase()) ||
        c.type.toLowerCase().includes(searchVal.toLowerCase()))
  );

  return (
    <PageWrapper>
      {/* Header controls */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6 mb-6 mt-2">
        <div className="space-y-1">
          <span className="font-mono text-[9px] text-primary uppercase tracking-widest font-semibold block">
            Comparative Matrix
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-wide text-text-primary">
            Compare Institutions
          </h1>
        </div>

        {mounted && compareIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={handleCopyLink}
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Share Link</span>
            </Button>
            <Button
              onClick={() => {
                clearCompare();
                updateUrlParams([]);
              }}
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
            >
              <span>Reset Matrix</span>
            </Button>
          </div>
        )}
      </section>

      {/* Grid containing comparison panels */}
      <div className="space-y-8">
        {/* 1. Selector Slots bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 border border-border divide-y md:divide-y-0 md:divide-x divide-border bg-surface-100 p-2.5 rounded-[2px]">
          <div className="p-4 flex flex-col justify-center items-start space-y-1">
            <h4 className="font-serif text-sm font-semibold text-text-primary">Choose Candidates</h4>
            <p className="font-sans text-[11px] text-text-secondary leading-relaxed">
              Add up to three different institutions from the search catalog to analyze parameters side-by-side.
            </p>
          </div>

          {[0, 1, 2].map((slotIdx) => {
            const collegeId = compareIds[slotIdx];
            const college = colleges.find((c) => c.id === collegeId);

            return (
              <div key={slotIdx} className="p-4 relative flex flex-col justify-center min-h-[90px]">
                {college ? (
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 text-left">
                      <span className="font-mono text-[8px] text-primary uppercase tracking-widest font-semibold block">
                        Slot 0{slotIdx + 1}
                      </span>
                      <h3 className="font-serif text-xs font-semibold text-text-primary line-clamp-1">
                        {college.name}
                      </h3>
                      <p className="font-sans text-[10px] text-text-secondary">
                        {college.location}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveId(college.id)}
                      className="p-1 border border-border bg-surface-200 text-text-secondary hover:text-destructive hover:border-destructive/20 rounded-[2px] transition-colors"
                      title="Clear slot"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    {activeSlotIdx === slotIdx ? (
                      <div className="space-y-2 z-25">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary" />
                          <Input
                            type="text"
                            placeholder="Type to search..."
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            className="pl-8 py-1.5 pr-8"
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              setActiveSlotIdx(null);
                              setSearchVal("");
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Dropdown list of filtered results */}
                        <div className="absolute left-4 right-4 top-[85px] bg-surface-100 border border-border z-30 max-h-40 overflow-y-auto scrollbar-thin divide-y divide-border rounded-[2px]">
                          {filteredSearchList.length > 0 ? (
                            filteredSearchList.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => handleAddId(item.id)}
                                className="w-full text-left px-3 py-2 text-[11px] text-text-primary hover:bg-surface-200 hover:text-primary transition-colors truncate"
                              >
                                <span className="font-serif font-semibold">{item.name}</span>
                                <span className="font-sans text-[9px] text-text-secondary ml-2">
                                  ({item.location})
                                </span>
                              </button>
                            ))
                          ) : (
                            <div className="p-3 text-center text-[10px] font-mono text-text-secondary">
                              No unmatched colleges found
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveSlotIdx(slotIdx);
                          setSearchVal("");
                        }}
                        className="w-full border border-border border-dashed hover:border-solid hover:border-primary text-text-secondary hover:text-text-primary py-3 rounded-[2px] transition-all flex items-center justify-center gap-1.5 text-xs font-mono tracking-wider"
                      >
                        <Plus className="w-4 h-4 text-primary" />
                        <span>ADD COLLEGE</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* 2. Full Comparison Matrix Table */}
        {mounted && compareIds.length > 0 ? (
          <div className="bg-surface-100 border border-border rounded-[2px] overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-xs font-mono text-text-secondary uppercase tracking-widest animate-pulse">
                Evaluating Matrix Indices...
              </div>
            ) : (
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-surface-200">
                    <th className="p-4 font-mono text-[9px] text-text-secondary uppercase tracking-widest w-1/4">
                      Comparison Metric
                    </th>
                    {[0, 1, 2].map((slotIdx) => {
                      const collegeId = compareIds[slotIdx];
                      const college = colleges.find((c) => c.id === collegeId);
                      return (
                        <th
                          key={slotIdx}
                          className="p-4 font-serif font-bold text-text-primary w-1/4"
                        >
                          {college ? college.name : `Open Slot 0${slotIdx + 1}`}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {COMPARISON_ROWS.map((row) => {
                    const winnerIndex = getWinnerIndex(row.key, colleges);

                    return (
                      <tr key={row.key} className="hover:bg-surface-200 transition-colors duration-150">
                        <td className="p-4 font-mono text-[9px] text-text-secondary uppercase tracking-widest">
                          {row.label}
                        </td>
                        {[0, 1, 2].map((slotIdx) => {
                          const collegeId = compareIds[slotIdx];
                          const college = colleges.find((c) => c.id === collegeId);
                          const isWinner = winnerIndex === slotIdx;

                          return (
                            <td
                              key={slotIdx}
                              className={cn(
                                "p-4 font-sans text-xs transition-all duration-300",
                                college ? "text-text-primary" : "text-text-secondary font-mono tracking-wider italic",
                                isWinner && "bg-primary/5 text-primary border-l-2 border-primary font-semibold"
                              )}
                            >
                              {college ? (
                                <span className={cn(isWinner && "font-mono font-bold text-primary text-[13px]")}>
                                  {getCellContent(row.key, college)}
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-16 border border-border border-dashed bg-surface-100 rounded-[2px] space-y-4">
            <Columns className="w-10 h-10 text-primary" />
            <h3 className="font-serif text-base font-semibold text-text-primary">
              No Candidates Under Comparison
            </h3>
            <p className="font-sans text-xs text-text-secondary max-w-sm leading-relaxed">
              Add multiple institutions using the upper selector slots to generate placement, fee structure, and admissions selectivity matrices.
            </p>
          </div>
        )}

        {/* 3. Save Comparison Sheet Drawer (Behind Auth) */}
        {mounted && compareIds.length >= 2 && (
          <div className="bg-surface-100 border border-border p-6 rounded-[2px] space-y-4 max-w-md">
            <h3 className="font-mono text-[10px] text-primary uppercase tracking-widest font-semibold pb-2 border-b border-border">
              Save Comparison Workspace
            </h3>
            
            <p className="text-[10px] text-text-secondary leading-relaxed font-sans">
              Logged in scholars can archive this matrix. It will be added to your profile panel on the Saved tab.
            </p>

            <form onSubmit={handleSaveComparison} className="flex gap-2 items-end pt-1">
              <div className="space-y-1 flex-grow">
                <label className="font-mono text-[8px] text-text-secondary uppercase tracking-widest block">
                  Sheet Name
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Premium Tech Selection"
                  value={comparisonName}
                  onChange={(e) => setComparisonName(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" variant="primary" className="py-2.5 px-4 shrink-0 font-semibold flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5" />
                <span>Save Sheet</span>
              </Button>
            </form>

            {isSavedNotify && (
              <div className="bg-secondary/10 border border-secondary/20 text-secondary text-[9px] font-mono px-3 py-2 rounded-[2px] leading-relaxed">
                Comparison workspace successfully archived! View details inside your Saved profiles list.
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
export default function ComparePage() {
  return <Suspense fallback={null}><ComparePageContent /></Suspense>
}