"use client";

import { useEffect } from "react";
import { useClinicStore } from "@/store/clinicStore";
import { api, type RoleKey } from "@/lib/api";

export function RequireRole({
  role,
  children,
  fallback,
}: {
  role: "admin" | "doctor";
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const session = useClinicStore((s) =>
    role === "admin" ? s.adminSession : s.doctorSession
  );

  if (!session) {
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
              href={role === "doctor" ? "/portal/login" : "/hq-command/login"}
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

export function DataLoader({ role }: { role: "admin" | "doctor" }) {
  const session = useClinicStore((s) =>
    role === "admin" ? s.adminSession : s.doctorSession
  );
  const refreshDoctors = useClinicStore((s) => s.refreshDoctors);
  const refreshPatients = useClinicStore((s) => s.refreshPatients);
  const refreshAppointments = useClinicStore((s) => s.refreshAppointments);

  useEffect(() => {
    if (!session) return;
    // Set API role context so the right token is used
    api.setRole(role);
    refreshDoctors();
    if (role === "doctor") {
      refreshPatients();
      refreshAppointments();
    }
  }, [session, role, refreshDoctors, refreshPatients, refreshAppointments]);

  return null;
}
