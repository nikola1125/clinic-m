"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { RequireRole, DataLoader } from "@/components/RequireRole";
import { formatDateTime } from "@/lib/format";
import { useClinicStore } from "@/store/clinicStore";
import {
  UserCircle, Calendar, CalendarCheck, Clock, Users, ArrowRight, Video,
  CheckCircle2, XCircle, TrendingUp, Activity, Stethoscope, Bell,
  ChevronRight, Sparkles, Heart, BarChart3, RefreshCw,
} from "lucide-react";

/* ── animated counter ── */
function AnimatedCount({ value, duration = 800 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    let start = 0;
    const step = Math.max(1, Math.ceil(value / (duration / 16)));
    const id = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(id); }
      else setDisplay(start);
    }, 16);
    return () => clearInterval(id);
  }, [value, duration]);
  return <>{display}</>;
}

/* ── time greeting ── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

/* ── donut chart ── */
function StatusDonut({ segments }: { segments: { count: number; color: string; label: string }[] }) {
  const total = segments.reduce((s, x) => s + x.count, 0);
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-32 w-32">
        <div className="h-28 w-28 rounded-full border-8 border-foreground/5 flex items-center justify-center">
          <span className="text-xs font-bold text-foreground/30">No data</span>
        </div>
      </div>
    );
  }
  let offset = 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative h-32 w-32">
      <svg viewBox="0 0 100 100" className="transform -rotate-90 h-full w-full">
        {segments.filter(s => s.count > 0).map((seg, i) => {
          const pct = seg.count / total;
          const dash = pct * circumference;
          const gap = circumference - dash;
          const off = offset * circumference;
          offset += pct;
          return (
            <circle key={i} cx="50" cy="50" r={radius} fill="none" strokeWidth="12"
              stroke={seg.color} strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-off}
              className="transition-all duration-700" strokeLinecap="round" />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{total}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">total</div>
        </div>
      </div>
    </div>
  );
}

export default function DoctorHomePage() {
  const session = useClinicStore((s) => s.doctorSession);
  const doctors = useClinicStore((s) => s.doctors);
  const appointments = useClinicStore((s) => s.appointments);
  const patients = useClinicStore((s) => s.patients);
  const setAppointmentStatus = useClinicStore((s) => s.setAppointmentStatus);
  const refreshAppointments = useClinicStore((s) => s.refreshAppointments);
  const refreshPatients = useClinicStore((s) => s.refreshPatients);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const doctorId = session?.role === "doctor" ? session.doctorId : null;
  const doctor = doctors.find((d) => d.id === doctorId) ?? null;

  const myAppointments = useMemo(() =>
    appointments.filter((a) => a.doctorId === doctorId)
      .sort((a, b) => (a.scheduledAt < b.scheduledAt ? -1 : 1)),
    [appointments, doctorId]
  );

  const pending = useMemo(() => myAppointments.filter((a) => a.status === "pending"), [myAppointments]);
  const upcoming = useMemo(() => myAppointments.filter((a) => a.status === "accepted"), [myAppointments]);
  const completed = useMemo(() => myAppointments.filter((a) => a.status === "completed"), [myAppointments]);
  const rejected = useMemo(() => myAppointments.filter((a) => a.status === "rejected"), [myAppointments]);
  const myPatients = useMemo(() => patients.filter((p) => p.doctorId === doctorId), [patients, doctorId]);

  const totalRevenue = useMemo(() => completed.reduce((s, a) => s + a.price, 0), [completed]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([refreshAppointments("doctor"), refreshPatients("doctor")]);
    setTimeout(() => setIsRefreshing(false), 600);
  }, [refreshAppointments, refreshPatients]);

  const [activeTab, setActiveTab] = useState<"pending" | "upcoming">("pending");

  const donutSegments = [
    { count: pending.length, color: "#f59e0b", label: "Pending" },
    { count: upcoming.length, color: "#10b981", label: "Upcoming" },
    { count: completed.length, color: "#3b82f6", label: "Completed" },
    { count: rejected.length, color: "#ef4444", label: "Rejected" },
  ];

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } };

  return (
    <AppShell
      title="Doctor Portal"
      nav={[
        { label: "Dashboard", href: "/portal" },
        { label: "Appointments", href: "/portal/appointments" },
        { label: "Patients", href: "/portal/patients" },
      ]}
    >
      <RequireRole role="doctor">
        <DataLoader role="doctor" />
        <motion.div className="grid gap-6" variants={stagger} initial="hidden" animate="show">

          {/* ── Hero Greeting ── */}
          <motion.div variants={fadeUp} className="glass rounded-4xl p-8 lg:p-10 shadow-premium relative overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-primary uppercase tracking-wider">{getGreeting()}</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                  Dr. {doctor ? doctor.name : "..."}
                </h1>
                <div className="mt-2 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    <Stethoscope className="h-3 w-3" />
                    {doctor?.specialty || "Specialist"}
                  </span>
                  {pending.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 animate-pulse">
                      <Bell className="h-3 w-3" />
                      {pending.length} new request{pending.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/portal/appointments"
                    className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-premium transition-all hover:bg-primary/90 hover:translate-y-[-2px] active:translate-y-0">
                    <Calendar className="h-4 w-4" /> View Schedule
                  </Link>
                  <Link href="/portal/patients"
                    className="flex items-center gap-2 rounded-2xl border border-foreground/10 bg-white px-6 py-3 text-sm font-bold text-foreground transition-all hover:bg-foreground/5">
                    <Users className="h-4 w-4" /> Patients
                  </Link>
                  <button onClick={handleRefresh}
                    className="flex items-center gap-2 rounded-2xl border border-foreground/10 bg-white px-4 py-3 text-sm font-bold text-foreground transition-all hover:bg-foreground/5">
                    <RefreshCw className={`h-4 w-4 transition-transform ${isRefreshing ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Donut Chart */}
              <div className="flex flex-col items-center gap-4 shrink-0">
                <StatusDonut segments={donutSegments} />
                <div className="flex flex-wrap gap-3 justify-center">
                  {donutSegments.map((seg) => (
                    <div key={seg.label} className="flex items-center gap-1.5 text-xs font-bold text-foreground/60">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ background: seg.color }} />
                      {seg.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          </motion.div>

          {/* ── Stat Cards ── */}
          <motion.div variants={fadeUp} className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Pending", value: pending.length, icon: Clock, color: "amber", bg: "bg-amber-50", border: "border-amber-200/50", text: "text-amber-700" },
              { label: "Upcoming", value: upcoming.length, icon: CalendarCheck, color: "emerald", bg: "bg-emerald-50", border: "border-emerald-200/50", text: "text-emerald-700" },
              { label: "Patients", value: myPatients.length, icon: Heart, color: "rose", bg: "bg-rose-50", border: "border-rose-200/50", text: "text-rose-700" },
              { label: "Revenue", value: totalRevenue, icon: TrendingUp, color: "blue", bg: "bg-blue-50", border: "border-blue-200/50", text: "text-blue-700", prefix: "$" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`rounded-3xl border-2 ${stat.border} ${stat.bg} p-5 shadow-sm cursor-default`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.text}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <BarChart3 className="h-4 w-4 text-foreground/20" />
                  </div>
                  <div className={`text-3xl font-bold ${stat.text} tabular-nums`}>
                    {stat.prefix || ""}<AnimatedCount value={stat.value} />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-foreground/40 mt-1">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* ── Tabbed Appointments ── */}
          <motion.div variants={fadeUp} className="glass rounded-4xl p-6 lg:p-8 border-2 border-foreground/5 shadow-premium">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-1 p-1 rounded-2xl bg-foreground/5">
                {(["pending", "upcoming"] as const).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      activeTab === tab
                        ? "bg-white shadow-sm text-foreground"
                        : "text-foreground/50 hover:text-foreground"
                    }`}>
                    {tab === "pending" ? `Pending (${pending.length})` : `Upcoming (${upcoming.length})`}
                  </button>
                ))}
              </div>
              <Link href="/portal/appointments" className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                View All <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                {activeTab === "pending" ? (
                  <div className="grid gap-3">
                    {pending.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-foreground/10 bg-foreground/2 p-10 text-center">
                        <Clock className="h-8 w-8 text-foreground/20 mx-auto mb-3" />
                        <div className="text-sm font-bold text-foreground/40">No pending requests</div>
                        <div className="text-xs text-foreground/30 mt-1">New appointment requests will appear here</div>
                      </div>
                    ) : (
                      pending.slice(0, 5).map((a, idx) => {
                        const patient = patients.find((p) => p.id === a.patientId);
                        return (
                          <motion.div key={a.id}
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                            className="group rounded-2xl border border-foreground/5 bg-white p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-amber-200 hover:shadow-sm">
                            <div className="flex items-center gap-4">
                              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-500 shrink-0">
                                <Clock className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-foreground">{formatDateTime(a.scheduledAt)}</div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  {patient && <span className="text-xs text-foreground/50">{patient.fullName}</span>}
                                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">${a.price}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto shrink-0">
                              <button onClick={() => setAppointmentStatus(a.id, "accepted")}
                                className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-600 hover:bg-emerald-100 transition-colors">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Accept
                              </button>
                              <button onClick={() => setAppointmentStatus(a.id, "rejected")}
                                className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-white px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors">
                                <XCircle className="h-3.5 w-3.5" /> Reject
                              </button>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {upcoming.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-foreground/10 bg-foreground/2 p-10 text-center">
                        <CalendarCheck className="h-8 w-8 text-foreground/20 mx-auto mb-3" />
                        <div className="text-sm font-bold text-foreground/40">No upcoming meetings</div>
                        <div className="text-xs text-foreground/30 mt-1">Accept pending requests to schedule meetings</div>
                      </div>
                    ) : (
                      upcoming.slice(0, 5).map((a, idx) => {
                        const patient = patients.find((p) => p.id === a.patientId);
                        return (
                          <motion.div key={a.id}
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                            className="group rounded-2xl border border-foreground/5 bg-white p-4 flex items-center justify-between gap-4 transition-all hover:border-emerald-200 hover:shadow-sm">
                            <div className="flex items-center gap-4">
                              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 shrink-0 group-hover:bg-emerald-100 transition-colors">
                                <Video className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-foreground">{formatDateTime(a.scheduledAt)}</div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  {patient && <span className="text-xs text-foreground/50">{patient.fullName}</span>}
                                  <span className="text-xs font-bold text-emerald-600">${a.price}</span>
                                </div>
                              </div>
                            </div>
                            <Link href={`/meet/${a.id}?role=doctor`}
                              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-600 hover:-translate-y-px active:translate-y-0 shrink-0">
                              <Video className="h-3.5 w-3.5" /> Join <ArrowRight className="h-3 w-3" />
                            </Link>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* ── Recent Patients ── */}
          <motion.div variants={fadeUp} className="glass rounded-4xl p-6 lg:p-8 border-2 border-foreground/5 shadow-premium">
            <div className="flex items-center justify-between mb-6">
              <div className="text-lg font-bold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-rose-500" /> Recent Patients
              </div>
              <Link href="/portal/patients" className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                View All <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            {myPatients.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-foreground/10 bg-foreground/2 p-10 text-center">
                <UserCircle className="h-8 w-8 text-foreground/20 mx-auto mb-3" />
                <div className="text-sm font-bold text-foreground/40">No patients yet</div>
                <div className="text-xs text-foreground/30 mt-1">Patients will appear once appointments are booked</div>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {myPatients.slice(0, 6).map((p, idx) => (
                  <motion.div key={p.id}
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}>
                    <Link href={`/portal/patients/${p.id}`}
                      className="group flex items-center gap-4 rounded-2xl border border-foreground/5 bg-white p-4 transition-all hover:border-primary/20 hover:shadow-sm">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-primary/10 to-primary/20 text-primary font-bold text-sm shrink-0">
                        {p.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{p.fullName}</div>
                        <div className="text-xs text-foreground/40 truncate">{p.email}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-foreground/20 group-hover:text-primary transition-colors shrink-0" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

        </motion.div>
      </RequireRole>
    </AppShell>
  );
}
