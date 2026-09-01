import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAmenity extends Document {
  name: string;
  icon: string;
  description?: string;
  visible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const amenitySchema = new Schema<IAmenity>(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, required: true },
    description: { type: String },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

amenitySchema.index({ order: 1 });
amenitySchema.index({ visible: 1 });

const Amenity: Model<IAmenity> =
  mongoose.models.Amenity ?? mongoose.model<IAmenity>("Amenity", amenitySchema);

export default Amenity;
