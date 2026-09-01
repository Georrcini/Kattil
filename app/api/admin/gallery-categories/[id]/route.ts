import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import GalleryCategory from "@/lib/models/GalleryCategory";
import { apiSuccess, apiError } from "@/lib/utils/api";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const deleted = await GalleryCategory.findByIdAndDelete(id);
    if (!deleted) return apiError("Category not found", 404);
    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/admin/gallery-categories/[id]]", error);
    return apiError("Internal server error", 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const updated = await GalleryCategory.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    if (!updated) return apiError("Category not found", 404);
    return apiSuccess(updated);
  } catch (error) {
    console.error("[PATCH /api/admin/gallery-categories/[id]]", error);
    return apiError("Internal server error", 500);
  }
}
