import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Media from "@/lib/models/Media";
import { apiSuccess, apiError, getPaginationParams } from "@/lib/utils/api";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = request.nextUrl;
    const { page, limit, skip } = getPaginationParams(searchParams);

    const folder = searchParams.get("folder") ?? "";
    const search = searchParams.get("search") ?? "";
    const tag = searchParams.get("tag") ?? "";

    const filter: Record<string, unknown> = {};
    if (folder) filter.folder = folder;
    if (tag) filter.tags = { $in: [tag] };
    if (search) {
      filter.$or = [
        { originalName: { $regex: search, $options: "i" } },
        { alt: { $regex: search, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      Media.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Media.countDocuments(filter),
    ]);

    const folders = await Media.distinct("folder");

    return apiSuccess({ items, folders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error("[GET /api/admin/media]", error);
    return apiError("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { filename, originalName, url, mimeType, size, width, height, folder, tags, alt } = body;

    if (!filename || !originalName || !url || !mimeType || !size) {
      return apiError("Missing required fields: filename, originalName, url, mimeType, size", 400);
    }

    const media = await Media.create({ filename, originalName, url, mimeType, size, width, height, folder: folder ?? "general", tags: tags ?? [], alt });
    return apiSuccess(media, 201);
  } catch (error) {
    console.error("[POST /api/admin/media]", error);
    return apiError("Internal server error", 500);
  }
}
