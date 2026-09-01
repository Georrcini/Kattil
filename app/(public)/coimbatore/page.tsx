import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { SITE_URL } from "@/lib/seo";

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Kattil — The Homely Hotel, Coimbatore",
  url: `${SITE_URL}/coimbatore`,
  image: `${SITE_URL}/assets/gallery.png`,
  telephone: "+917448749779",
  email: "hostelsparrow@gmail.com",
  description:
    "Kattil Coimbatore offers premium co-living and hotel rooms in Race Course / Gopalapuram, one of Coimbatore's most peaceful and accessible neighbourhoods. High-speed Wi-Fi, AC rooms, and curated community spaces.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "124, Race Course Road, Gopalapuram",
    addressLocality: "Coimbatore",
    addressRegion: "Tamil Nadu",
    postalCode: "641018",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "11.0016",
    longitude: "76.9746",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  priceRange: "₹₹",
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Air Conditioning", value: true },
    { "@type": "LocationFeatureSpecification", name: "24-hour Front Desk", value: true },
  ],
};

export const metadata: Metadata = {
  title: "Hotel in Coimbatore | Kattil — Homely Stay in Race Course",
  description:
    "Stay at Kattil Coimbatore — a premium hotel near Race Course offering AC rooms, co-working spaces, and warm hospitality. Ideal for travellers, professionals, and digital nomads.",
  keywords: [
    "hotel in Coimbatore",
    "homely hotel Coimbatore",
    "stay in Coimbatore",
    "luxury hotel Race Course Coimbatore",
    "co-living Coimbatore",
    "Kattil Coimbatore",
    "budget hotel Coimbatore",
    "premium hostel Coimbatore",
  ],
  alternates: {
    canonical: `${SITE_URL}/coimbatore`,
  },
  openGraph: {
    title: "Kattil Coimbatore — Homely Hotel in Race Course",
    description:
      "Premium AC rooms and co-working spaces in the heart of Coimbatore. Book your stay at Kattil today.",
    url: `${SITE_URL}/coimbatore`,
    images: [{ url: "/assets/gallery.png", width: 1200, height: 630, alt: "Kattil Coimbatore Hotel" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kattil Coimbatore — Homely Hotel",
    description: "Premium stay in Race Course, Coimbatore. Book now.",
    images: ["/assets/gallery.png"],
  },
};

const features = [
  { label: "Prime Location", desc: "Race Course — serene, green neighbourhood close to railway station & airport" },
  { label: "AC Rooms & Dorms", desc: "Private deluxe rooms and shared dormitories with individual pod cooling" },
  { label: "High-Speed Wi-Fi", desc: "Fibre broadband across all rooms and co-working areas" },
  { label: "24/7 Support", desc: "Our friendly team is always on-site to assist your stay" },
];

export default function CoimbatorePage() {
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
            Coimbatore Property
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.2rem] font-normal text-white leading-[1.08] tracking-tight mb-6 max-w-2xl">
            Your Home in the Manchester of South India
          </h1>
          <p className="font-sans text-base text-white/70 leading-relaxed max-w-xl mb-10">
            Located near Race Course — one of Coimbatore's finest and most connected neighbourhoods — Kattil
            offers premium AC rooms, dedicated workspaces, and a welcoming atmosphere that turns every journey
            into a relaxed stay.
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
            What Makes Kattil Coimbatore Special
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
              Explore Coimbatore From Our Doorstep
            </h2>
            <p className="font-sans text-base text-white/70 leading-relaxed mb-6 max-w-2xl">
              Race Course puts you minutes from top textile centers, tech parks, famous local eateries,
              and easy transit towards Isha Yoga and the Nilgiris foothills. Kattil Coimbatore is your
              perfect retreat.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {["Coimbatore Junction — 10 min", "Race Course Walking Track — 3 min", "Airport — 20 min"].map((item) => (
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
                124, Race Course Road, Gopalapuram, Coimbatore, Tamil Nadu 641018
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
