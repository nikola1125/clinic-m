"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useClinicStore } from "@/store/clinicStore";
import { Link } from "@/i18n/routing";
import {
  Heart, Brain, Baby, Eye, Bone, Stethoscope,
  Microscope, Droplets, Activity, Ear, Wind, Pill,
  Syringe, Scissors, Smile, ArrowRight, ChevronDown, ChevronUp,
  Users,
} from "lucide-react";

// Static specialty metadata — icons, colors, translation key
const specialtiesBase = [
  { id: "s1",  slug: "Cardiology",       icon: Heart,        color: "#E05555", bg: "rgba(224,85,85,0.09)"    },
  { id: "s2",  slug: "Neurology",        icon: Brain,        color: "#8E44AD", bg: "rgba(142,68,173,0.09)"   },
  { id: "s3",  slug: "Pediatrics",       icon: Baby,         color: "#2980B9", bg: "rgba(41,128,185,0.09)"   },
  { id: "s4",  slug: "Ophthalmology",    icon: Eye,          color: "#16A085", bg: "rgba(22,160,133,0.09)"   },
  { id: "s5",  slug: "Orthopedics",      icon: Bone,         color: "#D35400", bg: "rgba(211,84,0,0.09)"     },
  { id: "s6",  slug: "General Medicine", icon: Stethoscope,  color: "#4C8C6D", bg: "rgba(76,140,109,0.09)"   },
  { id: "s7",  slug: "Oncology",         icon: Microscope,   color: "#7D3C98", bg: "rgba(125,60,152,0.09)"   },
  { id: "s8",  slug: "Dermatology",      icon: Droplets,     color: "#E08E0B", bg: "rgba(224,142,11,0.09)"   },
  { id: "s9",  slug: "Gynecology",       icon: Activity,     color: "#C2185B", bg: "rgba(194,24,91,0.09)"    },
  { id: "s10", slug: "ENT",              icon: Ear,          color: "#00796B", bg: "rgba(0,121,107,0.09)"    },
  { id: "s11", slug: "Pneumology",       icon: Wind,         color: "#2E86C1", bg: "rgba(46,134,193,0.09)"   },
  { id: "s12", slug: "Endocrinology",    icon: Pill,         color: "#884EA0", bg: "rgba(136,78,160,0.09)"   },
  { id: "s13", slug: "Urology",          icon: Syringe,      color: "#17A589", bg: "rgba(23,165,137,0.09)"   },
  { id: "s14", slug: "Surgery",          icon: Scissors,     color: "#CB4335", bg: "rgba(203,67,53,0.09)"    },
  { id: "s15", slug: "Dentist",          icon: Smile,        color: "#2E86C1", bg: "rgba(46,134,193,0.09)"   },
  { id: "s16", slug: "Gastroenterology", icon: Stethoscope,  color: "#E74C3C", bg: "rgba(231,76,60,0.09)"    },
] as const;

const INITIAL_COUNT = 8;

export function SpecialtyGrid() {
  const t = useTranslations("SpecialtyGrid");
  const doctors = useClinicStore((s) => s.doctors);
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  // Count doctors per specialty (case-insensitive match)
  const doctorCountBySlug = (slug: string) =>
    doctors.filter((d) =>
      d.specialty.toLowerCase().includes(slug.toLowerCase())
    ).length;

  const visible = expanded ? specialtiesBase : specialtiesBase.slice(0, INITIAL_COUNT);

  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ─────────────────────────────── */}
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm font-semibold uppercase tracking-widest text-primary"
          >
            {t("title")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 text-3xl font-bold tracking-tight text-foreground lg:text-4xl"
          >
            {t("heading_1")}{" "}
            <span className="text-gradient">{t("heading_specialist")}</span>
            {t("heading_2")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.14, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 text-base text-foreground/60 max-w-lg mx-auto"
          >
            {t("description")}
          </motion.p>
        </div>

        {/* ── Specialty Cards Grid ───────────────────────── */}
        <div
          className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4"
        >
          <AnimatePresence>
            {visible.map((spec, idx) => {
              const Icon = spec.icon;
              const count = doctorCountBySlug(spec.slug);
              const isHovered = hovered === spec.id;

              return (
                <motion.div
                  key={spec.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={`/book?specialty=${encodeURIComponent(spec.slug)}`}
                    className="group relative flex flex-col gap-2 sm:gap-3 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 lg:p-5 h-full cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    style={{
                      background: isHovered ? spec.bg : "var(--card)",
                      border: `1px solid ${isHovered ? spec.color + "30" : "var(--card-border)"}`,
                      boxShadow: isHovered
                        ? `0 4px 16px -2px ${spec.color}18, var(--shadow-card)`
                        : "var(--shadow-card)",
                    }}
                    onMouseEnter={() => setHovered(spec.id)}
                    onMouseLeave={() => setHovered(null)}
                    aria-label={`${t(`${spec.id}_name`)} — ${count} ${count === 1 ? "doctor" : "doctors"}`}
                  >
                    {/* Icon */}
                    <div
                      className="flex h-9 w-9 sm:h-11 sm:w-11 lg:h-12 lg:w-12 items-center justify-center rounded-lg sm:rounded-xl shrink-0"
                      style={{ background: spec.bg }}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" style={{ color: spec.color }} aria-hidden="true" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-xs sm:text-sm lg:text-base font-bold leading-snug text-foreground transition-colors group-hover:text-inherit"
                        style={{ color: isHovered ? spec.color : undefined }}
                      >
                        {t(`${spec.id}_name`)}
                      </h3>
                      <p className="mt-0.5 text-[11px] lg:text-xs text-foreground/50 leading-relaxed line-clamp-1 hidden sm:block">
                        {t(`${spec.id}_desc`)}
                      </p>
                    </div>

                    {/* Doctor count badge — hidden on mobile for compact 3-col */}
                    <div className="hidden sm:flex items-center justify-between mt-auto pt-1">
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold rounded-full px-2 py-0.5"
                        style={{
                          background: `${spec.color}14`,
                          color: spec.color,
                        }}
                      >
                        <Users className="h-2.5 w-2.5" aria-hidden="true" />
                        {count} {count === 1 ? t("doctor_singular") : t("doctor_plural")}
                      </span>

                      {/* Arrow — appears on hover */}
                      <ArrowRight
                        className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ color: spec.color }}
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ── Show More / View All ───────────────────────── */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          {specialtiesBase.length > INITIAL_COUNT && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
              style={{
                background: "rgba(111,175,143,0.08)",
                color: "var(--primary-dark)",
                border: "1px solid rgba(111,175,143,0.15)",
              }}
              aria-expanded={expanded}
            >
              {expanded ? (
                <>{t("show_less")} <ChevronUp className="h-4 w-4" aria-hidden="true" /></>
              ) : (
                <>{t("show_all")} <ChevronDown className="h-4 w-4" aria-hidden="true" /></>
              )}
            </button>
          )}

          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white transition-all hover:scale-[1.03] hover:shadow-lg active:scale-[0.97] cursor-pointer"
            style={{ background: "linear-gradient(135deg, #4C8C6D, #6FAF8F)" }}
          >
            {t("view_all_specialists")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
