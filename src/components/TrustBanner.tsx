"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const certifications = [
  {
    id: "iso",
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
        <path d="M14 20l4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "eu",
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
        <circle cx="33" cy="20" r="1.5" fill="currentColor" />
        <circle cx="31.26" cy="26.5" r="1.5" fill="currentColor" />
        <circle cx="26.5" cy="31.26" r="1.5" fill="currentColor" />
        <circle cx="20" cy="33" r="1.5" fill="currentColor" />
        <circle cx="13.5" cy="31.26" r="1.5" fill="currentColor" />
        <circle cx="8.74" cy="26.5" r="1.5" fill="currentColor" />
        <circle cx="7" cy="20" r="1.5" fill="currentColor" />
        <circle cx="8.74" cy="13.5" r="1.5" fill="currentColor" />
        <circle cx="13.5" cy="8.74" r="1.5" fill="currentColor" />
        <circle cx="20" cy="7" r="1.5" fill="currentColor" />
        <circle cx="26.5" cy="8.74" r="1.5" fill="currentColor" />
        <circle cx="31.26" cy="13.5" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "qkum",
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none">
        <rect x="4" y="12" width="32" height="22" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M20 6l8 6H12l8-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 22h6M20 19v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "gdpr",
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none">
        <path d="M20 4L6 10v10c0 8.5 6 15 14 18 8-3 14-9.5 14-18V10L20 4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M15 21l3 3 7-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "emergency",
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
        <path d="M20 10v10l6 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "tech",
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none">
        <rect x="6" y="6" width="28" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M14 30h12M20 26v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="16" r="4" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
];

export function TrustBanner() {
  const t = useTranslations("TrustBanner");

  return (
    <div className="py-12 border-y border-foreground/5 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-foreground/30 mb-10"
        >
          {t("title")}
        </motion.p>

        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-8 lg:gap-x-16">
          {certifications.map((cert, idx) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="group flex items-center gap-3.5 cursor-default transition-all"
            >
              <div className="text-foreground/20 group-hover:text-primary transition-colors duration-300">
                {cert.icon}
              </div>
              <div>
                <div className="text-sm font-bold text-foreground/50 group-hover:text-foreground transition-colors">
                  {t(`${cert.id}_name`)}
                </div>
                <div className="text-xs text-foreground/25 group-hover:text-foreground/40 transition-colors">
                  {t(`${cert.id}_sub`)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
