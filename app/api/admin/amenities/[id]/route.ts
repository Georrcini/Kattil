import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Amenity from "@/lib/models/Amenity";
import { apiSuccess, apiError, handleApiError } from "@/lib/utils/api";
import { updateAmenitySchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const amenity = await Amenity.findById(id);
    if (!amenity) return apiError("Amenity not found", 404);
    return apiSuccess(amenity);
  } catch (error) {
    console.error("[GET /api/admin/amenities/[id]]", error);
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const parsed = updateAmenitySchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);

    const amenity = await Amenity.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true });
    if (!amenity) return apiError("Amenity not found", 404);
    return apiSuccess(amenity);
  } catch (error) {
    console.error("[PUT /api/admin/amenities/[id]]", error);
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const amenity = await Amenity.findByIdAndDelete(id);
    if (!amenity) return apiError("Amenity not found", 404);
    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/admin/amenities/[id]]", error);
    return handleApiError(error);
  }
}
