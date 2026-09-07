"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wifi, Utensils, Sparkles, MapPin } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export interface PropertyStay {
  _id: string;
  name: string;
  slug?: string;
  badge?: string; // e.g. "Private room", "Home stay", "Deluxe Suite"
  category?: string;
  images: string[];
  amenities?: string[]; // e.g. ["Free Wifi", "Restaurant"]
  link?: string;
  description?: string;
  occupancy?: string;
  price?: string;
}

interface DestinationStaysViewProps {
  cityName: string;
  citySlug: string;
  properties: PropertyStay[];
}

// Fallback stays in case no rooms are created yet in admin for this city
const getFallbackStays = (cityName: string): PropertyStay[] => [
  {
    _id: "fb-1",
    name: "Kattil Executive Stay",
    slug: "kattil-executive-stay",
    badge: "Private room",
    images: ["/assets/ac-double-room.webp", "/assets/gallery.png"],
    amenities: ["Free Wifi", "Restaurant"],
    link: "/rooms/kattil-executive-stay",
  },
  {
    _id: "fb-2",
    name: "Kattil Stay",
    slug: "kattil-stay",
    badge: "Home stay",
    images: ["/assets/non-ac-double-room.webp", "/assets/about-us-1.webp"],
    amenities: ["Free Wifi", "Restaurant"],
    link: "/rooms/kattil-stay",
  },
  {
    _id: "fb-3",
    name: "Kattil Stay",
    slug: "kattil-stay-heritage",
    badge: "Home stay",
    images: ["/assets/deluxe-garden-suite.webp", "/assets/about-us-2.webp"],
    amenities: ["Free Wifi", "Restaurant"],
    link: "/rooms/kattil-stay-heritage",
  },
  {
    _id: "fb-4",
    name: "Kattil Stay",
    slug: "kattil-stay-garden",
    badge: "Home stay",
    images: ["/assets/six-bed-dormitory.webp", "/assets/gallery.png"],
    amenities: ["Free Wifi", "Restaurant"],
    link: "/rooms/kattil-stay-garden",
  },
  {
    _id: "fb-5",
    name: "Kattil Executive Stay",
    slug: "kattil-executive-stay-prime",
    badge: "Private room",
    images: ["/assets/ac-double-room.webp", "/assets/about-us-1.webp"],
    amenities: ["Free Wifi", "Restaurant"],
    link: "/rooms/kattil-executive-stay-prime",
  },
];

export default function DestinationStaysView({
  cityName,
  citySlug,
  properties: initialProperties,
}: DestinationStaysViewProps) {
  const [stays, setStays] = useState<PropertyStay[]>(
    initialProperties && initialProperties.length > 0
      ? initialProperties
      : []
  );

  // Live client-side fetch from database API to ensure instant updates when admin adds rooms
  useEffect(() => {
    let isMounted = true;
    fetch(`/api/rooms?city=${encodeURIComponent(citySlug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.data?.rooms) && data.data.rooms.length > 0) {
          const mapped: PropertyStay[] = data.data.rooms.map((r: any, idx: number) => ({
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
          setStays(mapped);
        }
      })
      .catch(() => { });

    return () => {
      isMounted = false;
    };
  }, [citySlug]);

  const displayStays = stays.length > 0 ? stays : getFallbackStays(cityName);
  const totalCount = displayStays.length;
  const formattedCount = totalCount < 10 ? `0${totalCount}` : `${totalCount}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Top Navigation */}
      <Navbar />

      {/* ── Sage Green Hero Section with Monument Line-Art ──────────────── */}
      <section className="relative w-full bg-[#9caf88] overflow-hidden pt-36 md:pt-44 lg:pt-52 pb-16 md:pb-24">
        {/* Background architectural monument sketch */}
        <div className="absolute right-0 bottom-0 top-auto h-[65%] sm:h-[72%] md:h-[78%] lg:h-[82%] w-[70%] sm:w-[48%] md:w-[40%] lg:w-[34%] max-w-[460px] pointer-events-none z-0 overflow-hidden flex items-end justify-end pr-2 md:pr-6">
          <div
            className="w-full h-full opacity-90 md:opacity-95 bg-no-repeat"
            style={{
              backgroundImage: "url('/images/destinations/hero-monument-illustration.png')",
              backgroundSize: "contain",
              backgroundPosition: "right bottom",
            }}
          />
        </div>

        {/* Hero Content - Aligned exactly with Navbar 'Home' (left) and 'Book Now' (right) */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-3 md:px-8">
          <div className="relative px-5 md:px-8 lg:px-15 max-w-3xl">
            <p className="font-sans text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.28em] text-[#eaf2e1] mb-4 drop-shadow-sm">
              FIND YOUR PERFECT STAY
            </p>

            <h1 className="text-white tracking-tight">
              <span className="block font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[40px] font-bold leading-[1.12]">
                Discover handpicked stays
              </span>
              <span className="block font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[40px] font-normal italic text-[#f4f7ef] leading-[1.15] mt-1">
                that feel like home.
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* ── Main Properties Listing Grid ─────────────────────────────────── */}
      <main className="flex-1 py-12 md:py-16 lg:py-20">
        <div className="w-full max-w-[1920px] mx-auto px-3 md:px-8">
          <div className="px-5 md:px-8 lg:px-15">
            {/* Subheader: Showing 02 Properties in Madurai */}
            <div className="mb-8 md:mb-10 flex items-center justify-between">
              <p className="font-sans text-[15px] md:text-[17px] text-[#4b5563]">
                Showing <span className="font-bold text-[#111827]">{formattedCount}</span>{" "}
                Properties in <span className="font-bold text-[#111827]">{cityName}</span>
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {displayStays.map((stay, idx) => {
                const imgSrc =
                  (stay.images && stay.images.length > 0 && stay.images[0]) ||
                  "/assets/ac-double-room.webp";
                const stayBadge =
                  stay.badge?.trim() ||
                  (stay.category === "deluxe"
                    ? "Private room"
                    : stay.category === "suite"
                      ? "Luxury Suite"
                      : idx % 2 === 0
                        ? "Private room"
                        : "Home stay");
                const targetLink =
                  stay.slug
                    ? `/rooms/${stay.slug}`
                    : stay._id
                      ? `/rooms/${stay._id}`
                      : "/rooms/kattil-executive-stay";
                const stayAmenities =
                  stay.amenities && stay.amenities.length > 0
                    ? stay.amenities
                    : ["Free Wifi", "Restaurant"];

                return (
                  <div
                    key={stay._id || idx}
                    className="group bg-white rounded-[8px] overflow-hidden border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col"
                  >
                    {/* Property Image */}
                    <Link
                      href={targetLink}
                      className="relative w-full aspect-[16/10] bg-gray-100 overflow-hidden block"
                    >
                      <Image
                        src={imgSrc}
                        alt={stay.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                      />
                    </Link>

                    {/* Card Body */}
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        {/* Badge / Category */}
                        <p className="font-sans text-[13px] text-[#6b7280] font-normal mb-1.5">
                          {stayBadge}
                        </p>

                        {/* Property Title */}
                        <Link href={targetLink} className="block">
                          <h3 className="font-sans text-[20px] md:text-[22px] font-semibold text-[#111827] leading-snug tracking-tight group-hover:text-[#526442] transition-colors">
                            {stay.name}
                          </h3>
                        </Link>
                      </div>

                      {/* Footer Row: Amenities + View Link */}
                      <div className="mt-6 pt-2 flex items-center justify-between gap-3">
                        {/* Amenities pills */}
                        <div className="flex flex-wrap items-center gap-2">
                          {stayAmenities.map((amenity, aIdx) => (
                            <span
                              key={aIdx}
                              className="inline-flex items-center px-2.5 py-1 rounded-[8px] bg-[#f3f4f6] text-[12px] font-medium text-[#4b5563]"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>

                        {/* View Link */}
                        <Link
                          href={targetLink}
                          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#374151] group-hover:text-[#526442] transition-colors shrink-0"
                        >
                          View <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
