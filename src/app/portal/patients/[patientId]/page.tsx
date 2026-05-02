"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { AutoSeed, RequireRole, DataLoader } from "@/components/RequireRole";
import { useClinicStore } from "@/store/clinicStore";
import {
  ArrowLeft, UserCircle, Mail, Phone, FileText, Pill, ClipboardList,
  Plus, Send, Calendar,
} from "lucide-react";

type Tab = "notes" | "medicines" | "prescriptions";

const TAB_CFG: Record<Tab, { label: string; icon: typeof FileText; color: string; bg: string; placeholder: string }> = {
  notes:         { label: "Notes",         icon: FileText,     color: "text-blue-600",    bg: "bg-blue-50",    placeholder: "Add a clinical note..." },
  medicines:     { label: "Medicines",     icon: Pill,         color: "text-emerald-600", bg: "bg-emerald-50", placeholder: "Add a medicine..." },
  prescriptions: { label: "Prescriptions", icon: ClipboardList, color: "text-violet-600", bg: "bg-violet-50",  placeholder: "Add a prescription..." },
};

export default function DoctorPatientDetailsPage({
  params,
}: {
  params: { patientId: string };
}) {
  const session = useClinicStore((s) => s.doctorSession);
  const patients = useClinicStore((s) => s.patients);
  const addPatientEntry = useClinicStore((s) => s.addPatientEntry);

  const doctorId = session?.role === "doctor" ? session.doctorId : null;

  const patient = useMemo(() => {
    const p = patients.find((x) => x.id === params.patientId) ?? null;
    if (!p) return null;
    if (p.doctorId !== doctorId) return null;
    return p;
  }, [patients, params.patientId, doctorId]);

  const [activeTab, setActiveTab] = useState<Tab>("notes");
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!patient) return;
    const v = input.trim();
    if (!v) return;
    addPatientEntry(patient.id, activeTab, v);
    setInput("");
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
        {!patient ? (
          <div className="glass rounded-4xl p-12 text-center shadow-premium">
            <UserCircle className="h-10 w-10 text-foreground/15 mx-auto mb-4" />
            <div className="text-lg font-bold text-foreground/40">Patient not found</div>
            <Link href="/portal/patients"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary/90">
              <ArrowLeft className="h-4 w-4" /> Back to Patients
            </Link>
          </div>
        ) : (
          <motion.div className="grid gap-6"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {/* Patient Header */}
            <div className="glass rounded-4xl p-6 lg:p-8 shadow-premium border-2 border-foreground/5 relative overflow-hidden">
              <Link href="/portal/patients"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground/40 hover:text-primary transition-colors mb-4">
                <ArrowLeft className="h-3 w-3" /> Back to directory
              </Link>

              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary text-2xl font-bold shrink-0">
                  {patient.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">{patient.fullName}</h1>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1.5 text-sm text-foreground/50">
                      <Mail className="h-3.5 w-3.5" /> {patient.email}
                    </span>
                    {patient.phone && (
                      <span className="inline-flex items-center gap-1.5 text-sm text-foreground/50">
                        <Phone className="h-3.5 w-3.5" /> {patient.phone}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-sm text-foreground/50">
                      <Calendar className="h-3.5 w-3.5" /> Since {new Date(patient.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {(["notes", "medicines", "prescriptions"] as Tab[]).map((key) => {
                  const cfg = TAB_CFG[key];
                  const Icon = cfg.icon;
                  const count = patient[key].length;
                  return (
                    <button key={key} onClick={() => setActiveTab(key)}
                      className={`rounded-2xl p-4 text-left transition-all border-2 ${
                        activeTab === key ? "border-primary/30 shadow-sm" : "border-transparent hover:border-foreground/5"
                      } ${cfg.bg}`}>
                      <Icon className={`h-5 w-5 ${cfg.color} mb-2`} />
                      <div className="text-2xl font-bold text-foreground">{count}</div>
                      <div className="text-xs font-bold uppercase tracking-wider text-foreground/40">{cfg.label}</div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4">
                <Link href={`/portal/patients/${params.patientId}/medical-profile`}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-colors">
                  <FileText className="h-4 w-4" /> Open Medical Profile
                </Link>
              </div>
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
            </div>

            {/* Tab Content */}
            <div className="glass rounded-4xl p-6 lg:p-8 shadow-premium border-2 border-foreground/5">
              {/* Tab Switcher */}
              <div className="flex gap-1 p-1 rounded-2xl bg-foreground/5 mb-6 w-fit">
                {(["notes", "medicines", "prescriptions"] as Tab[]).map((tab) => {
                  const cfg = TAB_CFG[tab];
                  const Icon = cfg.icon;
                  return (
                    <button key={tab} onClick={() => { setActiveTab(tab); setInput(""); }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        activeTab === tab ? "bg-white shadow-sm text-foreground" : "text-foreground/40 hover:text-foreground"
                      }`}>
                      <Icon className="h-3 w-3" /> {cfg.label} ({patient[tab].length})
                    </button>
                  );
                })}
              </div>

              {/* Entries List */}
              <AnimatePresence mode="wait">
                <motion.div key={activeTab}
                  initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}>
                  <div className="grid gap-2 mb-4 max-h-[400px] overflow-y-auto pr-1">
                    {patient[activeTab].length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-foreground/10 bg-foreground/2 p-8 text-center">
                        {(() => { const Icon = TAB_CFG[activeTab].icon; return <Icon className="h-6 w-6 text-foreground/15 mx-auto mb-2" />; })()}
                        <div className="text-sm font-bold text-foreground/30">No {activeTab} yet</div>
                        <div className="text-xs text-foreground/20 mt-1">Add one below to get started</div>
                      </div>
                    ) : (
                      patient[activeTab].map((entry, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className={`rounded-2xl border border-foreground/5 ${TAB_CFG[activeTab].bg}/50 px-4 py-3 text-sm text-foreground`}>
                          {entry}
                        </motion.div>
                      ))
                    )}
                  </div>

                  {/* Add Input */}
                  <div className="flex gap-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                      className="flex-1 h-11 rounded-2xl border border-foreground/10 bg-white px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder={TAB_CFG[activeTab].placeholder}
                    />
                    <button onClick={handleAdd}
                      disabled={!input.trim()}
                      className="flex items-center gap-2 h-11 rounded-2xl bg-primary px-5 text-sm font-bold text-white transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed">
                      <Send className="h-4 w-4" /> Add
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </motion.div>
        )}
      </RequireRole>
    </AppShell>
  );
}
