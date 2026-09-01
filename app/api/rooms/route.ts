import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Room from "@/lib/models/Room";
import City from "@/lib/models/City";
import { apiSuccess, apiError } from "@/lib/utils/api";

export async function GET(_request: NextRequest) {
  try {
    await connectDB();

    const cities = await City.find({ active: true }).sort({ order: 1 }).lean();
    const rooms = await Room.find({ status: "active" })
      .sort({ order: 1 })
      .populate("city", "name slug")
      .lean();

    // Group rooms by city slug
    const grouped: Record<string, typeof rooms> = {};
    for (const city of cities) {
      grouped[city.slug] = rooms.filter(
        (r) => r.city && (r.city as unknown as { slug: string }).slug === city.slug
      );
    }

    return apiSuccess({ cities, grouped });
  } catch (error) {
    console.error("[GET /api/rooms]", error);
    return apiError("Internal server error", 500);
  }
}
