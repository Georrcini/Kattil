import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Faq from "@/lib/models/Faq";
import { apiSuccess, apiError } from "@/lib/utils/api";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const category = request.nextUrl.searchParams.get("category") ?? "";
    const filter: Record<string, unknown> = { status: "active" };
    if (category && category !== "All") filter.category = category;

    const faqs = await Faq.find(filter)
      .sort({ displayOrder: 1, createdAt: 1 })
      .select("question answer category displayOrder")
      .lean();

    return apiSuccess({ faqs });
  } catch (error) {
    console.error("[GET /api/faqs]", error);
    return apiError("Internal server error", 500);
  }
}
