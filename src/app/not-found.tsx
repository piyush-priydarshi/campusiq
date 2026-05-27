import React from "react";
import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Compass, HelpCircle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <PageWrapper>
      <div className="max-w-md mx-auto text-center border border-border border-dashed p-12 bg-surface-100 rounded-[2px] space-y-6 mt-16">
        <div className="w-12 h-12 flex items-center justify-center bg-surface-200 border border-border text-primary mx-auto">
          <HelpCircle className="w-5.5 h-5.5" />
        </div>

        <div className="space-y-3">
          <span className="font-mono text-[9px] text-destructive uppercase tracking-widest font-semibold block">
            INDEX SEARCH OVERFLOW [404]
          </span>
          <h2 className="font-serif text-2xl font-bold text-text-primary tracking-wide leading-tight">
            Record Out of Bounds
          </h2>
          <p className="font-sans text-xs text-text-secondary leading-relaxed">
            The database page or index record you requested does not exist or has been archived. Confirm URL coordinates or return to the main index.
          </p>
        </div>

        {/* Monospace coordinates details */}
        <div className="bg-surface-200 border border-border px-4 py-2.5 rounded-[2px] font-mono text-[9px] text-text-secondary uppercase tracking-widest select-none">
          status: overflow | ref: undefined
        </div>

        <Link href="/" className="inline-block mt-2">
          <Button variant="primary" className="px-6 font-semibold py-3 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Return to Directory</span>
          </Button>
        </Link>
      </div>
    </PageWrapper>
  );
}
