import Home from "../lib/models/Home";

export async function seedHome() {
  const existing = await Home.findOne();

  const data = {
    hero: {
      eyebrow: "The Homely Reset",
      headlineLine1: "Find Your Perfect Stay",
      headlineLine2: "Experience",
    },
    amenities: {
      eyebrow: "The Experience",
      heading: "Premium Amenities",
    },
    galleryPreview: {
      eyebrow: "Our Spaces",
      heading: "Moments Captured",
      ctaText: "View All Moments",
    },
  };

  if (existing) {
    await Home.findByIdAndUpdate(existing._id, data);
    console.log("  ↺ Home page content updated");
  } else {
    await Home.create(data);
    console.log("  ✓ Home page content created");
  }
}
