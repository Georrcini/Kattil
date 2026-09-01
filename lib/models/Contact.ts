import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContact extends Document {
  heading?: string;
  phone?: string;
  email?: string;
  address?: string;
  supportTiming?: string;
  enquiryInfo?: string;
  mapEmbed?: string;
  whatsapp?: string;
  cta?: { text: string; url: string };
  formSettings?: {
    enabled: boolean;
    recipientEmail?: string;
    successMessage?: string;
  };
  updatedAt: Date;
}

const ctaSubdoc = new Schema(
  {
    text: { type: String },
    url: { type: String },
  },
  { _id: false }
);

const formSettingsSubdoc = new Schema(
  {
    enabled: { type: Boolean, default: true },
    recipientEmail: { type: String },
    successMessage: { type: String },
  },
  { _id: false }
);

const contactSchema = new Schema<IContact>(
  {
    heading: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    supportTiming: { type: String },
    enquiryInfo: { type: String },
    mapEmbed: { type: String },
    whatsapp: { type: String },
    cta: { type: ctaSubdoc },
    formSettings: { type: formSettingsSubdoc },
  },
  { timestamps: true }
);

const Contact: Model<IContact> =
  mongoose.models.Contact ?? mongoose.model<IContact>("Contact", contactSchema);

export default Contact;
