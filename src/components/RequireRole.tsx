"use client";

import { useEffect } from "react";
import { useClinicStore } from "@/store/clinicStore";

export function RequireRole({
  role,
  children,
  fallback,
}: {
  role: "admin" | "doctor";
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const session = useClinicStore((s) => s.session);

  if (!session || session.role !== role) {
    return (
      fallback ?? (
        <div className="rounded-3xl border border-zinc-200 bg-white p-10">
          <div className="text-base font-semibold text-zinc-900">
            Not authorized
          </div>
          <div className="mt-2 text-sm text-zinc-600">
            Please login to continue.
          </div>
          <div className="mt-6">
            <a
              className="inline-flex rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
              href={role === "doctor" ? "/doctor/login" : "/"}
            >
              Go to login
            </a>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

export function AutoSeed() {
  const seedIfEmpty = useClinicStore((s) => s.seedIfEmpty);

  useEffect(() => {
    seedIfEmpty();
  }, [seedIfEmpty]);

  return null;
}

// New component to fetch data on mount for authenticated users
export function DataLoader({ role }: { role: "admin" | "doctor" }) {
  const session = useClinicStore((s) => s.session);
  const refreshDoctors = useClinicStore((s) => s.refreshDoctors);
  const refreshPatients = useClinicStore((s) => s.refreshPatients);
  const refreshAppointments = useClinicStore((s) => s.refreshAppointments);

  useEffect(() => {
    if (!session || session.role !== role) return;
    // Always refresh doctors first (admin/doctor)
    refreshDoctors();
    if (role === "doctor") {
      // Doctor-specific refreshes
      refreshPatients();
      refreshAppointments();
    }
    // Admin revenue and consults are fetched on-demand in their pages
  }, [session, role, refreshDoctors, refreshPatients, refreshAppointments]);

  return null;
}
