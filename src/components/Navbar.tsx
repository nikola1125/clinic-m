"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, User } from "lucide-react";
import { useClinicStore } from "@/store/clinicStore";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  const session = useClinicStore((s) => s.session);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass mt-4 flex h-16 items-center justify-between rounded-2xl px-6 shadow-glass">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-premium">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="hidden text-xl font-bold tracking-tight text-foreground sm:block">
                Zenith<span className="text-primary tracking-tighter">Health</span>
              </span>
            </Link>
          </div>

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

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {session ? (
              <Link
                href={session.role === "doctor" ? "/doctor" : session.role === "patient" ? "/patient/dashboard" : "/admin"}
                className="flex items-center gap-3 rounded-full bg-foreground/5 p-1 pr-4 text-sm font-semibold transition-colors hover:bg-foreground/10"
              >
                <img 
                  src={`https://i.pravatar.cc/150?u=${session.role === 'admin' ? 'admin' : session.role === 'doctor' ? session.doctorId : session.patientId}`} 
                  alt="Profile" 
                  className="h-8 w-8 rounded-full border border-background shadow-sm"
                />
                <span className="hidden sm:inline">Dashboard</span>
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
        </div>
      </div>
    </motion.header>
  );
}
