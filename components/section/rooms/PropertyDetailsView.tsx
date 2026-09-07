"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Phone,
  Mail,
  MessageCircle,
  Wifi,
  Utensils,
  Dumbbell,
  Shield,
  Sparkles,
  Lock,
  BellRing,
  ArrowRight,
  Check,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export interface PropertyRoomOption {
  _id: string;
  name: string;
  badge?: string; // "Private room", "Dormitory", "Luxury Suite"
  description?: string;
  images: string[];
  amenities: string[];
  bookingLink?: string;
  price?: string;
}

export interface PropertyDetailsData {
  _id?: string;
  name: string;
  slug?: string;
  destinationName: string;
  destinationSlug?: string;
  tagline?: string;
  description: string;
  heroImages: string[];
  address: string;
  mapLink?: string;
  phone: string;
  email: string;
  whatsapp?: string;
  rooms: PropertyRoomOption[];
  directions?: {
    railway?: string;
    busStand?: string;
    landmark?: string;
    byCar?: string;
    important?: string;
    helpText?: string;
  };
}

const DEFAULT_GALLERY_IMAGES = [
  "/images/gallery/community-group.jpg",
  "/images/gallery/sunny-balcony-guest.jpg",
  "/images/gallery/bikers-adventure.jpg",
  "/assets/about-us-1.webp",
];

const AMENITY_ICONS = [
  { label: "Locker", icon: Lock },
  { label: "Holistic SPA", icon: Sparkles },
  { label: "Modern Gym", icon: Dumbbell },
  { label: "High Speed Wi-Fi", icon: Wifi },
  { label: "Locker", icon: Shield },
  { label: "Fine Dining", icon: Utensils },
  { label: "High Speed Wi-Fi", icon: Wifi },
  { label: "24/7 Butler", icon: BellRing },
];

export default function PropertyDetailsView({ data }: { data: PropertyDetailsData }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [howToReachOpen, setHowToReachOpen] = useState(true);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(
    `${data.destinationName}, ${data.name}`
  );

  const images =
    data.heroImages && data.heroImages.length > 0
      ? data.heroImages
      : [
          "/assets/ac-double-room.webp",
          "/assets/deluxe-garden-suite.webp",
          "/assets/six-bed-dormitory.webp",
          "/assets/non-ac-double-room.webp",
        ];

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleCheckAvailability = () => {
    if (data.rooms[0]?.bookingLink) {
      window.open(data.rooms[0].bookingLink, "_blank");
    } else {
      window.location.href = "/contact-us";
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111827]">
      {/* Top Navbar */}
      <Navbar />

      <div className="w-full max-w-[1920px] mx-auto px-3 md:px-8">
        <div className="px-5 md:px-8 lg:px-15 pt-28 md:pt-36 lg:pt-40 pb-20">
          {/* ── 1. Top Panoramic Hero Carousel ──────────────────────────────── */}
          <section className="relative w-full mb-12 md:mb-16">
            <div className="relative w-full overflow-hidden rounded-[24px] md:rounded-[28px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] bg-gray-100 aspect-[16/9] md:aspect-[21/9] max-h-[560px]">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    idx === activeSlide ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${data.name} photo ${idx + 1}`}
                    fill
                    priority={idx === 0}
                    className="object-cover"
                  />
                </div>
              ))}

              {/* Previous / Next Controls */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 hover:bg-white text-gray-900 shadow-md backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 hover:bg-white text-gray-900 shadow-md backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  {/* Dot Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md">
                    {images.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={() => setActiveSlide(dotIdx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          dotIdx === activeSlide ? "w-6 bg-white" : "w-2 bg-white/50"
                        }`}
                        aria-label={`Go to slide ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* ── 2. Main 2-Column Section: All Content on Left, Only Sticky Widget on Right ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-start">
            {/* Left Column: All Page Content (Adjusted to Left) */}
            <div className="lg:col-span-8 space-y-16 md:space-y-20">
              {/* ── A. Property Details & Description ── */}
              <div>
                <p className="font-sans text-[11px] md:text-[12px] font-bold uppercase tracking-[0.25em] text-[#6b7280] mb-2">
                  PROPERTY DETAILS
                </p>
                <h1 className="font-sans text-3xl sm:text-4xl md:text-[42px] font-semibold text-[#111827] leading-tight tracking-tight mb-10">
                  {data.name}
                </h1>
                <p className="font-sans text-[15px] md:text-[16px] text-[#4b5563] leading-relaxed max-w-3xl">
                  {data.description ||
                    `${data.name} offers thoughtfully designed spaces with modern amenities, warm hospitality, and a vibrant community experience for students and professionals.`}
                </p>

                {/* Premium Amenities */}
                <div className="mt-12">
                  <h2 className="font-sans text-2xl md:text-[26px] font-semibold text-[#111827] mb-10">
                    Premium Amenities
                  </h2>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-4">
                    {AMENITY_ICONS.map((item, aIdx) => {
                      const Icon = item.icon;
                      return (
                        <div key={aIdx} className="flex flex-col items-center text-center">
                          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#d8e6ce] flex items-center justify-center text-[#3a5535] shadow-xs">
                            <Icon className="w-6 h-6 md:w-7 md:h-7 stroke-[1.75]" />
                          </div>
                          <span className="font-sans text-[12.5px] md:text-[13px] font-medium text-[#374151] mt-3">
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── B. Select Room ── */}
              <section>
                <h2 className="font-sans text-2xl md:text-3xl font-semibold text-[#111827] mb-10">
                  Select Room
                </h2>

                <div className="space-y-6">
                  {data.rooms.map((room, rIdx) => {
                    const roomImg =
                      (room.images && room.images.length > 0 && room.images[0]) ||
                      "/assets/ac-double-room.webp";
                    const roomBadge =
                      room.badge ||
                      (rIdx === 0
                        ? "Private room"
                        : rIdx === 1
                        ? "Dormitory"
                        : "Private rooms");
                    const roomAmenities =
                      room.amenities && room.amenities.length > 0
                        ? room.amenities
                        : ["Free Wifi", "Restaurant", "Study Desk", "Double Occupancy"];
                    const bookUrl = room.bookingLink || data.rooms[0]?.bookingLink || "/rooms";

                    return (
                      <div
                        key={room._id || rIdx}
                        className="bg-white rounded-[22px] overflow-hidden border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-6 p-4 md:p-6 transition-all hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
                      >
                        {/* Left Room Image */}
                        <div className="relative w-full md:w-[320px] lg:w-[340px] xl:w-[360px] aspect-[16/10] md:aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          <Image
                            src={roomImg}
                            alt={room.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 360px"
                            className="object-cover"
                          />
                        </div>

                        {/* Right Room Info */}
                        <div className="flex flex-col justify-between flex-1 py-1">
                          <div>
                            {/* Badge / Category */}
                            <p className="font-sans text-[13px] text-[#6b7280] font-normal mb-1">
                              {roomBadge}
                            </p>

                            {/* Room Title */}
                            <h3 className="font-sans text-xl md:text-[22px] font-semibold text-[#111827] leading-snug">
                              {room.name}
                            </h3>

                            {/* Room Subtitle */}
                            <p className="font-sans text-[13px] text-[#6b7280] mt-4 mb-5">
                              {room.description || "Spacious Double occupancy room with extra comfort"}
                            </p>

                            {/* Amenities Pills */}
                            <div className="flex flex-wrap gap-2 mb-6">
                              {roomAmenities.map((amenity, aIdx) => (
                                <span
                                  key={aIdx}
                                  className="inline-flex items-center px-2.5 py-1 rounded-[6px] bg-[#f3f4f6] text-[12px] font-medium text-[#4b5563]"
                                >
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Book Now Button */}
                          <div className="pt-2">
                            <a
                              href={bookUrl}
                              target={bookUrl.startsWith("http") ? "_blank" : undefined}
                              rel={bookUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                              className="w-full py-3 rounded-xl border border-[#111827] text-[#111827] font-semibold text-[13.5px] hover:bg-[#0d1b2e] hover:text-white transition-all text-center block shadow-xs"
                            >
                              Book Now
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* ── C. Gallery ── */}
              <section>
                <h2 className="font-sans text-2xl md:text-3xl font-semibold text-[#111827] mb-10">
                  Gallery
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 max-w-[860px]">
                  {/* Tile 1 */}
                  <div className="relative w-full max-w-[416px] h-[240px] sm:h-[280px] md:h-[300px] aspect-[416/300] rounded-[8px] overflow-hidden bg-gray-100 shadow-xs">
                    <Image
                      src={DEFAULT_GALLERY_IMAGES[0]}
                      alt="Community group photo"
                      fill
                      sizes="(max-width: 768px) 100vw, 416px"
                      className="object-cover"
                    />
                  </div>

                  {/* Tile 2 */}
                  <div className="relative w-full max-w-[416px] h-[240px] sm:h-[280px] md:h-[300px] aspect-[416/300] rounded-[8px] overflow-hidden bg-gray-100 shadow-xs">
                    <Image
                      src={DEFAULT_GALLERY_IMAGES[1]}
                      alt="Balcony guest photo"
                      fill
                      sizes="(max-width: 768px) 100vw, 416px"
                      className="object-cover"
                    />
                  </div>

                  {/* Tile 3 */}
                  <div className="relative w-full max-w-[416px] h-[240px] sm:h-[280px] md:h-[300px] aspect-[416/300] rounded-[8px] overflow-hidden bg-gray-100 shadow-xs">
                    <Image
                      src={DEFAULT_GALLERY_IMAGES[2]}
                      alt="Adventure bikers photo"
                      fill
                      sizes="(max-width: 768px) 100vw, 416px"
                      className="object-cover"
                    />
                  </div>

                  {/* Tile 4: View all with dark overlay */}
                  <Link
                    href="/gallery"
                    className="group relative w-full max-w-[416px] h-[240px] sm:h-[280px] md:h-[300px] aspect-[416/300] rounded-[8px] overflow-hidden bg-gray-900 shadow-xs block"
                  >
                    <Image
                      src={DEFAULT_GALLERY_IMAGES[3]}
                      alt="More gallery photo"
                      fill
                      sizes="(max-width: 768px) 100vw, 416px"
                      className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="font-sans text-[15px] md:text-[16px] font-medium text-white flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                        View all <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </div>
              </section>

              {/* ── D. Location & How to reach ── */}
              <section>
                <h2 className="font-sans text-2xl md:text-3xl font-semibold text-[#111827] mb-10">
                  Location
                </h2>

                <div className="bg-[#ede7d8] rounded-2xl overflow-hidden border border-[#dfd7c3] shadow-xs">
                  {/* Top address bar */}
                  <div className="p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dfd7c3]">
                    <p className="font-sans text-[15px] md:text-[16px] text-[#374151]">
                      {data.address || "Karzu Road, Near circuit house, Karzu-194101"}
                    </p>
                    {data.mapLink ? (
                      <a
                        href={data.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-5 py-2 rounded-lg border border-[#374151] text-[#1f2937] text-xs font-semibold hover:bg-black/5 transition-colors self-start sm:self-auto text-center"
                      >
                        View on map
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          window.open(
                            `https://maps.google.com/?q=${encodeURIComponent(data.address || data.name)}`,
                            "_blank"
                          )
                        }
                        className="px-5 py-2 rounded-lg border border-[#374151] text-[#1f2937] text-xs font-semibold hover:bg-black/5 transition-colors self-start sm:self-auto cursor-pointer"
                      >
                        View on map
                      </button>
                    )}
                  </div>

                  {/* Accordion header */}
                  <button
                    type="button"
                    onClick={() => setHowToReachOpen((prev) => !prev)}
                    className="w-full px-6 md:px-8 py-4 flex items-center justify-between bg-[#ede7d8] hover:bg-[#e7e0cf] transition-colors text-left cursor-pointer"
                  >
                    <span className="font-sans text-[17px] md:text-[18px] font-semibold text-[#1f2937]">
                      How to reach
                    </span>
                    {howToReachOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#374151]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#374151]" />
                    )}
                  </button>

                  {/* Accordion body */}
                  {howToReachOpen && (
                    <div className="p-6 md:p-8 bg-white border-t border-[#dfd7c3] space-y-4 text-xs md:text-sm text-[#4b5563] leading-relaxed">
                      <h4 className="font-bold text-gray-900 text-sm md:text-[15px] mb-2">
                        Travel Directions
                      </h4>

                      <div>
                        <p className="font-bold text-gray-800">
                          From {data.destinationName} Railway Station:
                        </p>
                        <p>
                          {data.directions?.railway ||
                            `${data.name} is located close to ${data.destinationName} Railway Station and is easily accessible by auto, taxi, or local transport.`}
                        </p>
                      </div>

                      <div>
                        <p className="font-bold text-gray-800">
                          From {data.destinationName} Bus Stand:
                        </p>
                        <p>
                          {data.directions?.busStand ||
                            `The property is just a short drive from ${data.destinationName} Bus Stand. Guests can take a local auto or taxi to reach ${data.name}.`}
                        </p>
                      </div>

                      <div>
                        <p className="font-bold text-gray-800">
                          From {data.destinationName} Landmark / Center:
                        </p>
                        <p>
                          {data.directions?.landmark ||
                            `${data.name} is located near key local attractions. Follow the main access road towards the property.`}
                        </p>
                      </div>

                      <div>
                        <p className="font-bold text-gray-800">By Car:</p>
                        <p>
                          {data.directions?.byCar ||
                            `Drive towards ${data.destinationName} and continue along the main road. Follow the directions to ${data.name} using Google Maps. Parking is available at the property, subject to availability.`}
                        </p>
                      </div>

                      <div className="pt-2">
                        <p className="font-bold text-gray-800">Important:</p>
                        <p>
                          {data.directions?.important ||
                            `As the property is located in a popular area, traffic and parking availability may vary during weekends, holidays, and peak tourist seasons. We recommend using Google Maps for the most convenient route.`}
                        </p>
                      </div>

                      <div className="pt-1">
                        <p className="font-bold text-gray-800">Need Help Finding Us?</p>
                        <p>
                          {data.directions?.helpText ||
                            `If you need assistance with directions or transportation, please contact our property team. We'll be happy to guide you to ${data.name}.`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* ── E. Contact ── */}
              <section>
                <h2 className="font-sans text-2xl md:text-3xl font-semibold text-[#111827] mb-10">
                  Contact
                </h2>

                <div className="bg-[#ede7d8] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#dfd7c3]">
                  {/* Phone & Email */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
                    {/* Phone */}
                    <a
                      href={`tel:${data.phone || "+917448749779"}`}
                      className="flex items-center gap-3 text-sm md:text-[15px] font-medium text-gray-900 hover:text-[#526442] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-800 shadow-xs">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span>
                        <strong>Phone :</strong> {data.phone || "+91 74487 49779"}
                      </span>
                    </a>

                    {/* Email */}
                    <a
                      href={`mailto:${data.email || "hostelsparrow@gmail.com"}`}
                      className="flex items-center gap-3 text-sm md:text-[15px] font-medium text-gray-900 hover:text-[#526442] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-800 shadow-xs">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span>
                        <strong>Email :</strong> {data.email || "hostelsparrow@gmail.com"}
                      </span>
                    </a>
                  </div>

                  {/* Whatsapp Button */}
                  <div>
                    <a
                      href={`https://wa.me/${(data.whatsapp || data.phone || "917448749779").replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-[#374151] bg-white/40 hover:bg-white text-gray-900 text-sm font-semibold transition-colors shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                      <span>Whatsapp</span>
                    </a>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Sticky Booking Widget (ONLY this widget, nothing below it, aligned straight down to Book Now) */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 md:top-32 bg-white rounded-2xl p-6 md:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100">
                <div className="space-y-4">
                  {/* Location */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Location
                    </label>
                    <div className="relative">
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full h-11 px-3.5 pr-9 rounded-xl border border-gray-200 bg-gray-50/70 text-[13.5px] font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0d1b2e] appearance-none"
                      >
                        <option value={`${data.destinationName}, ${data.name}`}>
                          {data.destinationName}, {data.name}
                        </option>
                        <option value="Kanniyakumari, Kattil The Sparrow">
                          Kanniyakumari, Kattil The Sparrow
                        </option>
                        <option value="Madurai, Kattil Heritage">Madurai, Kattil Heritage</option>
                        <option value="Chennai, Kattil Executive">Chennai, Kattil Executive</option>
                        <option value="Coimbatore, Kattil Stay">Coimbatore, Kattil Stay</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Check In */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Check In
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50/70 text-[13.5px] font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0d1b2e]"
                      />
                    </div>
                  </div>

                  {/* Check Out */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Check Out
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50/70 text-[13.5px] font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0d1b2e]"
                      />
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="button"
                    onClick={handleCheckAvailability}
                    className="w-full mt-2 py-3.5 rounded-xl bg-[#0d1b2e] hover:bg-[#162a45] text-white text-sm font-semibold transition-colors shadow-sm cursor-pointer"
                  >
                    Check Availability
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
