export interface Course {
  name: string;
  duration: string;
  totalFees: number;
  seats: number;
  exam: string;
  popular: boolean;
}

export interface YearwisePlacement {
  year: number;
  avg: number; // In LPA
  highest: number; // In LPA
}

export interface Placements {
  avg: number; // In LPA
  highest: number; // In LPA
  percentage: number;
  topRecruiters: string[];
  yearwise: YearwisePlacement[];
}

export interface ReviewCategories {
  academics: number;
  accommodation: number;
  placements: number;
  infrastructure: number;
  social: number;
}

export interface Review {
  author: string;
  course: string;
  batch: string;
  rating: number;
  categories: ReviewCategories;
  text: string;
  helpful: number;
}

export interface QuickStats {
  rank: number;
  acceptance: string;
  students: string;
  campus: string;
}

export interface College {
  id: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  city: string;
  type: "Engineering" | "Medical" | "Arts" | "Commerce" | "Law" | "Management" | "Design";
  established: number;
  nirfRank: number;
  rating: number;
  reviewCount: number;
  acceptanceRate: number; // numerical %
  totalStudents: number;
  campusSize: number; // in acres
  about: string;
  accreditations: string[];
  entranceExams: string[];
  courses: Course[];
  placements: Placements;
  reviews: Review[];
  quickStats: QuickStats;
}

export interface CollegeFilters {
  search?: string;
  state?: string;
  type?: string;
  feeMin?: number;
  feeMax?: number;
  ratingMin?: number;
  exam?: string;
  sortBy?: "rating" | "fees_asc" | "fees_desc" | "established";
  page?: number;
  limit?: number;
  infinite?: boolean;
}
