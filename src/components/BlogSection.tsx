"use client";

import { motion } from "framer-motion";
import { Clock, ArrowRight, Tag, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

const articleIds = ["a1", "a2", "a3", "a4"] as const;

const articleImages = [
  "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800&auto=format&fit=crop",
];

const categoryColors: Record<string, string> = {
  green: "#6FAF8F",
  red: "#E05555",
  blue: "#2E86C1",
  purple: "#8E44AD",
};

const articleCategoryColors = ["green", "red", "blue", "purple"] as const;

export function BlogSection() {
  const t = useTranslations("BlogSection");

  const articles = articleIds.map((id, idx) => ({
    id,
    title: t(`${id}_title`),
    excerpt: t(`${id}_excerpt`),
    category: t(`${id}_category`),
    readTime: t(`${id}_readTime`),
    date: t(`${id}_date`),
    image: articleImages[idx],
    featured: idx === 0,
    colorKey: articleCategoryColors[idx],
  }));

  const featured = articles.find((a) => a.featured);
  const rest = articles.filter((a) => !a.featured);

  return (
    <section className="py-12 lg:py-16" style={{ background: "rgba(207,232,216,0.08)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-semibold uppercase tracking-widest text-primary"
            >
              {t("badge")}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl"
            >
              {t("heading_1")} <span className="text-gradient">{t("heading_2")}</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-base text-foreground/60 max-w-xl"
            >
              {t("desc")}
            </motion.p>
          </div>
          <motion.a
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            href="#"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:scale-[1.03] shrink-0"
            style={{ background: "rgba(111,175,143,0.08)", color: "var(--primary-dark)" }}
          >
            {t("view_all")} <ArrowRight className="h-4 w-4" />
          </motion.a>
        </div>

        {/* Grid: Featured + 3 Side Cards */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Featured Article */}
          {featured && (
            <motion.a
              href="#"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden bg-card shadow-card ring-1 ring-foreground/5 transition-all hover:shadow-premium"
            >
              <div className="relative flex-1 sm:flex-none sm:aspect-[16/10] overflow-hidden min-h-0">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6">
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-bold text-white mb-1.5 sm:mb-3"
                    style={{ background: categoryColors[featured.colorKey] || "var(--primary)" }}
                  >
                    <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    <span className="hidden xs:inline">{featured.category}</span>
                  </span>
                  <h3 className="text-xs sm:text-lg lg:text-2xl font-bold text-white leading-tight line-clamp-3">
                    {featured.title}
                  </h3>
                </div>
              </div>
              <div className="flex flex-col p-3 sm:p-6 lg:p-8 sm:flex-1">
                <p className="hidden sm:block text-sm lg:text-base text-foreground/60 leading-relaxed flex-1 line-clamp-3">
                  {featured.excerpt}
                </p>
                <div className="mt-2 sm:mt-4 lg:mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] sm:text-sm text-foreground/40">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{featured.readTime}</span>
                  </div>
                  <span className="text-[10px] sm:text-sm text-foreground/40">{featured.date}</span>
                </div>
              </div>
            </motion.a>
          )}

          {/* Side Articles */}
          <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6">
            {rest.map((article, idx) => (
              <motion.a
                key={article.id}
                href="#"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group flex gap-2 sm:gap-4 lg:gap-5 rounded-xl sm:rounded-2xl bg-card p-2 sm:p-4 shadow-card ring-1 ring-foreground/5 transition-all hover:shadow-premium"
              >
                <div className="relative h-14 w-14 sm:h-20 sm:w-20 lg:h-24 lg:w-24 shrink-0 overflow-hidden rounded-lg sm:rounded-xl">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <span
                    className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold mb-1 sm:mb-1.5 w-fit"
                    style={{ color: categoryColors[article.colorKey] || "var(--primary)" }}
                  >
                    <Tag className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    <span className="truncate max-w-[80px] sm:max-w-none">{article.category}</span>
                  </span>
                  <h3 className="text-[11px] sm:text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <div className="mt-1 sm:mt-2 flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-foreground/40">
                    <span className="flex items-center gap-0.5 sm:gap-1">
                      <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      <span className="hidden sm:inline">{article.readTime}</span>
                    </span>
                    <span className="hidden sm:inline">{article.date}</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
