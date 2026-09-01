import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHome extends Document {
  hero: {
    eyebrow: string;
    headlineLine1: string;
    headlineLine2: string;
  };
  amenities: {
    eyebrow: string;
    heading: string;
  };
  galleryPreview: {
    eyebrow: string;
    heading: string;
    ctaText: string;
  };
}

const homeSchema = new Schema<IHome>(
  {
    hero: {
      eyebrow: { type: String, default: "The Homely Reset" },
      headlineLine1: { type: String, default: "Find Your Perfect Stay" },
      headlineLine2: { type: String, default: "Experience" },
    },
    amenities: {
      eyebrow: { type: String, default: "The Experience" },
      heading: { type: String, default: "Premium Amenities" },
    },
    galleryPreview: {
      eyebrow: { type: String, default: "Our Spaces" },
      heading: { type: String, default: "Moments Captured" },
      ctaText: { type: String, default: "View All Moments" },
    },
  },
  { timestamps: true }
);

const Home: Model<IHome> =
  mongoose.models.Home ?? mongoose.model<IHome>("Home", homeSchema);

export default Home;
