"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface Testimonial {
  rating: number;
  title: string;
  review: string;
  author: string;
  location: string;
}

const TESTIMONIALS_DATA: Testimonial[][] = [
  [
    {
      rating: 5,
      title: "Located where you need to be",
      review:
        "Central location, clean rooms, and genuinely helpful staff. Walking distance to Connaught Place made it perfect for both business and evening strolls",
      author: "Parag",
      location: "Chennai",
    },
    {
      rating: 5,
      title: "Located where you need to be",
      review:
        "Central location, clean rooms, and genuinely helpful staff. Walking distance to Connaught Place made it perfect for both business and evening strolls",
      author: "Parag",
      location: "Chennai",
    },
    {
      rating: 5,
      title: "Located where you need to be",
      review:
        "Central location, clean rooms, and genuinely helpful staff. Walking distance to Connaught Place made it perfect for both business and evening strolls",
      author: "Parag",
      location: "Chennai",
    },
  ],
  [
    {
      rating: 5,
      title: "An Oasis of Calm in Madurai",
      review:
        "Exceptional hospitality and serene aesthetic. The rooms were spotless, linen crisp, and the staff treated us like family throughout our stay.",
      author: "Ananya",
      location: "Bangalore",
    },
    {
      rating: 5,
      title: "Perfect For Solo Travelers",
      review:
        "Met wonderful people in the common area and the bunk pods felt remarkably private and comfortable with fast Wi-Fi and cold AC.",
      author: "David",
      location: "London",
    },
    {
      rating: 5,
      title: "Exceeded All Expectations",
      review:
        "Super close to the temple and key transit points. Seamless check-in and the curated local tips saved us tons of time exploring.",
      author: "Suresh",
      location: "Coimbatore",
    },
  ],
  [
    {
      rating: 5,
      title: "Homely Feel with Hotel Quality",
      review:
        "You get the warmth and personal care of a boutique home stay with the cleanliness and standards of a top tier hotel.",
      author: "Kavitha",
      location: "Hyderabad",
    },
    {
      rating: 5,
      title: "Great Workspace & Community",
      review:
        "Worked remotely for a week from Kattil. Reliable power, super fast internet, and fantastic filter coffee every morning.",
      author: "Rahul",
      location: "Mumbai",
    },
    {
      rating: 5,
      title: "Loved the Thoughtful Design",
      review:
        "The minimal earthy interior design and subtle lighting make you instantly relax after a long journey.",
      author: "Elena",
      location: "Germany",
    },
  ],
  [
    {
      rating: 5,
      title: "Best Value for Money",
      review:
        "Everything from the linen to the bathroom fittings was premium. Can't wait to return to their upcoming properties.",
      author: "Vikram",
      location: "Chennai",
    },
    {
      rating: 5,
      title: "Warm and Helpful Staff",
      review:
        "Any request we had was handled with a smile. The 24/7 assistance and clean atmosphere made traveling with family easy.",
      author: "Pooja",
      location: "Kochi",
    },
    {
      rating: 5,
      title: "Unmatched Hospitality",
      review:
        "A truly refreshing experience. Kattil sets a new standard for modern community-driven stays in South India.",
      author: "Marcus",
      location: "Australia",
    },
  ],
];

const ALL_TESTIMONIALS = TESTIMONIALS_DATA.flat();

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const currentReviews = TESTIMONIALS_DATA[activeIndex] || TESTIMONIALS_DATA[0];

  return (
    <section className="w-full bg-transparent pt-10 pb-16 md:pt-18 md:pb-28 overflow-x-hidden">
      <div className="w-full max-w-[1920px] mx-auto px-3 md:px-8">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12">
          {/* Section Heading */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-8 sm:mb-10"
          >
            <h2 className="text-[#0d1b2e] text-[26px] sm:text-[40px] md:text-[44px] font-sans font-normal tracking-tight">
              What our{" "}
              <span className="font-serif italic font-normal text-[#0d1b2e]">
                Guests say
              </span>
            </h2>
          </motion.div>

          {/* ── Mobile Carousel View (< md) ─────────────────────────────────── */}
          <div className="block md:hidden">
            <div
              ref={mobileScrollRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none px-4 -mx-4 pb-2 scroll-smooth"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {ALL_TESTIMONIALS.map((item, index) => (
                <div
                  key={`mobile-${index}`}
                  className="w-[85vw] max-w-[340px] shrink-0 snap-center bg-white rounded-[18px] p-5 sm:p-6 flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-black/[0.04] select-none"
                >
                  <div>
                    {/* 5 Stars */}
                    <div className="flex items-center gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]"
                        />
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="text-[17px] sm:text-[18px] font-bold text-[#0d1b2e] mt-3.5 leading-snug">
                      {item.title}
                    </h3>

                    {/* Review Text */}
                    <p className="text-gray-600 text-[14px] sm:text-[15px] leading-relaxed mt-2.5 font-light">
                      {item.review}
                    </p>
                  </div>

                  {/* Author Info */}
                  <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-[13.5px] font-bold text-[#0d1b2e]">
                        {item.author}
                      </p>
                      <p className="text-[11.5px] text-gray-400 mt-0.5">
                        {item.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Desktop Grid View (>= md) ────────────────────────────────────── */}
          <div className="hidden md:block">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentReviews.map((item, index) => (
                <motion.div
                  key={`${activeIndex}-${index}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.08,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="bg-white rounded-[18px] p-6 sm:p-7 md:p-8 flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-black/[0.03] hover:shadow-[0_10px_32px_rgba(0,0,0,0.06)] transition-all duration-300"
                >
                  <div>
                    {/* 5 Stars */}
                    <div className="flex items-center gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]"
                        />
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="text-[20px] font-bold text-[#0d1b2e] mt-4 leading-snug">
                      {item.title}
                    </h3>

                    {/* Review Text */}
                    <p className="text-gray-600 text-[16px] leading-relaxed mt-4 font-light">
                      {item.review}
                    </p>
                  </div>

                  {/* Author Info */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-[14px] font-bold text-[#0d1b2e]">
                      {item.author}
                    </p>
                    <p className="text-[12px] text-gray-400 mt-0.5">
                      {item.location}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Dots (Desktop) */}
            <div className="flex justify-center items-center gap-2.5 mt-12">
              {TESTIMONIALS_DATA.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Go to testimonial page ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    activeIndex === i
                      ? "w-2.5 h-2.5 bg-[#8EA980] scale-110"
                      : "w-2.5 h-2.5 bg-[#D1D5DB] hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
