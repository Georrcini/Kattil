"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export interface GalleryPreviewItem {
  src: string;
  alt: string;
  location: string;
}

const FALLBACK_IMAGES: GalleryPreviewItem[] = [
  { src: "/assets/madurai-gallery/image-1.jpeg",  alt: "Private room with carved wooden bed",  location: "Madurai" },
  { src: "/assets/chennai-gallery/image-3.jpeg",  alt: "Building exterior at night",            location: "Chennai" },
  { src: "/assets/madurai-gallery/image-5.jpeg",  alt: "Lit building entrance at evening",      location: "Madurai" },
  { src: "/assets/chennai-gallery/image-1.jpeg",  alt: "Dormitory room with bunk beds",         location: "Chennai" },
];

// ─── Static card with location label ─────────────────────────────────────────
function GalleryCard({
  src,
  alt,
  location,
  sizes = "(max-width: 1024px) 100vw, 33vw",
}: {
  src: string;
  alt: string;
  location: string;
  sizes?: string;
}) {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-sm group">
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        unoptimized={src.startsWith("https://")}
      />
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-500" />
      <span className="absolute bottom-3 left-3 font-sans text-[10px] font-bold uppercase tracking-[0.22em]
        text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
        {location}
      </span>
    </div>
  );
}

// ─── Mobile infinite slider ───────────────────────────────────────────────────
const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (direction: number) => ({ x: direction < 0 ? "100%" : "-100%", opacity: 0 }),
};

function MobileGallerySlider({ images }: { images: GalleryPreviewItem[] }) {
  const [[page, direction], setPage] = useState([0, 0]);
  const [dragging, setDragging] = useState(false);
  const total = images.length;

  const paginate = useCallback(
    (dir: number) => setPage(([p]) => [(p + dir + total) % total, dir]),
    [total],
  );

  useEffect(() => {
    if (dragging) return;
    const timer = setInterval(() => paginate(1), 3500);
    return () => clearInterval(timer);
  }, [dragging, paginate]);

  const img = images[page];

  return (
    <div className="relative w-full aspect-3/4 overflow-hidden rounded-sm">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: EASE }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragStart={() => setDragging(true)}
          onDragEnd={(_, info) => {
            setDragging(false);
            if (info.offset.x < -50) paginate(1);
            else if (info.offset.x > 50) paginate(-1);
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="100vw"
            className="object-cover pointer-events-none select-none"
            unoptimized={img.src.startsWith("https://")}
          />
          <span className="absolute bottom-4 left-4 font-sans text-[10px] font-bold uppercase tracking-[0.22em]
            text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
            {img.location}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(([p]) => [i, i > p ? 1 : -1])}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === page ? "bg-white scale-125" : "bg-white/45"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GalleryPreview({
  eyebrow = "Our Spaces",
  heading = "Moments Captured",
  ctaText = "View All Moments",
  images,
}: {
  eyebrow?: string;
  heading?: string;
  ctaText?: string;
  images?: GalleryPreviewItem[];
}) {
  const preview = images && images.length >= 4 ? images.slice(0, 4) : FALLBACK_IMAGES;
  const [a, b, c, d] = preview;

  return (
    <section className="bg-[#F8F4E5] py-10 md:py-20 lg:py-28">
      <div className="mx-auto max-w-480 px-5 md:px-8 lg:px-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-160px 0px 0px 0px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-10"
        >
          <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.25em] text-[#526442] mb-4">
            {eyebrow}
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-[#000000] tracking-tight leading-tight">
            {heading}
          </h2>
        </motion.div>

        {/* Desktop layout — 3-column grid, 4 images */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_1fr_1fr] gap-3 h-80 2xl:h-140">
          {/* Left — full-height */}
          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            whileInView={{ clipPath: "inset(0 0% 0 0)" }}
            viewport={{ once: true, margin: "-100px 0px 0px 0px" }}
            transition={{ duration: 0.85, ease: EASE }}
            className="h-full"
          >
            <GalleryCard src={a.src} alt={a.alt} location={a.location} />
          </motion.div>

          {/* Middle — full-height */}
          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            whileInView={{ clipPath: "inset(0 0% 0 0)" }}
            viewport={{ once: true, margin: "-100px 0px 0px 0px" }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.12 }}
            className="h-full"
          >
            <GalleryCard src={b.src} alt={b.alt} location={b.location} />
          </motion.div>

          {/* Right — two stacked */}
          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            whileInView={{ clipPath: "inset(0 0% 0 0)" }}
            viewport={{ once: true, margin: "-100px 0px 0px 0px" }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.24 }}
            className="flex flex-col gap-3 h-full"
          >
            <div className="flex-1">
              <GalleryCard src={c.src} alt={c.alt} location={c.location} sizes="33vw" />
            </div>
            <div className="flex-1">
              <GalleryCard src={d.src} alt={d.alt} location={d.location} sizes="33vw" />
            </div>
          </motion.div>
        </div>

        {/* Mobile/tablet — swipeable slider */}
        <motion.div
          className="lg:hidden"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px 0px 0px 0px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <MobileGallerySlider images={preview} />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px 0px 0px 0px" }}
          transition={{ duration: 0.55, delay: 0.25, ease: EASE }}
          className="flex justify-center mt-10 md:mt-12"
        >
          <Link
            href="/gallery"
            className="group relative overflow-hidden inline-flex items-center font-sans text-sm font-medium
              tracking-wide border border-primary/40 rounded px-8 py-3.5
              hover:border-primary transition-all duration-400 ease-out"
          >
            <span className="absolute inset-0 bg-primary scale-x-0 origin-left transition-transform duration-400 ease-out group-hover:scale-x-100" />
            <span className="relative z-10 text-primary transition-colors duration-400 group-hover:text-white">
              {ctaText}
            </span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
