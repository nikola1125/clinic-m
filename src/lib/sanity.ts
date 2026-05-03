import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2024-01-01";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}

/* ── GROQ queries ── */

export const ARTICLES_QUERY = `*[_type == "article"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  dek,
  publishedAt,
  readMinutes,
  featured,
  mainImage,
  "category": category->title,
  "author": author->{ name, role, portrait, bio, linkedIn, doctorSlug }
}`;

export const ARTICLE_BY_SLUG_QUERY = `*[_type == "article" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  dek,
  publishedAt,
  readMinutes,
  featured,
  mainImage,
  body,
  "category": category->title,
  "author": author->{ name, role, portrait, bio, linkedIn, doctorSlug }
}`;

export const CATEGORIES_QUERY = `*[_type == "category"] | order(title asc) { _id, title }`;

/* ── TypeScript types for query results ── */

export type SanityArticleCard = {
  _id: string;
  title: string;
  slug: { current: string };
  dek: string;
  publishedAt: string;
  readMinutes: number;
  featured: boolean;
  mainImage?: {
    asset: { _ref: string };
    alt?: string;
  };
  category: string;
  author: {
    name: string;
    role: string;
    portrait?: { asset: { _ref: string } };
    bio?: string;
    linkedIn?: string;
    doctorSlug?: string;
  };
};

export type SanityArticleFull = SanityArticleCard & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[];
};

export type SanityCategory = {
  _id: string;
  title: string;
};
