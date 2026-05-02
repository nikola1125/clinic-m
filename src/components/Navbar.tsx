"use client";

import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Menu, X } from "lucide-react";
import { useClinicStore } from "@/store/clinicStore";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useTranslations } from "next-intl";

export function Navbar() {
  const adminSession = useClinicStore((s) => s.adminSession);
  const doctorSession = useClinicStore((s) => s.doctorSession);
  const patientSession = useClinicStore((s) => s.patientSession);
  // Show whichever session is active (prefer patient for the public Navbar)
  const session = patientSession || doctorSession || adminSession;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("Navbar");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="mt-4 flex h-16 items-center justify-between rounded-2xl px-4 sm:px-6 shadow-glass will-change-transform"
          style={{
            background: "var(--glass)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid var(--glass-border)",
          }}
        >
          {/* Brand */}
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl shadow-premium shrink-0"
                style={{ background: "linear-gradient(135deg, #4C8C6D, #5F8F7B)" }}>
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Mjek<span style={{ color: "var(--primary)" }}>On</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
            {[
              { href: "/#services", label: t("services") },
              { href: "/#doctors", label: t("specialists") },
              { href: "/#about", label: t("about") }
            ].map(({href, label}) => (
              <Link
                key={href}
                href={href}
                className="nav-link text-sm font-medium whitespace-nowrap"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <LanguageToggle />
            <ThemeToggle />
            {session ? (
              <Link
                href={
                  session.role === "doctor"
                    ? "/portal"
                    : session.role === "patient"
                    ? "/patient/dashboard"
                    : "/hq-command"
                }
                className="flex items-center gap-2 rounded-full p-1 pr-3 text-sm font-semibold transition-colors whitespace-nowrap"
                style={{ background: "rgba(76,140,109,0.07)" }}
              >
                <img
                  src={`https://i.pravatar.cc/150?u=${
                    session.role === "admin"
                      ? "admin"
                      : session.role === "doctor"
                      ? session.doctorId
                      : session.patientId
                  }`}
                  alt="Profile"
                  className="h-7 w-7 rounded-full border border-white shadow-sm img-above-floaters"
                />
                <span style={{ color: "var(--foreground)" }} className="hidden xl:inline">{t("dashboard")}</span>
                <span style={{ color: "var(--foreground)" }} className="xl:hidden">{t.has("dashboard_short") ? t("dashboard_short") : t("dashboard")}</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold transition-colors whitespace-nowrap"
                  style={{ color: "var(--foreground)" }}
                >
                  {t("login")}
                </Link>
                <Link
                  href="/book"
                  className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white shadow-premium transition-all hover:scale-[1.03] hover:shadow-lg active:scale-[0.98] whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg, #4C8C6D, #6FAF8F)" }}
                >
                  {t("book_btn")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className="touch-target flex items-center justify-center rounded-xl transition-colors shrink-0 cursor-pointer"
              style={{ background: "rgba(76,140,109,0.07)", color: "var(--foreground)" }}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute left-0 right-0 top-full z-50 mt-4 overflow-visible rounded-3xl p-4 shadow-2xl lg:hidden"
            style={{
              background: "var(--card)",
              border: "1px solid var(--card-border)",
            }}
          >
            <div className="flex flex-col gap-4">
              {[
                { label: t("services"), href: "/#services" },
                { label: t("specialists"), href: "/#doctors" },
                { label: t("about"), href: "/#about" },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  onClick={() => setIsMenuOpen(false)}
                  href={href}
                  className="text-base font-bold sm:text-lg"
                  style={{ color: "var(--foreground)" }}
                >
                  {label}
                </Link>
              ))}

              <hr style={{ borderColor: "rgba(76,140,109,0.1)" }} />

              {/* Language Toggle Section */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-bold" style={{ color: "var(--foreground-muted)" }}>
                  {t("language")}
                </span>
                <LanguageToggle />
              </div>

              <hr style={{ borderColor: "rgba(76,140,109,0.1)" }} />

              {session ? (
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  href={
                    session.role === "doctor"
                      ? "/portal"
                      : session.role === "patient"
                      ? "/patient/dashboard"
                      : "/hq-command"
                  }
                  className="flex items-center gap-4 rounded-2xl p-3"
                  style={{ background: "rgba(76,140,109,0.07)" }}
                >
                  <img
                    src={`https://i.pravatar.cc/150?u=${
                      session.role === "admin"
                        ? "admin"
                        : session.role === "doctor"
                        ? session.doctorId
                        : session.patientId
                    }`}
                    alt="Profile"
                    className="h-10 w-10 rounded-full border-2 border-white img-above-floaters"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold" style={{ color: "var(--foreground)" }}>
                      {t("dashboard")}
                    </span>
                    <span
                      className="text-xs uppercase tracking-widest"
                      style={{ color: "var(--foreground-muted)" }}
                    >
                      {session.role === "admin" ? "Admin" : session.role === "doctor" ? "Doctor" : "Patient"} Portal
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    onClick={() => setIsMenuOpen(false)}
                    href="/login"
                    className="flex h-10 items-center justify-center rounded-2xl font-bold text-base sm:text-lg"
                    style={{
                      border: "1px solid rgba(76,140,109,0.2)",
                      color: "var(--foreground)",
                    }}
                  >
                    {t("login")}
                  </Link>
                  <Link
                    onClick={() => setIsMenuOpen(false)}
                    href="/signup"
                    className="flex h-10 items-center justify-center rounded-2xl font-bold text-base sm:text-lg text-white shadow-premium"
                    style={{ background: "var(--primary)" }}
                  >
                    {t("join")}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      </div>
    </motion.header>
  );
}
