"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { AutoSeed, RequireRole, DataLoader } from "@/components/RequireRole";
import { useClinicStore } from "@/store/clinicStore";
import { Users, Search, Mail, Phone, Calendar, ChevronRight, X } from "lucide-react";
import Link from "next/link";

export default function DoctorPatientsPage() {
  const session = useClinicStore((s) => s.doctorSession);
  const patients = useClinicStore((s) => s.patients);

  const [q, setQ] = useState("");
  const filtered = patients.filter((p) =>
    `${p.fullName} ${p.email}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <AppShell
      title="Doctor Portal"
      nav={[
        { label: "Dashboard", href: "/portal" },
        { label: "Appointments", href: "/portal/appointments" },
        { label: "Patients", href: "/portal/patients" },
      ]}
    >
      <AutoSeed />
      <RequireRole role="doctor">
        <DataLoader role="doctor" />
        <div>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Patient Directory
              </h1>
              <p className="mt-1 text-sm text-foreground/50">
                {patients.length} patient{patients.length !== 1 ? "s" : ""} in your care
              </p>
            </div>

            <div className="w-full md:w-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30 transition-colors group-focus-within:text-primary" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="h-12 w-full md:w-80 rounded-2xl border-none bg-white p-4 pl-11 pr-10 text-sm shadow-sm transition-all focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Search by name or email..."
                />
                {q && (
                  <button onClick={() => setQ("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full bg-foreground/10 text-foreground/50 hover:bg-foreground/20 transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Patient Grid */}
          {filtered.length === 0 ? (
            <div className="glass rounded-4xl p-12 text-center shadow-premium bg-white/50">
              <Users className="h-10 w-10 text-foreground/15 mx-auto mb-4" />
              <div className="text-lg font-bold text-foreground/40">No patients found</div>
              <div className="mt-2 text-sm text-foreground/30 max-w-sm mx-auto">
                {q
                  ? `No patients match "${q}". Try a different search.`
                  : "Records are created when patients book appointments."}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, idx) => (
                <motion.div key={p.id}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.35 }}>
                  <Link href={`/portal/patients/${p.id}`}
                    className="group flex flex-col h-full rounded-3xl p-5 shadow-sm border-2 border-foreground/5 bg-white/80 transition-all hover:shadow-md hover:border-primary/20 hover:bg-white">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                        {p.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-base font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {p.fullName}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-foreground/50 truncate">
                          <Mail className="h-3 w-3 shrink-0" /> {p.email}
                        </div>
                        {p.phone && (
                          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-foreground/50 truncate">
                            <Phone className="h-3 w-3 shrink-0" /> {p.phone}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto pt-3 border-t border-foreground/5 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-foreground/30">
                        <Calendar className="h-3 w-3" /> Since {new Date(p.createdAt).toLocaleDateString()}
                      </span>
                      <ChevronRight className="h-4 w-4 text-foreground/20 group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </RequireRole>
    </AppShell>
  );
}
