import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import KanbanTask from "@/lib/models/Kanban";
import { apiSuccess, apiError } from "@/lib/utils/api";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { tasks } = await request.json() as {
      tasks: Array<{ id: string; column: string; order: number }>;
    };
    if (!Array.isArray(tasks)) return apiError("tasks must be an array", 400);

    await Promise.all(
      tasks.map(({ id, column, order }) =>
        KanbanTask.findByIdAndUpdate(id, { column, order }, { new: true })
      )
    );

    return apiSuccess({ reordered: tasks.length });
  } catch (error) {
    console.error("[POST /api/admin/kanban/reorder]", error);
    return apiError("Internal server error", 500);
  }
}
