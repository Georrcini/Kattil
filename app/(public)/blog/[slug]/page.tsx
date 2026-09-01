import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/seo";
import { connectDB } from "@/lib/db/mongodb";
import BlogModel from "@/lib/models/Blog";
import BlogDetailContent from "./_content";

interface BlogDocLean {
  _id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  additionalImages?: string[];
  readTime: string;
  date: string;
  featured: boolean;
  author?: string;
  tags?: string[];
  publishedAt?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
  };
}

export interface BlogPost extends BlogDocLean {
  relatedPosts?: RelatedPost[];
}

export interface RelatedPost {
  _id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
}

type PageProps = { params: Promise<{ slug: string }> };

async function getPost(slug: string): Promise<{ post: BlogDocLean; related: RelatedPost[] } | null> {
  try {
    await connectDB();
    const post = await BlogModel.findOne({ slug, status: "published" })
      .select("slug title category excerpt content image additionalImages readTime date featured author tags publishedAt seo")
      .lean<BlogDocLean>();

    if (!post) return null;

    const related = await BlogModel.find({ status: "published", slug: { $ne: slug } })
      .sort({ order: 1, createdAt: -1 })
      .limit(3)
      .select("slug category title excerpt image _id")
      .lean<RelatedPost[]>();

    return { post, related };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    await connectDB();
    const post = await BlogModel.findOne({ slug, status: "published" })
      .select("title excerpt seo image category")
      .lean<BlogDocLean>();

    if (!post) return { title: "Post Not Found" };

    const title = post.seo?.title || post.title;
    const description = post.seo?.description || post.excerpt;
    const ogImage = post.seo?.ogImage || post.image;
    const canonical = `${SITE_URL}/blog/${slug}`;

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
        type: "article",
        ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        ...(ogImage ? { images: [ogImage] } : {}),
      },
    };
  } catch {
    return { title: "Blog" };
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getPost(slug);
  if (!data) notFound();
  return <BlogDetailContent post={data.post} related={data.related} />;
}
