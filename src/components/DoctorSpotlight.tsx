"use client";

import { motion } from "framer-motion";
import { Award, Star, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const doctorsBase = [
  {
    id: "d1",
    name: "Dr. Elena Rodriguez",
    yearsNum: 15,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "d2",
    name: "Dr. Marcus Chen",
    yearsNum: 12,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "d3",
    name: "Dr. Sarah Johnson",
    yearsNum: 10,
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=800&auto=format&fit=crop",
  },
];

export function DoctorSpotlight() {
  const t = useTranslations("DoctorSpotlight");

  return (
    <section id="doctors" className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
            className="mt-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl"
          >
            {t("heading_1")}<span className="text-gradient">{t("heading_2")}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-foreground/60"
          >
            {t("desc")}
          </motion.p>
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {doctorsBase.map((doctor, idx) => (
            <motion.div
              key={doctor.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group flex flex-col rounded-3xl bg-card shadow-card ring-1 ring-foreground/5 transition-all hover:shadow-premium overflow-hidden"
            >
              {/* Photo */}
              <div className="relative aspect-4/3 overflow-hidden">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Card Body */}
              <div className="flex flex-col flex-1 p-8">
                {/* Rating + Experience */}
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600">
                    <Star className="h-3 w-3 fill-current" />
                    {doctor.rating}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-foreground/40">
                    <Award className="h-3 w-3" />
                    {t("years", { years: doctor.yearsNum })}
                  </div>
                </div>

                {/* Name & Specialty */}
                <h3 className="text-2xl font-bold text-foreground">
                  {doctor.name}
                </h3>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-primary">
                  {t(`${doctor.id}_spec`)}
                </p>

                {/* CTA Button */}
                <div className="mt-6 flex gap-3">
                  <Link
                    href="/book"
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-primary/10 px-4 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/20"
                  >
                    {t("profile_btn")}
                  </Link>
                  <Link
                    href="/book"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-card transition-all hover:bg-primary/90 hover:scale-[1.02]"
                  >
                    <Calendar className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
