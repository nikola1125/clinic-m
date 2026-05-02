"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, Star } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { EcgLine } from "./EcgLine";
import Image from "next/image";

const T = { duration: 0.5, ease: [0.22, 1, 0.36, 1] } as const;

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative overflow-hidden pt-10 pb-12 lg:pt-16 lg:pb-14">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 -z-10 h-full w-full">
        <Image
          src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2000&auto=format&fit=crop"
          alt="Clinic Background"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-15 grayscale-50"
        />
        <div className="absolute inset-0 bg-linear-to-b from-background via-background/90 to-background" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="relative">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...T, delay: 0 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                <Star className="h-4 w-4 fill-current" />
                <span>{t("badge")}</span>
              </div>
            </motion.div>

            {/* ECG heartbeat */}
            <EcgLine />

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...T, delay: 0.1 }}
              className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-7xl"
            >
              {t("title_1")} <br />
              <span className="text-gradient">{t("title_2")}</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...T, delay: 0.2 }}
              className="mt-4 text-base leading-7 text-foreground max-w-xl sm:text-lg sm:leading-8"
            >
              {t("description")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...T, delay: 0.3 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-premium transition-all hover:bg-primary/90 hover:scale-[1.03] active:scale-[0.97] sm:px-8 sm:py-4 sm:text-lg"
              >
                <Calendar className="h-5 w-5" />
                {t("book_btn")}
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-base font-semibold text-foreground transition-all hover:bg-foreground/5 sm:px-6 sm:py-4 sm:text-lg"
              >
                {t("services_btn")}
                <ChevronRight className="h-5 w-5" />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...T, delay: 0.4 }}
              className="mt-10 grid grid-cols-2 gap-4 border-t border-foreground/5 pt-6 sm:mt-12 sm:flex sm:items-center sm:gap-8 sm:pt-10"
            >
              <div>
                <div className="text-xl font-bold text-foreground sm:text-2xl">15k+</div>
                <div className="text-xs text-foreground sm:text-sm">{t("stat_patients")}</div>
              </div>
              <div className="hidden sm:block h-10 w-px bg-foreground/10" />
              <div>
                <div className="text-xl font-bold text-foreground sm:text-2xl">48+</div>
                <div className="text-xs text-foreground sm:text-sm">{t("stat_doctors")}</div>
              </div>
              <div className="hidden sm:block h-10 w-px bg-foreground/10" />
              <div className="flex -space-x-2 overflow-hidden col-span-2 sm:col-auto justify-start mt-2 sm:mt-0 sm:-space-x-3 img-above-floaters">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="relative inline-block h-8 w-8 rounded-full border-2 border-background bg-zinc-200 overflow-hidden sm:h-10 sm:w-10">
                    <Image src={`https://i.pravatar.cc/100?img=${i+20}`} alt="" fill sizes="40px" className="object-cover" />
                  </div>
                ))}
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-xs font-bold text-white sm:h-10 sm:w-10">
                  +1k
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative z-10 aspect-4/5 overflow-hidden rounded-[3rem] shadow-premium bg-primary/10 img-above-floaters">
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop"
                alt="MjekOn Clinic"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...T, delay: 0.5 }}
          className="mt-16 lg:mt-20"
        >
          <SearchBar />
        </motion.div>
      </div>

      {/* Background blobs for depth — hidden on mobile (blur is GPU-heavy) */}
      <div className="absolute top-0 right-0 -z-10 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px] hidden lg:block" />
      <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent/5 blur-[120px] hidden lg:block" />
    </section>
  );
}
