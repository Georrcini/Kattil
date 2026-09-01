"use client";

import { useEffect } from "react";

// Must match NAVBAR_H in hero-navbar.tsx
const NAVBAR_H = 118;
// Must match pt-36 (144px) on the section — distance from section top to the title
const TITLE_OFFSET = 144;
// ms to wait after the last scroll event before checking
const SETTLE_MS = 80;
// ms to wait for the hero spacer animation (HERO_DURATION 650ms + 100ms buffer)
// The spacer animates from 100svh → 158px which shifts the section's document position.
// Firing the snap before this settles gives a wrong rect.top and wrong target.
const SPACER_SETTLE_MS = 750;

export default function AmenitiesSnap() {
  useEffect(() => {
    const section = document.getElementById("amenities");
    if (!section) return;

    let scrollTimer: ReturnType<typeof setTimeout>;
    let spacerTimer: ReturnType<typeof setTimeout>;
    let snapping = false;

    const doSnap = (force = false) => {
      if (snapping && !force) return;

      const rect = section.getBoundingClientRect();

      // Section completely below the fold or completely scrolled past — ignore
      if (rect.top >= window.innerHeight || rect.bottom <= 0) return;

      // Title is already visible below the navbar — nothing to do
      if (rect.top + TITLE_OFFSET >= NAVBAR_H) return;

      // Section is in the viewport but the title is hidden under the navbar.
      // Scroll up just enough so the section top lands 8px below the navbar.
      const target = Math.max(
        // Floor at 80px: prevents scrolling back far enough to re-expand the hero
        80,
        window.scrollY + rect.top - NAVBAR_H - 8
      );

      if (Math.abs(target - window.scrollY) < 4) return;

      snapping = true;
      window.scrollTo({ top: target, behavior: "smooth" });
      setTimeout(() => { snapping = false; }, 850);
    };

    const onScroll = () => {
      clearTimeout(scrollTimer);
      clearTimeout(spacerTimer);

      // Pass 1 — fires quickly after scroll momentum dies
      scrollTimer = setTimeout(() => doSnap(), SETTLE_MS);

      // Pass 2 — fires after the hero spacer animation has fully settled.
      // Uses force=true so it runs even if pass 1 already triggered a snap
      // (the first snap may have targeted a mid-animation position).
      spacerTimer = setTimeout(() => doSnap(true), SETTLE_MS + SPACER_SETTLE_MS);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // scrollend fires when ALL momentum has stopped (Chrome + Firefox).
    // On Safari the scroll-timeout fallback above handles it.
    window.addEventListener("scrollend", () => doSnap(), { passive: true });

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(spacerTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", () => doSnap());
    };
  }, []);

  return null;
}
