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

        <div className="overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide scroll-smooth snap-x snap-mandatory lg:snap-none">
          <div className="flex lg:grid lg:grid-cols-3 gap-4 lg:gap-8 min-w-max lg:min-w-0">
            {testimonialsBase.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.12, duration: 0.4 }}
                className="flex flex-col rounded-2xl lg:rounded-3xl bg-card p-5 lg:p-8 shadow-card ring-1 ring-foreground/5 transition-shadow hover:shadow-premium w-72 lg:w-auto shrink-0 lg:shrink snap-center lg:snap-align-none"
              >
                <Quote className="h-5 w-5 lg:h-8 lg:w-8 text-primary/30 mb-3 lg:mb-6" />
                <p className="flex-1 text-xs lg:text-base leading-relaxed text-foreground italic">
                  &ldquo;{t(`${item.id}_quote`)}&rdquo;
                </p>
                <div className="mt-4 lg:mt-8 border-t border-foreground/5 pt-3 lg:pt-6">
                  <div className="text-xs lg:text-base font-bold text-foreground">{t(`${item.id}_name`)}</div>
                  <div className="text-[10px] lg:text-sm text-foreground/60">{t(`${item.id}_detail`)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
