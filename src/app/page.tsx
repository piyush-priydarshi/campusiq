"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, GraduationCap, ChevronRight, Award, Flame, Users, BookOpen } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { CollegeCard } from "@/components/college/CollegeCard";
import { Button } from "@/components/ui/Button";
import collegesData from "@/data/colleges.json";
import { College } from "@/types/college";

const POPULAR_SEARCHES = [
  { label: "IITs", query: "IIT" },
  { label: "Medical", query: "NEET" },
  { label: "Law", query: "CLAT" },
  { label: "MBA", query: "CAT" },
  { label: "Design", query: "Design" },
];

const CATEGORIES = [
  { name: "Engineering", count: "7 Colleges", slug: "Engineering", desc: "Technical & structural sciences" },
  { name: "Medical", count: "3 Colleges", slug: "Medical", desc: "Clinical practice & research" },
  { name: "Law", count: "3 Colleges", slug: "Law", desc: "Jurisprudence & legal affairs" },
  { name: "Management", count: "4 Colleges", slug: "Management", desc: "Strategic business management" },
  { name: "Design", count: "3 Colleges", slug: "Design", desc: "Aesthetics & interface craft" },
  { name: "Arts", count: "5 Colleges", slug: "Arts", desc: "Humanities & liberal education" },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredColleges, setFeaturedColleges] = useState<College[]>([]);

  useEffect(() => {
    // Select specific 6 elite colleges for featured showcase
    const selectedIds = ["iit-madras", "aiims-delhi", "nlsiu-bangalore", "iim-ahmedabad", "bits-pilani", "nid-ahmedabad"];
    const filtered = (collegesData as College[]).filter((c) => selectedIds.includes(c.id));
    setFeaturedColleges(filtered);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/colleges");
    }
  };

  const handlePopularClick = (query: string) => {
    router.push(`/colleges?search=${encodeURIComponent(query)}`);
  };

  return (
    <PageWrapper>
      {/* 1. Hero Section with CSS Film Grain */}
      <section className="grain-bg border border-border p-8 md:p-16 text-center space-y-8 rounded-[2px] mt-2 relative overflow-hidden">
        {/* Subtle grid border background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2520_1px,transparent_1px),linear-gradient(to_bottom,#2a2520_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="space-y-4 max-w-3xl mx-auto z-10 relative">
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-tight">
            Find Your College.<br />
            <span className="text-primary italic">Own Your Future.</span>
          </h1>
          <p className="font-sans text-xs md:text-sm text-text-secondary max-w-lg mx-auto leading-relaxed">
            An authoritative, data-dense exploration platform for premium educational institutions in India. Contrast placements, fees, and real student audits.
          </p>
        </div>

        {/* Large Centered Search Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex gap-2 z-10 relative">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search by name, city, state, or course stream..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-100 border border-border pl-11 pr-4 py-3 text-xs md:text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary rounded-[2px]"
            />
          </div>
          <Button type="submit" variant="primary" className="px-6 font-semibold shrink-0">
            Search
          </Button>
        </form>

        {/* Popular Searches */}
        <div className="flex flex-wrap justify-center items-center gap-2.5 z-10 relative">
          <span className="font-mono text-[9px] text-text-secondary uppercase tracking-widest mr-1">
            Trending Searches:
          </span>
          {POPULAR_SEARCHES.map((pill) => (
            <button
              key={pill.label}
              onClick={() => handlePopularClick(pill.query)}
              className="font-mono text-[9px] uppercase tracking-wider text-text-secondary border border-border px-3 py-1 bg-surface-200 hover:text-primary hover:border-primary transition-all rounded-[2px]"
            >
              {pill.label}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Bloomberg-Style Monospace Stats Bar */}
      <section className="bg-surface-100 border border-border my-6 py-4 text-center rounded-[2px]">
        <p className="font-mono text-[9px] md:text-xs text-primary font-medium tracking-[0.18em] uppercase flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
          <span>25,000+ Verified Audits</span>
          <span className="text-border hidden sm:inline">•</span>
          <span>500+ Indian Colleges Listed</span>
          <span className="text-border hidden sm:inline">•</span>
          <span>50+ Accepted Entrance Exams</span>
        </p>
      </section>

      {/* 3. Featured Colleges Section */}
      <section className="space-y-6 py-6">
        <div className="flex justify-between items-end border-b border-border pb-3.5">
          <div className="space-y-1">
            <span className="font-mono text-[9px] text-primary uppercase tracking-widest font-semibold block">
              Audited Records
            </span>
            <h2 className="font-serif text-xl md:text-2xl font-bold tracking-wide text-text-primary">
              Elite Showcases
            </h2>
          </div>
          <Link href="/colleges">
            <Button variant="ghost" size="sm" className="group text-primary hover:text-primary-hover font-semibold pr-0">
              <span>View All Records</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Listing Grid (scrollable horizontal scroll on mobile viewports) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto pb-4 scrollbar-thin md:overflow-visible">
          {featuredColleges.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      </section>

      {/* 4. Categories Stream Section */}
      <section className="space-y-6 py-6">
        <div className="border-b border-border pb-3.5">
          <span className="font-mono text-[9px] text-primary uppercase tracking-widest font-semibold block">
            Segment Indexes
          </span>
          <h2 className="font-serif text-xl md:text-2xl font-bold tracking-wide text-text-primary">
            Explore by Stream
          </h2>
        </div>

        {/* Large bordered editorial tiles */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/colleges?type=${cat.slug}`}
              className="group bg-surface-100 border border-border hover:border-primary p-4 flex flex-col justify-between h-36 transition-all duration-300 rounded-[2px]"
            >
              <div className="space-y-1">
                <h3 className="font-serif text-sm font-semibold text-text-primary group-hover:text-primary transition-colors leading-tight">
                  {cat.name}
                </h3>
                <p className="font-sans text-[10px] text-text-secondary group-hover:text-text-primary transition-colors duration-300 leading-normal">
                  {cat.desc}
                </p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="font-mono text-[9px] text-text-secondary tracking-tight">
                  {cat.count}
                </span>
                <span className="font-mono text-[9px] text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  GO &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
