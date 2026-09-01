import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import BlogCategory from "@/lib/models/BlogCategory";
import { apiSuccess, apiError, slugify, handleApiError } from "@/lib/utils/api";

export async function GET() {
  try {
    await connectDB();
    const categories = await BlogCategory.find({ active: true })
      .sort({ order: 1, name: 1 })
      .lean();
    return apiSuccess({ categories });
  } catch (error) {
    console.error("[GET /api/admin/blog-categories]", error);
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, order } = await request.json() as { name?: string; order?: number };
    if (!name?.trim()) return apiError("Category name is required", 400);

    const slug = slugify(name.trim());
    const existing = await BlogCategory.findOne({ slug });
    if (existing) return apiError("A category with this name already exists", 409);

    const count    = await BlogCategory.countDocuments();
    const category = await BlogCategory.create({ name: name.trim(), slug, order: order ?? count });
    return apiSuccess(category, 201);
  } catch (error) {
    console.error("[POST /api/admin/blog-categories]", error);
    return handleApiError(error);
  }
}
