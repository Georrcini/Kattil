import type { Metadata } from "next";
import { SITE_URL, DEFAULT_DESCRIPTION } from "@/lib/seo";
import HeroNavbar from "@/components/layout/hero-navbar";
import DestinationsSection from "@/components/section/home/destinations-section";
import ComfortSection from "@/components/section/home/comfort-section";
import OffersSection from "@/components/section/home/offers-section";
import TestimonialsSection from "@/components/section/home/testimonials-section";
import { connectDB } from "@/lib/db/mongodb";
import Home from "@/lib/models/Home";

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

export default async function Home_Page() {
  const home = await getHomeContent();

  return (
    <div className="bg-[#FFFCF2]">
      <HeroNavbar
        heroEyebrow={home?.hero?.eyebrow ?? "The Homely Reset"}
        heroLine1={home?.hero?.headlineLine1 ?? "Find your perfect"}
        heroLine2={home?.hero?.headlineLine2 ?? "experience"}
      />
      <DestinationsSection />
      <ComfortSection />
      <OffersSection />
      <TestimonialsSection />
    </div>
  );
}
