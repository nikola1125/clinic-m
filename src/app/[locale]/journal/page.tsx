"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  JOURNAL_ARTICLES,
  JOURNAL_CATEGORIES,
  type JournalCategory,
} from "@/lib/journal";
import {
  client,
  ARTICLES_QUERY,
  CATEGORIES_QUERY,
  type SanityArticleCard,
  type SanityCategory,
} from "@/lib/sanity";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type UnifiedArticle = {
  slug: string;
  title: string;
  dek: string;
  date: string;
  readMinutes: number;
  category: string;
  authorName: string;
  authorRole: string;
  source: "sanity" | "local";
};

function sanityToUnified(a: SanityArticleCard): UnifiedArticle {
  return {
    slug: a.slug.current,
    title: a.title,
    dek: a.dek || "",
    date: a.publishedAt,
    readMinutes: a.readMinutes || 5,
    category: a.category || "Uncategorized",
    authorName: a.author?.name || "Unknown",
    authorRole: a.author?.role || "",
    source: "sanity",
  };
}

function localToUnified(a: (typeof JOURNAL_ARTICLES)[number]): UnifiedArticle {
  return {
    slug: a.slug,
    title: a.title,
    dek: a.dek,
    date: a.date,
    readMinutes: a.readMinutes,
    category: a.category,
    authorName: a.author.name,
    authorRole: a.author.role,
    source: "local",
  };
}

export default function JournalPage() {
  const t = useTranslations("journal");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<UnifiedArticle[]>(
    JOURNAL_ARTICLES.map(localToUnified)
  );
  const [categories, setCategories] = useState<string[]>([...JOURNAL_CATEGORIES]);

  useEffect(() => {
    async function fetchSanity() {
      try {
        const [sanityArticles, sanityCats] = await Promise.all([
          client.fetch<SanityArticleCard[]>(ARTICLES_QUERY),
          client.fetch<SanityCategory[]>(CATEGORIES_QUERY),
        ]);
        if (sanityArticles && sanityArticles.length > 0) {
          setArticles(sanityArticles.map(sanityToUnified));
        }
        if (sanityCats && sanityCats.length > 0) {
          setCategories(sanityCats.map((c) => c.title));
        }
      } catch {
        // Sanity not configured yet — use local fallback silently
      }
    }
    fetchSanity();
  }, []);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchCat = activeCategory === "All" || a.category === activeCategory;
      const q = query.toLowerCase();
      const matchQ =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.dek.toLowerCase().includes(q) ||
        a.authorName.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [activeCategory, query, articles]);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 72 }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

          {/* ── Header ── */}
          <section
            className="py-16"
            style={{ borderBottom: "1px solid var(--line)" }}
          >
            <p className="label-mono mb-3">{t("label")}</p>
            <h1
              className="font-heading text-[48px] lg:text-[64px] leading-none mb-4"
              style={{ color: "var(--ink)" }}
            >
              {t("heading")}
            </h1>
            <p
              className="text-[15px] italic"
              style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
            >
              {t("subhead")}
            </p>
          </section>

          {/* ── Filters ── */}
          <div
            className="sticky z-30 py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
            style={{
              top: 72,
              background: "rgba(245,241,234,0.97)",
              borderBottom: "1px solid var(--line)",
            }}
          >
            {/* Category chips */}
            <div className="flex flex-wrap gap-2">
              {["All", ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="label-mono px-3 h-7 transition-colors cursor-pointer"
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: "var(--r)",
                    background: activeCategory === cat ? "var(--ink)" : "transparent",
                    color: activeCategory === cat ? "var(--bone)" : "var(--muted)",
                  }}
                >
                  {cat === "All" ? t("filter_all") : cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search_placeholder")}
              className="bg-transparent text-[13px] outline-none py-1 w-full sm:w-56"
              style={{
                borderBottom: "1px solid var(--ink)",
                color: "var(--ink)",
                fontFamily: "var(--font-sans)",
              }}
            />
          </div>

          {/* ── Article rows ── */}
          <div>
            {filtered.length === 0 && (
              <div className="py-20 text-center">
                <p className="label-mono" style={{ color: "var(--muted)" }}>
                  No articles found.
                </p>
              </div>
            )}

            {filtered.map((article) => (
              <Link
                key={article.slug}
                href={`/journal/${article.slug}`}
                className="group grid py-8 gap-3 sm:gap-4"
                style={{
                  borderBottom: "1px solid var(--line)",
                  gridTemplateColumns: "1fr",
                }}
              >
                {/* Top meta row */}
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="label-mono" style={{ color: "var(--muted)" }}>
                    {formatDate(article.date)}
                  </span>
                  <span
                    className="label-mono px-2 h-5 flex items-center"
                    style={{
                      border: "1px solid var(--line)",
                      borderRadius: "var(--r)",
                      color: "var(--oxblood)",
                    }}
                  >
                    {article.category.toUpperCase()}
                  </span>
                  <span className="label-mono" style={{ color: "var(--muted)" }}>
                    {t("min_read", { n: article.readMinutes })}
                  </span>
                </div>

                {/* Title */}
                <h2
                  className="font-heading text-[28px] leading-tight transition-colors duration-200"
                  style={{ color: "var(--ink)" }}
                >
                  {article.title}
                </h2>

                {/* Author + dek */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <span
                    className="text-[14px] font-medium"
                    style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
                  >
                    {t("by")} {article.authorName} — {article.authorRole}
                  </span>
                </div>
                <p
                  className="text-[14px] italic leading-relaxed"
                  style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
                >
                  {article.dek}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
