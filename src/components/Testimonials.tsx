"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useTranslations } from "next-intl";

const testimonialsBase = [
  { id: "t1" },
  { id: "t2" },
  { id: "t3" },
];

export function Testimonials() {
  const t = useTranslations("Testimonials");

  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-widest text-primary"
          >
            {t("title")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl font-heading"
          >
            {t("heading_1")}<span className="text-gradient">{t("heading_2")}</span>
          </motion.h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonialsBase.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12 }}
              className="flex flex-col rounded-3xl bg-card p-8 shadow-card ring-1 ring-foreground/5 transition-shadow hover:shadow-premium"
            >
              <Quote className="h-8 w-8 text-primary/30 mb-6" />
              <p className="flex-1 text-base leading-relaxed text-foreground/70 italic">
                &ldquo;{t(`${item.id}_quote`)}&rdquo;
              </p>
              <div className="mt-8 border-t border-foreground/5 pt-6">
                <div className="font-bold text-foreground">{t(`${item.id}_name`)}</div>
                <div className="text-sm text-foreground/50">{t(`${item.id}_detail`)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
