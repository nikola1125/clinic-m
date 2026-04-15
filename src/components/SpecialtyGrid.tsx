"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Heart, Brain, Baby, Eye, Bone, Stethoscope,
  Microscope, Pill, Ear, Wind, Droplets, Scissors,
  Smile, Syringe, Activity, ChevronDown, ChevronUp,
} from "lucide-react";

const specialtiesBase = [
  { id: "s1", icon: Heart, gradient: "linear-gradient(135deg, #FF6B6B22, #FF6B6B08)", iconColor: "#E05555" },
  { id: "s2", icon: Brain, gradient: "linear-gradient(135deg, #9B59B622, #9B59B608)", iconColor: "#8E44AD" },
  { id: "s3", icon: Baby, gradient: "linear-gradient(135deg, #3498DB22, #3498DB08)", iconColor: "#2980B9" },
  { id: "s4", icon: Eye, gradient: "linear-gradient(135deg, #1ABC9C22, #1ABC9C08)", iconColor: "#16A085" },
  { id: "s5", icon: Bone, gradient: "linear-gradient(135deg, #E67E2222, #E67E2208)", iconColor: "#D35400" },
  { id: "s6", icon: Stethoscope, gradient: "linear-gradient(135deg, #6FAF8F22, #6FAF8F08)", iconColor: "#4C8C6D" },
  { id: "s7", icon: Microscope, gradient: "linear-gradient(135deg, #8E44AD22, #8E44AD08)", iconColor: "#7D3C98" },
  { id: "s8", icon: Droplets, gradient: "linear-gradient(135deg, #F39C1222, #F39C1208)", iconColor: "#E08E0B" },
  { id: "s9", icon: Activity, gradient: "linear-gradient(135deg, #E91E6322, #E91E6308)", iconColor: "#C2185B" },
  { id: "s10", icon: Ear, gradient: "linear-gradient(135deg, #00968822, #00968808)", iconColor: "#00796B" },
  { id: "s11", icon: Wind, gradient: "linear-gradient(135deg, #5DADE222, #5DADE208)", iconColor: "#2E86C1" },
  { id: "s12", icon: Pill, gradient: "linear-gradient(135deg, #AF7AC522, #AF7AC508)", iconColor: "#884EA0" },
  { id: "s13", icon: Syringe, gradient: "linear-gradient(135deg, #48C9B022, #48C9B008)", iconColor: "#17A589" },
  { id: "s14", icon: Scissors, gradient: "linear-gradient(135deg, #E7494922, #E7494908)", iconColor: "#CB4335" },
  { id: "s15", icon: Smile, gradient: "linear-gradient(135deg, #5499C722, #5499C708)", iconColor: "#2E86C1" },
  { id: "s16", icon: Stethoscope, gradient: "linear-gradient(135deg, #F1948A22, #F1948A08)", iconColor: "#E74C3C" },
];

export function SpecialtyGrid() {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations("SpecialtyGrid");
  const visibleCount = expanded ? specialtiesBase.length : 8;

  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
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
            className="mt-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl"
          >
            {t("heading_1")} <span className="text-gradient">{t("heading_specialist")}</span>{t("heading_2")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-foreground/60 max-w-2xl mx-auto"
          >
            {t("description")}
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {specialtiesBase.slice(0, visibleCount).map((specialty, idx) => (
            <motion.a
              key={specialty.id}
              href={`/#specialty-${t(`${specialty.id}_name`).toLowerCase().replace(/\s+/g, "-").replace(/ë/g, "e")}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.04, duration: 0.4 }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex flex-col items-center gap-4 rounded-3xl p-6 lg:p-8 text-center transition-all duration-300 cursor-pointer"
              style={{
                background: specialty.gradient,
                border: "1px solid rgba(95,143,123,0.08)",
              }}
            >
              {/* Icon */}
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-4deg]"
                style={{
                  background: `${specialty.iconColor}12`,
                }}
              >
                <specialty.icon
                  className="h-7 w-7 transition-colors"
                  style={{ color: specialty.iconColor }}
                />
              </div>

              {/* Name */}
              <h3 className="text-sm lg:text-base font-bold text-foreground leading-tight">
                {t(`${specialty.id}_name`)}
              </h3>

              {/* Description - visible on hover */}
              <p className="text-xs text-foreground/50 leading-relaxed hidden sm:block">
                {t(`${specialty.id}_desc`)}
              </p>

              {/* Hover arrow */}
              <div
                className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 -translate-x-1"
                style={{ background: `${specialty.iconColor}15` }}
              >
                <svg
                  width="12" height="12" viewBox="0 0 12 12"
                  style={{ color: specialty.iconColor }}
                >
                  <path
                    d="M2 6h8M7 3l3 3-3 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Expand / Collapse Button */}
        {specialtiesBase.length > 8 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:scale-[1.03] active:scale-[0.97]"
              style={{
                background: "rgba(111,175,143,0.08)",
                color: "var(--primary-dark)",
              }}
            >
              {expanded ? (
                <>
                  {t("show_less")} <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  {t("show_all")} <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
