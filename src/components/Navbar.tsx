"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, User, Menu, X } from "lucide-react";
import { useClinicStore } from "@/store/clinicStore";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

export function Navbar() {
  const session = useClinicStore((s) => s.session);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on navigation or window resize
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
        <div className="glass mt-4 flex h-16 items-center justify-between rounded-2xl px-6 shadow-glass">
          {/* Desktop & Mobile Brand */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-premium">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Zenith<span className="text-primary tracking-tighter">Health</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/#services" className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary">
              Services
            </Link>
            <Link href="/#doctors" className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary">
              Specialists
            </Link>
            <Link href="/#about" className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary">
              About
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 md:flex">
            <ThemeToggle />
            {session ? (
              <Link
                href={session.role === "doctor" ? "/portal" : session.role === "patient" ? "/patient/dashboard" : "/hq-command"}
                className="flex items-center gap-3 rounded-full bg-foreground/5 p-1 pr-4 text-sm font-semibold transition-colors hover:bg-foreground/10"
              >
                <img 
                  src={`https://i.pravatar.cc/150?u=${session.role === 'admin' ? 'admin' : session.role === 'doctor' ? session.doctorId : session.patientId}`} 
                  alt="Profile" 
                  className="h-8 w-8 rounded-full border border-background shadow-sm"
                />
                <span>Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-foreground/70 transition-colors hover:text-primary"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-premium transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Join Clinic
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Controls: Toggle + Theme */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/5 text-foreground transition-colors hover:bg-foreground/10"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-24 left-4 right-4 z-50 overflow-hidden rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/5 dark:bg-slate-900 md:hidden"
          >
            <div className="flex flex-col gap-6">
              <Link
                onClick={() => setIsMenuOpen(false)}
                href="/#services"
                className="text-lg font-bold text-foreground"
              >
                Services
              </Link>
              <Link
                onClick={() => setIsMenuOpen(false)}
                href="/#doctors"
                className="text-lg font-bold text-foreground"
              >
                Specialists
              </Link>
              <Link
                onClick={() => setIsMenuOpen(false)}
                href="/#about"
                className="text-lg font-bold text-foreground"
              >
                About
              </Link>

              <hr className="border-foreground/5" />

              {session ? (
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  href={session.role === "doctor" ? "/portal" : session.role === "patient" ? "/patient/dashboard" : "/hq-command"}
                  className="flex items-center gap-4 rounded-2xl bg-foreground/5 p-3"
                >
                  <img 
                    src={`https://i.pravatar.cc/150?u=${session.role === 'admin' ? 'admin' : session.role === 'doctor' ? session.doctorId : session.patientId}`} 
                    alt="Profile" 
                    className="h-10 w-10 rounded-full border-2 border-background"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">My Dashboard</span>
                    <span className="text-xs text-foreground/50 uppercase tracking-widest">{session.role} Portal</span>
                  </div>
                </Link>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    onClick={() => setIsMenuOpen(false)}
                    href="/login"
                    className="flex h-12 items-center justify-center rounded-2xl border border-foreground/10 text-lg font-bold text-foreground"
                  >
                    Log in
                  </Link>
                  <Link
                    onClick={() => setIsMenuOpen(false)}
                    href="/signup"
                    className="flex h-12 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-white shadow-premium"
                  >
                    Join Clinic
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
