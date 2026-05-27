import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useUrlSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getParam = useCallback(
    (name: string, defaultValue: string = "") => {
      return searchParams.get(name) || defaultValue;
    },
    [searchParams]
  );

  const setParam = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "" || value === "all") {
        params.delete(name);
      } else {
        params.set(name, value);
      }

      // Reset to page 1 if changing query parameters other than the page itself
      if (name !== "page" && params.has("page")) {
        params.delete("page");
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const setMultipleParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      Object.entries(updates).forEach(([name, value]) => {
        if (value === null || value === "" || value === "all") {
          params.delete(name);
        } else {
          params.set(name, value);
        }
      });

      // Reset to page 1 if updating filters
      const hasFilterUpdate = Object.keys(updates).some((key) => key !== "page");
      if (hasFilterUpdate && params.has("page")) {
        params.delete("page");
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return {
    getParam,
    setParam,
    setMultipleParams,
    searchParams,
  };
}
