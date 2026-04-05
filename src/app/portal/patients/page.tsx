"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AutoSeed, RequireRole } from "@/components/RequireRole";
import { useClinicStore } from "@/store/clinicStore";
import { Users, Search, Mail, Phone, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function DoctorPatientsPage() {
  const session = useClinicStore((s) => s.session);
  const patients = useClinicStore((s) => s.patients);

  const doctorId = session?.role === "doctor" ? session.doctorId : null;
  const myPatients = useMemo(
    () => patients.filter((p) => p.doctorId === doctorId),
    [patients, doctorId]
  );

  const [q, setQ] = useState("");
  const filtered = myPatients.filter((p) =>
    `${p.fullName} ${p.email}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <AppShell
      title="Doctor Portal"
      nav={[
        { label: "Dashboard", href: "/doctor" },
        { label: "Appointments", href: "/doctor/appointments" },
        { label: "Patients", href: "/doctor/patients" },
      ]}
    >
      <AutoSeed />
      <RequireRole role="doctor">
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Patient Directory
              </div>
              <div className="mt-1 text-sm text-foreground/50">
                Manage your patient roster, view medical histories, and track progress.
              </div>
            </div>

            <div className="w-full md:w-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30 transition-colors group-focus-within:text-primary" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="h-12 w-full md:w-80 rounded-2xl border-none bg-white p-4 pl-11 text-sm shadow-sm transition-all focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Search by name or email..."
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {filtered.length === 0 ? (
              <div className="glass rounded-4xl p-12 text-center shadow-premium bg-white/50">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-foreground/5 mb-4 text-primary opacity-50">
                  <Users className="h-8 w-8" />
                </div>
                <div className="text-lg font-bold text-foreground">No patients found</div>
                <div className="mt-2 text-sm text-foreground/60 max-w-sm mx-auto">
                  {q 
                    ? `No patients match your search for "${q}". Try a different term.` 
                    : "You don't have any registered patients yet. Records are created when appointments are booked."}
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p) => (
                  <Link
                    key={p.id}
                    href={`/doctor/patients/${p.id}`}
                    className="glass rounded-4xl p-6 shadow-sm transition-all hover:shadow-md border-2 border-foreground/5 hover:border-primary/20 group flex flex-col h-full bg-white/50 hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {p.fullName}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-foreground/60 truncate">
                          <Mail className="h-3 w-3 shrink-0" /> {p.email}
                        </div>
                        {p.phone && (
                          <div className="mt-1 flex items-center gap-2 text-sm text-foreground/60 truncate">
                            <Phone className="h-3 w-3 shrink-0" /> {p.phone}
                          </div>
                        )}
                      </div>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-foreground/40 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-foreground/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                        <FileText className="h-3 w-3" /> View Records
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </RequireRole>
    </AppShell>
  );
}
