import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Blog from "@/lib/models/Blog";
import { apiSuccess, apiError } from "@/lib/utils/api";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { slug } = await params;

    const post = await Blog.findOne({ slug, status: "published" }).lean();
    if (!post) return apiError("Post not found", 404);

    const related = await Blog.find({
      _id: { $ne: post._id },
      status: "published",
    })
      .sort({ order: 1, createdAt: -1 })
      .limit(3)
      .select("slug category title excerpt image featured _id")
      .lean();

    return apiSuccess({ post, related });
  } catch (error) {
    console.error("[GET /api/blogs/[slug]]", error);
    return apiError("Internal server error", 500);
  }
}
