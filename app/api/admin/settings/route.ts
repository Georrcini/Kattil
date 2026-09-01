import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Settings from "@/lib/models/Settings";
import { apiSuccess, apiError } from "@/lib/utils/api";

const DEFAULTS = {
  hotelName: "Kattil Hotels",
  theme: "system",
  socialLinks: [],
  features: {
    bookingEnabled: true,
    galleryEnabled: true,
    blogEnabled: false,
    reviewsEnabled: false,
  },
};

export async function GET() {
  try {
    await connectDB();
    const settings = await Settings.findOne().lean();
    return apiSuccess(settings ?? DEFAULTS);
  } catch (error) {
    console.error("[GET /api/admin/settings]", error);
    return apiError("Internal server error", 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true, runValidators: true }
    );
    return apiSuccess(settings);
  } catch (error) {
    console.error("[PUT /api/admin/settings]", error);
    return apiError("Internal server error", 500);
  }
}
