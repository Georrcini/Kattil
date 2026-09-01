import type { Metadata } from "next";
import { SITE_URL, DEFAULT_DESCRIPTION } from "@/lib/seo";
import HeroNavbar from "@/components/layout/hero-navbar";
import AmenitiesSection, { type AmenityItem } from "@/components/section/home/amenties-section";
import GalleryPreview, { type GalleryPreviewItem } from "@/components/section/home/gallery-preview";
import { connectDB } from "@/lib/db/mongodb";
import Home from "@/lib/models/Home";
import Amenity from "@/lib/models/Amenity";
import Gallery from "@/lib/models/Gallery";

export const metadata: Metadata = {
  title: {
    absolute: "Kattil — The Homely Hotel | Chennai & Madurai",
  },
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
};

async function getHomeContent() {
  try {
    await connectDB();
    let home = await Home.findOne().lean();
    if (!home) home = await Home.create({});
    return home as Awaited<ReturnType<typeof Home.findOne>>;
  } catch {
    return null;
  }
}

async function getAmenities(): Promise<AmenityItem[]> {
  try {
    await connectDB();
    const amenities = await Amenity.find({ visible: true })
      .sort({ order: 1, name: 1 })
      .select("name icon description order")
      .lean();
    return amenities as AmenityItem[];
  } catch {
    return [];
  }
}

async function getGalleryPreview(): Promise<GalleryPreviewItem[]> {
  try {
    await connectDB();
    const items = await Gallery.find({ featured: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(4)
      .populate("city", "name")
      .lean();

    if (items.length < 4) {
      const extra = await Gallery.find({ featured: false })
        .sort({ order: 1, createdAt: -1 })
        .limit(4 - items.length)
        .populate("city", "name")
        .lean();
      items.push(...extra);
    }

    return items.map((item) => ({
      src: item.src as string,
      alt: item.alt as string,
      location: (item.city as { name?: string } | null)?.name ?? "Kattil",
    }));
  } catch {
    return [];
  }
}

export default async function Home_Page() {
  const [home, amenities, galleryImages] = await Promise.all([
    getHomeContent(),
    getAmenities(),
    getGalleryPreview(),
  ]);

  return (
    <div className="bg-tertiary">
      <HeroNavbar
        heroEyebrow={home?.hero?.eyebrow ?? "The Homely Reset"}
        heroLine1={home?.hero?.headlineLine1 ?? "Find Your Perfect Stay"}
        heroLine2={home?.hero?.headlineLine2 ?? "Experience"}
      />
      <AmenitiesSection
        eyebrow={home?.amenities?.eyebrow ?? "The Experience"}
        heading={home?.amenities?.heading ?? "Premium Amenities"}
        amenities={amenities}
      />
      <GalleryPreview
        eyebrow={home?.galleryPreview?.eyebrow ?? "Our Spaces"}
        heading={home?.galleryPreview?.heading ?? "Moments Captured"}
        ctaText={home?.galleryPreview?.ctaText ?? "View All Moments"}
        images={galleryImages}
      />
    </div>
  );
}
