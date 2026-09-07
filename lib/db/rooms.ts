import { connectDB } from "@/lib/db/mongodb";
import Room from "@/lib/models/Room";
import City from "@/lib/models/City";
import { PropertyDetailsData, PropertyRoomOption } from "@/components/section/rooms/PropertyDetailsView";

export async function getPropertyDetailsData(
  slug: string,
  fallbackDestination: string = "Kanniyakumari"
): Promise<PropertyDetailsData> {
  try {
    await connectDB();
    const cleanSlug = slug.toLowerCase().trim();

    // 1. Try finding a room by slug, name regex, or _id
    let primaryRoom: any = null;
    let city: any = null;

    if (cleanSlug.match(/^[0-9a-fA-F]{24}$/)) {
      primaryRoom = await Room.findById(cleanSlug).populate("city").lean();
    }
    if (!primaryRoom) {
      primaryRoom = await Room.findOne({
        $or: [{ slug: cleanSlug }, { name: { $regex: new RegExp(`^${cleanSlug}$`, "i") } }],
        status: "active",
      })
        .populate("city")
        .lean();
    }

    // 2. If not found by room slug, check if the slug is a city slug (e.g. /rooms/madurai)
    if (!primaryRoom) {
      city = await City.findOne({
        $or: [{ slug: cleanSlug }, { name: { $regex: new RegExp(`^${cleanSlug}$`, "i") } }],
        active: true,
      }).lean();
    } else if (primaryRoom.city) {
      city = primaryRoom.city;
    }

    // 3. Find sibling rooms for this city
    let cityRooms: any[] = [];
    if (city) {
      cityRooms = await Room.find({ city: city._id, status: "active" })
        .sort({ order: 1, createdAt: -1 })
        .lean();
    }

    const destinationName = city?.name || fallbackDestination;
    const propertyName =
      primaryRoom?.name ||
      (cleanSlug.includes("sparrow")
        ? "Kattil The Sparrow"
        : cleanSlug.includes("executive")
        ? "Kattil Executive Stay"
        : `Kattil Stay ${destinationName}`);

    // Map rooms list for "Select Room"
    const roomOptions: PropertyRoomOption[] =
      cityRooms.length > 0
        ? JSON.parse(JSON.stringify(cityRooms)).map((r: any, idx: number) => ({
            _id: String(r._id),
            name: r.name,
            badge: r.badge?.trim() || (idx === 0 ? "Private room" : idx === 1 ? "Dormitory" : "Private rooms"),
            description: r.description || "Spacious Double occupancy room with extra comfort",
            images: Array.isArray(r.images) && r.images.length > 0 ? r.images : ["/assets/ac-double-room.webp"],
            amenities: Array.isArray(r.amenities) && r.amenities.length > 0 ? r.amenities : ["Free Wifi", "Restaurant", "Study Desk", "Double Occupancy"],
            bookingLink: r.link?.trim() || r.cta?.url?.trim() || undefined,
            price: r.pricing?.[0]?.value,
          }))
        : [
            {
              _id: "default-room-1",
              name: "Kattil Executive Stay",
              badge: "Private room",
              description: "Spacious Double occupancy room with extra comfort",
              images: ["/assets/ac-double-room.webp", "/assets/gallery.png"],
              amenities: ["Free Wifi", "Restaurant", "Study Desk", "Double Occupancy"],
              bookingLink: "/rooms",
            },
            {
              _id: "default-room-2",
              name: "Kattil Executive Stay",
              badge: "Dormitory",
              description: "Spacious Double occupancy room with extra comfort",
              images: ["/assets/six-bed-dormitory.webp", "/assets/gallery.png"],
              amenities: ["Free Wifi", "Restaurant", "Study Desk", "Double Occupancy"],
              bookingLink: "/rooms",
            },
            {
              _id: "default-room-3",
              name: "Kattil Executive Stay",
              badge: "Private rooms",
              description: "Spacious Double occupancy room with extra comfort",
              images: ["/assets/deluxe-garden-suite.webp", "/assets/gallery.png"],
              amenities: ["Free Wifi", "Restaurant", "Study Desk", "Double Occupancy"],
              bookingLink: "/rooms",
            },
          ];

    const heroImages =
      primaryRoom?.images && primaryRoom.images.length > 0
        ? primaryRoom.images
        : [
            "/assets/ac-double-room.webp",
            "/assets/deluxe-garden-suite.webp",
            "/assets/six-bed-dormitory.webp",
            "/assets/about-us-1.webp",
          ];

    return {
      _id: primaryRoom ? String(primaryRoom._id) : undefined,
      name: propertyName,
      slug: cleanSlug,
      destinationName,
      destinationSlug: city?.slug || destinationName.toLowerCase(),
      description:
        primaryRoom?.description ||
        city?.description ||
        `${propertyName} offers thoughtfully designed spaces with modern amenities, warm hospitality, and a vibrant community experience for students and professionals. vibrant community experience for students and professionals.`,
      heroImages,
      address: city?.address || "Karzu Road, Near circuit house, Karzu-194101",
      mapLink: city?.mapSrc,
      phone: city?.phone || "+91 74487 49779",
      email: city?.email || "hostelsparrow@gmail.com",
      rooms: roomOptions,
    };
  } catch (error) {
    console.error(`[getPropertyDetailsData] Failed for slug "${slug}":`, error);
    return {
      name: "Kattil The Sparrow",
      slug,
      destinationName: fallbackDestination,
      description:
        "Kattil Executive Stay offers thoughtfully designed spaces with modern amenities, warm hospitality, and a vibrant community experience for students and professionals.",
      heroImages: ["/assets/ac-double-room.webp", "/assets/deluxe-garden-suite.webp"],
      address: "Karzu Road, Near circuit house, Karzu-194101",
      phone: "+91 74487 49779",
      email: "hostelsparrow@gmail.com",
      rooms: [
        {
          _id: "fb-1",
          name: "Kattil Executive Stay",
          badge: "Private room",
          description: "Spacious Double occupancy room with extra comfort",
          images: ["/assets/ac-double-room.webp"],
          amenities: ["Free Wifi", "Restaurant", "Study Desk", "Double Occupancy"],
          bookingLink: "/rooms",
        },
      ],
    };
  }
}
