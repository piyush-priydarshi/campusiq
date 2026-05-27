import React from "react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border mt-auto pt-16 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 pb-12">
          {/* Logo and About */}
          <div className="space-y-4 md:col-span-2">
            <span className="font-serif text-lg font-bold tracking-widest text-text-primary">
              CAMPUS<span className="text-primary font-bold">IQ</span>
            </span>
            <p className="text-text-secondary text-xs leading-relaxed max-w-sm">
              An authoritative discovery engine and placement index designed for higher education candidates in India. Engineered to deliver premium comparative insight with clean tabular clarity.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] text-primary tracking-widest uppercase font-semibold">
              Directory
            </h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li>
                <Link href="/colleges" className="hover:text-text-primary transition-colors">
                  All Colleges
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-text-primary transition-colors">
                  Comparison Matrix
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-text-primary transition-colors">
                  About Platform
                </Link>
              </li>
            </ul>
          </div>

          {/* streams */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] text-primary tracking-widest uppercase font-semibold">
              Streams Covered
            </h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li>
                <Link href="/colleges?type=engineering" className="hover:text-text-primary transition-colors">
                  Engineering Sciences
                </Link>
              </li>
              <li>
                <Link href="/colleges?type=medical" className="hover:text-text-primary transition-colors">
                  Medical & Clinical
                </Link>
              </li>
              <li>
                <Link href="/colleges?type=law" className="hover:text-text-primary transition-colors">
                  Legal Studies
                </Link>
              </li>
              <li>
                <Link href="/colleges?type=management" className="hover:text-text-primary transition-colors">
                  Business Management
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Dashed Line Divider */}
        <div className="border-t border-dashed border-border my-6" />

        {/* copyright and legal */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-text-secondary">
          <span>&copy; {currentYear} CAMPUSIQ Index. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-text-primary transition-colors">
              Terms of Index
            </a>
            <a href="#" className="hover:text-text-primary transition-colors">
              Data Licensing
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
