import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import About from "@/lib/models/About";
import { apiSuccess, apiError } from "@/lib/utils/api";

// ── GET — map DB fields → admin form fields ───────────────────────────────────
export async function GET() {
  try {
    await connectDB();
    const doc = await About.findOne().lean() as {
      heading?: string; subheading?: string; description?: string;
      images?: string[]; seo?: Record<string, string>;
    } | null;

    if (!doc) return apiSuccess({});

    const parts = (doc.description ?? "").split("\n\n").filter(Boolean);

    return apiSuccess({
      eyebrow:     doc.subheading ?? "Our Story",
      heading:     doc.heading ?? "",
      paragraph1:  parts[0] ?? "",
      paragraph2:  parts[1] ?? "",
      paragraph3:  parts[2] ?? "",
      mainImage:   doc.images?.[0] ?? "",
      overlayImage:doc.images?.[1] ?? "",
      seo:         doc.seo ?? {},
    });
  } catch (error) {
    console.error("[GET /api/admin/about]", error);
    return apiError("Internal server error", 500);
  }
}

// ── PUT — map admin form fields → DB fields ───────────────────────────────────
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json() as {
      eyebrow?: string; heading?: string;
      paragraph1?: string; paragraph2?: string; paragraph3?: string;
      mainImage?: string; overlayImage?: string;
      seo?: Record<string, string>;
    };

    const description = [body.paragraph1, body.paragraph2, body.paragraph3]
      .filter((p) => p?.trim())
      .join("\n\n");

    const images = [body.mainImage, body.overlayImage].filter(Boolean) as string[];

    const update = {
      subheading: body.eyebrow ?? "Our Story",
      heading:    body.heading ?? "",
      description,
      images,
      seo: body.seo ?? {},
    };

    const about = await About.findOneAndUpdate(
      {},
      { $set: update },
      { new: true, upsert: true, runValidators: false }
    );

    return apiSuccess(about);
  } catch (error) {
    console.error("[PUT /api/admin/about]", error);
    return apiError("Internal server error", 500);
  }
}
