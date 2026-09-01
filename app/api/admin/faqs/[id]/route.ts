import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Faq from "@/lib/models/Faq";
import { apiSuccess, apiError, handleApiError } from "@/lib/utils/api";
import { updateFaqSchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const faq = await Faq.findById(id);
    if (!faq) return apiError("FAQ not found", 404);
    return apiSuccess(faq);
  } catch (error) {
    console.error("[GET /api/admin/faqs/[id]]", error);
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const parsed = updateFaqSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);

    const faq = await Faq.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true });
    if (!faq) return apiError("FAQ not found", 404);
    return apiSuccess(faq);
  } catch (error) {
    console.error("[PUT /api/admin/faqs/[id]]", error);
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const faq = await Faq.findByIdAndDelete(id);
    if (!faq) return apiError("FAQ not found", 404);
    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/admin/faqs/[id]]", error);
    return handleApiError(error);
  }
}
