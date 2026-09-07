import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
import PartnersView from "@/components/section/partners/PartnersView";

export const metadata: Metadata = {
  title: "Partner With Us | Kattil — Hotel & Property Management",
  description:
    "Partner with Kattil to maximize your property's revenue, bookings, and operations. Transparent reporting, shared growth, and zero upfront fees.",
  keywords: [
    "partner with Kattil",
    "hotel management Tamil Nadu",
    "property management partnership",
    "hotel franchise India",
    "homestay management",
    "Kattil partners",
  ],
  alternates: {
    canonical: `${SITE_URL}/partners`,
  },
  openGraph: {
    title: "Partner With Us | Kattil — Your Property. Our Expertise.",
    description:
      "Transform your hospitality property with Kattil's expert operations and booking management.",
    url: `${SITE_URL}/partners`,
    images: [
      {
        url: "/images/partners/community-group.png",
        width: 1200,
        height: 630,
        alt: "Partner with Kattil",
      },
    ],
  },
};

export default function PartnersPage() {
  return <PartnersView />;
}
