import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
import { connectDB } from "@/lib/db/mongodb";
import RoomModel from "@/lib/models/Room";
import CityModel from "@/lib/models/City";
import RoomsContent from "./_content";

export const metadata: Metadata = {
  title: "Rooms & Suites",
  description:
    "Explore premium rooms and suites at Kattil in Chennai and Madurai. From AC dormitories to private doubles — comfortable stays at great value.",
  alternates: { canonical: `${SITE_URL}/rooms` },
  openGraph: {
    title: "Rooms & Suites | Kattil — The Homely Hotel",
    description: "View all available rooms across our Chennai and Madurai properties.",
    url: `${SITE_URL}/rooms`,
  },
};

export interface RoomItem {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  link?: string;
  description?: string;
  city: { name: string; slug: string };
}

export interface CityTab {
  _id: string;
  name: string;
  slug: string;
  label?: string;
}

async function getRoomsData(): Promise<{ cities: CityTab[]; grouped: Record<string, RoomItem[]> }> {
  try {
    await connectDB();

    const cities = await CityModel.find({ active: true })
      .sort({ order: 1 })
      .select("name slug label")
      .lean();

    const rooms = await RoomModel.find({ status: "active" })
      .sort({ order: 1 })
      .populate("city", "name slug")
      // include cta so we can fall back to cta.url for rooms saved before the link field fix
      .select("name slug images link cta description city")
      .lean();

    // ── Serialize (strips ObjectIds, toJSON methods, Mongoose internals) ──────
    const plainCities = JSON.parse(JSON.stringify(cities)) as CityTab[];
    const plainRooms  = (JSON.parse(JSON.stringify(rooms)) as Array<{
      _id: string; name: string; slug: string; images: string[];
      link?: string; cta?: { url?: string }; description?: string;
      city: { name: string; slug: string };
    }>).map((r) => ({
      _id:         r._id,
      name:        r.name,
      slug:        r.slug,
      images:      r.images ?? [],
      // fall back to cta.url for rooms saved before the link field was used
      link:        r.link?.trim() || r.cta?.url?.trim() || undefined,
      description: r.description ?? "",
      city:        r.city,
    } satisfies RoomItem));

    const grouped: Record<string, RoomItem[]> = {};
    for (const city of plainCities) {
      grouped[city.slug] = plainRooms.filter(
        (r) => r.city?.slug === city.slug
      );
    }

    return { cities: plainCities, grouped };
  } catch (err) {
    console.error("[getRoomsData]", err);
    return { cities: [], grouped: {} };
  }
}

export default async function RoomsPage() {
  const { cities, grouped } = await getRoomsData();
  return <RoomsContent cities={cities} grouped={grouped} />;
}
