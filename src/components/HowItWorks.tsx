"use client";

import { motion } from "framer-motion";
import { Search, LayoutGrid, CalendarCheck, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const steps = [
  {
    number: "01",
    icon: Search,
    accent: "#6FAF8F",
    glow: "rgba(111,175,143,0.18)",
    ring: "rgba(111,175,143,0.2)",
    bg: "rgba(111,175,143,0.08)",
  },
  {
    number: "02",
    icon: LayoutGrid,
    accent: "#5B9BD5",
    glow: "rgba(91,155,213,0.18)",
    ring: "rgba(91,155,213,0.2)",
    bg: "rgba(91,155,213,0.08)",
  },
  {
    number: "03",
    icon: CalendarCheck,
    accent: "#A78BFA",
    glow: "rgba(167,139,250,0.18)",
    ring: "rgba(167,139,250,0.2)",
    bg: "rgba(167,139,250,0.08)",
  },
] as const;

export function HowItWorks() {
  const t = useTranslations("HowItWorks");

  return (
    <section
      className="relative py-16 lg:py-24 overflow-hidden"
      style={{ background: "var(--background-alt)" }}
    >
      {/* Ambient top glow — matches primary colour */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 blur-[100px] -z-10 rounded-full pointer-events-none"
        style={{ background: "rgba(111,175,143,0.12)" }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-primary"
            style={{
              borderColor: "rgba(111,175,143,0.25)",
              background: "rgba(111,175,143,0.08)",
            }}
          >
            {t("badge")}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-5 text-3xl font-bold tracking-tight text-foreground lg:text-5xl"
          >
            {t("heading_1")}{" "}
            <span className="text-gradient">{t("heading_2")}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            className="mt-4 text-base max-w-lg mx-auto"
            style={{ color: "var(--foreground-muted)", opacity: 0.7 }}
          >
            {t("subtitle")}
          </motion.p>
        </div>

        {/* Step cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;
            return (
              <div key={step.number} className="relative">
                {/* Arrow connector — desktop only */}
                {!isLast && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 + 0.3 }}
                    className="absolute hidden sm:flex items-center justify-center -right-4 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full"
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--card-border)",
                      boxShadow: "var(--shadow-card)",
                    }}
                  >
                    <ArrowRight className="h-4 w-4 text-primary opacity-50" />
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.5 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="relative flex flex-col rounded-3xl p-6 lg:p-8 h-full overflow-hidden group cursor-default"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--card-border)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at 50% 0%, ${step.glow} 0%, transparent 70%)`,
                    }}
                  />

                  {/* Large ghost step number */}
                  <div
                    className="absolute -top-2 -right-1 text-[80px] lg:text-[100px] font-black leading-none select-none pointer-events-none"
                    style={{ color: step.accent, opacity: 0.06 }}
                  >
                    {step.number}
                  </div>

                  {/* Icon with glow ring */}
                  <div className="relative mb-5 w-fit">
                    <div
                      className="absolute inset-0 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: step.glow }}
                    />
                    <div
                      className="relative flex h-14 w-14 lg:h-16 lg:w-16 items-center justify-center rounded-2xl"
                      style={{
                        background: step.bg,
                        border: `1px solid ${step.ring}`,
                      }}
                    >
                      <Icon
                        className="h-7 w-7 lg:h-8 lg:w-8 transition-transform duration-300 group-hover:scale-110"
                        style={{ color: step.accent }}
                      />
                    </div>
                  </div>

                  {/* Step label */}
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: step.accent }}
                  >
                    {t("step_label")} {step.number}
                  </p>

                  {/* Title */}
                  <h3 className="text-lg lg:text-xl font-bold text-foreground mb-3 leading-snug">
                    {t(`step${idx + 1}_title`)}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed flex-1"
                    style={{ color: "var(--foreground-muted)", opacity: 0.65 }}
                  >
                    {t(`step${idx + 1}_desc`)}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 lg:mt-14"
        >
          <Link
            href="/book"
            className="inline-flex items-center gap-3 rounded-2xl px-8 py-4 text-sm font-bold text-white transition-all hover:scale-[1.04] active:scale-[0.97]"
            style={{
              background: "linear-gradient(135deg, #4C8C6D, #6FAF8F)",
              boxShadow: "0 8px 32px -4px rgba(76,140,109,0.35)",
            }}
          >
            <CalendarCheck className="h-5 w-5" />
            {t("cta")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
