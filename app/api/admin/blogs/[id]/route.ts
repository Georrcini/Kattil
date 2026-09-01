import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Blog from "@/lib/models/Blog";
import { apiSuccess, apiError, handleApiError, slugify } from "@/lib/utils/api";
import { updateBlogSchema } from "@/lib/validations";
import { deleteUploadedFile } from "@/lib/utils/fileCleanup";

type Params = { params: Promise<{ id: string }> };

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function generateSeo(data: {
  title?: string; excerpt?: string; content?: string;
  category?: string; tags?: string[]; image?: string;
}) {
  const plain    = data.excerpt || stripHtml(data.content ?? "").slice(0, 200);
  const seoTitle = `${data.title} | Kattil Hotel Blog`;
  const seoDesc  = plain.length > 160 ? plain.slice(0, 157) + "…" : plain;
  const keywords = [data.category, ...(data.tags ?? [])].filter(Boolean).join(", ");
  return {
    title:       seoTitle,
    description: seoDesc,
    keywords:    keywords || undefined,
    ogImage:     data.image || undefined,
  };
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const blog = await Blog.findById(id);
    if (!blog) return apiError("Blog post not found", 404);
    return apiSuccess(blog);
  } catch (error) {
    console.error("[GET /api/admin/blogs/[id]]", error);
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const body   = await request.json();
    const parsed = updateBlogSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);

    const updateData: Record<string, unknown> = Object.fromEntries(
      Object.entries(parsed.data).filter(([, v]) => v !== undefined)
    );

    // Keep slug stable on updates (only regenerate if not already set)
    if (parsed.data.title && !parsed.data.slug) {
      const existing = await Blog.findById(id).select("slug");
      if (!existing?.slug) {
        updateData.slug = slugify(parsed.data.title);
      }
    }

    // Re-generate SEO automatically
    const current = await Blog.findById(id).lean() as {
      title?: string; excerpt?: string; content?: string;
      category?: string; tags?: string[]; image?: string;
    } | null;
    if (current) {
      updateData.seo = generateSeo({ ...current, ...updateData });
    }

    const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true, runValidators: false });
    if (!blog) return apiError("Blog post not found", 404);
    return apiSuccess(blog);
  } catch (error) {
    console.error("[PUT /api/admin/blogs/[id]]", error);
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) return apiError("Blog post not found", 404);

    // Clean up uploaded images (skip /assets/ paths)
    const imagesToDelete = [blog.image, ...(blog.additionalImages ?? [])].filter(Boolean);
    await Promise.allSettled(imagesToDelete.map(deleteUploadedFile));

    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/admin/blogs/[id]]", error);
    return handleApiError(error);
  }
}
