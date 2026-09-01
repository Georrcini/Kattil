import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGallery extends Document {
  src: string;
  alt: string;
  caption?: string;
  category: string;
  tags: string[];
  city?: mongoose.Types.ObjectId;
  featured: boolean;
  order: number;
  width?: number;
  height?: number;
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<IGallery>(
  {
    src: { type: String, required: true },
    alt: { type: String, required: true },
    caption: { type: String },
    category: { type: String, default: "general" },
    tags: { type: [String], default: [] },
    city: { type: Schema.Types.ObjectId, ref: "City" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    width: { type: Number },
    height: { type: Number },
  },
  { timestamps: true }
);

gallerySchema.index({ category: 1 });
gallerySchema.index({ city: 1 });
gallerySchema.index({ featured: 1 });
gallerySchema.index({ order: 1 });

const Gallery: Model<IGallery> =
  mongoose.models.Gallery ?? mongoose.model<IGallery>("Gallery", gallerySchema);

export default Gallery;
