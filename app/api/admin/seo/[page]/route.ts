import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Seo from "@/lib/models/Seo";
import { apiSuccess, apiError } from "@/lib/utils/api";
import { updateSeoSchema } from "@/lib/validations";

type Params = { params: Promise<{ page: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { page } = await params;
    const entry = await Seo.findOne({ page }).lean();
    return apiSuccess(entry ?? {});
  } catch (error) {
    console.error("[GET /api/admin/seo/[page]]", error);
    return apiError("Internal server error", 500);
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { page } = await params;
    const body = await request.json();
    const parsed = updateSeoSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);

    const entry = await Seo.findOneAndUpdate(
      { page },
      { $set: { ...parsed.data, page } },
      { new: true, upsert: true, runValidators: true }
    );
    return apiSuccess(entry);
  } catch (error) {
    console.error("[PUT /api/admin/seo/[page]]", error);
    return apiError("Internal server error", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { page } = await params;
    const entry = await Seo.findOneAndDelete({ page });
    if (!entry) return apiError("SEO entry not found", 404);
    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/admin/seo/[page]]", error);
    return apiError("Internal server error", 500);
  }
}
