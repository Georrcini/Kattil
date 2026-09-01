"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShieldCheck, Sparkles, Headphones } from "lucide-react";
import { navLinks } from "@/lib/data";
import BookingBarWidget from "./booking-bar-widget";


// ─── Constants ────────────────────────────────────────────────────────────────
const NAVBAR_H_DEFAULT = 92;
const HERO_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const HERO_DURATION = 0.65;

const CHAR_STAGGER = 0.04;
const HEADLINE_DELAY = 0.56;

function StreamChar({
  char,
  index,
  visible,
}: {
  char: string;
  index: number;
  visible: boolean;
}) {
  return (
    <motion.span
      aria-hidden
      initial={{ opacity: 0, filter: "blur(8px)", y: 5 }}
      animate={
        visible
          ? { opacity: 1, filter: "blur(0px)", y: 0 }
          : { opacity: 0, filter: "blur(6px)", y: 5 }
      }
      transition={
        visible
          ? {
            delay: HEADLINE_DELAY + index * CHAR_STAGGER,
            duration: 0.22,
            ease: [0.22, 1, 0.36, 1],
          }
          : { duration: 0.08 }
      }
      style={{ display: "inline-block", verticalAlign: "baseline" }}
    >
      {char === " " ? " " : char}
    </motion.span>
  );
}

// ─── Trust Ticker (mobile only) ───────────────────────────────────────────────
const TRUST_ITEMS = [
  { icon: ShieldCheck, title: "Verified Hospitality",    sub: "Certified & trusted property" },
  { icon: Sparkles,    title: "10% Exclusive Benefit",   sub: "Best rate on direct booking" },
  { icon: Headphones,  title: "Premium Guest Support",   sub: "Always here for you" },
] as const;

function TrustTicker() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % TRUST_ITEMS.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const { icon: Icon, title, sub } = TRUST_ITEMS[active];

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {/* Pill */}
      <div
        className="relative overflow-hidden rounded-full border border-white/10 h-13 w-full"
        style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(14px)" }}
        aria-live="polite"
        aria-label="Trust signals"
      >
        {/* Sage-green top accent line */}
        <div
          className="absolute inset-x-0 top-0 h-px pointer-events-none z-10"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(156,175,136,0.75) 28%, rgba(156,175,136,0.75) 72%, transparent 100%)" }}
          aria-hidden="true"
        />
        {/* Slot-machine slot — both enter and exit animate simultaneously */}
        <AnimatePresence>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center gap-2.5"
            style={{ willChange: "transform, opacity" }}
          >
            <div className="rounded-full p-1.5 shrink-0" style={{ background: "rgba(156,175,136,0.14)" }}>
              <Icon className="size-4 text-secondary" aria-hidden="true" />
            </div>
            <div className="text-left">
              <p className="text-[13px] font-semibold text-white/90 tracking-wide leading-tight" style={{ fontFamily: "Inter" }}>
                {title}
              </p>
              <p className="text-[11px] text-white/40 tracking-[0.035em] leading-tight" style={{ fontFamily: "Inter" }}>
                {sub}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HeroNavbar({
  heroEyebrow = "The Homely Reset",
  heroLine1 = "Find Your Perfect Stay",
  heroLine2 = "Experience",
}: {
  heroEyebrow?: string;
  heroLine1?: string;
  heroLine2?: string;
}) {

  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(isHome);

  const lastScrollY = useRef(0);
  const heroJumpedRef = useRef(false);
  const heroVisibleRef = useRef(heroVisible);
  const navbarH = NAVBAR_H_DEFAULT;

  useEffect(() => {
    heroVisibleRef.current = heroVisible;
  }, [heroVisible]);

  useEffect(() => {
    if (!isHome) return;
    let lockUntil = 0;
    let prevHeroVisible = heroVisibleRef.current;

    const jump = () => {
      if (heroJumpedRef.current) return;
      heroJumpedRef.current = true;
      lockUntil = Date.now() + 600;
      const el = document.getElementById("amenities");
      if (!el) return;
      const frameMargin = window.innerWidth >= 768 ? 20 : 12;
      const collapsedNavbarBottom = frameMargin + 16 + navbarH;
      // body has overflow-anchor:none so scroll won't auto-adjust when the
      // spacer collapses from 100svh → (navbarH+40). Pre-compensate by
      // targeting where the element will sit AFTER the spacer shrinks.
      const spacerShrink = window.innerHeight - (navbarH + 40);
      const futureAbsPos =
        el.getBoundingClientRect().top + window.scrollY - spacerShrink;
      // Land so the section title (pt-36 = 144 px below section top) sits
      // 8 px below the collapsed navbar. Floor at 81 to keep hero collapsed.
      const top = Math.max(81, futureAbsPos + 144 - collapsedNavbarBottom - 8);
      window.scrollTo(0, top);
    };

    const onWheel = (e: WheelEvent) => {
      const heroNow = heroVisibleRef.current;
      if (heroNow && !prevHeroVisible) {
        heroJumpedRef.current = false;
        lockUntil = 0;
      }
      prevHeroVisible = heroNow;
      if (e.deltaY <= 0) return;
      if (heroNow || Date.now() < lockUntil) {
        e.preventDefault();
        jump();
      }
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!heroVisibleRef.current) return;
      if (touchStartY - e.changedTouches[0].clientY > 30) jump();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (!heroVisibleRef.current) return;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isHome]);

  // Scroll handler — manages scrolled shadow + hero expand/collapse
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);
      if (isHome) {
        const scrollingDown = currentY > lastScrollY.current;
        if (scrollingDown && currentY > 80) setHeroVisible(false);
        if (!scrollingDown && currentY < 20) setHeroVisible(true);
        lastScrollY.current = currentY;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Reset hero visibility when navigating to/from home
  useEffect(() => {
    setHeroVisible(isHome);
  }, [isHome]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isExpanded = isHome && heroVisible;

  return (
    <>
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        style={{ willChange: "transform, opacity" }}
        className="fixed top-0 left-0 right-0 z-70 m-3 md:m-5"
      >
        <motion.div
          animate={{
            height: isExpanded ? "95svh" : `${navbarH}px`,
            marginTop: isExpanded ? 0 : 16,
            marginLeft: isExpanded ? 0 : 12,
            marginRight: isExpanded ? 0 : 12,
          }}
          transition={{ duration: HERO_DURATION, ease: HERO_EASE }}
          className="relative overflow-hidden border border-white/5 rounded-xl"
          style={{
            backgroundColor: scrolled && !isExpanded ? "rgba(13, 27, 46, 0.92)" : "#0d1b2e",
            backdropFilter: scrolled && !isExpanded ? "blur(16px)" : "none",
            boxShadow: scrolled && !isExpanded ? "0 8px 32px rgba(0,0,0,0.35)" : "none",
            transition:
              "background-color 0.5s ease, backdrop-filter 0.5s ease, box-shadow 0.5s ease",
            maxWidth: "1920px",
          }}
        >
          {/* Overlay texture */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: "url('/assets/overlay.png')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />

          {/* ── NAV ROW ─────────────────────────────────────────────────────── */}
          <div
            className="relative z-10 flex items-center justify-around px-5 md:px-8 lg:px-20"
            style={{ height: `${navbarH}px` }}
          >
            {/* Left navigation */}
            <nav className="hidden lg:flex items-center gap-10 flex-1">
              {navLinks.slice(0, 4).map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group relative uppercase text-[13px] leading-none tracking-[1.2px]
                      transition-colors duration-200 ease-out hover:text-white
                      ${isActive ? "text-white font-bold" : "text-[#CCCCCC] font-medium"}`}
                    style={{ fontFamily: "Inter" }}
                  >
                    {link.label}
                    <span
                      className={`absolute left-0 -bottom-1.5 h-px bg-white transition-all duration-250 ease-out
                        ${isActive
                          ? "w-full opacity-100"
                          : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                        }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Center logo */}
            <Link
              href="/"
              className="absolute left-5 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center"
            >
              <img
                src="/assets/logo.png"
                alt="Kattil — The Homely Reset"
                className="object-contain h-[48px] md:h-[58px] lg:h-[68px] transition-all duration-300"
              />
            </Link>

            {/* Right CTA */}
            <div className="hidden lg:flex items-center justify-end flex-1">
              <Link
                href="/contact-us"
                className="group relative overflow-hidden px-7 py-3.5 border border-white/30 rounded-md uppercase
                  text-white text-[13px] font-semibold tracking-[1.2px] leading-none
                  transition-all duration-400 ease-out hover:border-white hover:shadow-[0_0_24px_rgba(255,255,255,0.08)]"
                style={{ fontFamily: "Inter" }}
              >
                <span className="absolute inset-0 bg-white scale-x-0 origin-left transition-transform duration-400 ease-out group-hover:scale-x-100" />
                <span className="relative z-10 transition-colors duration-400 group-hover:text-[#0d1b2e]">
                  Contact us
                </span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden ml-auto relative z-20 flex items-center justify-center w-10 h-10 rounded-full
                border border-white/10 bg-white/4 transition-all duration-200 hover:border-white/30 hover:bg-white/8"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle Menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    style={{ willChange: "transform, opacity" }}
                  >
                    <X size={18} color="white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    style={{ willChange: "transform, opacity" }}
                  >
                    <Menu size={18} color="white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* ── HERO CONTENT (home page only) ───────────────────────────────── */}
          {isHome && (
            <motion.div
              animate={{ opacity: heroVisible ? 1 : 0, y: heroVisible ? 0 : -20 }}
              transition={
                heroVisible
                  ? { duration: 0.45, delay: 0.4, ease: [0.22, 1, 0.36, 1] }
                  : { duration: 0.28, ease: [0.4, 0, 1, 1] }
              }
              style={{
                height: `calc(100svh - ${navbarH}px)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "start",
                pointerEvents: heroVisible ? "auto" : "none",
                willChange: "transform, opacity",
              }}
              className="relative z-10 px-5 md:px-20 md:pt-10 2xl:pt-15 flex flex-col gap-2 md:gap-4 2xl:gap-8 text-center rounded-b-xl"
            >
              {/* Eyebrow */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: heroVisible ? 1 : 0, y: heroVisible ? 0 : 12 }}
                transition={
                  heroVisible
                    ? { delay: 0.48, duration: 0.45, ease: [0.22, 1, 0.36, 1] }
                    : { duration: 0.15 }
                }
                className="text-[11px] md:text-sm font-semibold text-white uppercase tracking-[3px] mb-3 md:mb-2  font-sans"
              >
                {heroEyebrow}
              </motion.p>

              {/* Headline — streaming character-by-character reveal */}
              <h1 className="text-white font-normal font-serif text-[28px] md:text-[36px] lg:text-[52px] 2xl:text-[72px]
                leading-[1.2] tracking-[-1px] mb-3 md:mb-0 lg:mb-3 whitespace-nowrap">
                <span className="sr-only">{heroLine1} {heroLine2}</span>
                {`${heroLine1} ${heroLine2}`.split("").map((char: string, i: number) => (
                  <StreamChar key={i} char={char} index={i} visible={heroVisible} />
                ))}
              </h1>

              {/* Booking bar */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: heroVisible ? 1 : 0, y: heroVisible ? 0 : 28 }}
                transition={
                  heroVisible
                    ? { delay: 0.72, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                    : { duration: 0.15 }
                }
                className="w-full mt-1 md:mt-0"
                style={{ willChange: "transform, opacity" }}
              >
                <BookingBarWidget />
              </motion.div>

               {/* Trust badge — ticker on mobile, triptych on md+ */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: heroVisible ? 1 : 0, y: heroVisible ? 0 : 16 }}
                transition={
                  heroVisible
                    ? { delay: 0.62, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                    : { duration: 0.15 }
                }
                className="flex justify-center w-full md:w-auto"
                style={{ willChange: "opacity, transform" }}
              >
                {/* Mobile: animated trust ticker */}
                <div className="block md:hidden w-full">
                  <TrustTicker />
                </div>

                {/* md+: three-cell triptych */}
                <div
                  className="relative hidden md:inline-flex flex-row rounded-2xl overflow-hidden border border-white/8"
                  style={{ background: "rgba(255,255,255,0.048)", backdropFilter: "blur(14px)" }}
                  role="list"
                  aria-label="Trust signals"
                >
                  {/* Sage-green top accent line */}
                  <div
                    className="absolute inset-x-0 top-0 h-px pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent 0%, rgba(156,175,136,0.75) 28%, rgba(156,175,136,0.75) 72%, transparent 100%)" }}
                    aria-hidden="true"
                  />

                  {/* Cell 1 — Verified */}
                  <div className="flex items-center gap-3 px-5 py-3.5" role="listitem">
                    <div className="rounded-full p-1.75 shrink-0" style={{ background: "rgba(156,175,136,0.14)" }}>
                      <ShieldCheck className="size-6 text-secondary" aria-hidden="true" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white/88 tracking-wide leading-tight" style={{ fontFamily: "Inter" }}>
                        Verified Hospitality
                      </p>
                      <p className="text-[12px] text-white/40 tracking-[0.035em] leading-tight mt-0.75" style={{ fontFamily: "Inter" }}>
                        Certified &amp; trusted property
                      </p>
                    </div>
                  </div>

                  <div className="w-px bg-white/8 my-3" aria-hidden="true" />

                  {/* Cell 2 — 10% Benefit */}
                  <div className="flex items-center gap-3 px-5 py-3.5" role="listitem">
                    <div className="rounded-full p-1.75 shrink-0" style={{ background: "rgba(156,175,136,0.14)" }}>
                      <Sparkles className="size-6 text-secondary" aria-hidden="true" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white/88 tracking-wide leading-tight" style={{ fontFamily: "Inter" }}>
                        10% Exclusive Benefit
                      </p>
                      <p className="text-[12px] text-white/40 tracking-[0.035em] leading-tight mt-0.75" style={{ fontFamily: "Inter" }}>
                        Best rate on direct booking
                      </p>
                    </div>
                  </div>

                  <div className="w-px bg-white/8 my-3" aria-hidden="true" />

                  {/* Cell 3 — Support */}
                  <div className="flex items-center gap-3 px-5 py-3.5" role="listitem">
                    <div className="rounded-full p-1.75 shrink-0" style={{ background: "rgba(156,175,136,0.14)" }}>
                      <Headphones className="size-6 text-secondary" aria-hidden="true" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white/88 tracking-wide leading-tight" style={{ fontFamily: "Inter" }}>
                        Premium Guest Support
                      </p>
                      <p className="text-[12px] text-white/40 tracking-[0.035em] leading-tight mt-0.75" style={{ fontFamily: "Inter" }}>
                        Always here for you
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.header>

      {/* ── Page spacer — pushes content below the fixed header ─────────────── */}
      <motion.div
        animate={{ height: isHome && heroVisible ? "100svh" : `${navbarH + 40}px` }}
        transition={{ duration: HERO_DURATION, ease: HERO_EASE }}
        aria-hidden
      />

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 59px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 59px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 59px)" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            style={{ backgroundColor: "#0d1b2e", willChange: "clip-path" }}
            className="fixed inset-3 md:inset-6 z-75 lg:hidden rounded-2xl overflow-hidden"
          >
            {/* Background texture */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "url('/assets/overlay.png')",
                backgroundPosition: "center",
                backgroundSize: "cover",
                opacity: 0.12,
                mixBlendMode: "soft-light",
              }}
            />

            {/* ── Top bar — holds the close button at the same spot as the hamburger */}
            <div
              className="relative z-20 flex items-center justify-end px-5"
              style={{ height: `${navbarH}px` }}
            >
              <motion.button
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.28, duration: 0.22, ease: "easeOut" }}
                onClick={() => setMobileOpen(false)}
                aria-label="Close Menu"
                className="flex items-center justify-center w-10 h-10 rounded-full
                  border border-white/10 bg-white/6
                  transition-all duration-200 hover:border-white/30 hover:bg-white/10"
              >
                <X size={18} color="white" />
              </motion.button>
            </div>

            {/* ── Nav content */}
            <div
              className="relative z-10 flex flex-col px-8 pb-10"
              style={{ height: `calc(100% - ${navbarH}px)` }}
            >
              <nav className="flex flex-col gap-7">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.3 + index * 0.07,
                        duration: 0.38,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{ willChange: "transform, opacity" }}
                    >
                      <Link
                        href={link.href}
                        className={`relative inline-block uppercase tracking-[2px] transition-colors duration-200
                          text-[26px] sm:text-[32px]
                          ${isActive ? "text-white font-bold" : "text-[#CCCCCC] font-medium"}`}
                        style={{ fontFamily: "Inter" }}
                      >
                        {link.label}
                        {isActive && (
                          <motion.div
                            layoutId="mobileActiveLine"
                            className="absolute left-0 -bottom-2 h-0.5 w-full bg-white"
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="flex-1" />

              {/* Mobile CTA */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ willChange: "transform, opacity" }}
              >
                <Link
                  href="/contact-us"
                  className="group relative flex items-center justify-center overflow-hidden w-full
                    border border-white rounded-xl py-5 uppercase text-white text-[13px]
                    font-semibold tracking-[1.2px] transition-all duration-400"
                  style={{ fontFamily: "Inter" }}
                >
                  <span className="absolute inset-0 bg-white scale-x-0 origin-left transition-transform duration-400 ease-out group-hover:scale-x-100" />
                  <span className="relative z-10 transition-colors duration-400 group-hover:text-[#0d1b2e]">
                    Contact us
                  </span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
