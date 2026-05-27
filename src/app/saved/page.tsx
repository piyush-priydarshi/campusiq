"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useSavedStore } from "@/store/savedStore";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { CollegeCard } from "@/components/college/CollegeCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { College } from "@/types/college";
import collegesData from "@/data/colleges.json";
import { Bookmark, Lock, Columns, ArrowRight, Trash2, Calendar, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SavedPage() {
  const [mounted, setMounted] = useState(false);
  
  // ZUSTAND client states
  const { user, openAuthModal } = useAuthStore();
  const { savedColleges, savedComparisons, deleteComparison } = useSavedStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <PageWrapper>
        <div className="p-8 text-center text-xs font-mono text-text-secondary uppercase tracking-widest animate-pulse mt-12">
          Syncing scholar records...
        </div>
      </PageWrapper>
    );
  }

  // 1. Unauthenticated State: Editorial Lock Page
  if (!user) {
    return (
      <PageWrapper>
        <div className="max-w-md mx-auto text-center border border-border border-dashed p-12 bg-surface-100 rounded-[2px] space-y-6 mt-12">
          <div className="w-12 h-12 flex items-center justify-center bg-surface-200 border border-border text-primary mx-auto">
            <Lock className="w-5.5 h-5.5" />
          </div>

          <div className="space-y-2.5">
            <h2 className="font-serif text-lg font-bold text-text-primary tracking-wide">
              Scholarly Vault Secured
            </h2>
            <p className="font-sans text-xs text-text-secondary leading-relaxed">
              Bookmarks, custom search preferences, and comparison sheets are restricted. Establish an active scholar session to view saved records.
            </p>
          </div>

          <Button onClick={openAuthModal} variant="primary" className="px-6 font-semibold py-3">
            Open Access Portal
          </Button>
        </div>
      </PageWrapper>
    );
  }

  // Find bookmarked college details from JSON lists
  const bookmarkedDetails = (collegesData as College[]).filter((c) =>
    savedColleges.includes(c.id)
  );

  return (
    <PageWrapper>
      {/* Header controls */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6 mb-8 mt-2">
        <div className="space-y-1">
          <span className="font-mono text-[9px] text-primary uppercase tracking-widest font-semibold block">
            SCHOLAR WORKSPACE
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-wide text-text-primary">
            Saved Directory
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-surface-100 border border-border px-3.5 py-1.5 rounded-[2px]">
          <UserCheck className="w-3.5 h-3.5 text-secondary" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-secondary">
            Session: <span className="text-text-primary font-bold">{user.email}</span>
          </span>
        </div>
      </section>

      <div className="space-y-10">
        {/* A. Saved Colleges Section */}
        <div className="space-y-4">
          <div className="border-b border-border pb-2.5">
            <h2 className="font-serif text-lg font-bold text-text-primary flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-primary fill-current" />
              <span>Bookmarked Institutions ({bookmarkedDetails.length})</span>
            </h2>
          </div>

          {bookmarkedDetails.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedDetails.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-12 border border-border border-dashed bg-surface-100 rounded-[2px] space-y-4">
              <Bookmark className="w-8 h-8 text-text-secondary" />
              <div className="space-y-1">
                <h3 className="font-serif text-sm font-semibold text-text-primary">
                  Folder is Empty
                </h3>
                <p className="font-sans text-[11px] text-text-secondary max-w-xs leading-normal">
                  Go to the Explore tab to bookmark colleges. They will automatically be compiled inside this workspace.
                </p>
              </div>
              <Link href="/colleges">
                <Button variant="outline" size="sm">
                  Browse Colleges Directory
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* B. Saved Comparison matrices Sheets Section */}
        <div className="space-y-4 pt-4">
          <div className="border-b border-border pb-2.5">
            <h2 className="font-serif text-lg font-bold text-text-primary flex items-center gap-2">
              <Columns className="w-4 h-4 text-secondary" />
              <span>Saved Comparison Folders ({savedComparisons.length})</span>
            </h2>
          </div>

          {savedComparisons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedComparisons.map((item) => {
                // Find names of colleges listed inside comparison folders
                const names = item.collegeIds.map((id) => {
                  const coll = (collegesData as College[]).find((c) => c.id === id);
                  return coll ? coll.name : "Loading Record...";
                });

                return (
                  <div
                    key={item.id}
                    className="bg-surface-100 border border-border p-5 rounded-[2px] flex flex-col justify-between h-44 hover:border-primary transition-all duration-300"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-serif text-sm font-bold text-text-primary truncate">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-1 text-text-secondary font-mono text-[9px] tracking-tight shrink-0">
                          <Calendar className="w-3 h-3" />
                          <span>{item.createdAt}</span>
                        </div>
                      </div>

                      {/* Display colleges tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1 max-h-12 overflow-y-auto">
                        {names.map((name, i) => (
                          <Badge key={i} variant="outline" className="text-[9px]">
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-dashed border-border/80">
                      <button
                        onClick={() => deleteComparison(item.id)}
                        className="flex items-center gap-1.5 font-mono text-[9px] text-destructive hover:text-opacity-80 uppercase tracking-wider transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete Folder</span>
                      </button>

                      <Link href={`/compare?ids=${item.collegeIds.join(",")}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 border-secondary text-text-primary hover:border-secondary-hover hover:bg-surface-200"
                        >
                          <span>Load Sheets</span>
                          <ArrowRight className="w-3.5 h-3.5 text-secondary" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-12 border border-border border-dashed bg-surface-100 rounded-[2px] space-y-4">
              <Columns className="w-8 h-8 text-text-secondary" />
              <div className="space-y-1">
                <h3 className="font-serif text-sm font-semibold text-text-primary">
                  No Saved Sheets
                </h3>
                <p className="font-sans text-[11px] text-text-secondary max-w-xs leading-normal">
                  Create a custom comparative sheet on the Compare tab and select &ldquo;Save Sheet&rdquo; to compile comparison matrices here.
                </p>
              </div>
              <Link href="/compare">
                <Button variant="outline" size="sm">
                  Generate Comparison Matrix
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
