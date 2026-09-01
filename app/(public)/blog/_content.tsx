"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { usePageView } from "@/hooks/usePageView";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { BlogPost } from "./page";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function AnimatedWords({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: delay + i * 0.07, ease: "easeOut" }}
          style={{ display: "inline-block", marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px 0px 0px" });
  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE, delay: (index % 3) * 0.12 }}
      className="group flex flex-col"
    >
      <Link href={`/blog/${post.slug}`} className="flex flex-col flex-1">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-5">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              unoptimized={post.image.startsWith("https://")}
            />
          ) : (
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
              <span className="text-white/30 text-sm font-sans">No image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
        </div>
        <motion.p
          initial={{ opacity: 0, x: -8 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.45, ease: EASE, delay: (index % 3) * 0.12 + 0.15 }}
          className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#526442] mb-2.5"
        >
          {post.category}
        </motion.p>
        <h3 className="font-serif text-base md:text-[1.05rem] text-primary leading-snug transition-colors duration-300 group-hover:text-[#3d5a2e] mb-1.5">
          {post.title}
        </h3>
        {post.author && (
          <p className="font-sans text-[11px] text-primary/50 mt-auto pt-2">
            By {post.author}
            {post.readTime && <span className="mx-1.5 opacity-50">·</span>}
            {post.readTime}
          </p>
        )}
      </Link>
    </motion.article>
  );
}

// ─── Category Tabs ────────────────────────────────────────────────────────────
function CategoryTabs({ categories, current }: { categories: string[]; current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigate = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat) params.set("category", cat);
    else params.delete("category");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-10 md:mb-12">
      {["", ...categories].map((cat) => (
        <button
          key={cat || "all"}
          onClick={() => navigate(cat)}
          className={`font-sans text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full border transition-all duration-200 ${
            current === cat
              ? "bg-primary text-white border-primary"
              : "text-primary/70 border-primary/20 hover:border-primary/50 hover:text-primary"
          }`}
        >
          {cat || "All"}
        </button>
      ))}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const go = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-14 md:mt-16">
      <button
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-primary/60 disabled:opacity-30 hover:text-primary transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Prev
      </button>
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => go(p)}
            className={`w-8 h-8 rounded-full font-sans text-xs font-bold transition-all ${
              p === page
                ? "bg-primary text-white"
                : "text-primary/50 hover:text-primary hover:bg-primary/10"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <button
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
        className="flex items-center gap-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-primary/60 disabled:opacity-30 hover:text-primary transition-colors"
      >
        Next <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function BlogContent({
  posts,
  categories,
  currentCategory,
  currentPage,
  totalPages,
}: {
  posts: BlogPost[];
  categories: string[];
  currentCategory: string;
  currentPage: number;
  totalPages: number;
  total: number;
}) {
  usePageView();

  const isFirstPage = currentPage === 1 && !currentCategory;
  const featured = isFirstPage ? (posts.find((p) => p.featured) ?? posts[0]) : null;
  const gridPosts = featured ? posts.filter((p) => p !== featured) : posts;

  if (posts.length === 0) {
    return (
      <>
        <Navbar />
        <section className="bg-secondary min-h-screen">
          <div className="mx-auto max-w-480 px-5 md:px-8 lg:px-20 pt-28 md:pt-36 lg:pt-44 pb-28">
            <div className="text-center mb-10 md:mb-14 lg:mb-16">
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }} className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-white/55 mb-4">
                Journal
              </motion.p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-[2.8rem] 2xl:text-[3.5rem] font-normal text-white leading-[1.1] tracking-tight">
                <AnimatedWords text="Essays on Living Well" delay={0.12} />
              </h1>
            </div>
            {categories.length > 0 && (
              <CategoryTabs categories={categories} current={currentCategory} />
            )}
            <p className="font-sans text-white/60 text-base text-center pt-16">
              {currentCategory ? `No posts in "${currentCategory}" yet.` : "No blog posts published yet."}
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* ── Hero / Featured ── */}
      <section className="bg-secondary pt-28 md:pt-36 lg:pt-44 pb-16 md:pb-20 lg:pb-28">
        <div className="mx-auto max-w-480 px-5 md:px-8 lg:px-20">
          <div className="text-center mb-10 md:mb-14 lg:mb-16">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }} className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-white/55 mb-4">
              Journal
            </motion.p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-[2.8rem] 2xl:text-[3.5rem] font-normal text-white leading-[1.1] tracking-tight">
              <AnimatedWords text="Essays on Living Well" delay={0.12} />
            </h1>
          </div>

          {/* Category filter tabs */}
          {categories.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}>
              <CategoryTabs categories={categories} current={currentCategory} />
            </motion.div>
          )}

          {/* Featured post — only on first page with no category filter */}
          {featured && (
            <div className="grid grid-cols-1 lg:grid-cols-[57%_43%] gap-8 lg:gap-10 items-center">
              <motion.div
                initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
                animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
                transition={{ duration: 1.0, ease: EASE, delay: 0.28 }}
                className="relative overflow-hidden rounded-lg"
                style={{ aspectRatio: "738 / 384" }}
              >
                {featured.image ? (
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                    priority
                    unoptimized={featured.image.startsWith("https://")}
                  />
                ) : (
                  <div className="absolute inset-0 bg-primary/20" />
                )}
              </motion.div>

              <div className="flex flex-col gap-6 lg:gap-7">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, delay: 0.6, ease: EASE }} className="flex items-center gap-4 flex-wrap">
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-primary border border-[#D2E6BC] bg-[#D2E6BC] px-4 py-2 rounded-full">{featured.category}</span>
                  {featured.readTime && <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">{featured.readTime}</span>}
                </motion.div>

                <motion.h2 initial={{ opacity: 0, filter: "blur(6px)", y: 14 }} animate={{ opacity: 1, filter: "blur(0px)", y: 0 }} transition={{ duration: 0.7, delay: 0.7, ease: EASE }} className="font-serif text-4xl md:text-[2.6rem] 2xl:text-[2.8rem] font-normal text-white leading-[1.15] tracking-tight">
                  {featured.title}
                </motion.h2>

                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.82, ease: "easeOut" }} className="font-sans text-base text-white/75 leading-relaxed">
                  {featured.excerpt}
                </motion.p>

                {featured.author && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.9 }} className="font-sans text-[11px] text-white/40 uppercase tracking-[0.15em]">
                    By {featured.author}
                  </motion.p>
                )}

                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.94, ease: "easeOut" }}>
                  <Link href={`/blog/${featured.slug}`} className="group/cta inline-flex items-center gap-3 font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-white">
                    <span className="relative">
                      Read Article
                      <span className="absolute left-0 -bottom-px h-px w-0 bg-white/60 transition-all duration-300 ease-out group-hover/cta:w-full" />
                    </span>
                    <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} className="text-lg leading-none">→</motion.span>
                  </Link>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Grid posts ── */}
      {gridPosts.length > 0 && (
        <section className="bg-[#ECE8DA] py-16 md:py-20 lg:py-28">
          <div className="mx-auto max-w-480 px-5 md:px-8 lg:px-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 lg:gap-10">
              {gridPosts.map((post, i) => <BlogCard key={String(post._id)} post={post} index={i} />)}
            </div>
            <Pagination page={currentPage} totalPages={totalPages} />
          </div>
        </section>
      )}

      {/* Pagination when featured takes the whole page */}
      {gridPosts.length === 0 && totalPages > 1 && (
        <section className="bg-[#ECE8DA] py-12">
          <div className="mx-auto max-w-480 px-5 md:px-8 lg:px-20">
            <Pagination page={currentPage} totalPages={totalPages} />
          </div>
        </section>
      )}
    </>
  );
}
