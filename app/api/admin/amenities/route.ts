import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Amenity from "@/lib/models/Amenity";
import { apiSuccess, apiError, handleApiError } from "@/lib/utils/api";
import { amenitySchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = request.nextUrl;
    const visible = searchParams.get("visible") ?? "";
    const limit   = Math.min(200, Math.max(1, parseInt(searchParams.get("limit") ?? "100", 10)));

    const filter: Record<string, unknown> = {};
    if (visible === "true")  filter.visible = true;
    if (visible === "false") filter.visible = false;

    const amenities = await Amenity.find(filter).sort({ order: 1, name: 1 }).limit(limit);
    return apiSuccess({ amenities });
  } catch (error) {
    console.error("[GET /api/admin/amenities]", error);
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = amenitySchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);

    const count = await Amenity.countDocuments();
    const amenity = await Amenity.create({ ...parsed.data, order: parsed.data.order ?? count });
    return apiSuccess(amenity, 201);
  } catch (error) {
    console.error("[POST /api/admin/amenities]", error);
    return handleApiError(error);
  }
}
