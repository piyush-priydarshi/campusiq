import { NextResponse } from "next/server";
import collegesData from "@/data/colleges.json";
import { College } from "@/types/college";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const college = (collegesData as College[]).find(
      (c) => c.id.toLowerCase() === id.toLowerCase() || c.slug.toLowerCase() === id.toLowerCase()
    );

    if (!college) {
      return NextResponse.json(
        { error: `College with ID or slug '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(college);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch college details", details: error.message },
      { status: 500 }
    );
  }
}
