import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Gallery from "@/lib/models/Gallery";
import { apiSuccess, apiError } from "@/lib/utils/api";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = request.nextUrl;
    const categoryFilter = searchParams.get("category") ?? "";

    const filter: Record<string, unknown> = {};
    if (categoryFilter) filter.category = categoryFilter;

    const items = await Gallery.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .populate("city", "name slug")
      .lean();

    return apiSuccess(items);
  } catch (error) {
    console.error("[GET /api/gallery]", error);
    return apiError("Failed to fetch gallery", 500);
  }
}
