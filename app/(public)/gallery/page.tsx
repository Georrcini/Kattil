import { cache } from "react";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
import { connectDB } from "@/lib/db/mongodb";
import GalleryModel from "@/lib/models/Gallery";
import GalleryCategoryModel from "@/lib/models/GalleryCategory";
import GalleryContent, {
  type PublicGalleryItem,
  type PublicGalleryCategory,
  STATIC_ITEMS,
  STATIC_CATEGORIES,
} from "./_content";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse photos of our rooms, common areas, rooftop lounges, and property surroundings at Kattil Chennai and Madurai.",
  alternates: { canonical: `${SITE_URL}/gallery` },
  openGraph: {
    title: "Photo Gallery | Kattil — The Homely Hotel",
    description: "Explore Kattil's spaces through our gallery.",
    url: `${SITE_URL}/gallery`,
  },
};

// Shared between this page and any future generateMetadata call
const getGalleryData = cache(async (): Promise<{
  items: PublicGalleryItem[];
  categories: PublicGalleryCategory[];
}> => {
  try {
    await connectDB();
    const [rawItems, rawCats] = await Promise.all([
      GalleryModel.find({})
        .sort({ order: 1, createdAt: -1 })
        .populate("city", "name")
        .lean<Array<{
          _id: unknown;
          src: string;
          alt: string;
          caption?: string;
          category: string;
          city?: { name: string } | null;
          featured: boolean;
          order: number;
          width?: number;
          height?: number;
        }>>(),
      GalleryCategoryModel.find({}).sort({ order: 1, name: 1 }).lean<Array<{
        _id: unknown;
        name: string;
        slug: string;
        order: number;
      }>>(),
    ]);

    // Fall back to static data when the CMS has no images yet
    if (rawItems.length === 0) {
      return { items: STATIC_ITEMS, categories: rawCats.length > 0
        ? rawCats.map((c) => ({ slug: c.slug, name: c.name }))
        : STATIC_CATEGORIES };
    }

    const items: PublicGalleryItem[] = rawItems.map((item) => ({
      id: String(item._id),
      src: item.src,
      alt: item.alt,
      caption: item.caption,
      category: item.category,          // already a slug e.g. "rooms"
      cityName: item.city?.name?.toLowerCase() ?? undefined,
      featured: item.featured,
      width: item.width,
      height: item.height,
    }));

    const categories: PublicGalleryCategory[] =
      rawCats.length > 0
        ? rawCats.map((c) => ({ slug: c.slug, name: c.name }))
        : STATIC_CATEGORIES;

    return { items, categories };
  } catch {
    return { items: STATIC_ITEMS, categories: STATIC_CATEGORIES };
  }
});

export default async function GalleryPage() {
  const { items, categories } = await getGalleryData();
  return <GalleryContent items={items} categories={categories} />;
}
