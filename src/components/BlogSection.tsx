"use client";

import { motion } from "framer-motion";
import { Clock, ArrowRight, Tag, TrendingUp } from "lucide-react";

const articles = [
  {
    id: 1,
    title: "Si të Përgatiteni për Vizitën Tuaj të Parë Onkologjike",
    excerpt: "Mësoni çfarë të prisni gjatë konsultimit tuaj të parë dhe si të përgatiteni për të marrë maksimumin nga takimi me specialistin.",
    category: "Udhëzues Pacientësh",
    readTime: "5 min lexim",
    date: "12 Prill 2026",
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=800&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 2,
    title: "10 Këshilla për Një Zemër të Shëndetshme",
    excerpt: "Zbuloni mënyrat e thjeshta, bazuar në shkencë, për të mbrojtur shëndetin e zemrës suaj çdo ditë.",
    category: "Shëndeti i Zemrës",
    readTime: "4 min lexim",
    date: "8 Prill 2026",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=800&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 3,
    title: "Rëndësia e Check-Up Vjetor: Çfarë Duhet të Dini",
    excerpt: "Kontrolli i rregullt shëndetësor mund të zbulojë problemet para se të bëhen serioze. Ja pse nuk duhet ta neglizhoni.",
    category: "Parandalimi",
    readTime: "3 min lexim",
    date: "3 Prill 2026",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 4,
    title: "Mjekësia Moderne: Teknikat Minimalisht Invazive",
    excerpt: "Si ndërhyrjet kirurgjikale me akses minimal po transformojnë rikuperimin e pacientëve dhe rezultatet klinike.",
    category: "Inovacion",
    readTime: "6 min lexim",
    date: "28 Mars 2026",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800&auto=format&fit=crop",
    featured: false,
  },
];

const categoryColors: Record<string, string> = {
  "Udhëzues Pacientësh": "#6FAF8F",
  "Shëndeti i Zemrës": "#E05555",
  "Parandalimi": "#2E86C1",
  "Inovacion": "#8E44AD",
};

export function BlogSection() {
  const featured = articles.find((a) => a.featured);
  const rest = articles.filter((a) => !a.featured);

  return (
    <section className="py-16 lg:py-20" style={{ background: "rgba(207,232,216,0.08)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-16 gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-semibold uppercase tracking-widest text-primary"
            >
              Blog Shëndetësor
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl"
            >
              Lajme & <span className="text-gradient">Këshilla</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-lg text-foreground/60 max-w-xl"
            >
              Informacione të dobishme nga specialistët tanë për shëndetin tuaj.
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
            Shiko Të Gjitha <ArrowRight className="h-4 w-4" />
          </motion.a>
        </div>

        {/* Grid: Featured + 3 Cards */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Featured Article */}
          {featured && (
            <motion.a
              href="#"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative flex flex-col rounded-3xl overflow-hidden bg-card shadow-card ring-1 ring-foreground/5 transition-all hover:shadow-premium lg:row-span-3"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white mb-3"
                    style={{ background: categoryColors[featured.category] || "var(--primary)" }}
                  >
                    <TrendingUp className="h-3 w-3" />
                    {featured.category}
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                    {featured.title}
                  </h3>
                </div>
              </div>
              <div className="flex flex-col flex-1 p-8">
                <p className="text-base text-foreground/60 leading-relaxed flex-1">
                  {featured.excerpt}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-foreground/40">
                    <Clock className="h-4 w-4" />
                    {featured.readTime}
                  </div>
                  <span className="text-sm text-foreground/40">{featured.date}</span>
                </div>
              </div>
            </motion.a>
          )}

          {/* Side Articles */}
          <div className="flex flex-col gap-6">
            {rest.map((article, idx) => (
              <motion.a
                key={article.id}
                href="#"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group flex gap-5 rounded-2xl bg-card p-4 shadow-card ring-1 ring-foreground/5 transition-all hover:shadow-premium"
              >
                {/* Thumbnail */}
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center min-w-0">
                  <span
                    className="inline-flex items-center gap-1 text-xs font-bold mb-1.5 w-fit"
                    style={{ color: categoryColors[article.category] || "var(--primary)" }}
                  >
                    <Tag className="h-3 w-3" />
                    {article.category}
                  </span>
                  <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-3 text-xs text-foreground/40">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                    <span>{article.date}</span>
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
