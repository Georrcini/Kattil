import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Blog from "@/lib/models/Blog";
import { apiSuccess, apiError, handleApiError, slugify, getPaginationParams } from "@/lib/utils/api";
import { blogSchema } from "@/lib/validations";

/** Strip HTML tags to extract plain text for SEO */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/** Auto-generate SEO from blog content */
function generateSeo(data: {
  title: string; excerpt: string; content: string;
  category: string; tags: string[]; image: string;
}) {
  const plain     = data.excerpt || stripHtml(data.content).slice(0, 200);
  const seoTitle  = `${data.title} | Kattil Hotel Blog`;
  const seoDesc   = plain.length > 160 ? plain.slice(0, 157) + "…" : plain;
  const keywords  = [data.category, ...data.tags].filter(Boolean).join(", ");

  return {
    title:       seoTitle,
    description: seoDesc,
    keywords:    keywords || undefined,
    ogImage:     data.image || undefined,
  };
}

/** Ensure slug is unique — append -2, -3, etc. if needed */
async function uniqueSlug(base: string): Promise<string> {
  let candidate = base;
  let n = 1;
  while (await Blog.findOne({ slug: candidate })) {
    n++;
    candidate = `${base}-${n}`;
  }
  return candidate;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = request.nextUrl;
    const { page, limit, skip } = getPaginationParams(searchParams);

    const search   = searchParams.get("search")   ?? "";
    const category = searchParams.get("category") ?? "";
    const status   = searchParams.get("status")   ?? "";
    const featured = searchParams.get("featured") ?? "";

    const filter: Record<string, unknown> = {};
    if (search)            filter.title    = { $regex: search, $options: "i" };
    if (category)          filter.category = category;
    if (status)            filter.status   = status;
    if (featured === "true")  filter.featured = true;
    if (featured === "false") filter.featured = false;

    const [blogs, total] = await Promise.all([
      Blog.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
      Blog.countDocuments(filter),
    ]);

    return apiSuccess({ blogs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error("[GET /api/admin/blogs]", error);
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body   = await request.json();
    const parsed = blogSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);

    const slug = await uniqueSlug(parsed.data.slug?.trim() || slugify(parsed.data.title));
    const seo  = generateSeo(parsed.data);

    const blog = await Blog.create({ ...parsed.data, slug, seo });
    return apiSuccess(blog, 201);
  } catch (error) {
    console.error("[POST /api/admin/blogs]", error);
    return handleApiError(error);
  }
}
