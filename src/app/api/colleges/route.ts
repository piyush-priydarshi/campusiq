import { NextResponse } from "next/server";
import collegesData from "@/data/colleges.json";
import { College } from "@/types/college";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const state = searchParams.get("state") || "";
    const type = searchParams.get("type") || "";
    const feeMin = parseInt(searchParams.get("feeMin") || "0");
    const feeMax = parseInt(searchParams.get("feeMax") || "99999999");
    const ratingMin = parseFloat(searchParams.get("ratingMin") || "0");
    const exam = searchParams.get("exam") || "";
    const sortBy = searchParams.get("sortBy") || "rating";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const infinite = searchParams.get("infinite") === "true";

    let filtered = [...collegesData] as College[];

    // 1. Search Query
    if (search) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.location.toLowerCase().includes(search) ||
          c.about.toLowerCase().includes(search) ||
          c.accreditations.some((a) => a.toLowerCase().includes(search))
      );
    }

    // 2. State Filter
    if (state && state !== "all") {
      filtered = filtered.filter(
        (c) => c.state.toLowerCase() === state.toLowerCase()
      );
    }

    // 3. Type / Stream Filter
    if (type && type !== "all") {
      filtered = filtered.filter(
        (c) => c.type.toLowerCase() === type.toLowerCase()
      );
    }

    // 4. Rating Filter
    if (ratingMin > 0) {
      filtered = filtered.filter((c) => c.rating >= ratingMin);
    }

    // 5. Entrance Exam Filter
    if (exam && exam !== "all") {
      filtered = filtered.filter((c) =>
        c.entranceExams.some((e) => e.toLowerCase() === exam.toLowerCase())
      );
    }

    // 6. Fee Range Filter (At least one course fee is within range)
    if (feeMin > 0 || feeMax < 99999999) {
      filtered = filtered.filter((c) =>
        c.courses.some((course) => course.totalFees >= feeMin && course.totalFees <= feeMax)
      );
    }

    // 7. Sorting
    filtered.sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      if (sortBy === "established") {
        return a.established - b.established;
      }
      if (sortBy === "fees_asc" || sortBy === "fees_desc") {
        const getMinFee = (c: College) =>
          c.courses.length > 0
            ? Math.min(...c.courses.map((course) => course.totalFees))
            : 0;

        const feeA = getMinFee(a);
        const feeB = getMinFee(b);

        return sortBy === "fees_asc" ? feeA - feeB : feeB - feeA;
      }
      return 0;
    });

    // 8. Pagination logic
    const total = filtered.length;
    let paginated = filtered;
    
    if (!infinite) {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      paginated = filtered.slice(startIndex, endIndex);
    }

    return NextResponse.json({
      colleges: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: !infinite ? page * limit < total : false,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch colleges data", details: error.message },
      { status: 500 }
    );
  }
}
