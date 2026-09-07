import { connectDB } from "@/lib/db/mongodb";
import City from "@/lib/models/City";
import Room from "@/lib/models/Room";
import { PropertyStay } from "@/components/section/destination/DestinationStaysView";

export interface DestinationStaysData {
  cityId?: string;
  cityName: string;
  citySlug: string;
  cityDescription?: string;
  banner?: string;
  properties: PropertyStay[];
}

export async function getDestinationStaysData(
  slug: string,
  fallbackName: string
): Promise<DestinationStaysData> {
  try {
    await connectDB();
    const cleanSlug = slug.toLowerCase().trim();

    // 1. Query city by slug, name, or label
    const city = await City.findOne({
      $or: [
        { slug: cleanSlug },
        { name: { $regex: new RegExp(`^${cleanSlug}$`, "i") } },
        { label: { $regex: new RegExp(`^${cleanSlug}$`, "i") } },
      ],
    }).lean();

    let rooms: any[] = [];
    if (city) {
      // Find all rooms assigned to this city
      rooms = await Room.find({
        $or: [{ city: city._id }, { city: String(city._id) }],
        status: { $ne: "inactive" },
      })
        .sort({ order: 1, createdAt: -1 })
        .lean();
    }

    // If city wasn't found by slug, also search rooms directly by slug/city text
    if (!rooms || rooms.length === 0) {
      const allActiveRooms = await Room.find({ status: { $ne: "inactive" } })
        .populate("city", "name slug")
        .sort({ order: 1, createdAt: -1 })
        .lean();

      rooms = allActiveRooms.filter(
        (r: any) =>
          r.city &&
          (r.city.slug?.toLowerCase() === cleanSlug ||
            r.city.name?.toLowerCase() === cleanSlug)
      );
    }

    const properties: PropertyStay[] = JSON.parse(JSON.stringify(rooms)).map((r: any, idx: number) => ({
      _id: String(r._id),
      name: r.name,
      slug: r.slug,
      badge: r.badge?.trim() || (idx % 2 === 0 ? "Private room" : "Home stay"),
      category: r.category,
      images: Array.isArray(r.images) && r.images.length > 0 ? r.images : ["/assets/ac-double-room.webp"],
      amenities: Array.isArray(r.amenities) && r.amenities.length > 0 ? r.amenities : ["Free Wifi", "Restaurant"],
      link: r.link?.trim() || `/rooms/${r.slug || r._id}`,
      description: r.description,
      occupancy: r.occupancy,
    }));

    return {
      cityId: city ? String(city._id) : undefined,
      cityName: city?.name || fallbackName,
      citySlug: city?.slug || cleanSlug,
      cityDescription: city?.description,
      banner: city?.banner,
      properties,
    };
  } catch (error) {
    console.error(`[getDestinationStaysData] Failed for slug "${slug}":`, error);
    return {
      cityName: fallbackName,
      citySlug: slug,
      properties: [],
    };
  }
}
