"use client";

import { motion } from "framer-motion";
import {
  BedDouble,
  LockKeyhole,
  Wifi,
  Coffee,
  SquareParking,
  WashingMachine,
  PawPrint,
  ChefHat,
  Plane,
  Utensils,
  Wind,
  Droplets,
  Tv,
  Car,
  Shield,
  Clock,
  MapPin,
  Phone,
  Star,
  Home,
  Heart,
  Zap,
  Leaf,
  Sun,
  Bath,
  Dumbbell,
  Waves,
  Bus,
  Luggage,
  type LucideIcon,
} from "lucide-react";

// ─── Icon registry — maps DB icon string → Lucide component ──────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  BedDouble, LockKeyhole, Wifi, Coffee, SquareParking, WashingMachine,
  PawPrint, ChefHat, Plane, Utensils, Wind, Droplets, Tv, Car, Shield,
  Clock, MapPin, Phone, Star, Home, Heart, Zap, Leaf, Sun, Bath,
  Dumbbell, Waves, Bus, Luggage,
};

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AmenityItem {
  name: string;
  icon: string;
  description?: string;
  order?: number;
}

// ─── Fallback data (mirrors seed) ────────────────────────────────────────────
const DEFAULT_AMENITIES: AmenityItem[] = [
  { name: "Bunk Bed", icon: "BedDouble", order: 0 },
  { name: "Locker", icon: "LockKeyhole", order: 1 },
  { name: "High Speed Wi-Fi", icon: "Wifi", order: 2 },
  { name: "Paid Breakfast", icon: "Coffee", order: 3 },
  { name: "Free Parking", icon: "SquareParking", order: 4 },
  { name: "Laundry Service", icon: "WashingMachine", order: 5 },
  { name: "Pet Friendly", icon: "PawPrint", order: 6 },
  { name: "Kitchen", icon: "ChefHat", order: 7 },
  { name: "Airport Shuttle", icon: "Plane", order: 8 },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AmenitiesSection({
  eyebrow = "The Experience",
  heading = "Premium Amenities",
  amenities,
}: {
  eyebrow?: string;
  heading?: string;
  amenities?: AmenityItem[];
}) {
  const items = amenities && amenities.length > 0 ? amenities : DEFAULT_AMENITIES;

  return (
    <section
      id="amenities"
      className="
    bg-tertiary
    pt-36 pb-10 md:pt-36 md:pb-20 lg:pt-36 lg:pb-28
    mt-25
    scroll-mt-[110px] 2xl:scroll-mt-[135px]
  "
    >
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

        {/* Amenity Cards */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-y-12 gap-x-6">
          {items.map((item, i) => {
            const Icon = ICON_MAP[item.icon] ?? BedDouble;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.4, rotate: -12 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true, margin: "-100px 0px 0px 0px" }}
                transition={{ type: "spring", damping: 14, stiffness: 220, delay: i * 0.07 }}
                whileHover={{ y: -8, scale: 1.08, transition: { duration: 0.2, ease: "easeOut" } }}
                className="flex flex-col items-center gap-4 cursor-default"
              >
                {/* Icon Circle */}
                <motion.div
                  className="w-15 h-15 2xl:w-20 2xl:h-20 rounded-full bg-[#D2E6BC] flex items-center justify-center"
                  whileHover={{ backgroundColor: "#c2d8a8" }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon
                    size={28}
                    strokeWidth={1.5}
                    className="text-primary"
                  />
                </motion.div>

                {/* Label */}
                <span className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-primary text-center leading-snug">
                  {item.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
