"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/data";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRowRef = useRef<HTMLDivElement>(null);
  const [navRowHeight, setNavRowHeight] = useState(72);

  useEffect(() => {
    const measure = () => {
      if (navRowRef.current) setNavRowHeight(navRowRef.current.offsetHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: EASE }}
      style={{ willChange: "transform, opacity" }}
      className="fixed top-0 left-0 right-0 z-70 mt-4 md:mt-6 lg:mt-8 px-3 md:px-8"
    >
      {/* ── Expanding container ───────────────────────────────────────────────── */}
      <motion.div
        animate={{ height: mobileOpen ? "calc(100svh - 32px)" : navRowHeight }}
        transition={{ duration: 0.55, ease: EASE, delay: mobileOpen ? 0 : 0.15 }}
        className="relative mx-auto overflow-hidden rounded-2xl border border-white/5 flex flex-col"
        style={{
          backgroundColor: scrolled && !mobileOpen ? "rgba(13, 27, 46, 0.92)" : "#0d1b2e",
          backdropFilter: scrolled && !mobileOpen ? "blur(16px)" : "none",
          maxWidth: "1920px",
          boxShadow: scrolled && !mobileOpen ? "0 8px 32px rgba(0,0,0,0.35)" : "none",
          willChange: "height",
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

        {/* ── Nav row (always visible) ─────────────────────────────────────── */}
        <div ref={navRowRef} className="relative z-10 shrink-0 flex items-center justify-between h-18 md:h-22 lg:h-23 px-5 md:px-8 lg:px-15">

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
                      ${isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"}`}
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
              className="object-contain h-12 md:h-14.5 lg:h-17 transition-all duration-300"
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

          {/* Mobile menu toggle */}
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

        {/* ── Expanded menu content ─────────────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="menu-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="lg:hidden relative z-10 flex flex-col flex-1 px-8 pb-10 border-t border-white/10"
            >
              {/* Links */}
              <nav className="flex flex-col gap-7 mt-10">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.06, duration: 0.35, ease: EASE }}
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

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.4, ease: EASE }}
                style={{ willChange: "transform, opacity" }}
              >
                <Link
                  href="/contact-us"
                  className="group relative flex items-center justify-center overflow-hidden w-full
                    border border-white rounded-xl py-5 uppercase text-white text-[13px]
                    font-semibold tracking-[1.2px] transition-all duration-400"
                  style={{ fontFamily: "Inter" }}
                >
                  <span className="absolute inset-0 bg-white scale-x-0 origin-left transition-transform duration-400 group-hover:scale-x-100" />
                  <span className="relative z-10 transition-colors duration-400 group-hover:text-[#0d1b2e]">
                    Contact us
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </motion.header>
  );
}
