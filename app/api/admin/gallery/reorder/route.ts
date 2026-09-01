import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Gallery from "@/lib/models/Gallery";
import { apiSuccess, apiError } from "@/lib/utils/api";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { items } = await request.json() as { items: Array<{ id: string; order: number }> };
    if (!Array.isArray(items)) return apiError("items must be an array", 400);

    await Promise.all(
      items.map(({ id, order }) =>
        Gallery.findByIdAndUpdate(id, { order }, { new: true })
      )
    );

    return apiSuccess({ reordered: items.length });
  } catch (error) {
    console.error("[POST /api/admin/gallery/reorder]", error);
    return apiError("Internal server error", 500);
  }
}
