"use client";

import { useState, useRef } from "react";
import { usePageView } from "@/hooks/usePageView";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import type { FaqItem } from "./page";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function AnimatedWords({
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

const ALL_CATEGORIES = ["All", "Reservations", "Amenities", "Dining", "Policies"] as const;
type Category = (typeof ALL_CATEGORIES)[number];

function AccordionItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.55, ease: EASE, delay: index * 0.05 }}
      className="border-b border-primary/10 last:border-b-0"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-5 py-6 text-left group cursor-pointer"
        aria-expanded={isOpen}
      >
        <span
          className={`font-serif text-lg md:text-xl leading-snug tracking-tight transition-colors duration-300
            ${isOpen ? "text-primary" : "text-primary/75 group-hover:text-primary"}`}
        >
          {faq.question}
        </span>
        <span
          className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300
            ${isOpen
              ? "bg-secondary border-secondary text-white"
              : "bg-transparent border-primary/20 text-primary/50 group-hover:border-primary/40 group-hover:text-primary/70"
            }`}
        >
          {isOpen ? <Minus size={15} /> : <Plus size={15} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ height: { duration: 0.4, ease: EASE }, opacity: { duration: 0.3 } }}
            className="overflow-hidden"
          >
            <p className="font-sans text-base text-primary/60 leading-relaxed pb-7 max-w-3xl">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQsContent({ faqs }: { faqs: FaqItem[] }) {
  usePageView();
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabsInView = useInView(tabsRef, { once: true });

  const filtered =
    activeCategory === "All"
      ? faqs
      : faqs.filter((f) => f.category === activeCategory);

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    setOpenIndex(null);
  };

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-secondary pt-28 md:pt-36 lg:pt-44 pb-16 md:pb-20">
        <div className="mx-auto max-w-480 px-5 md:px-8 lg:px-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
            className="font-sans text-[12px] font-semibold uppercase tracking-[0.28em] text-white/70 mb-5"
          >
            Support
          </motion.p>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.6rem] font-normal
            text-white leading-[1.1] tracking-tight mb-7 max-w-3xl">
            <AnimatedWords text="Questions, Answered." delay={0.2} />
          </h1>

          <motion.p
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.65, ease: "easeOut" }}
            className="font-sans text-base text-white/70 leading-relaxed max-w-xl"
          >
            Everything you need to know before, during, and after your stay.
            Can&#39;t find what you&#39;re looking for? Our team is always happy to help.
          </motion.p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="bg-tertiary py-14 md:py-20 lg:py-28">
        <div className="mx-auto max-w-480 px-5 md:px-8 lg:px-20">

          {/* Category filter tabs */}
          <div ref={tabsRef}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={tabsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease: EASE }}
              className="flex flex-wrap gap-2.5 mb-12"
            >
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className="relative overflow-hidden px-5 py-2.5 rounded-full border
                    font-sans text-[12px] font-semibold uppercase tracking-[0.18em]
                    transition-all duration-300 cursor-pointer"
                  style={{
                    borderColor: activeCategory === cat ? "transparent" : "rgba(8,26,43,0.18)",
                    color: activeCategory === cat ? "#fff" : "rgba(8,26,43,0.55)",
                    backgroundColor: activeCategory === cat ? "#9CAF88" : "transparent",
                  }}
                >
                  {cat}
                  {activeCategory === cat && (
                    <motion.span
                      layoutId="activePill"
                      className="absolute inset-0 bg-secondary rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </motion.div>
          </div>

          {/* FAQ accordion */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="bg-white rounded-2xl px-6 md:px-10 shadow-sm"
            >
              {filtered.length === 0 ? (
                <p className="py-10 text-center font-sans text-sm text-primary/50">
                  No FAQs in this category yet.
                </p>
              ) : (
                filtered.map((faq, i) => (
                  <AccordionItem
                    key={String(faq._id)}
                    faq={faq}
                    index={i}
                    isOpen={openIndex === i}
                    onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                  />
                ))
              )}
            </motion.div>
          </AnimatePresence>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-12 flex flex-col sm:flex-row items-start sm:items-center
              justify-between gap-6 p-7 md:p-9 rounded-2xl bg-secondary/10 border border-secondary/20"
          >
            <div>
              <h3 className="font-serif text-xl md:text-2xl font-medium text-primary mb-2">
                Still have questions?
              </h3>
              <p className="font-sans text-[15px] text-primary/60 leading-relaxed">
                Our concierge team is available 24/7 to assist you.
              </p>
            </div>
            <motion.a
              href="mailto:concierge@kattil.com"
              whileHover="hover"
              initial="rest"
              animate="rest"
              className="relative overflow-hidden shrink-0 px-8 py-4 rounded-xl bg-primary cursor-pointer
                font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-white"
            >
              <motion.span
                variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                style={{ transformOrigin: "left" }}
                transition={{ duration: 0.4, ease: EASE }}
                className="absolute inset-0 bg-secondary"
              />
              <span className="relative z-10">Contact Us</span>
            </motion.a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
