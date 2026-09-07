"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface DestinationItem {
  name: string;
  pillLabel: string;
  image: string;
  href: string;
}

const DESTINATIONS: DestinationItem[] = [
  {
    name: "Kanyakumari",
    pillLabel: "Kanyakumari",
    image: "/images/destinations/kanyakumari.png",
    href: "/rooms",
  },
  {
    name: "Madurai",
    pillLabel: "Madurai",
    image: "/images/destinations/madurai.png",
    href: "/rooms",
  },
  {
    name: "Coimbatore",
    pillLabel: "Coimbatore",
    image: "/images/destinations/coimbatore.png",
    href: "/coimbatore",
  },
];

export default function DestinationsSection() {
  return (
    <section
      id="destinations"
      className="bg-transparent pt-36 pb-10 md:pt-36 md:pb-20 lg:pt-36 lg:pb-28 mt-25 scroll-mt-[110px] 2xl:scroll-mt-[135px]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <h2 className="text-[#0d1b2e] text-[32px] sm:text-[40px] md:text-[44px] font-sans font-normal tracking-tight">
            Destinations to{" "}
            <span className="font-serif italic font-normal text-[#0d1b2e]">
              Discover
            </span>
          </h2>
        </motion.div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {DESTINATIONS.map((dest, index) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                delay: index * 0.08,
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={dest.href}
                className="group relative block aspect-[3/4.2] rounded-[8px] overflow-hidden bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-all duration-300"
              >
                {/* Top Pill Tag */}
                <div className="absolute top-4 left-4 right-4 flex justify-center z-10">
                  <div
                    className="
      w-full
      h-[35px]
      flex items-center justify-center
      bg-[#FFFCF2]
      backdrop-blur-[4px]
      rounded-[70px]
      px-4
      text-[13px]
      font-medium
      text-[#52613F]
      tracking-tight
      shadow-none
      translate-y-3
      transition-colors
    "
                  >
                    {dest.pillLabel}
                  </div>
                </div>
                {/* Destination Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
              </Link>
            </motion.div>
          ))}

          {/* 4th Card: View all our Destination */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              delay: 0.25,
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              href="/rooms"
              className="group relative flex flex-col aspect-[3/4.2] rounded-[8px] overflow-hidden bg-[#C5D9B0] text-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-all duration-300"
            >
              {/* Full Artwork Background */}
              <div className="relative w-full h-full">
                <Image
                  src="/images/destinations/destination-card-bg.png"
                  alt="View all our destinations"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Bottom CTA */}
              <div className="absolute bottom-5 left-5 right-5 z-10 flex items-end justify-between gap-3">
                <p className="text-white text-[18px] sm:text-[20px] font-normal leading-[1.15] tracking-tight drop-shadow-sm">
                  View all our
                  <br />
                  Destination
                </p>

                <div className="w-10 h-10 rounded-[8px] bg-white text-[#8FAE80] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <ArrowRight className="w-5 h-5 stroke-[1.8]" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
