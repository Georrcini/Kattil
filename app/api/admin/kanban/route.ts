import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import KanbanTask from "@/lib/models/Kanban";
import { apiSuccess, apiError } from "@/lib/utils/api";
import { kanbanSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = request.nextUrl;
    const column = searchParams.get("column") ?? "";

    const filter: Record<string, unknown> = {};
    if (column) filter.column = column;

    const tasks = await KanbanTask.find(filter).sort({ column: 1, order: 1 });
    return apiSuccess({ tasks });
  } catch (error) {
    console.error("[GET /api/admin/kanban]", error);
    return apiError("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = kanbanSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);

    const columnCount = await KanbanTask.countDocuments({ column: parsed.data.column ?? "todo" });
    const task = await KanbanTask.create({ ...parsed.data, order: columnCount });
    return apiSuccess(task, 201);
  } catch (error) {
    console.error("[POST /api/admin/kanban]", error);
    return apiError("Internal server error", 500);
  }
}
