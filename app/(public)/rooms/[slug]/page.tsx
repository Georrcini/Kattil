import type { Metadata } from "next";
import { getPropertyDetailsData } from "@/lib/db/rooms";
import PropertyDetailsView from "@/components/section/rooms/PropertyDetailsView";
import { SITE_URL } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPropertyDetailsData(slug);

  return {
    title: `${data.name} in ${data.destinationName} | Rooms & Stays — Kattil`,
    description: `Book your stay at ${data.name}, ${data.destinationName}. Comfortable rooms, premium amenities, Free WiFi, and authentic hospitality.`,
    alternates: {
      canonical: `${SITE_URL}/rooms/${slug}`,
    },
    openGraph: {
      title: `${data.name} | Kattil Stays`,
      description: data.description,
      url: `${SITE_URL}/rooms/${slug}`,
    },
  };
}

export default async function PropertyRoomDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getPropertyDetailsData(slug);

  return <PropertyDetailsView data={data} />;
}
