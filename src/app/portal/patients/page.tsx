"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { AutoSeed, RequireRole, DataLoader } from "@/components/RequireRole";
import { useClinicStore } from "@/store/clinicStore";
import { api } from "@/lib/api";
import {
  Users, Search, Mail, Phone, Calendar, ChevronRight, X,
  UserPlus, Loader2,
} from "lucide-react";
import Link from "next/link";

export default function DoctorPatientsPage() {
  const session = useClinicStore((s) => s.doctorSession);
  const patients = useClinicStore((s) => s.patients);
  const refreshPatients = useClinicStore((s) => s.refreshPatients);

  const doctorId = session?.role === "doctor" ? session.doctorId : null;

  const [q, setQ] = useState("");
  const filtered = patients.filter((p) =>
    `${p.fullName} ${p.email}`.toLowerCase().includes(q.toLowerCase())
  );

  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  const handleAddPatient = async () => {
    if (!addName.trim() || !addEmail.trim() || !doctorId) return;
    setAdding(true);
    setAddError("");
    try {
      api.setRole("doctor");
      const created = await api.createPatient({
        doctor_id: doctorId,
        full_name: addName.trim(),
        email: addEmail.trim(),
        phone: addPhone.trim() || undefined,
      });
      await api.linkPatient(created.id);
      await refreshPatients("doctor");
      setShowAdd(false);
      setAddName("");
      setAddEmail("");
      setAddPhone("");
    } catch (e: any) {
      setAddError(e?.detail || e?.message || "Failed to add patient");
    } finally {
      setAdding(false);
    }
  };

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

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button onClick={() => setShowAdd(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary/90 transition-colors shrink-0">
                <UserPlus className="h-4 w-4" /> Add Patient
              </button>
              <div className="relative group flex-1 md:flex-initial">
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

          {/* Add Patient Modal */}
          <AnimatePresence>
            {showAdd && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                onClick={() => setShowAdd(false)}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-foreground/5"
                  onClick={(e) => e.stopPropagation()}>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-5">
                    <UserPlus className="h-5 w-5 text-primary" /> Add New Patient
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-foreground/40 mb-1.5">Full Name *</label>
                      <input value={addName} onChange={(e) => setAddName(e.target.value)}
                        className="w-full h-11 rounded-xl border border-foreground/10 bg-foreground/2 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                        placeholder="e.g. John Doe" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-foreground/40 mb-1.5">Email *</label>
                      <input value={addEmail} onChange={(e) => setAddEmail(e.target.value)} type="email"
                        className="w-full h-11 rounded-xl border border-foreground/10 bg-foreground/2 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                        placeholder="e.g. patient@email.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-foreground/40 mb-1.5">Phone (optional)</label>
                      <input value={addPhone} onChange={(e) => setAddPhone(e.target.value)} type="tel"
                        className="w-full h-11 rounded-xl border border-foreground/10 bg-foreground/2 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                        placeholder="e.g. +1 555 000 0000" />
                    </div>
                    {addError && (
                      <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600 font-medium">
                        {addError}
                      </div>
                    )}
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setShowAdd(false)}
                        className="flex-1 h-11 rounded-xl border border-foreground/10 text-sm font-bold text-foreground hover:bg-foreground/5 transition-colors">
                        Cancel
                      </button>
                      <button onClick={handleAddPatient}
                        disabled={adding || !addName.trim() || !addEmail.trim()}
                        className="flex-1 h-11 rounded-xl bg-primary text-sm font-bold text-white hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                        {adding ? "Adding..." : "Add Patient"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Patient Grid */}
          {filtered.length === 0 ? (
            <div className="glass rounded-4xl p-12 text-center shadow-premium bg-white/50">
              <Users className="h-10 w-10 text-foreground/15 mx-auto mb-4" />
              <div className="text-lg font-bold text-foreground/40">No patients found</div>
              <div className="mt-2 text-sm text-foreground/30 max-w-sm mx-auto">
                {q
                  ? `No patients match "${q}". Try a different search.`
                  : "Use the \"Add Patient\" button above to add your first patient."}
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
