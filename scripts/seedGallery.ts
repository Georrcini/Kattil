import Gallery from "../lib/models/Gallery";
import City from "../lib/models/City";

export async function seedGallery() {
  await Gallery.deleteMany({});

  const madurai = await City.findOne({ slug: "madurai" });
  const chennai = await City.findOne({ slug: "chennai" });

  const images = [
    // ── Madurai ───────────────────────────────────────────────
    {
      src: "/assets/madurai-gallery/image-1.jpeg",
      alt: "Private room with carved wooden bed",
      category: "Rooms", city: madurai?._id, featured: true,  order: 0,
    },
    {
      src: "/assets/madurai-gallery/image-2.jpeg",
      alt: "In-room AC unit",
      category: "Rooms", city: madurai?._id, featured: false, order: 1,
    },
    {
      src: "/assets/madurai-gallery/image-3.jpeg",
      alt: "Private room with wooden bed and curtains",
      category: "Rooms", city: madurai?._id, featured: false, order: 2,
    },
    {
      src: "/assets/madurai-gallery/image-4.jpeg",
      alt: "Bathroom with white marble tiles",
      category: "Rooms", city: madurai?._id, featured: false, order: 3,
    },
    {
      src: "/assets/madurai-gallery/image-5.jpeg",
      alt: "Lit building entrance at evening",
      category: "Exterior", city: madurai?._id, featured: true, order: 4,
    },
    {
      src: "/assets/madurai-gallery/image-6.jpeg",
      alt: "Guests arriving at the property",
      category: "Outdoor", city: madurai?._id, featured: false, order: 5,
    },
    {
      src: "/assets/madurai-gallery/image-7.jpeg",
      alt: "Building exterior at dusk",
      category: "Exterior", city: madurai?._id, featured: false, order: 6,
    },
    {
      src: "/assets/madurai-gallery/image-8.jpeg",
      alt: "Dormitory room with bunk beds",
      category: "Rooms", city: madurai?._id, featured: false, order: 7,
    },
    {
      src: "/assets/madurai-gallery/image-9.jpeg",
      alt: "Private room with wooden furniture",
      category: "Rooms", city: madurai?._id, featured: false, order: 8,
    },
    // ── Chennai ───────────────────────────────────────────────
    {
      src: "/assets/chennai-gallery/image-1.jpeg",
      alt: "Dormitory room with bunk beds",
      category: "Rooms", city: chennai?._id, featured: true,  order: 9,
    },
    {
      src: "/assets/chennai-gallery/image-2.jpeg",
      alt: "Bathroom with marble tiles",
      category: "Rooms", city: chennai?._id, featured: false, order: 10,
    },
    {
      src: "/assets/chennai-gallery/image-3.jpeg",
      alt: "Building exterior at night",
      category: "Exterior", city: chennai?._id, featured: true, order: 11,
    },
    {
      src: "/assets/chennai-gallery/image-4.jpeg",
      alt: "Dormitory room overview",
      category: "Rooms", city: chennai?._id, featured: false, order: 12,
    },
  ];

  await Gallery.insertMany(images);
  console.log(`Gallery: ${images.length} images created (9 Madurai, 4 Chennai)`);
}
