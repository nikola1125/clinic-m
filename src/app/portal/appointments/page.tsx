"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { AutoSeed, RequireRole, DataLoader } from "@/components/RequireRole";
import { formatDateTime } from "@/lib/format";
import { useClinicStore, type AppointmentStatus } from "@/store/clinicStore";
import {
  Calendar, UserCircle, Activity, Video, CheckCircle2, XCircle,
  Clock, CheckCheck, Filter, ChevronRight,
} from "lucide-react";
import Link from "next/link";

const STATUS_CFG: Record<AppointmentStatus, { label: string; border: string; bg: string; text: string; icon: typeof Clock }> = {
  pending:   { label: "Pending",   border: "border-amber-200",   bg: "bg-amber-50",   text: "text-amber-700",   icon: Clock },
  accepted:  { label: "Accepted",  border: "border-emerald-200", bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle2 },
  rejected:  { label: "Rejected",  border: "border-red-200",     bg: "bg-red-50",     text: "text-red-700",     icon: XCircle },
  completed: { label: "Completed", border: "border-blue-200",    bg: "bg-blue-50",    text: "text-blue-700",    icon: CheckCheck },
};

type FilterKey = "all" | AppointmentStatus;

export default function DoctorAppointmentsPage() {
  const session = useClinicStore((s) => s.doctorSession);
  const doctors = useClinicStore((s) => s.doctors);
  const patients = useClinicStore((s) => s.patients);
  const appointments = useClinicStore((s) => s.appointments);
  const setAppointmentStatus = useClinicStore((s) => s.setAppointmentStatus);

  const doctorId = session?.role === "doctor" ? session.doctorId : null;
  const doctor = doctors.find((d) => d.id === doctorId) ?? null;

  const myAppointments = useMemo(() =>
    appointments.filter((a) => a.doctorId === doctorId)
      .sort((a, b) => (a.scheduledAt < b.scheduledAt ? -1 : 1)),
    [appointments, doctorId]
  );

  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = useMemo(() =>
    filter === "all" ? myAppointments : myAppointments.filter((a) => a.status === filter),
    [myAppointments, filter]
  );

  const counts: Record<FilterKey, number> = {
    all: myAppointments.length,
    pending: myAppointments.filter((a) => a.status === "pending").length,
    accepted: myAppointments.filter((a) => a.status === "accepted").length,
    completed: myAppointments.filter((a) => a.status === "completed").length,
    rejected: myAppointments.filter((a) => a.status === "rejected").length,
  };

  const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                Schedule & Appointments
              </h1>
              <p className="mt-1 text-sm text-foreground/50">
                Manage consultation requests, join meetings, and track history.
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {(["all", "pending", "accepted", "completed", "rejected"] as FilterKey[]).map((key) => (
              <button key={key} onClick={() => setFilter(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  filter === key
                    ? "bg-primary text-white shadow-sm"
                    : "bg-foreground/5 text-foreground/50 hover:text-foreground hover:bg-foreground/10"
                }`}>
                <Filter className="h-3 w-3" />
                {key === "all" ? "All" : STATUS_CFG[key].label} ({counts[key]})
              </button>
            ))}
          </div>

          {/* Appointment List */}
          <AnimatePresence mode="wait">
            <motion.div key={filter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="grid gap-4">
                {filtered.length === 0 ? (
                  <div className="glass rounded-4xl p-12 text-center shadow-premium bg-white/50">
                    <Calendar className="h-10 w-10 text-foreground/15 mx-auto mb-4" />
                    <div className="text-lg font-bold text-foreground/40">No appointments found</div>
                    <div className="mt-2 text-sm text-foreground/30 max-w-sm mx-auto">
                      {filter === "all"
                        ? "Patients haven't scheduled any consultations with you yet."
                        : `No ${filter} appointments at the moment.`}
                    </div>
                  </div>
                ) : (
                  filtered.map((a, idx) => {
                    const patient = patients.find((p) => p.id === a.patientId) ?? null;
                    const consult = doctor?.consults.find((c) => c.id === a.consultId) ?? null;
                    const cfg = STATUS_CFG[a.status];
                    const StatusIcon = cfg.icon;

                    return (
                      <motion.div key={a.id}
                        variants={fadeUp} initial="hidden" animate="show"
                        transition={{ delay: idx * 0.04 }}
                        className={`glass rounded-3xl p-5 sm:p-6 shadow-sm border-2 ${cfg.border}/30 transition-all hover:shadow-md group`}>
                        <div className="flex flex-col lg:flex-row justify-between gap-5">
                          {/* Left Info */}
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${cfg.border} ${cfg.bg} ${cfg.text}`}>
                                <StatusIcon className="h-3 w-3" />
                                {cfg.label}
                              </div>
                              <span className="text-sm font-bold text-foreground">{formatDateTime(a.scheduledAt)}</span>
                              <span className="text-sm font-bold text-primary">${a.price}</span>
                            </div>

                            <div className="flex flex-wrap gap-3">
                              <div className="flex items-center gap-3 rounded-2xl bg-white p-3 border border-foreground/5 flex-1 min-w-[200px]">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground/5 text-foreground shrink-0">
                                  <UserCircle className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">Patient</div>
                                  <div className="text-sm font-bold text-foreground">{patient?.fullName ?? "Unknown"}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 rounded-2xl bg-white p-3 border border-foreground/5 flex-1 min-w-[200px]">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/5 text-primary shrink-0">
                                  <Activity className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">Service</div>
                                  <div className="text-sm font-bold text-foreground">{consult?.title ?? "General Visit"}</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Actions */}
                          <div className="flex flex-row lg:flex-col justify-end gap-2 pl-0 lg:pl-5 lg:border-l border-foreground/5 shrink-0">
                            {a.status === "pending" && (
                              <>
                                <button onClick={() => setAppointmentStatus(a.id, "accepted")}
                                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-5 py-2.5 text-xs font-bold text-emerald-600 hover:bg-emerald-100 transition-colors flex-1 lg:w-44">
                                  <CheckCircle2 className="h-4 w-4" /> Accept
                                </button>
                                <button onClick={() => setAppointmentStatus(a.id, "rejected")}
                                  className="flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-5 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors flex-1 lg:w-44">
                                  <XCircle className="h-4 w-4" /> Reject
                                </button>
                              </>
                            )}
                            {a.status === "accepted" && (
                              <>
                                <Link href={`/meet/${a.id}?role=doctor`}
                                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-600 transition-all flex-1 lg:w-44">
                                  <Video className="h-4 w-4" /> Join Call
                                </Link>
                                <button onClick={() => setAppointmentStatus(a.id, "completed")}
                                  className="flex items-center justify-center gap-2 rounded-xl border border-foreground/10 bg-white px-5 py-2.5 text-xs font-bold text-foreground hover:bg-foreground/5 transition-colors flex-1 lg:w-44">
                                  <CheckCheck className="h-4 w-4" /> Complete
                                </button>
                              </>
                            )}
                            {patient && (
                              <Link href={`/portal/patients/${patient.id}`}
                                className="flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-5 py-2.5 text-xs font-bold text-primary hover:bg-primary/10 transition-colors flex-1 lg:w-44">
                                <ChevronRight className="h-4 w-4" /> Patient File
                              </Link>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </RequireRole>
    </AppShell>
  );
}
