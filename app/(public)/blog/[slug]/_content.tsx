"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Share2, Check, CalendarDays, Clock, Tag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { usePageView } from "@/hooks/usePageView";
import type { BlogPost, RelatedPost } from "./page";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px 0px 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function RelatedCard({ post, index }: { post: RelatedPost; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px 0px 0px" });
  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: EASE, delay: index * 0.12 }}
      className="group"
    >
      <Link href={`/blog/${post.slug}`} className="flex flex-col">
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
            <div className="absolute inset-0 bg-primary/20" />
          )}
        </div>
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#526442] mb-2.5">
          {post.category}
        </p>
        <h3 className="font-serif text-base md:text-[1.05rem] text-primary leading-snug transition-colors duration-300 group-hover:text-[#3d5a2e]">
          {post.title}
        </h3>
      </Link>
    </motion.article>
  );
}

export default function BlogDetailContent({
  post,
  related,
}: {
  post: BlogPost;
  related: RelatedPost[];
}) {
  usePageView();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }).catch(() => {});
  };

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-secondary pt-28 md:pt-36 lg:pt-40 2xl:pt-50 pb-10 md:pb-14">
        <div className="mx-auto max-w-480 px-5 md:px-8 lg:px-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
            className="font-sans text-[12px] font-semibold uppercase tracking-[0.28em] text-tertiary mb-5"
          >
            {post.category}
            {post.date && <><span className="mx-2 opacity-50">•</span>{post.date}</>}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.12 }}
            className="font-serif text-4xl md:text-5xl lg:text-[2.8rem] 2xl:text-[4rem] font-normal text-white leading-[1.1] tracking-tight max-w-7xl mb-10 md:mb-14"
          >
            {post.title}
          </motion.h1>

          {post.image && (
            <motion.div
              initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
              animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
              transition={{ duration: 1.05, ease: EASE, delay: 0.32 }}
              className="relative w-full overflow-hidden rounded-lg"
              style={{ aspectRatio: "16/5" }}
            >
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 90vw"
                className="object-cover"
                priority
                unoptimized={post.image.startsWith("https://")}
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Article body ── */}
      <section className="bg-secondary py-12 md:py-16 lg:py-24">
        <div className="mx-auto max-w-480 px-5 md:px-8 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-[190px_1fr] xl:grid-cols-[300px_1fr] gap-10 lg:gap-20">

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.7 }}
              className="flex flex-row lg:flex-col gap-8 lg:gap-10 lg:sticky lg:top-32 lg:self-start pb-8 lg:pb-0 border-b lg:border-b-0 border-white/10"
            >
              {post.date && (
                <div>
                  <p className="font-sans text-[12px] font-semibold uppercase tracking-relaxed text-tertiary mb-1.5 flex items-center gap-1.5">
                    <CalendarDays className="h-3 w-3" /> Published
                  </p>
                  <p className="font-sans text-base text-white leading-snug">{post.date}</p>
                </div>
              )}
              {post.author && (
                <div>
                  <p className="font-sans text-[12px] font-semibold uppercase tracking-relaxed text-tertiary mb-1.5">Author</p>
                  <p className="font-sans text-base text-white leading-snug">{post.author}</p>
                </div>
              )}
              {post.readTime && (
                <div>
                  <p className="font-sans text-[12px] font-semibold uppercase tracking-relaxed text-tertiary mb-1.5 flex items-center gap-1.5">
                    <Clock className="h-3 w-3" /> Read Time
                  </p>
                  <p className="font-sans text-base text-white leading-snug">{post.readTime}</p>
                </div>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="hidden lg:block">
                  <p className="font-sans text-[12px] font-semibold uppercase tracking-relaxed text-tertiary mb-2 flex items-center gap-1.5">
                    <Tag className="h-3 w-3" /> Tags
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span key={tag} className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50 border border-white/15 px-2.5 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="font-sans text-[12px] font-semibold uppercase tracking-relaxed text-tertiary mb-3">Share</p>
                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="w-10 h-10 rounded-full border border-white flex items-center justify-center text-white hover:border-white/50 cursor-pointer hover:text-white transition-colors duration-300"
                  aria-label="Share article"
                >
                  {copied ? <Check size={14} strokeWidth={2} /> : <Share2 size={14} strokeWidth={1.8} />}
                </motion.button>
              </div>
            </motion.aside>

            {/* Article content */}
            <FadeIn>
              {post.content ? (
                <div
                  className="prose-blog font-sans text-[18px] leading-[29.25px] text-tertiary [&_h2]:font-serif [&_h2]:text-[32px] [&_h2]:font-medium [&_h2]:text-white [&_h2]:leading-[41.6px] [&_h2]:tracking-tight [&_h2]:pt-4 [&_h2]:mb-4 [&_p]:mb-6 [&_blockquote]:border-l-2 [&_blockquote]:border-white/30 [&_blockquote]:pl-6 [&_blockquote]:py-1 [&_blockquote]:my-2 [&_blockquote_p]:font-serif [&_blockquote_p]:text-[32px] [&_blockquote_p]:font-medium [&_blockquote_p]:italic [&_blockquote_p]:text-white [&_blockquote_p]:leading-[44px] [&_img]:rounded-lg [&_img]:w-full [&_img]:object-cover"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <p className="font-sans text-[18px] leading-[29.25px] text-tertiary">{post.excerpt}</p>
              )}

              {/* Additional images */}
              {post.additionalImages && post.additionalImages.length > 0 && (
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {post.additionalImages.map((src, i) => (
                    <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-lg">
                      <Image
                        src={src}
                        alt={`${post.title} — image ${i + 2}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                        unoptimized={src.startsWith("https://")}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Mobile tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="lg:hidden mt-10 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span key={tag} className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50 border border-white/15 px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Related articles ── */}
      {related.length > 0 && (
        <section className="bg-tertiary py-14 md:py-20 lg:py-28">
          <div className="mx-auto max-w-480 px-5 md:px-8 lg:px-20">
            <FadeIn className="mb-10 md:mb-14">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-[#526442] mb-3">More Stories</p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.6rem] font-normal text-primary leading-[1.1] tracking-tight">Related Articles</h2>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {related.map((p, i) => <RelatedCard key={String(p._id)} post={p} index={i} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
