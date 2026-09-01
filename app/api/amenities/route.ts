import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Amenity from "@/lib/models/Amenity";
import { apiSuccess, apiError } from "@/lib/utils/api";

export async function GET(_request: NextRequest) {
  try {
    await connectDB();
    const amenities = await Amenity.find({ visible: true })
      .sort({ order: 1, name: 1 })
      .select("name icon description order")
      .lean();
    return apiSuccess({ amenities });
  } catch (error) {
    console.error("[GET /api/amenities]", error);
    return apiError("Internal server error", 500);
  }
}
