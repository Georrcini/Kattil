import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Footer from "@/lib/models/Footer";
import { apiSuccess, apiError, handleApiError } from "@/lib/utils/api";

export async function GET() {
  try {
    await connectDB();
    const footer = await Footer.findOne().lean();
    return apiSuccess(footer ?? {});
  } catch (error) {
    console.error("[GET /api/admin/footer]", error);
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const allowed = [
      "logo", "headline", "description", "tagline", "copyright",
      "footerLinks", "socialLinks", "sidebarIcons", "locations",
    ];
    const update: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) update[key] = body[key];
    }

    if (Object.keys(update).length === 0) {
      return apiError("No valid fields provided", 400);
    }

    const footer = await Footer.findOneAndUpdate(
      {},
      { $set: update },
      { new: true, upsert: true, runValidators: false }
    );
    return apiSuccess(footer);
  } catch (error) {
    console.error("[PUT /api/admin/footer]", error);
    return handleApiError(error);
  }
}
