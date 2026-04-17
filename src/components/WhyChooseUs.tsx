"use client";

import { motion } from "framer-motion";
import { BadgeCheck, CalendarClock, Zap, ShieldHalf } from "lucide-react";
import { useTranslations } from "next-intl";

const items = [
  { icon: BadgeCheck, accent: "#6FAF8F", bg: "rgba(111,175,143,0.09)", key: "verified" },
  { icon: CalendarClock, accent: "#5B9BD5", bg: "rgba(91,155,213,0.09)", key: "booking" },
  { icon: Zap, accent: "#F59E0B", bg: "rgba(245,158,11,0.09)", key: "response" },
  { icon: ShieldHalf, accent: "#A78BFA", bg: "rgba(167,139,250,0.09)", key: "trusted" },
] as const;

export function WhyChooseUs() {
  const t = useTranslations("WhyChooseUs");

  return (
    <section className="py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Slim header */}
        <div className="text-center mb-8">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-widest text-primary"
          >
            {t("badge")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="mt-2 text-2xl font-bold tracking-tight text-foreground lg:text-3xl"
          >
            {t("heading")}
          </motion.h2>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {items.map(({ icon: Icon, accent, bg, key }, idx) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.18 } }}
              className="flex flex-col gap-3 rounded-2xl p-5 lg:p-6 cursor-default"
              style={{
                background: "var(--card)",
                border: "1px solid var(--card-border)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
                style={{ background: bg }}
              >
                <Icon className="h-5 w-5" style={{ color: accent }} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {t(`${key}_title`)}
                </h3>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--foreground-muted)", opacity: 0.7 }}>
                  {t(`${key}_desc`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
