"use client";

import { motion } from "framer-motion";
import { Clock, Phone, AlertCircle, MapPin, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import { useTranslations } from "next-intl";


function getClinicStatus(t: any): { isOpen: boolean; message: string } {
  const now = new Date();
  const day = now.getDay(); // 0=sunday, 1=monday...
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTime = hour * 60 + minute;

  if (day === 0) return { isOpen: false, message: t("closed_weekend") };
  if (day === 6) {
    if (currentTime >= 540 && currentTime < 900) {
      return { isOpen: true, message: t("open_till_15") };
    }
    return { isOpen: false, message: t("closed_weekend") };
  }

  if (currentTime >= 480 && currentTime < 1200) {
    const remaining = 1200 - currentTime;
    const hrs = Math.floor(remaining / 60);
    const mins = remaining % 60;
    return {
      isOpen: true,
      message: t("open_remaining", { hrs: hrs > 0 ? `${hrs}h ` : "", mins }),
    };
  }

  return { isOpen: false, message: t("closed_tomorrow") };
}

export function WorkingHours() {
  const t = useTranslations("WorkingHours");
  const [status, setStatus] = useState({ isOpen: false, message: "" });
  const [mounted, setMounted] = useState(false);
  const todayIndex = new Date().getDay();
  // Convert JS day (0=Sun) to our schedule index (0=Mon)
  const scheduleIndex = todayIndex === 0 ? 6 : todayIndex - 1;

  useEffect(() => {
    setMounted(true);
    setStatus(getClinicStatus(t));
    const interval = setInterval(() => setStatus(getClinicStatus(t)), 60000);
    return () => clearInterval(interval);
  }, [t]);

  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:gap-8 lg:grid-cols-3">
          {/* Left: Live Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div
              className="rounded-2xl lg:rounded-3xl p-5 lg:p-8 h-full"
              style={{
                background: mounted && status.isOpen
                  ? "linear-gradient(135deg, #6FAF8F, #4C8C6D)"
                  : "linear-gradient(135deg, #9CA3AF, #6B7280)",
              }}
            >
              {/* Status Badge */}
              <div className="flex items-center gap-2 mb-4 lg:mb-8">
                <div className="relative">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ background: mounted && status.isOpen ? "#10B981" : "#EF4444" }}
                  />
                  {mounted && status.isOpen && (
                    <div className="absolute inset-0 h-4 w-4 rounded-full bg-green-400 animate-ping opacity-40" />
                  )}
                </div>
                <span className="text-sm font-bold text-white/90 uppercase tracking-widest">
                  {mounted ? (status.isOpen ? t("open_now") : t("closed")) : ""}
                </span>
              </div>

              <h3 className="text-xl lg:text-3xl font-bold text-white mb-2 lg:mb-3">
                {t("title_live")}
              </h3>
              <p className="text-white/70 text-sm lg:text-base mb-4 lg:mb-8">
                {mounted ? status.message : ""}
              </p>

              {/* Quick Actions */}
              <div className="space-y-2">
                <a
                  href="tel:+355697009090"
                  className="flex items-center gap-2 lg:gap-3 rounded-xl lg:rounded-2xl bg-white/15 px-3 lg:px-5 py-2.5 lg:py-3.5 text-white font-semibold text-xs lg:text-sm transition-all hover:bg-white/25 backdrop-blur-sm"
                >
                  <Phone className="h-4 w-4 lg:h-5 lg:w-5" />
                  +355 69 700 9090
                </a>
                <a
                  href="tel:127"
                  className="flex items-center gap-2 lg:gap-3 rounded-xl lg:rounded-2xl bg-white/10 px-3 lg:px-5 py-2.5 lg:py-3.5 text-white/80 font-semibold text-xs lg:text-sm transition-all hover:bg-white/20 backdrop-blur-sm"
                >
                  <AlertCircle className="h-4 w-4 lg:h-5 lg:w-5" />
                  {t("emergency")}
                </a>
              </div>

              {/* Location */}
              <div className="mt-4 lg:mt-8 flex items-start gap-2 text-white/60 text-xs lg:text-sm">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{t("address")}</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Weekly Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div
              className="rounded-2xl lg:rounded-3xl p-5 lg:p-8 h-full"
              style={{
                background: "var(--card)",
                border: "1px solid var(--card-border)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="flex items-center gap-3 mb-4 lg:mb-8">
                <div
                  className="flex h-9 w-9 lg:h-12 lg:w-12 items-center justify-center rounded-xl lg:rounded-2xl"
                  style={{ background: "rgba(111,175,143,0.1)" }}
                >
                  <Clock className="h-4 w-4 lg:h-6 lg:w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base lg:text-xl font-bold text-foreground">{t("schedule_title")}</h3>
                  <p className="text-xs lg:text-sm text-foreground/50">{t("schedule_desc")}</p>
                </div>
              </div>

              <div className="space-y-2">
                {[0, 1, 2, 3, 4, 5, 6].map((idx) => {
                  const scheduleItems = [
                    { day: t("d0"), hours: t("h_weekday"), isOpen: true },
                    { day: t("d1"), hours: t("h_weekday"), isOpen: true },
                    { day: t("d2"), hours: t("h_weekday"), isOpen: true },
                    { day: t("d3"), hours: t("h_weekday"), isOpen: true },
                    { day: t("d4"), hours: t("h_weekday"), isOpen: true },
                    { day: t("d5"), hours: t("h_saturday"), isOpen: true },
                    { day: t("d6"), hours: t("h_sunday"), isOpen: false },
                  ];
                  const item = scheduleItems[idx];
                  const isToday = idx === scheduleIndex;
                  return (
                    <motion.div
                      key={item.day}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between rounded-xl px-2 lg:px-5 py-1.5 lg:py-3.5 transition-colors"
                      style={{
                        background: isToday ? "rgba(111,175,143,0.08)" : "transparent",
                        border: isToday ? "1px solid rgba(111,175,143,0.15)" : "1px solid transparent",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {isToday && (
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        )}
                        <span
                          className="text-xs lg:text-sm font-semibold"
                          style={{
                            color: isToday ? "var(--primary-dark)" : "var(--foreground)",
                          }}
                        >
                          {item.day}
                          {isToday && (
                            <span className="ml-1 text-[10px] lg:text-xs font-normal text-primary/60 hidden sm:inline">({t("today")})</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.isOpen ? (
                          <>
                            <CheckCircle2
                              className="h-3 w-3 lg:h-4 lg:w-4"
                              style={{ color: "var(--primary)" }}
                            />
                            <span
                              className="text-xs lg:text-sm font-medium"
                              style={{
                                color: isToday ? "var(--primary-dark)" : "var(--foreground-muted)",
                              }}
                            >
                              {item.hours}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs lg:text-sm font-medium text-foreground/30">
                            {item.hours}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Doctors Available */}
              <div
                className="mt-6 flex items-center gap-4 rounded-2xl px-5 py-4"
                style={{ background: "rgba(111,175,143,0.05)" }}
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-white overflow-hidden"
                    >
                      <img
                        src={`https://i.pravatar.cc/80?img=${i + 30}`}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t("docs_avail")}
                  </p>
                  <p className="text-xs text-foreground/50">
                    {t("docs_desc")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
