import mongoose, { Schema, Document, Model } from "mongoose";

export interface IKanbanTask extends Document {
  title: string;
  description?: string;
  column: "todo" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high";
  tags: string[];
  assignee?: string;
  dueDate?: Date;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const kanbanSchema = new Schema<IKanbanTask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    column: {
      type: String,
      enum: ["todo", "in-progress", "review", "completed"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    tags: { type: [String], default: [] },
    assignee: { type: String },
    dueDate: { type: Date },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

kanbanSchema.index({ column: 1 });
kanbanSchema.index({ order: 1 });
kanbanSchema.index({ priority: 1 });

const KanbanTask: Model<IKanbanTask> =
  mongoose.models.KanbanTask ??
  mongoose.model<IKanbanTask>("KanbanTask", kanbanSchema);

export default KanbanTask;
