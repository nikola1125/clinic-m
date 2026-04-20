"use client";

import { motion, useInView } from "framer-motion";
import { Search, LayoutGrid, CalendarCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    icon: Search,
    accent: "#6FAF8F",
    glow: "rgba(111,175,143,0.22)",
    ring: "rgba(111,175,143,0.25)",
    bg: "rgba(111,175,143,0.10)",
  },
  {
    number: "02",
    icon: LayoutGrid,
    accent: "#5B9BD5",
    glow: "rgba(91,155,213,0.22)",
    ring: "rgba(91,155,213,0.25)",
    bg: "rgba(91,155,213,0.10)",
  },
  {
    number: "03",
    icon: CalendarCheck,
    accent: "#A78BFA",
    glow: "rgba(167,139,250,0.22)",
    ring: "rgba(167,139,250,0.25)",
    bg: "rgba(167,139,250,0.10)",
  },
] as const;

/* ── Animated connecting arrow (desktop) ── */
function DesktopConnector({ accent, delay }: { accent: string; delay: number }) {
  return (
    <div className="absolute top-1/2 -right-6 lg:-right-8 hidden sm:block -translate-y-1/2 z-10 w-8 lg:w-10">
      <svg viewBox="0 0 40 24" fill="none" className="w-full h-6">
        <motion.path
          d="M0 12h30l6-6 4 6"
          stroke={accent}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="60"
          initial={{ strokeDashoffset: 60, opacity: 0 }}
          whileInView={{ strokeDashoffset: 0, opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{ delay, duration: 0.8, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}

/* ── Mobile Timeline Step ── */
function MobileStep({ step, idx, t, isLast }: { step: typeof steps[number]; idx: number; t: any; isLast: boolean }) {
  const Icon = step.icon;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="relative flex gap-4">
      {/* Timeline rail */}
      <div className="flex flex-col items-center shrink-0" style={{ width: 44 }}>
        {/* Pulsing step dot */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full"
          style={{
            background: step.bg,
            border: `2px solid ${step.accent}`,
            boxShadow: `0 0 0 4px ${step.accent}15`,
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Icon className="h-5 w-5" style={{ color: step.accent }} />
          </motion.div>

          {/* Pulse ring on appear */}
          {inView && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ border: `2px solid ${step.accent}` }}
            />
          )}
        </motion.div>

        {/* Vertical connecting line */}
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
            className="w-0.5 flex-1 origin-top my-1"
            style={{
              background: `linear-gradient(to bottom, ${step.accent}, ${steps[idx + 1]?.accent || step.accent}40)`,
            }}
          />
        )}
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{
          delay: 0.15,
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative flex-1 rounded-2xl p-5 overflow-hidden mb-4"
        style={{
          background: "var(--card)",
          border: "1px solid var(--card-border)",
          boxShadow: "var(--shadow-card)",
          borderLeft: `3px solid ${step.accent}`,
        }}
      >
        {/* Ghost number */}
        <div
          className="absolute -top-1 -right-1 text-[64px] font-black leading-none select-none pointer-events-none"
          style={{ color: step.accent, opacity: 0.07 }}
        >
          {step.number}
        </div>

        {/* Colored top edge glow */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background: `linear-gradient(90deg, ${step.accent}60, transparent)`,
          }}
        />

        {/* Step label */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[10px] font-extrabold uppercase tracking-widest"
            style={{ color: step.accent }}
          >
            {t("step_label")} {step.number}
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="h-px flex-1 origin-left"
            style={{ background: `${step.accent}40` }}
          />
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-foreground mb-1.5 leading-snug">
          {t(`step${idx + 1}_title`)}
        </h3>

        {/* Description */}
        <p
          className="text-xs leading-relaxed"
          style={{ color: "var(--foreground-muted)", opacity: 0.65 }}
        >
          {t(`step${idx + 1}_desc`)}
        </p>

        {/* Bottom accent bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
          className="h-0.5 rounded-full mt-4 origin-left"
          style={{
            background: `linear-gradient(90deg, ${step.accent}, ${step.accent}30)`,
          }}
        />
      </motion.div>
    </div>
  );
}

/* ── Desktop Step Card ── */
function DesktopCard({ step, idx, t }: { step: typeof steps[number]; idx: number; t: any }) {
  const Icon = step.icon;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        delay: idx * 0.12,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative flex flex-col rounded-3xl p-6 lg:p-8 h-full overflow-hidden group cursor-default"
      style={{
        background: "var(--card)",
        border: "1px solid var(--card-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Animated gradient border on hover */}
      <div
        className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${step.accent}40, transparent 50%, ${step.accent}20)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1.5px",
        }}
      />

      {/* Top glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% -20%, ${step.glow} 0%, transparent 70%)`,
        }}
      />

      {/* Ghost number — slides in */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 0.06, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.2 + 0.3, duration: 0.5 }}
        className="absolute -top-2 -right-1 text-[100px] font-black leading-none select-none pointer-events-none"
        style={{ color: step.accent }}
      >
        {step.number}
      </motion.div>

      {/* Icon with spring entrance */}
      <div className="relative mb-5 w-fit">
        <div
          className="absolute inset-0 rounded-2xl blur-lg opacity-0 group-hover:opacity-80 transition-opacity duration-300"
          style={{ background: step.glow }}
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{
            delay: idx * 0.12 + 0.15,
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{
            background: step.bg,
            border: `1.5px solid ${step.ring}`,
          }}
        >
          <Icon
            className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
            style={{ color: step.accent }}
          />
        </motion.div>
      </div>

      {/* Step label + animated underline */}
      <div className="relative w-fit mb-2">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: step.accent }}
        >
          {t("step_label")} {step.number}
        </p>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.2 + 0.4, duration: 0.4 }}
          className="h-0.5 rounded-full mt-1 origin-left"
          style={{ background: step.accent, opacity: 0.4 }}
        />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-foreground mb-3 leading-snug">
        {t(`step${idx + 1}_title`)}
      </h3>

      {/* Description */}
      <p
        className="text-sm leading-relaxed flex-1"
        style={{ color: "var(--foreground-muted)", opacity: 0.65 }}
      >
        {t(`step${idx + 1}_desc`)}
      </p>

      {/* Bottom accent bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.2 + 0.5, duration: 0.6, ease: "easeOut" }}
        className="h-1 rounded-full mt-6 origin-left"
        style={{
          background: `linear-gradient(90deg, ${step.accent}, ${step.accent}40)`,
        }}
      />
    </motion.div>
  );
}

export function HowItWorks() {
  const t = useTranslations("HowItWorks");

  return (
    <section
      className="relative py-16 lg:py-24 overflow-hidden"
      style={{ background: "var(--background-alt)" }}
    >
      {/* Ambient glow — desktop only */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 blur-[100px] -z-10 rounded-full pointer-events-none hidden lg:block"
        style={{ background: "rgba(111,175,143,0.12)" }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-3xl font-bold tracking-tight text-foreground lg:text-5xl"
          >
            {t("heading_1")}{" "}
            <span className="text-gradient">{t("heading_2")}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-base max-w-lg mx-auto"
            style={{ color: "var(--foreground-muted)", opacity: 0.7 }}
          >
            {t("subtitle")}
          </motion.p>
        </div>

        {/* ── Mobile: Vertical Timeline ── */}
        <div className="sm:hidden">
          {steps.map((step, idx) => (
            <MobileStep
              key={step.number}
              step={step}
              idx={idx}
              t={t}
              isLast={idx === steps.length - 1}
            />
          ))}
        </div>

        {/* ── Desktop: 3-column grid ── */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-5 lg:gap-8 relative">
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            return (
              <div key={step.number} className="relative">
                {!isLast && (
                  <DesktopConnector accent={step.accent} delay={idx * 0.2 + 0.5} />
                )}
                <DesktopCard step={step} idx={idx} t={t} />
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
