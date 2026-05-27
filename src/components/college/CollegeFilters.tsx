"use client";

import React from "react";
import { X, SlidersHorizontal, Trash2 } from "lucide-react";
import { useUrlSync } from "@/hooks/useUrlSync";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const STREAMS = [
  { id: "all", label: "All Streams" },
  { id: "Engineering", label: "Engineering" },
  { id: "Medical", label: "Medical" },
  { id: "Arts", label: "Arts & Humanities" },
  { id: "Commerce", label: "Commerce" },
  { id: "Law", label: "Law" },
  { id: "Management", label: "Management" },
  { id: "Design", label: "Design" },
];

const STATES = [
  { id: "all", label: "All States" },
  { id: "Maharashtra", label: "Maharashtra" },
  { id: "Delhi", label: "Delhi" },
  { id: "Tamil Nadu", label: "Tamil Nadu" },
  { id: "Karnataka", label: "Karnataka" },
  { id: "Rajasthan", label: "Rajasthan" },
  { id: "Gujarat", label: "Gujarat" },
  { id: "Haryana", label: "Haryana" },
  { id: "Uttar Pradesh", label: "Uttar Pradesh" },
];

const EXAMS = [
  { id: "all", label: "All Exams" },
  { id: "JEE Advanced", label: "JEE Advanced" },
  { id: "JEE Main", label: "JEE Main" },
  { id: "BITSAT", label: "BITSAT" },
  { id: "NEET UG", label: "NEET UG" },
  { id: "CLAT", label: "CLAT" },
  { id: "CAT", label: "CAT" },
  { id: "SNAP", label: "SNAP" },
  { id: "CUET", label: "CUET" },
  { id: "NID DAT", label: "NID DAT" },
];

const RATINGS = [
  { id: "0", label: "All Ratings" },
  { id: "4.0", label: "4.0★ & Above" },
  { id: "4.5", label: "4.5★ & Above" },
  { id: "4.8", label: "4.8★ & Above" },
];

export function CollegeFilters() {
  const { getParam, setParam, setMultipleParams } = useUrlSync();

  const activeType = getParam("type", "all");
  const activeState = getParam("state", "all");
  const activeExam = getParam("exam", "all");
  const activeRating = getParam("ratingMin", "0");
  const feeMin = parseInt(getParam("feeMin", "0"));
  const feeMax = parseInt(getParam("feeMax", "3500000"));

  const handleReset = () => {
    setMultipleParams({
      type: "all",
      state: "all",
      exam: "all",
      ratingMin: "0",
      feeMin: "0",
      feeMax: "3500000",
      search: null,
    });
  };

  const handleTypeSelect = (typeId: string) => {
    setParam("type", typeId);
  };

  const handleSliderChange = (vals: [number, number]) => {
    setMultipleParams({
      feeMin: vals[0].toString(),
      feeMax: vals[1].toString(),
    });
  };

  const isAnyFilterActive =
    activeType !== "all" ||
    activeState !== "all" ||
    activeExam !== "all" ||
    activeRating !== "0" ||
    feeMin > 0 ||
    feeMax < 3500000;

  return (
    <div className="space-y-6 w-full lg:sticky lg:top-24 max-h-[85vh] overflow-y-auto pr-2 scrollbar-thin">
      {/* Header controls */}
      <div className="flex justify-between items-center pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            Filter Controls
          </h2>
        </div>
        {isAnyFilterActive && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 font-mono text-[9px] text-destructive hover:text-opacity-80 uppercase tracking-wider transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Streams list */}
      <div className="space-y-2.5">
        <h3 className="font-mono text-[10px] text-text-secondary uppercase tracking-widest font-semibold">
          Streams
        </h3>
        <div className="flex flex-wrap lg:flex-col gap-1.5">
          {STREAMS.map((s) => {
            const isSelected = activeType.toLowerCase() === s.id.toLowerCase();
            return (
              <button
                key={s.id}
                onClick={() => handleTypeSelect(s.id)}
                className={cn(
                  "px-3 py-1.5 text-left text-xs transition-all duration-200 border rounded-[2px]",
                  isSelected
                    ? "bg-primary text-background border-primary font-semibold"
                    : "bg-surface-100 text-text-secondary border-border hover:text-text-primary hover:border-border-accent"
                )}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fee Slider Range */}
      <div className="space-y-3.5">
        <h3 className="font-mono text-[10px] text-text-secondary uppercase tracking-widest font-semibold">
          Total Fee Threshold
        </h3>
        <div className="bg-surface-100 border border-border p-4 rounded-[2px]">
          <Slider
            min={0}
            max={3500000}
            step={50000}
            value={[feeMin, feeMax]}
            onChange={handleSliderChange}
          />
        </div>
      </div>

      {/* State Filter dropdown */}
      <div className="space-y-2.5">
        <h3 className="font-mono text-[10px] text-text-secondary uppercase tracking-widest font-semibold">
          State Region
        </h3>
        <select
          value={activeState}
          onChange={(e) => setParam("state", e.target.value)}
          className="w-full bg-surface-100 border border-border px-3.5 py-2.5 text-xs text-text-primary focus:outline-none focus:border-primary rounded-[2px] font-sans"
        >
          {STATES.map((st) => (
            <option key={st.id} value={st.id}>
              {st.label}
            </option>
          ))}
        </select>
      </div>

      {/* Exam Filter Dropdown */}
      <div className="space-y-2.5">
        <h3 className="font-mono text-[10px] text-text-secondary uppercase tracking-widest font-semibold">
          Accepted Entrance Exam
        </h3>
        <select
          value={activeExam}
          onChange={(e) => setParam("exam", e.target.value)}
          className="w-full bg-surface-100 border border-border px-3.5 py-2.5 text-xs text-text-primary focus:outline-none focus:border-primary rounded-[2px] font-sans"
        >
          {EXAMS.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.label}
            </option>
          ))}
        </select>
      </div>

      {/* Rating Filters */}
      <div className="space-y-2.5">
        <h3 className="font-mono text-[10px] text-text-secondary uppercase tracking-widest font-semibold">
          Minimum Rating
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          {RATINGS.map((rt) => {
            const isSelected = activeRating === rt.id;
            return (
              <button
                key={rt.id}
                onClick={() => setParam("ratingMin", rt.id)}
                className={cn(
                  "px-2.5 py-2 text-center text-xs transition-all duration-200 border rounded-[2px] font-mono",
                  isSelected
                    ? "bg-secondary text-text-primary border-secondary font-semibold"
                    : "bg-surface-100 text-text-secondary border-border hover:text-text-primary hover:border-border-accent"
                )}
              >
                {rt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
