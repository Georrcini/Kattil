import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Home from "@/lib/models/Home";
import { apiSuccess, apiError } from "@/lib/utils/api";

export async function GET() {
  try {
    await connectDB();
    let home = await Home.findOne();
    if (!home) {
      home = await Home.create({});
    }
    return apiSuccess(home);
  } catch (error) {
    console.error("[GET /api/admin/home]", error);
    return apiError("Internal server error", 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    let home = await Home.findOne();
    if (!home) {
      home = await Home.create(body);
    } else {
      home = await Home.findByIdAndUpdate(home._id, { $set: body }, { new: true, runValidators: true });
    }
    return apiSuccess(home);
  } catch (error) {
    console.error("[PUT /api/admin/home]", error);
    return apiError("Internal server error", 500);
  }
}
