"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  JOURNAL_ARTICLES,
  JOURNAL_CATEGORIES,
  type JournalCategory,
} from "@/lib/journal";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function JournalPage() {
  const t = useTranslations("journal");
  const [activeCategory, setActiveCategory] = useState<JournalCategory | "All">("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return JOURNAL_ARTICLES.filter((a) => {
      const matchCat = activeCategory === "All" || a.category === activeCategory;
      const q = query.toLowerCase();
      const matchQ =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.dek.toLowerCase().includes(q) ||
        a.author.name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [activeCategory, query]);

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
              {(["All", ...JOURNAL_CATEGORIES] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as JournalCategory | "All")}
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
                    {t("by")} {article.author.name} — {article.author.role}
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
