import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGalleryCategory extends Document {
  name: string;
  slug: string;
  order: number;
  createdAt: Date;
}

const galleryCategorySchema = new Schema<IGalleryCategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const GalleryCategory: Model<IGalleryCategory> =
  mongoose.models.GalleryCategory ??
  mongoose.model<IGalleryCategory>("GalleryCategory", galleryCategorySchema);

export default GalleryCategory;
