import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import City from "@/lib/models/City";
import Room from "@/lib/models/Room";
import { apiSuccess, apiError, handleApiError, slugify } from "@/lib/utils/api";
import { updateCitySchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const city = await City.findById(id);
    if (!city) return apiError("City not found", 404);
    return apiSuccess(city);
  } catch (error) {
    console.error("[GET /api/admin/cities/[id]]", error);
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const parsed = updateCitySchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.slug?.trim()) {
      updateData.slug = slugify(parsed.data.slug);
    } else if (parsed.data.name) {
      updateData.slug = slugify(parsed.data.name);
    }

    const city = await City.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!city) return apiError("City not found", 404);
    return apiSuccess(city);
  } catch (error) {
    console.error("[PUT /api/admin/cities/[id]]", error);
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;

    const roomCount = await Room.countDocuments({ city: id });
    if (roomCount > 0) {
      return apiError(`Cannot delete: ${roomCount} room(s) reference this city`, 400);
    }

    const city = await City.findByIdAndDelete(id);
    if (!city) return apiError("City not found", 404);
    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/admin/cities/[id]]", error);
    return handleApiError(error);
  }
}
