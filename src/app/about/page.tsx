"use client";

import React from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { GraduationCap, Award, Compass, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <PageWrapper>
      {/* Editorial Header */}
      <section className="border-b border-border pb-8 mb-10 text-center md:text-left mt-2">
        <span className="font-mono text-[9px] text-primary uppercase tracking-widest font-semibold block mb-1">
          PUBLICATION RATIONALE
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-text-primary leading-tight max-w-2xl">
          The CAMPUSIQ Index
        </h1>
        <p className="font-sans text-xs text-text-secondary mt-3 max-w-md leading-relaxed">
          An independent exploration journal and quantitative audit compiling academic placements, admission selectivity, and institutional fee structures across major Indian centers.
        </p>
      </section>

      {/* Spacious 2-Column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Article Narrative */}
        <article className="lg:col-span-8 space-y-6 font-sans text-xs text-text-secondary leading-relaxed">
          <p className="font-serif text-sm font-semibold text-text-primary leading-relaxed">
            Selecting higher education should not be an exercise in navigating marketing noise.
          </p>

          <p>
            In the modern education market, university catalogs are frequently bloated with hyperbolic claims and vague statistics. CAMPUSIQ was established to counter this complexity, inspired by the direct and dense information grids of classic financial journalism (like Bloomberg Businessweek).
          </p>

          <p>
            We compile verified, granular parameters for 50 elite Indian campuses—spanning technical engineering hubs (IITs, BITS), business schools (IIMs), legal institutions (NLSIU), clinical schools (AIIMS), and liberal arts environments (Ashoka, Azim Premji).
          </p>

          {/* Dotted border quote block */}
          <div className="border-y border-dashed border-border py-6 my-8 space-y-2 pl-4 border-l-2 border-l-primary/60">
            <h3 className="font-serif text-sm font-bold text-text-primary italic">
              {"\"Data is secondary to context. By contrasting real seat counts with verified package progressions, candidates acquire deep agency.\""}
            </h3>
            <span className="font-mono text-[9px] text-text-secondary uppercase tracking-wider block">
              — Editorial Board Review, 2026
            </span>
          </div>

          <h2 className="font-serif text-base font-bold text-text-primary pt-2">
            Independent Verification Standards
          </h2>

          <p>
            Each institutional audit listed in our catalog features detailed breakdowns of:
          </p>
          <ul className="list-disc pl-4 space-y-2 text-[11px]">
            <li>
              <strong>Admission Selectivity Index:</strong> Verified acceptance percentages drawn from test entries divided by absolute seat quotas.
            </li>
            <li>
              <strong>Placements Progressions:</strong> Multi-year comparison curves tracking median placements rather than selective averages.
            </li>
            <li>
              <strong>Student Audits:</strong> User reviews partitioned across academics, hostel accommodations, social spheres, and structural facilities.
            </li>
          </ul>
        </article>

        {/* Right: Key Rationale Metrics Panel */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-surface-100 border border-border p-6 rounded-[2px] space-y-4">
            <h3 className="font-mono text-[10px] text-primary uppercase tracking-widest font-semibold pb-2 border-b border-border">
              Core Principles
            </h3>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="p-2 bg-surface-200 border border-border text-primary rounded-[2px] shrink-0 h-8 w-8 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-serif text-xs font-bold text-text-primary">
                    Selectivity Focus
                  </h4>
                  <p className="font-sans text-[10px] text-text-secondary leading-normal">
                    Admissions ratios are measured accurately, highlighting highly selective gates.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-surface-200 border border-border text-primary rounded-[2px] shrink-0 h-8 w-8 flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-serif text-xs font-bold text-text-primary">
                    Granular Comparison
                  </h4>
                  <p className="font-sans text-[10px] text-text-secondary leading-normal">
                    Matrices analyze 10+ strict rows, highlighting winning values mathematically.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-surface-200 border border-border text-primary rounded-[2px] shrink-0 h-8 w-8 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-serif text-xs font-bold text-text-primary">
                    Verified Audits
                  </h4>
                  <p className="font-sans text-[10px] text-text-secondary leading-normal">
                    Reviews catalog student batch years, categories, and direct helpful reviews votes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </PageWrapper>
  );
}
