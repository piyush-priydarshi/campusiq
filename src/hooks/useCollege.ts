import { useQuery } from "@tanstack/react-query";
import { College } from "@/types/college";

async function fetchCollege(id: string): Promise<College> {
  const res = await fetch(`/api/colleges/${id}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("College not found");
    }
    throw new Error(`Failed to query details for '${id}'`);
  }
  return res.json();
}

export function useCollege(id: string) {
  return useQuery<College>({
    queryKey: ["college", id],
    queryFn: () => fetchCollege(id),
    enabled: !!id,
    retry: 1, // Minimize extra attempts on flat 404 boundaries
  });
}
