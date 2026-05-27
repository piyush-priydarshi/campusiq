import { NextResponse } from "next/server";
import collegesData from "@/data/colleges.json";
import { College } from "@/types/college";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsString = searchParams.get("ids") || "";

    if (!idsString) {
      return NextResponse.json([]);
    }

    const ids = idsString.split(",").map((id) => id.trim().toLowerCase());
    const colleges = (collegesData as College[]).filter((c) =>
      ids.includes(c.id.toLowerCase())
    );

    return NextResponse.json(colleges);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch comparison colleges", details: error.message },
      { status: 500 }
    );
  }
}
