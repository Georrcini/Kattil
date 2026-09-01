import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMedia extends Document {
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  folder: string;
  tags: string[];
  alt?: string;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    width: { type: Number },
    height: { type: Number },
    folder: { type: String, default: "general" },
    tags: { type: [String], default: [] },
    alt: { type: String },
  },
  { timestamps: true }
);

mediaSchema.index({ folder: 1 });
mediaSchema.index({ tags: 1 });
mediaSchema.index({ createdAt: 1 });

const Media: Model<IMedia> =
  mongoose.models.Media ?? mongoose.model<IMedia>("Media", mediaSchema);

export default Media;
