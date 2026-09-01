import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
  hotelName?: string;
  logo?: string;
  favicon?: string;
  theme: "light" | "dark" | "system";
  primaryColor?: string;
  phone?: string;
  email?: string;
  address?: string;
  socialLinks: Array<{ platform: string; url: string }>;
  features: Record<string, boolean>;
  updatedAt: Date;
}

const socialLinkSubdoc = new Schema(
  {
    platform: { type: String },
    url: { type: String },
  },
  { _id: false }
);

const settingsSchema = new Schema<ISettings>(
  {
    hotelName: { type: String, default: "Kattil" },
    logo: { type: String },
    favicon: { type: String },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },
    primaryColor: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    socialLinks: { type: [socialLinkSubdoc], default: [] },
    features: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const Settings: Model<ISettings> =
  mongoose.models.Settings ??
  mongoose.model<ISettings>("Settings", settingsSchema);

export default Settings;
