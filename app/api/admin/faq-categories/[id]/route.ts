import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import FaqCategory from "@/lib/models/FaqCategory";
import { apiSuccess, apiError, slugify, handleApiError } from "@/lib/utils/api";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const { name, active, order } = await request.json() as { name?: string; active?: boolean; order?: number };
    const update: Record<string, unknown> = {};
    if (name !== undefined)   { update.name = name.trim(); update.slug = slugify(name.trim()); }
    if (active !== undefined) update.active = active;
    if (order !== undefined)  update.order  = order;

    const cat = await FaqCategory.findByIdAndUpdate(id, update, { new: true });
    if (!cat) return apiError("Category not found", 404);
    return apiSuccess(cat);
  } catch (error) {
    console.error("[PUT /api/admin/faq-categories/[id]]", error);
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const cat = await FaqCategory.findByIdAndDelete(id);
    if (!cat) return apiError("Category not found", 404);
    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/admin/faq-categories/[id]]", error);
    return handleApiError(error);
  }
}
