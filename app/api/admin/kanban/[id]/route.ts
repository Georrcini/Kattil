import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import KanbanTask from "@/lib/models/Kanban";
import { apiSuccess, apiError } from "@/lib/utils/api";
import { updateKanbanSchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const task = await KanbanTask.findById(id);
    if (!task) return apiError("Task not found", 404);
    return apiSuccess(task);
  } catch (error) {
    console.error("[GET /api/admin/kanban/[id]]", error);
    return apiError("Internal server error", 500);
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const parsed = updateKanbanSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);

    const task = await KanbanTask.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true });
    if (!task) return apiError("Task not found", 404);
    return apiSuccess(task);
  } catch (error) {
    console.error("[PUT /api/admin/kanban/[id]]", error);
    return apiError("Internal server error", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const task = await KanbanTask.findByIdAndDelete(id);
    if (!task) return apiError("Task not found", 404);
    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/admin/kanban/[id]]", error);
    return apiError("Internal server error", 500);
  }
}
