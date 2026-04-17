"use client";

import { motion } from "framer-motion";
import { Scissors, Eye, Microscope, Users, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

const serviceIds = ["s1", "s2", "s3", "s4"] as const;
const serviceIcons = [Scissors, Eye, Microscope, Users];

export function Services() {
  const t = useTranslations("Services");

  return (
    <section
      id="services"
      className="py-16 lg:py-20"
      style={{ background: "rgba(207, 232, 216, 0.15)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-20">
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
            className="mt-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl"
          >
            {t("heading_1")}
            <span className="text-gradient">{t("heading_highlight")}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-foreground max-w-2xl mx-auto"
          >
            {t("desc")}
          </motion.p>
        </div>

        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {serviceIds.map((id, idx) => {
            const Icon = serviceIcons[idx];
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative flex flex-col rounded-3xl bg-card p-6 sm:p-8 shadow-card ring-1 ring-foreground/5 transition-all hover:shadow-premium"
              >
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 sm:mb-6">
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <h3 className="text-lg font-bold text-foreground sm:text-xl">
                  {t(`${id}_title`)}
                </h3>
                <p className="mt-2 text-sm text-foreground leading-relaxed flex-1 sm:mt-3">
                  {t(`${id}_desc`)}
                </p>
                <div className="mt-4 sm:mt-6 flex items-center text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  {t("learn_more")} <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
