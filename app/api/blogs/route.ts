import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Blog from "@/lib/models/Blog";
import { apiSuccess, apiError } from "@/lib/utils/api";

const DEFAULT_LIMIT = 9;

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category") ?? "";
    const page  = Math.max(1, parseInt(searchParams.get("page")  ?? "1",  10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10)));
    const skip  = (page - 1) * limit;

    const filter: Record<string, unknown> = { status: "published" };
    if (category) filter.category = { $regex: new RegExp(`^${category}$`, "i") };

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("slug category readTime date title excerpt image featured author tags publishedAt")
        .lean(),
      Blog.countDocuments(filter),
    ]);

    return apiSuccess({
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/blogs]", error);
    return apiError("Failed to fetch blogs", 500);
  }
}
