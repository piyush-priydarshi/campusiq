"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useColleges } from "@/hooks/useColleges";
import { useUrlSync } from "@/hooks/useUrlSync";
import { useDebounce } from "@/hooks/useDebounce";
import { CollegeFilters } from "@/components/college/CollegeFilters";
import { CollegeCard } from "@/components/college/CollegeCard";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Search, ChevronLeft, ChevronRight, RefreshCw, LayoutGrid, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

function CollegesPageContent(){
  const { getParam, setParam, setMultipleParams } = useUrlSync();
  const searchParams = useSearchParams();

  // Local state for immediate input feedback before debouncing
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);

  // Sync Search state from searchParams on load
  useEffect(() => {
    setSearchInput(searchParams.get("search") || "");
  }, [searchParams]);

  // Sync debounced search back to URL query parameters
  useEffect(() => {
    setParam("search", debouncedSearch);
  }, [debouncedSearch, setParam]);

  // Read URL query parameters to construct filters
  const activeType = getParam("type", "all");
  const activeState = getParam("state", "all");
  const activeExam = getParam("exam", "all");
  const activeRating = getParam("ratingMin", "0");
  const feeMin = parseInt(getParam("feeMin", "0"));
  const feeMax = parseInt(getParam("feeMax", "3500000"));
  const sortBy = getParam("sortBy", "rating") as any;
  const currentPage = parseInt(getParam("page", "1"));
  
  // Custom interface modes: Traditional Pagination vs Infinite Scroll
  const [isInfiniteMode, setIsInfiniteMode] = useState(false);
  const [infiniteLimit, setInfiniteLimit] = useState(25);

  // Construct filters payload for React Query hook
  const filters = {
    search: debouncedSearch,
    type: activeType,
    state: activeState,
    exam: activeExam,
    ratingMin: parseFloat(activeRating),
    feeMin,
    feeMax,
    sortBy,
    page: isInfiniteMode ? 1 : currentPage,
    limit: isInfiniteMode ? infiniteLimit : 25,
    infinite: isInfiniteMode,
  };

  const { data, isLoading, isError, refetch } = useColleges(filters);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (data && newPage > data.totalPages)) return;
    setParam("page", newPage.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoadMore = () => {
    setInfiniteLimit((prev) => prev + 25);
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setMultipleParams({
      type: "all",
      state: "all",
      exam: "all",
      ratingMin: "0",
      feeMin: "0",
      feeMax: "3500000",
      search: null,
      page: null,
    });
  };

  return (
    <PageWrapper>
      {/* Search and Mode Bar Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6 mb-6 mt-2">
        <div className="space-y-1">
          <span className="font-mono text-[9px] text-primary uppercase tracking-widest font-semibold block">
            Discovery Engine
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-wide text-text-primary">
            College Directory
          </h1>
        </div>

        {/* Traditional Search Box and Toggles */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Main Search Input */}
          <div className="relative flex-grow md:w-64 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search directory..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-surface-100 border border-border pl-10 pr-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary rounded-[2px]"
            />
          </div>

          {/* Mode Toggles */}
          <div className="flex bg-surface-100 border border-border p-1 rounded-[2px] text-[10px] font-mono tracking-wider font-semibold">
            <button
              onClick={() => {
                setIsInfiniteMode(false);
                setParam("page", "1");
              }}
              className={cn(
                "px-3 py-1.5 uppercase rounded-[2px] transition-all",
                !isInfiniteMode ? "bg-primary text-background" : "text-text-secondary hover:text-text-primary"
              )}
            >
              Pages
            </button>
            <button
              onClick={() => {
                setIsInfiniteMode(true);
                setInfiniteLimit(25);
              }}
              className={cn(
                "px-3 py-1.5 uppercase rounded-[2px] transition-all",
                isInfiniteMode ? "bg-primary text-background" : "text-text-secondary hover:text-text-primary"
              )}
            >
              Scroll
            </button>
          </div>
        </div>
      </section>

      {/* Main Layout Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Filter panel */}
        <aside className="lg:col-span-3">
          <CollegeFilters />
        </aside>

        {/* Right Column: Grid and Listing */}
        <section className="lg:col-span-9 space-y-6">
          {/* Grid Toolbar: Active counts and sorting options */}
          <div className="flex justify-between items-center bg-surface-100 border border-border px-4 py-3 rounded-[2px]">
            <span className="font-mono text-[10px] text-text-secondary uppercase tracking-widest font-medium">
              INDEX: {data?.total !== undefined ? `${data.total} records` : "Retrieving records..."}
            </span>

            {/* Sorting Select */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] text-text-secondary uppercase tracking-widest hidden sm:inline">
                Sort Order:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setParam("sortBy", e.target.value)}
                className="bg-surface-200 border border-border px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-primary rounded-[2px] font-mono tracking-wide"
              >
                <option value="rating">Rating (Desc)</option>
                <option value="fees_asc">Fees (Low &rarr; High)</option>
                <option value="fees_desc">Fees (High &rarr; Low)</option>
                <option value="established">Established Year</option>
              </select>
            </div>
          </div>

          {/* Loading Skeletons */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Connection Error */}
          {isError && (
            <ErrorState onRetry={refetch} />
          )}

          {/* Listing Grid */}
          {!isLoading && !isError && data && (
            <>
              {data.colleges.length === 0 ? (
                <EmptyState onReset={handleResetFilters} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.colleges.map((college) => (
                    <CollegeCard key={college.id} college={college} />
                  ))}
                </div>
              )}

              {/* Traditional Pagination Controls */}
              {!isInfiniteMode && data.totalPages > 1 && (
                <div className="flex justify-between items-center border-t border-border pt-6 mt-4">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 font-semibold"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </Button>

                  <div className="flex items-center gap-1 font-mono text-xs">
                    {[...Array(data.totalPages)].map((_, idx) => {
                      const pNum = idx + 1;
                      const isCurrent = currentPage === pNum;
                      return (
                        <button
                          key={pNum}
                          onClick={() => handlePageChange(pNum)}
                          className={cn(
                            "w-7 h-7 flex items-center justify-center rounded-[2px] transition-all",
                            isCurrent
                              ? "bg-primary text-background font-semibold"
                              : "bg-surface-100 border border-border text-text-secondary hover:text-text-primary"
                          )}
                        >
                          {pNum}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === data.totalPages}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 font-semibold"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}

              {/* Scroll / Load More Controls */}
              {isInfiniteMode && data.hasMore && (
                <div className="flex justify-center border-t border-border pt-6 mt-4">
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    className="w-full max-w-xs font-semibold py-3 border-dashed hover:border-solid group hover:border-primary"
                  >
                    <span>Load More Records</span>
                    <RefreshCw className="w-3.5 h-3.5 ml-2 transition-transform group-hover:rotate-45" />
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </PageWrapper>
  );
}
export default function CollegesPage() {
  return <Suspense fallback={null}><CollegesPageContent /></Suspense>
}