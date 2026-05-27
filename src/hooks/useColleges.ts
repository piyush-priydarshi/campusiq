import { useQuery } from "@tanstack/react-query";
import { CollegeFilters, College } from "@/types/college";

interface FetchCollegesResponse {
  colleges: College[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

async function fetchColleges(filters: CollegeFilters): Promise<FetchCollegesResponse> {
  const params = new URLSearchParams();
  
  if (filters.search) params.set("search", filters.search);
  if (filters.state) params.set("state", filters.state);
  if (filters.type) params.set("type", filters.type);
  if (filters.feeMin !== undefined) params.set("feeMin", filters.feeMin.toString());
  if (filters.feeMax !== undefined) params.set("feeMax", filters.feeMax.toString());
  if (filters.ratingMin !== undefined) params.set("ratingMin", filters.ratingMin.toString());
  if (filters.exam) params.set("exam", filters.exam);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.page !== undefined) params.set("page", filters.page.toString());
  if (filters.limit !== undefined) params.set("limit", filters.limit.toString());
  if (filters.infinite) params.set("infinite", "true");

  const res = await fetch(`/api/colleges?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to query college directory");
  }
  return res.json();
}

export function useColleges(filters: CollegeFilters) {
  return useQuery<FetchCollegesResponse>({
    queryKey: ["colleges", filters],
    queryFn: () => fetchColleges(filters),
    placeholderData: (prev) => prev, // Retains older records during debounced search loadings
  });
}
