import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Seo from "@/lib/models/Seo";
import { apiSuccess, apiError } from "@/lib/utils/api";
import { seoSchema } from "@/lib/validations";

export async function GET() {
  try {
    await connectDB();
    const entries = await Seo.find().sort({ page: 1 }).lean();
    return apiSuccess({ entries });
  } catch (error) {
    console.error("[GET /api/admin/seo]", error);
    return apiError("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = seoSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);

    const existing = await Seo.findOne({ page: parsed.data.page });
    if (existing) return apiError(`SEO entry for page "${parsed.data.page}" already exists. Use PUT to update.`, 409);

    const entry = await Seo.create(parsed.data);
    return apiSuccess(entry, 201);
  } catch (error) {
    console.error("[POST /api/admin/seo]", error);
    return apiError("Internal server error", 500);
  }
}
