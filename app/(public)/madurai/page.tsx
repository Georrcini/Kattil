import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { SITE_URL } from "@/lib/seo";

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Kattil — The Homely Hotel, Madurai",
  url: `${SITE_URL}/madurai`,
  image: `${SITE_URL}/assets/gallery.png`,
  telephone: "+917448749779",
  email: "hostelsparrow@gmail.com",
  description:
    "Kattil Madurai offers comfortable hotel rooms and dormitories near the Temple City's most iconic landmarks. Heritage-inspired interiors, warm service, and modern amenities.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "J17 Poondi, No.6/29, Anna Nagar",
    addressLocality: "Madurai",
    addressRegion: "Tamil Nadu",
    postalCode: "625701",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "9.9252",
    longitude: "78.1198",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  priceRange: "₹₹",
};

export const metadata: Metadata = {
  title: "Hotel in Madurai | Kattil — Homely Stay Near Meenakshi Temple",
  description:
    "Stay at Kattil Madurai — a homely hotel near Meenakshi Temple offering AC rooms, dormitories, and a warm Tamil Nadu hospitality experience. Perfect for pilgrims, tourists, and business travellers.",
  keywords: [
    "hotel in Madurai",
    "homely hotel Madurai",
    "stay in Madurai",
    "hotel near Meenakshi Temple",
    "budget hotel Madurai",
    "Kattil Madurai",
    "premium hostel Madurai",
    "Tamil Nadu hotel",
  ],
  alternates: {
    canonical: `${SITE_URL}/madurai`,
  },
  openGraph: {
    title: "Kattil Madurai — Homely Hotel Near Temple City",
    description:
      "Comfortable rooms and dormitories in the heart of Madurai. Book your stay at Kattil today.",
    url: `${SITE_URL}/madurai`,
    images: [{ url: "/assets/gallery.png", width: 1200, height: 630, alt: "Kattil Madurai Hotel" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kattil Madurai — Homely Hotel",
    description: "Comfortable stay near Meenakshi Temple, Madurai.",
    images: ["/assets/gallery.png"],
  },
};

const features = [
  { label: "Heritage Location", desc: "Steps away from Meenakshi Temple and Madurai's cultural heart" },
  { label: "Mixed & Private Rooms", desc: "6-bed dormitories and AC double rooms for every budget" },
  { label: "Warm Hospitality", desc: "Tamil Nadu's signature warmth baked into every interaction" },
  { label: "24/7 Check-in", desc: "Flexible arrivals welcomed — no curfew, no hassle" },
];

export default function MaduraiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <Navbar />

      {/* Hero */}
      <section className="bg-secondary pt-28 md:pt-36 lg:pt-44 pb-16 md:pb-20">
        <div className="mx-auto max-w-480 px-5 md:px-8 lg:px-20">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.32em] text-white/60 mb-5">
            Madurai Property
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.2rem] font-normal text-white leading-[1.08] tracking-tight mb-6 max-w-2xl">
            Heritage Comfort in the Temple City
          </h1>
          <p className="font-sans text-base text-white/70 leading-relaxed max-w-xl mb-10">
            Madurai is one of India's oldest living cities. Kattil places you in the middle of it —
            close to the Meenakshi Temple, local markets, and the city's timeless rhythm — with
            modern comforts and genuine Tamil hospitality.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/rooms"
              className="inline-block px-7 py-3.5 bg-white text-secondary font-sans text-[11px] font-bold uppercase tracking-[0.22em] rounded-lg hover:bg-white/90 transition-colors duration-200"
            >
              View Rooms
            </Link>
            <Link
              href="/contact-us"
              className="inline-block px-7 py-3.5 border border-white/30 text-white font-sans text-[11px] font-bold uppercase tracking-[0.22em] rounded-lg hover:border-white/60 transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-tertiary py-14 md:py-20">
        <div className="mx-auto max-w-480 px-5 md:px-8 lg:px-20">
          <h2 className="font-serif text-2xl md:text-3xl font-normal text-primary tracking-tight mb-10">
            Why Travellers Choose Kattil Madurai
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-14">
            {features.map((f) => (
              <div key={f.label} className="bg-white rounded-2xl px-7 py-6 border border-primary/8">
                <h3 className="font-serif text-lg font-semibold text-primary mb-2">{f.label}</h3>
                <p className="font-sans text-[15px] text-primary/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* About the area */}
          <div className="bg-secondary rounded-2xl px-8 py-10 md:px-12 md:py-12">
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-white mb-5">
              Discover Madurai at Your Own Pace
            </h2>
            <p className="font-sans text-base text-white/70 leading-relaxed mb-6 max-w-2xl">
              From the magnificent Meenakshi Amman Temple to the fragrant jasmine markets and
              legendary Madurai Meen Kuzhambu, this city rewards every curious traveller.
              Kattil Madurai is your base to explore it all without rushing.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {["Meenakshi Temple — 5 min", "Madurai Junction — 10 min", "Thiruparankundram — 20 min"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                  <span className="font-sans text-[13px] text-white/70">{item}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/rooms"
                className="inline-block px-6 py-3 bg-white text-secondary font-sans text-[11px] font-bold uppercase tracking-[0.2em] rounded-lg hover:bg-white/90 transition-colors duration-200"
              >
                Book a Room
              </Link>
              <Link
                href="/contact-us"
                className="inline-block px-6 py-3 border border-white/30 text-white font-sans text-[11px] font-bold uppercase tracking-[0.2em] rounded-lg hover:border-white/60 transition-colors duration-200"
              >
                Get Directions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Address */}
      <section className="bg-white py-10 border-t border-primary/8">
        <div className="mx-auto max-w-480 px-5 md:px-8 lg:px-20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-primary/50 mb-1">Address</p>
              <p className="font-sans text-base text-primary font-medium">
                J17 Poondi, No.6/29, Anna Nagar, Madurai, Tamil Nadu 625701
              </p>
            </div>
            <a
              href="tel:+917448749779"
              className="font-sans text-[13px] font-semibold text-primary hover:text-secondary transition-colors shrink-0"
            >
              +91 74487 49779
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
