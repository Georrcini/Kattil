import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAbout extends Document {
  heading: string;
  subheading?: string;
  title?: string;
  description: string;
  sections: Array<{
    title: string;
    content: string;
    image?: string;
    order: number;
  }>;
  mission?: string;
  vision?: string;
  values: string[];
  images: string[];
  banner?: string;
  cta?: { text: string; url: string };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
  };
  updatedAt: Date;
}

const seoSubdoc = new Schema(
  {
    title: { type: String },
    description: { type: String },
    keywords: { type: String },
    ogImage: { type: String },
  },
  { _id: false }
);

const ctaSubdoc = new Schema(
  {
    text: { type: String },
    url: { type: String },
  },
  { _id: false }
);

const sectionSubdoc = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const aboutSchema = new Schema<IAbout>(
  {
    heading: { type: String, required: true },
    subheading: { type: String },
    title: { type: String },
    description: { type: String, required: true },
    sections: { type: [sectionSubdoc], default: [] },
    mission: { type: String },
    vision: { type: String },
    values: { type: [String], default: [] },
    images: { type: [String], default: [] },
    banner: { type: String },
    cta: { type: ctaSubdoc },
    seo: { type: seoSubdoc },
  },
  { timestamps: true }
);

const About: Model<IAbout> =
  mongoose.models.About ?? mongoose.model<IAbout>("About", aboutSchema);

export default About;
