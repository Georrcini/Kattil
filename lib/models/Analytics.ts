import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnalytic extends Document {
  event: "book_now" | "page_view";
  page: string;
  branch?: string;
  roomName?: string;
  roomId?: string;
  createdAt: Date;
}

const analyticSchema = new Schema<IAnalytic>(
  {
    event: { type: String, enum: ["book_now", "page_view"], required: true },
    page:  { type: String, required: true },
    branch:   { type: String },
    roomName: { type: String },
    roomId:   { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

analyticSchema.index({ event: 1, createdAt: -1 });
analyticSchema.index({ branch: 1, event: 1 });
analyticSchema.index({ page: 1, event: 1 });

const Analytic: Model<IAnalytic> =
  mongoose.models.Analytic ?? mongoose.model<IAnalytic>("Analytic", analyticSchema);

export default Analytic;
