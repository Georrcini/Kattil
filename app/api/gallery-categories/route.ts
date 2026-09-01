import { connectDB } from "@/lib/db/mongodb";
import GalleryCategory from "@/lib/models/GalleryCategory";
import { apiSuccess, apiError } from "@/lib/utils/api";

export async function GET() {
  try {
    await connectDB();
    const categories = await GalleryCategory.find({})
      .sort({ order: 1, name: 1 })
      .lean();
    return apiSuccess(categories);
  } catch (error) {
    console.error("[GET /api/gallery-categories]", error);
    return apiError("Failed to fetch categories", 500);
  }
}
