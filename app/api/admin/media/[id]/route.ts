import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Media from "@/lib/models/Media";
import { apiSuccess, apiError } from "@/lib/utils/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const media = await Media.findById(id);
    if (!media) return apiError("Media not found", 404);
    return apiSuccess(media);
  } catch (error) {
    console.error("[GET /api/admin/media/[id]]", error);
    return apiError("Internal server error", 500);
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { alt, tags, folder } = body;

    const media = await Media.findByIdAndUpdate(id, { alt, tags, folder }, { new: true });
    if (!media) return apiError("Media not found", 404);
    return apiSuccess(media);
  } catch (error) {
    console.error("[PUT /api/admin/media/[id]]", error);
    return apiError("Internal server error", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const media = await Media.findByIdAndDelete(id);
    if (!media) return apiError("Media not found", 404);
    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/admin/media/[id]]", error);
    return apiError("Internal server error", 500);
  }
}
