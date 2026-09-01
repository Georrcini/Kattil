import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
import { connectDB } from "@/lib/db/mongodb";
import BlogModel from "@/lib/models/Blog";
import BlogCategory from "@/lib/models/BlogCategory";
import BlogContent from "./_content";

export const metadata: Metadata = {
  title: "Blog & Stories",
  description:
    "Stories, travel guides, wellness tips, and interior essays from the team at Kattil — The Homely Hotel.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "Blog & Stories | Kattil — The Homely Hotel",
    description: "Essays on living well, from the team at Kattil.",
    url: `${SITE_URL}/blog`,
  },
};

export interface BlogPost {
  _id: string;
  slug: string;
  category: string;
  readTime: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
  featured: boolean;
  content: string;
  author?: string;
  tags?: string[];
}

const PAGE_LIMIT = 9;

async function getBlogs(category: string, page: number) {
  await connectDB();
  const filter: Record<string, unknown> = { status: "published" };
  if (category) filter.category = { $regex: new RegExp(`^${category}$`, "i") };

  const skip = (page - 1) * PAGE_LIMIT;
  const [posts, total] = await Promise.all([
    BlogModel.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(PAGE_LIMIT)
      .select("slug category readTime date title excerpt image featured author content tags")
      .lean<BlogPost[]>(),
    BlogModel.countDocuments(filter),
  ]);

  return { posts, total, pages: Math.ceil(total / PAGE_LIMIT) };
}

async function getCategories(): Promise<string[]> {
  try {
    await connectDB();
    const cats = await BlogCategory.find({ active: true })
      .sort({ order: 1, name: 1 })
      .select("name")
      .lean<{ name: string }[]>();
    return cats.map((c) => c.name);
  } catch {
    return [];
  }
}

interface PageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = params.category ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const [{ posts, total, pages }, categories] = await Promise.all([
    getBlogs(category, page).catch(() => ({ posts: [], total: 0, pages: 0 })),
    getCategories(),
  ]);

  return (
    <BlogContent
      posts={posts}
      categories={categories}
      currentCategory={category}
      currentPage={page}
      totalPages={pages}
      total={total}
    />
  );
}
