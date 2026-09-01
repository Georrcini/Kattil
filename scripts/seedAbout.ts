import About from "../lib/models/About";

export async function seedAbout() {
  const existing = await About.findOne();

  // Paragraphs are stored as one `description` string joined by \n\n
  const paragraph1 =
    "Kattil is a premium heritage-industrial hostel and co-living space designed for tech professionals, digital nomads, backpackers, and solo travelers seeking a comfortable and connected stay experience.";
  const paragraph2 =
    "Located in prime city neighborhoods with seamless access to major hubs and local attractions, Kattil offers premium AC dorms with signature individual pod-cooling, secure lockers, high-speed Wi-Fi, and clean, hygienic living spaces.";
  const paragraph3 =
    "Our common areas, rooftop lounges, and shared kitchens are crafted to spark genuine connections. Whether you're here for a night or a month, Kattil is your home away from home.";

  const data = {
    heading:    "Created for Productivity, Relaxation, and Community",
    subheading: "Our Story",
    description: [paragraph1, paragraph2, paragraph3].join("\n\n"),
    images: [
      "/assets/about-us-2.webp",
      "/assets/about-us-1.webp",
    ],
    sections: [],
    values:  ["Comfort", "Community", "Connectivity", "Cleanliness"],
    mission: "To provide premium, affordable co-living and hostel experiences that foster productivity and community for modern travelers across India.",
    vision:  "To be the most trusted name in heritage-inspired urban hospitality — where every guest feels at home.",
    seo: {
      title:       "About Kattil — The Homely Hotel | Chennai & Madurai",
      description: "Learn about Kattil — a premium heritage-inspired hostel and co-living space in Chennai and Madurai, designed for travellers, digital nomads, and professionals.",
      keywords:    "kattil hostel, co-living chennai, budget hostel madurai, heritage hotel india",
    },
  };

  if (existing) {
    await About.findByIdAndUpdate(existing._id, data);
    console.log("  ↺ About page content updated (3 paragraphs)");
  } else {
    await About.create(data);
    console.log("  ✓ About page content created (3 paragraphs)");
  }
}
