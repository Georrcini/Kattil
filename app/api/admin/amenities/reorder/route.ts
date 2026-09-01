import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Amenity from "@/lib/models/Amenity";
import { apiSuccess, apiError } from "@/lib/utils/api";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { items } = await request.json() as { items: Array<{ id: string; order: number }> };
    if (!Array.isArray(items)) return apiError("items must be an array", 400);

    await Promise.all(
      items.map(({ id, order }) => Amenity.findByIdAndUpdate(id, { order }))
    );

    return apiSuccess({ reordered: items.length });
  } catch (error) {
    console.error("[POST /api/admin/amenities/reorder]", error);
    return apiError("Internal server error", 500);
  }
}
