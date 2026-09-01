"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { usePageView } from "@/hooks/usePageView";
import type { AboutData } from "./page";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function AnimatedWords({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  return (
    <span className={className}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.45, delay: delay + i * 0.055, ease: "easeOut" }}
          style={{ display: "inline-block", marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

const FALLBACK_EYEBROW = "Our Story";
const FALLBACK_HEADING = "Created for Productivity, Relaxation, and Community";
const FALLBACK_PARAGRAPHS = [
  "Kattil is a premium heritage-industrial hostel and co-living space designed for tech professionals, digital nomads, backpackers, and solo travelers seeking a comfortable and connected stay experience.",
  "Located in prime city neighborhoods with seamless access to major hubs and local attractions, Kattil offers premium AC dorms with signature individual pod-cooling, secure lockers, high-speed Wi-Fi, and clean, hygienic living spaces.",
  // "Our common areas, rooftop lounges, and shared kitchens are crafted to spark genuine connections. Whether you're here for a night or a month, Kattil is your home away from home.",
];

export default function AboutContent({ about }: { about: AboutData | null }) {
  usePageView();
  const eyebrow = about?.subheading || FALLBACK_EYEBROW;
  const heading = about?.heading || FALLBACK_HEADING;
  const primaryImage = about?.images?.[0] || "/assets/about-us-2.webp";
  const secondaryImage = about?.images?.[1] || "/assets/about-us-1.webp";

  // description is stored as paragraphs joined with \n\n
  const paragraphs = about?.description
    ? about.description.split("\n\n").filter(Boolean)
    : FALLBACK_PARAGRAPHS;

  return (
    <>
      <Navbar />

      <section className="bg-secondary min-h-screen pt-16 md:pt-25 2xl:pt-30 overflow-hidden">
        <div className="mx-auto max-w-400 px-5 sm:px-8 lg:px-12 xl:px-20 2xl:px-24 py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-14 lg:gap-12 xl:gap-18 2xl:gap-24 items-center">

            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, ease: EASE }}
              className="relative flex justify-center lg:justify-start pb-20 md:pb-24 lg:pb-20"
            >
              <motion.div
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
                className="relative w-full md:w-[68%] lg:w-[78%] xl:w-[72%] aspect-3/2 md:aspect-3/3 2xl:aspect-3/3 rounded-[28px] overflow-hidden shadow-xl"
              >
                <Image src={primaryImage} alt="Kattil interior" fill priority sizes="(max-width: 768px) 90vw, (max-width: 1280px) 42vw, 32vw" className="object-cover" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
                className="absolute bottom-0 right-[3%] md:right-[5%] sm:right-[10%] lg:right-0 xl:right-[5%] w-[50%] md:w-[30%] lg:w-[38%] xl:w-[40%] aspect-square rounded-[24px] overflow-hidden border-[10px] border-secondary"
              >
                <Image src={secondaryImage} alt="Kattil experience" fill sizes="(max-width: 768px) 45vw, (max-width: 1280px) 22vw, 18vw" className="object-cover" />
              </motion.div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
              className="flex flex-col max-w-190"
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                className="font-sans text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.32em] text-tertiary mb-4 2xl:mb-5"
              >
                {eyebrow}
              </motion.p>

              <h1 className="font-serif text-white font-normal tracking-tight leading-[1.04] mb-6 2xl:mb-8 text-3xl sm:text-[3rem] md:text-[3.5rem] lg:text-[2.8rem] 2xl:text-[3.5rem] max-w-full">
                <AnimatedWords text={heading} delay={0.25} />
              </h1>

              {paragraphs.map((text, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, delay: 0.7 + i * 0.12, ease: "easeOut" }}
                  className="font-sans text-tertiary leading-relaxed text-[15px] sm:text-base xl:text-lg mb-3 2xl:mb-2 max-w-[60ch]"
                >
                  {text}
                </motion.p>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
