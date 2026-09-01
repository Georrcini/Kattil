"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const columnVariants = {
  hidden:   { opacity: 0, y: 28 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};
const topVariants = {
  hidden:   { opacity: 0, y: 20 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

// ── Types passed from layout ──────────────────────────────────────────────────
export interface FooterLink     { label: string; href: string; newTab: boolean; order: number }
export interface FooterSection  { section: string; order: number; links: FooterLink[] }
export interface FooterSocial   { label: string; url: string; iconName: string; iconImageUrl: string; bgColor: string; visible: boolean }
export interface FooterLocation { city: string; address: string; phone?: string; email?: string }
export interface FooterProps {
  logo:        string;
  headline:    string;
  description: string;
  copyright:   string;
  footerLinks: FooterSection[];
  socialLinks: FooterSocial[];
  locations?:  FooterLocation[];
}

// ── Social icon text fallback ─────────────────────────────────────────────────
function SocialIconFallback({ name }: { name: string }) {
  const map: Record<string, string> = {
    instagram: "IG", facebook: "FB", twitter: "X", linkedin: "LI",
    youtube: "YT", whatsapp: "WA", telegram: "TG", googlemaps: "G",
  };
  return <span className="text-[10px] font-black">{map[name] ?? name.slice(0, 2).toUpperCase()}</span>;
}

// ── Location block — matches original structure ───────────────────────────────
function LocationBlock({ location }: { location: FooterLocation }) {
  return (
    <address className="not-italic space-y-4">
      <p className="text-[15px] sm:text-base text-[#E6E2D4CC]/80 leading-relaxed">
        {location.address}
      </p>
      {location.phone && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-white">Phone:</p>
          <a
            href={`tel:${location.phone.replace(/\s/g, "")}`}
            className="block text-[15px] sm:text-base text-[#E6E2D4CC]/70 hover:text-white transition-colors duration-200"
          >
            {location.phone}
          </a>
        </div>
      )}
      {location.email && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-white">Mail:</p>
          <a
            href={`mailto:${location.email}`}
            className="block text-[15px] sm:text-base text-[#E6E2D4CC]/70 hover:text-white transition-colors duration-200 break-all"
          >
            {location.email}
          </a>
        </div>
      )}
    </address>
  );
}

export default function Footer({
  logo, headline, description, copyright, footerLinks, socialLinks, locations,
}: FooterProps) {
  const ref = useRef<HTMLElement>(null);
  useInView(ref, { once: true, margin: "-80px" });

  const visibleSocial = socialLinks.filter((s) => s.visible);
  const sortedSections = [...footerLinks].sort((a, b) => a.order - b.order);
  const visibleLocations = locations?.filter((l) => l.city && l.address) ?? [];

  return (
    <footer ref={ref} className="relative overflow-hidden bg-primary text-white">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundImage: "url('/assets/overlay.png')", backgroundPosition: "center", backgroundSize: "cover", opacity: 0.8 }}
      />

      <div className="relative z-10 mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-20 py-14 sm:py-16 lg:py-20">

        {/* Header — logo + headline */}
        <motion.div variants={topVariants} initial="hidden" animate="visible" className="flex flex-col items-center text-center mb-12">
          {logo && (
            <img src={logo} alt="Kattil" className="h-20 sm:h-24 lg:h-28 object-contain mb-5" />
          )}
          {headline && (
            <p className="font-serif text-sm sm:text-lg lg:text-[30px] text-[#E6E2D4E5]/90 max-w-5xl leading-[1.3]">
              {headline}
            </p>
          )}
          {description && (
            <p className="mt-3 text-sm text-white/60 max-w-2xl leading-relaxed">{description}</p>
          )}
        </motion.div>

        <div className="border-t border-white/15 mb-10" />

        {/* Columns */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-10 lg:gap-12"
        >
          {/* Navigation + Legal (and any other CMS sections) */}
          {sortedSections.map((section) => (
            <motion.div key={section.section} variants={columnVariants}>
              <h4 className="text-[11px] sm:text-[12px] font-bold tracking-[0.2em] uppercase text-white mb-4 sm:mb-5">
                {section.section}
              </h4>
              <ul className="space-y-3">
                {[...section.links].sort((a, b) => a.order - b.order).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target={link.newTab ? "_blank" : undefined}
                      rel={link.newTab ? "noopener noreferrer" : undefined}
                      className="group inline-block text-[15px] sm:text-base text-[#E6E2D4CC]/80 hover:text-white transition-colors duration-200"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute left-0 -bottom-px h-px w-0 bg-white/50 transition-all duration-300 group-hover:w-full" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Locations — one column per city, "Locations" header only on the first */}
          {visibleLocations.map((loc, idx) => (
            <motion.div key={loc.city} variants={columnVariants}>
              {idx === 0 ? (
                <h4 className="text-[11px] sm:text-[12px] font-bold tracking-[0.2em] uppercase text-white mb-4 sm:mb-5">
                  Locations
                </h4>
              ) : (
                /* Spacer aligns subsequent cities with the content row on xl */
                <div className="hidden xl:block h-7" aria-hidden="true" />
              )}
              <LocationBlock location={loc} />
            </motion.div>
          ))}

          {/* Social links */}
          {visibleSocial.length > 0 && (
            <motion.div variants={columnVariants}>
              <h4 className="text-[11px] sm:text-[12px] font-bold tracking-[0.2em] uppercase text-white mb-4 sm:mb-5">
                Social Links
              </h4>
              <div className="flex flex-wrap gap-3">
                {visibleSocial.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.url}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white"
                    style={{ background: social.bgColor }}
                  >
                    {social.iconImageUrl
                      ? <img src={social.iconImageUrl} alt={social.label} className="h-5 w-5 object-contain" />
                      : <SocialIconFallback name={social.iconName} />
                    }
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-12 pt-7 text-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-white/35">
            {copyright || `© ${new Date().getFullYear()} Kattil. All Rights Reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
