import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Room from "@/lib/models/Room";
import City from "@/lib/models/City";
import { apiSuccess, apiError } from "@/lib/utils/api";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = request.nextUrl;
    const cityParam = searchParams.get("city")?.toLowerCase().trim();

    const cities = await City.find({ active: true }).sort({ order: 1 }).lean();
    const rooms = await Room.find({ status: { $ne: "inactive" } })
      .sort({ order: 1, createdAt: -1 })
      .populate("city", "name slug")
      .lean();

    // If a specific city was requested, filter directly
    if (cityParam) {
      const filtered = rooms.filter((r) => {
        const c = r.city as unknown as { _id?: string; name?: string; slug?: string } | null;
        if (!c) return false;
        return (
          c.slug?.toLowerCase() === cityParam ||
          c.name?.toLowerCase() === cityParam ||
          String(c._id) === cityParam
        );
      });

      return apiSuccess({
        city: cityParam,
        count: filtered.length,
        rooms: filtered,
      });
    }

    // Group rooms by city slug
    const grouped: Record<string, typeof rooms> = {};
    for (const city of cities) {
      grouped[city.slug] = rooms.filter(
        (r) => r.city && (r.city as unknown as { slug: string }).slug === city.slug
      );
    }

    return apiSuccess({ cities, rooms, grouped });
  } catch (error) {
    console.error("[GET /api/rooms]", error);
    return apiError("Internal server error", 500);
  }
}
