import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Analytic from "@/lib/models/Analytics";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { event, page, branch, roomName, roomId } = body;

    if (!event || !page) {
      return Response.json({ success: false }, { status: 400 });
    }

    await Analytic.create({ event, page, branch, roomName, roomId });
    return Response.json({ success: true });
  } catch {
    return Response.json({ success: false }, { status: 500 });
  }
}
