"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Compass, Columns, Bookmark, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCompareStore } from "@/store/compareStore";
import { useSavedStore } from "@/store/savedStore";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function NavbarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, logout, openAuthModal } = useAuthStore();
  const compareIds = useCompareStore((state) => state.compareIds);
  const savedColleges = useSavedStore((state) => state.savedColleges);

  useEffect(() => {
    setMounted(true);
    setSearchVal(searchParams.get("search") || "");

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      router.push("/colleges");
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b",
        isScrolled
          ? "bg-background/95 backdrop-blur-md py-3.5 border-border"
          : "bg-transparent py-5 border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Logo Left */}
        <Link href="/" className="flex items-center group">
          <span className="font-serif text-lg md:text-xl font-bold tracking-widest text-text-primary">
            CAMPUS<span className="text-primary transition-colors duration-300 group-hover:text-primary-hover">IQ</span>
          </span>
        </Link>

        {/* Center Search bar */}
        <form
          onSubmit={handleSearchSubmit}
          className={cn(
            "hidden sm:flex items-center bg-surface-100 border border-border px-3.5 py-1.5 transition-all duration-300 rounded-[2px]",
            isFocused ? "w-80 border-primary" : "w-48 border-border"
          )}
        >
          <Search className="w-3.5 h-3.5 text-text-secondary mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search colleges..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-secondary focus:outline-none font-sans"
          />
        </form>

        {/* Right Menu */}
        <nav className="flex items-center gap-1.5 md:gap-3">
          <Link href="/colleges">
            <Button variant="ghost" size="sm" className="hidden md:inline-flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Explore</span>
            </Button>
          </Link>

          {/* Comparison Link */}
          <Link href="/compare">
            <Button
              variant="ghost"
              size="sm"
              className="relative inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Compare</span>
              {mounted && compareIds.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-secondary font-mono text-[9px] font-semibold text-text-primary rounded-[2px]">
                  {compareIds.length}
                </span>
              )}
            </Button>
          </Link>

          {/* Saved Link */}
          <Link href="/saved">
            <Button
              variant="ghost"
              size="sm"
              className="relative inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Saved</span>
              {mounted && savedColleges.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-primary font-mono text-[9px] font-semibold text-background rounded-[2px]">
                  {savedColleges.length}
                </span>
              )}
            </Button>
          </Link>

          {/* Divider */}
          <span className="h-4 w-px bg-border hidden sm:inline" />

          {/* Auth State Button */}
          {mounted && user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-surface-200 border border-border px-3 py-1.5 rounded-[2px]">
                <User className="w-3 h-3 text-primary" />
                <span className="font-mono text-[10px] text-text-primary tracking-wide hidden lg:inline max-w-[80px] truncate">
                  {user.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-destructive hover:bg-destructive/10 px-2 py-1.5"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={openAuthModal}
              className="inline-flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login</span>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
}