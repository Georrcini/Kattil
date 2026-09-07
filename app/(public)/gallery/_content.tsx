"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { usePageView } from "@/hooks/usePageView";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Location = "chennai" | "madurai";
const LOCATION_TABS: Location[] = ["chennai", "madurai"];

// ── Shared public types (also imported by page.tsx) ───────────────────────────
export interface PublicGalleryItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category: string;  // slug e.g. "rooms"
  cityName?: string; // lowercase city name e.g. "chennai" | "madurai"
  featured: boolean;
  width?: number;
  height?: number;
}

export interface PublicGalleryCategory {
  slug: string;
  name: string; // display name e.g. "Rooms"
}

// ── Static fallback ───────────────────────────────────────────────────────────
// Used when the CMS gallery has no images yet.
export const STATIC_CATEGORIES: PublicGalleryCategory[] = [
  { slug: "rooms",    name: "Rooms"    },
  { slug: "exterior", name: "Exterior" },
  { slug: "outdoor",  name: "Outdoor"  },
];

export const STATIC_ITEMS: PublicGalleryItem[] = [
  // Chennai
  { id: "ch1", src: "/assets/chennai-gallery/image-1.jpeg", alt: "Dormitory room with bunk beds",        category: "rooms",    cityName: "chennai", featured: false, width: 1500, height: 1000 },
  { id: "ch2", src: "/assets/chennai-gallery/image-2.jpeg", alt: "Bathroom with marble tiles",           category: "rooms",    cityName: "chennai", featured: false, width: 1500, height: 1000 },
  { id: "ch3", src: "/assets/chennai-gallery/image-3.jpeg", alt: "Building exterior at night",           category: "exterior", cityName: "chennai", featured: false, width: 1500, height: 1000 },
  { id: "ch4", src: "/assets/chennai-gallery/image-4.jpeg", alt: "Dormitory room overview",              category: "rooms",    cityName: "chennai", featured: false, width: 1500, height: 1000 },
  // Madurai
  { id: "md1", src: "/assets/madurai-gallery/image-1.jpeg", alt: "Private room with carved wooden bed",  category: "rooms",    cityName: "madurai", featured: false, width: 1500, height: 1000 },
  { id: "md2", src: "/assets/madurai-gallery/image-2.jpeg", alt: "In-room AC unit",                      category: "rooms",    cityName: "madurai", featured: false, width: 1500, height: 1000 },
  { id: "md3", src: "/assets/madurai-gallery/image-3.jpeg", alt: "Private room with wooden bed",         category: "rooms",    cityName: "madurai", featured: false, width: 1500, height: 1000 },
  { id: "md4", src: "/assets/madurai-gallery/image-4.jpeg", alt: "Bathroom with white marble tiles",     category: "rooms",    cityName: "madurai", featured: false, width: 1500, height: 1000 },
  { id: "md5", src: "/assets/madurai-gallery/image-5.jpeg", alt: "Lit building entrance at evening",     category: "exterior", cityName: "madurai", featured: false, width: 1500, height: 1000 },
  { id: "md6", src: "/assets/madurai-gallery/image-6.jpeg", alt: "Guests arriving at the property",      category: "outdoor",  cityName: "madurai", featured: false, width: 1500, height: 1000 },
  { id: "md7", src: "/assets/madurai-gallery/image-7.jpeg", alt: "Building exterior at dusk",            category: "exterior", cityName: "madurai", featured: false, width: 1500, height: 1000 },
  { id: "md8", src: "/assets/madurai-gallery/image-8.jpeg", alt: "Dormitory room with bunk beds",        category: "rooms",    cityName: "madurai", featured: false, width: 1500, height: 1000 },
  { id: "md9", src: "/assets/madurai-gallery/image-9.jpeg", alt: "Private room with wooden furniture",   category: "rooms",    cityName: "madurai", featured: false, width: 1500, height: 1000 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function itemsForLocation(items: PublicGalleryItem[], loc: Location): PublicGalleryItem[] {
  return items.filter((item) => !item.cityName || item.cityName === loc);
}

function categoriesForLocation(
  items: PublicGalleryItem[],
  loc: Location,
  allCategories: PublicGalleryCategory[],
): PublicGalleryCategory[] {
  const slugsInUse = new Set(itemsForLocation(items, loc).map((i) => i.category));
  const inUse = allCategories.filter((c) => slugsInUse.has(c.slug));
  // Sort by the order they appear in allCategories (already sorted by CMS order)
  return inUse;
}

// ── Word-by-word blur reveal ──────────────────────────────────────────────────
function AnimatedWords({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.45, delay: delay + i * 0.06, ease: "easeOut" }}
          style={{ display: "inline-block", marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ── Individual tile ───────────────────────────────────────────────────────────
function MasonryTile({ item, categoryName, delay = 0 }: { item: PublicGalleryItem; categoryName: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE, delay }}
      className="overflow-hidden rounded-xl group cursor-pointer relative mb-3"
    >
      <Image
        src={item.src}
        alt={item.alt}
        width={item.width ?? 1500}
        height={item.height ?? 1000}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/25 transition-colors duration-500 flex items-end p-4">
        <span className="font-sans text-[9px] font-bold uppercase tracking-[0.22em] text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
          {categoryName}
        </span>
      </div>
    </motion.div>
  );
}

// ── Masonry columns layout ────────────────────────────────────────────────────
function MasonryColumns({ items, cols, offsets, categoryMap }: {
  items: PublicGalleryItem[];
  cols: number;
  offsets: number[];
  categoryMap: Map<string, string>;
}) {
  const columns: PublicGalleryItem[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => columns[i % cols].push(item));

  return (
    <div className="flex gap-3 items-start">
      {columns.map((col, ci) => (
        <div key={ci} className="flex-1 flex flex-col" style={{ marginTop: offsets[ci] ?? 0 }}>
          {col.map((item, ii) => (
            <MasonryTile
              key={item.id}
              item={item}
              categoryName={categoryMap.get(item.category) ?? item.category}
              delay={(ci * col.length + ii) * 0.06}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function GalleryContent({
  items,
  categories,
}: {
  items: PublicGalleryItem[];
  categories: PublicGalleryCategory[];
}) {
  usePageView();
  const [location, setLocation] = useState<Location>("madurai");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const dirRef = useRef(0);

  // slug → display name map
  const categoryMap = new Map(categories.map((c) => [c.slug, c.name]));

  // Categories that actually have images for the selected location
  const availableCategories = categoriesForLocation(items, location, categories);

  // Items for current location + category filter
  const locationItems = itemsForLocation(items, location);
  const filtered =
    activeCategory === "all"
      ? locationItems
      : locationItems.filter((img) => img.category === activeCategory);

  function handleLocationChange(loc: Location) {
    if (loc === location) return;
    dirRef.current = LOCATION_TABS.indexOf(loc) > LOCATION_TABS.indexOf(location) ? 1 : -1;
    setLocation(loc);
    setActiveCategory("all");
  }

  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="bg-secondary pt-28 md:pt-36 lg:pt-45 pb-8 md:pb-14">
        <div className="mx-auto max-w-480 px-5 md:px-8 lg:px-20">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-0">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-normal text-white leading-[1.05] tracking-tight mb-10">
                <AnimatedWords text="Our Spaces" delay={0.12} />
              </h1>

              {/* Location tabs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.22, ease: "easeOut" }}
                className="flex items-center gap-2.5 shrink-0"
              >
                {LOCATION_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleLocationChange(tab)}
                    className="relative overflow-hidden px-5 py-2.5 rounded-full border font-sans text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 cursor-pointer"
                    style={{
                      backgroundColor: location === tab ? "var(--color-primary)" : "transparent",
                      borderColor: location === tab ? "transparent" : "white",
                      color: "white",
                    }}
                  >
                    {tab}
                    {location === tab && (
                      <motion.span
                        layoutId="activeGalleryLocationPill"
                        className="absolute inset-0 bg-white rounded-full -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="bg-tertiary py-14 md:py-20 lg:py-15 overflow-hidden">
        <div className="mx-auto flex flex-col gap-5 max-w-480 px-5 md:px-8 lg:px-20">

          {/* Category filter chips */}
          {availableCategories.length > 0 && (
            <motion.nav
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease: "easeOut" }}
              aria-label="Gallery categories"
              className="flex flex-wrap items-center gap-1.5"
            >
              {/* ALL chip */}
              <button
                onClick={() => setActiveCategory("all")}
                className="relative shrink-0 px-4 py-2 rounded-full font-sans text-[11px] font-semibold uppercase tracking-[0.18em] cursor-pointer transition-colors duration-200 outline-none"
                style={{
                  color: "var(--color-primary)",
                  opacity: activeCategory === "all" ? 1 : 0.38,
                }}
              >
                {activeCategory === "all" && (
                  <motion.span
                    layoutId="activeGalleryCategoryPill"
                    className="absolute inset-0 rounded-full bg-secondary"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">All</span>
              </button>

              {availableCategories.map((cat) => (
                <button
                  key={`${location}-${cat.slug}`}
                  onClick={() => setActiveCategory(cat.slug)}
                  className="relative shrink-0 px-4 py-2 rounded-full font-sans text-[11px] font-semibold uppercase tracking-[0.18em] cursor-pointer transition-colors duration-200 outline-none"
                  style={{
                    color: "var(--color-primary)",
                    opacity: activeCategory === cat.slug ? 1 : 0.38,
                  }}
                >
                  {activeCategory === cat.slug && (
                    <motion.span
                      layoutId="activeGalleryCategoryPill"
                      className="absolute inset-0 rounded-full bg-secondary"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{cat.name}</span>
                </button>
              ))}
            </motion.nav>
          )}

          {/* Masonry grid */}
          <AnimatePresence mode="wait" custom={dirRef.current}>
            <motion.div
              key={`${location}-${activeCategory}`}
              custom={dirRef.current}
              variants={{
                enter: (d: number) => ({ x: d * 56, opacity: 0, filter: "blur(6px)" }),
                center: { x: 0, opacity: 1, filter: "blur(0px)" },
                exit: (d: number) => ({ x: d * -56, opacity: 0, filter: "blur(4px)" }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.42, ease: EASE }}
            >
              {filtered.length === 0 ? (
                <p className="py-20 text-center font-sans text-sm text-primary/40">
                  No images in this category yet.
                </p>
              ) : (
                <>
                  {/* Mobile: single column */}
                  <div className="sm:hidden flex flex-col gap-3">
                    {filtered.map((item, i) => (
                      <MasonryTile
                        key={item.id}
                        item={item}
                        categoryName={categoryMap.get(item.category) ?? item.category}
                        delay={i * 0.06}
                      />
                    ))}
                  </div>

                  {/* Tablet: 2 columns */}
                  <div className="hidden sm:block lg:hidden">
                    <MasonryColumns items={filtered} cols={2} offsets={[0, 60]} categoryMap={categoryMap} />
                  </div>

                  {/* Desktop: 3 columns */}
                  <div className="hidden lg:block">
                    <MasonryColumns items={filtered} cols={3} offsets={[0, 80, 40]} categoryMap={categoryMap} />
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </section>
    </>
  );
}
