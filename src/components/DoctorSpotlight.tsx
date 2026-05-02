"use client";

import { motion } from "framer-motion";
import { Award, Star, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";

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

        {/* Doctor Cards */}
        <div className="overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide scroll-smooth snap-x snap-mandatory lg:snap-none">
          <div className="flex lg:grid lg:grid-cols-3 gap-4 lg:gap-8 min-w-max lg:min-w-0">
            {doctorsBase.map((doctor, idx) => (
              <motion.div
                key={doctor.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.12, duration: 0.4 }}
                className="group flex flex-col rounded-2xl lg:rounded-3xl bg-card shadow-card ring-1 ring-foreground/5 transition-all hover:shadow-premium overflow-hidden w-72 lg:w-auto shrink-0 lg:shrink snap-center lg:snap-align-none"
              >
                {/* Photo */}
                <div className="relative aspect-4/3 overflow-hidden img-above-floaters">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    sizes="(max-width: 1024px) 288px, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Card Body */}
                <div className="flex flex-col flex-1 p-4 lg:p-8">
                  {/* Rating + Experience */}
                  <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 lg:px-3 py-0.5 lg:py-1 text-[10px] lg:text-xs font-bold text-amber-600">
                      <Star className="h-2.5 w-2.5 lg:h-3 lg:w-3 fill-current" />
                      {doctor.rating}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] lg:text-xs text-foreground/40">
                      <Award className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                      {t("years", { years: doctor.yearsNum })}
                    </div>
                  </div>

                  {/* Name & Specialty */}
                  <h3 className="text-sm lg:text-xl font-bold text-foreground">
                    {doctor.name}
                  </h3>
                  <p className="mt-0.5 text-xs lg:text-sm font-semibold uppercase tracking-wide text-primary">
                    {t(`${doctor.id}_spec`)}
                  </p>

                  {/* CTA Button */}
                  <div className="mt-4 lg:mt-6 flex gap-2 lg:gap-3">
                    <Link
                      href="/book"
                      className="flex-1 flex items-center justify-center gap-1 lg:gap-2 rounded-xl lg:rounded-2xl bg-primary/10 px-2 lg:px-4 py-1.5 lg:py-3 text-[10px] lg:text-sm font-bold text-primary transition-colors hover:bg-primary/20"
                    >
                      {t("profile_btn")}
                    </Link>
                    <Link
                      href="/book"
                      className="flex items-center justify-center gap-1 rounded-xl lg:rounded-2xl bg-primary px-2 lg:px-4 py-1.5 lg:py-3 text-[10px] font-bold text-white shadow-card transition-all hover:bg-primary/90 hover:scale-[1.02]"
                    >
                      <Calendar className="h-2.5 w-2.5 lg:h-4 lg:w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
