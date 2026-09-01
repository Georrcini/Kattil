import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import GalleryCategory from "@/lib/models/GalleryCategory";
import { apiSuccess, apiError } from "@/lib/utils/api";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  order: z.number().optional(),
});

export async function GET() {
  try {
    await connectDB();
    const categories = await GalleryCategory.find().sort({ order: 1, name: 1 }).lean();
    return apiSuccess(categories);
  } catch (error) {
    console.error("[GET /api/admin/gallery-categories]", error);
    return apiError("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);

    const slug =
      parsed.data.slug ??
      parsed.data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const existing = await GalleryCategory.findOne({ slug });
    if (existing) return apiError("A category with this name already exists", 409);

    const category = await GalleryCategory.create({ ...parsed.data, slug });
    return apiSuccess(category, 201);
  } catch (error) {
    console.error("[POST /api/admin/gallery-categories]", error);
    return apiError("Internal server error", 500);
  }
}
