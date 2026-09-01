import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Contact from "@/lib/models/Contact";
import { apiSuccess, apiError } from "@/lib/utils/api";
import { contactSchema } from "@/lib/validations";

export async function GET() {
  try {
    await connectDB();
    const contact = await Contact.findOne().lean();
    return apiSuccess(contact ?? {});
  } catch (error) {
    console.error("[GET /api/admin/contact]", error);
    return apiError("Internal server error", 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = contactSchema.partial().safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);

    const contact = await Contact.findOneAndUpdate({}, { $set: parsed.data }, { new: true, upsert: true, runValidators: true });
    return apiSuccess(contact);
  } catch (error) {
    console.error("[PUT /api/admin/contact]", error);
    return apiError("Internal server error", 500);
  }
}
