"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { RequireRole, DataLoader } from "@/components/RequireRole";
import { formatDateTime } from "@/lib/format";
import { useClinicStore } from "@/store/clinicStore";
import { format, isToday, isTomorrow, startOfMonth, isAfter, isBefore } from "date-fns";
import {
  UserCircle, Calendar, CalendarCheck, Clock, Users, ArrowRight, Video,
  CheckCircle2, XCircle, TrendingUp, Activity, Stethoscope, Bell,
  ChevronRight, Sparkles, Heart, BarChart3, RefreshCw, DollarSign,
  Wallet, Receipt, CreditCard, AreaChart, History, Phone, Mail,
  FileText, BadgeDollarSign, AlertCircle, Star,
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
  const [activeTab, setActiveTab] = useState<"pending" | "upcoming" | "history">("pending");

  const doctorId = session?.role === "doctor" ? session.doctorId : null;
  const doctor = doctors.find((d) => d.id === doctorId) ?? null;

  const myAppointments = useMemo(() =>
    appointments.filter((a) => a.doctorId === doctorId)
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()),
    [appointments, doctorId]
  );

  const pending   = useMemo(() => myAppointments.filter((a) => a.status === "pending"), [myAppointments]);
  const upcoming  = useMemo(() => myAppointments.filter((a) => a.status === "accepted"), [myAppointments]);
  const completed = useMemo(() => myAppointments.filter((a) => a.status === "completed"), [myAppointments]);
  const rejected  = useMemo(() => myAppointments.filter((a) => a.status === "rejected"), [myAppointments]);
  const myPatients = useMemo(() => patients.filter((p) => p.doctorId === doctorId), [patients, doctorId]);

  const totalRevenue   = useMemo(() => completed.reduce((s, a) => s + a.price, 0), [completed]);
  const monthlyRevenue = useMemo(() => {
    const start = startOfMonth(new Date());
    return completed.filter(a => isAfter(new Date(a.scheduledAt), start)).reduce((s, a) => s + a.price, 0);
  }, [completed]);

  const todayAppts = useMemo(() =>
    [...upcoming, ...pending].filter(a => isToday(new Date(a.scheduledAt)))
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()),
    [upcoming, pending]
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([refreshAppointments("doctor"), refreshPatients("doctor")]);
    setTimeout(() => setIsRefreshing(false), 600);
  }, [refreshAppointments, refreshPatients]);

  const donutSegments = [
    { count: pending.length,   color: "#f59e0b", label: "Pending" },
    { count: upcoming.length,  color: "#10b981", label: "Upcoming" },
    { count: completed.length, color: "#3b82f6", label: "Completed" },
    { count: rejected.length,  color: "#ef4444", label: "Rejected" },
  ];

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
  const fadeUp  = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } } };

  return (
    <AppShell title="Doctor Portal" nav={[
      { label: "Dashboard",     href: "/portal" },
      { label: "Appointments",  href: "/portal/appointments" },
      { label: "Patients",      href: "/portal/patients" },
    ]}>
      <RequireRole role="doctor">
        <DataLoader role="doctor" />
        <motion.div className="grid gap-6 max-w-7xl mx-auto pb-12" variants={stagger} initial="hidden" animate="show">

          {/* ── Hero ── */}
          <motion.div variants={fadeUp} className="glass rounded-3xl p-8 lg:p-10 shadow-premium relative overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-bold text-primary uppercase tracking-wider">{getGreeting()}</span>
                  {pending.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 animate-pulse">
                      <Bell className="h-3 w-3" />{pending.length} pending
                    </span>
                  )}
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Dr. {doctor?.name || "..."}</h1>
                <div className="mt-2 flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    <Stethoscope className="h-3 w-3" />{doctor?.specialty || "Specialist"}
                  </span>
                  <span className="text-xs text-foreground/50">{myPatients.length} patients • {completed.length} completed</span>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/portal/appointments" className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90 transition-all hover:-translate-y-px">
                    <Calendar className="h-4 w-4" /> Schedule
                  </Link>
                  <Link href="/portal/patients" className="flex items-center gap-2 rounded-2xl border border-foreground/10 bg-white px-6 py-3 text-sm font-bold text-foreground hover:bg-foreground/5 transition-all">
                    <Users className="h-4 w-4" /> Patients
                  </Link>
                  <button onClick={handleRefresh} className="flex items-center gap-2 rounded-2xl border border-foreground/10 bg-white px-4 py-3 text-sm font-bold text-foreground hover:bg-foreground/5 transition-all">
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 shrink-0">
                <StatusDonut segments={donutSegments} />
                <div className="flex flex-wrap gap-3 justify-center">
                  {donutSegments.map((seg) => (
                    <div key={seg.label} className="flex items-center gap-1.5 text-xs font-bold text-foreground/60">
                      <div className="h-2 w-2 rounded-full" style={{ background: seg.color }} />{seg.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
          </motion.div>

          {/* ── KPI Stats ── */}
          <motion.div variants={fadeUp} className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Pending",   value: pending.length,   icon: Clock,         bg: "bg-amber-50",   border: "border-amber-200/60",   text: "text-amber-700" },
              { label: "Upcoming",  value: upcoming.length,  icon: CalendarCheck, bg: "bg-emerald-50", border: "border-emerald-200/60", text: "text-emerald-700" },
              { label: "Completed", value: completed.length, icon: Activity,      bg: "bg-blue-50",    border: "border-blue-200/60",    text: "text-blue-700" },
              { label: "Patients",  value: myPatients.length,icon: Heart,         bg: "bg-rose-50",    border: "border-rose-200/60",    text: "text-rose-700" },
            ].map((stat) => (
              <motion.div key={stat.label} whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`rounded-3xl border-2 ${stat.border} ${stat.bg} p-5 shadow-sm`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`h-10 w-10 rounded-xl ${stat.bg} ${stat.text} flex items-center justify-center`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <BarChart3 className="h-4 w-4 text-foreground/20" />
                </div>
                <div className={`text-3xl font-bold ${stat.text} tabular-nums`}>
                  <AnimatedCount value={stat.value} />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-foreground/40 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Today's Schedule ── */}
          {todayAppts.length > 0 && (
            <motion.div variants={fadeUp} className="glass rounded-3xl p-6 shadow-premium border-2 border-emerald-100">
              <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Today's Schedule — {format(new Date(), "EEEE, MMMM d")}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {todayAppts.map(a => {
                  const pat = patients.find(p => p.id === a.patientId);
                  return (
                    <div key={a.id} className="flex items-center gap-4 rounded-2xl bg-white border border-foreground/5 p-4 hover:border-emerald-200 transition-all">
                      <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold">{format(new Date(a.scheduledAt), "h:mm")}</span>
                        <span className="text-[10px]">{format(new Date(a.scheduledAt), "a")}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-foreground truncate">{pat?.fullName || "Patient"}</div>
                        <div className="text-xs text-foreground/50">${a.price}</div>
                      </div>
                      {a.status === "accepted" && (
                        <Link href={`/meet/${a.id}?role=doctor`} className="shrink-0 rounded-xl bg-emerald-500 p-2 text-white hover:bg-emerald-600 transition-colors">
                          <Video className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── Appointments Panel ── */}
          <motion.div variants={fadeUp} className="glass rounded-3xl p-6 lg:p-8 shadow-premium">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-1 p-1 rounded-2xl bg-foreground/5">
                {(["pending", "upcoming", "history"] as const).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab ? "bg-white shadow-sm text-foreground" : "text-foreground/50 hover:text-foreground"}`}>
                    {tab === "pending" ? `Pending (${pending.length})` : tab === "upcoming" ? `Upcoming (${upcoming.length})` : `History (${completed.length + rejected.length})`}
                  </button>
                ))}
              </div>
              <Link href="/portal/appointments" className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                All <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>

                {activeTab === "pending" && (
                  <div className="grid gap-3">
                    {pending.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-foreground/10 p-10 text-center">
                        <Clock className="h-8 w-8 text-foreground/20 mx-auto mb-3" />
                        <div className="text-sm font-bold text-foreground/40">No pending requests</div>
                      </div>
                    ) : pending.map((a, idx) => {
                      const pat = patients.find(p => p.id === a.patientId);
                      return (
                        <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                          className="rounded-2xl border border-foreground/5 bg-white p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-amber-200 hover:shadow-sm transition-all">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                              <Clock className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-bold text-foreground">{pat?.fullName || "Patient"}</div>
                              <div className="text-xs text-foreground/50 mt-0.5">{formatDateTime(a.scheduledAt)}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">${a.price}</span>
                                {pat?.phone && <span className="text-xs text-foreground/40 flex items-center gap-1"><Phone className="h-3 w-3" />{pat.phone}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
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
                    })}
                  </div>
                )}

                {activeTab === "upcoming" && (
                  <div className="grid gap-3">
                    {upcoming.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-foreground/10 p-10 text-center">
                        <CalendarCheck className="h-8 w-8 text-foreground/20 mx-auto mb-3" />
                        <div className="text-sm font-bold text-foreground/40">No upcoming meetings</div>
                      </div>
                    ) : upcoming.map((a, idx) => {
                      const pat = patients.find(p => p.id === a.patientId);
                      const dt = new Date(a.scheduledAt);
                      const label = isToday(dt) ? "Today" : isTomorrow(dt) ? "Tomorrow" : format(dt, "MMM d");
                      return (
                        <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                          className="rounded-2xl border border-foreground/5 bg-white p-4 flex items-center gap-4 hover:border-emerald-200 hover:shadow-sm transition-all">
                          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex flex-col items-center justify-center shrink-0 text-[11px] font-bold">
                            <span>{label}</span>
                            <span className="opacity-70">{format(dt, "h:mm a")}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-foreground">{pat?.fullName || "Patient"}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-foreground/50">${a.price}</span>
                              {pat?.email && <span className="text-xs text-foreground/40 flex items-center gap-1"><Mail className="h-3 w-3" />{pat.email}</span>}
                            </div>
                          </div>
                          <Link href={`/meet/${a.id}?role=doctor`}
                            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 transition-all hover:-translate-y-px shrink-0">
                            <Video className="h-3.5 w-3.5" /> Join
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {activeTab === "history" && (
                  <div className="grid gap-3">
                    {[...completed, ...rejected].length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-foreground/10 p-10 text-center">
                        <History className="h-8 w-8 text-foreground/20 mx-auto mb-3" />
                        <div className="text-sm font-bold text-foreground/40">No history yet</div>
                      </div>
                    ) : [...completed, ...rejected].sort((a,b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()).slice(0, 10).map((a, idx) => {
                      const pat = patients.find(p => p.id === a.patientId);
                      return (
                        <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                          className="rounded-2xl border border-foreground/5 bg-white p-4 flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${a.status === "completed" ? "bg-blue-50 text-blue-500" : "bg-rose-50 text-rose-400"}`}>
                            {a.status === "completed" ? <CheckCircle2 className="h-4.5 w-4.5" /> : <XCircle className="h-4 w-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-foreground truncate">{pat?.fullName || "Patient"}</div>
                            <div className="text-xs text-foreground/50">{format(new Date(a.scheduledAt), "MMM d, yyyy · h:mm a")}</div>
                          </div>
                          <div className="text-right shrink-0">
                            {a.status === "completed"
                              ? <span className="text-sm font-bold text-emerald-600">+${a.price}</span>
                              : <span className="text-xs font-bold text-rose-400">Rejected</span>}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* ── Finance + Patients ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Finance Card — links to dedicated page */}
            <motion.div variants={fadeUp}>
              <Link href="/portal/finances"
                className="group block glass rounded-3xl p-6 shadow-premium hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                        <DollarSign className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-bold text-foreground">Financial Overview</div>
                        <div className="text-xs text-foreground/50">Earnings, history & breakdown</div>
                      </div>
                    </div>
                    <div className="h-9 w-9 rounded-xl border border-foreground/10 flex items-center justify-center group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all">
                      <ArrowRight className="h-4 w-4 text-foreground/40 group-hover:text-emerald-600 transition-colors" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
                      <div className="text-[10px] font-bold text-emerald-700/60 uppercase tracking-wider mb-1">This Month</div>
                      <div className="text-2xl font-bold text-emerald-700">${monthlyRevenue}</div>
                    </div>
                    <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
                      <div className="text-[10px] font-bold text-blue-700/60 uppercase tracking-wider mb-1">All Time</div>
                      <div className="text-2xl font-bold text-blue-700">${totalRevenue}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {completed.slice(0, 3).map(a => {
                      const pat = patients.find(p => p.id === a.patientId);
                      return (
                        <div key={a.id} className="flex items-center justify-between py-2 border-b border-foreground/5 last:border-0">
                          <div className="text-sm text-foreground/70 truncate">{pat?.fullName || "Patient"}</div>
                          <div className="text-sm font-bold text-emerald-600 shrink-0">+${a.price}</div>
                        </div>
                      );
                    })}
                    {completed.length === 0 && (
                      <div className="text-sm text-foreground/30 py-2 text-center">No earnings yet</div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600 group-hover:gap-3 transition-all">
                    <Receipt className="h-3.5 w-3.5" /> View full financial report
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 translate-y-1/3 translate-x-1/4 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              </Link>
            </motion.div>

            {/* Patients Panel */}
            <motion.div variants={fadeUp} className="glass rounded-3xl p-6 shadow-premium">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-foreground flex items-center gap-2"><Users className="h-5 w-5 text-rose-500" /> My Patients ({myPatients.length})</h3>
                <Link href="/portal/patients" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">All <ArrowRight className="h-3 w-3" /></Link>
              </div>
              {myPatients.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-foreground/10 p-10 text-center">
                  <UserCircle className="h-8 w-8 text-foreground/20 mx-auto mb-3" />
                  <div className="text-sm font-bold text-foreground/40">No patients yet</div>
                </div>
              ) : (
                <div className="grid gap-3">
                  {myPatients.slice(0, 6).map((p, idx) => {
                    const lastAppt = [...completed].filter(a => a.patientId === p.id).sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())[0];
                    const patRevenue = completed.filter(a => a.patientId === p.id).reduce((s, a) => s + a.price, 0);
                    return (
                      <motion.div key={p.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                        <Link href={`/portal/patients/${p.id}`}
                          className="group flex items-center gap-4 rounded-2xl border border-foreground/5 bg-white p-4 hover:border-primary/20 hover:shadow-sm transition-all">
                          <div className="h-11 w-11 rounded-full bg-linear-to-br from-primary/20 to-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                            {p.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-foreground truncate group-hover:text-primary transition-colors">{p.fullName}</div>
                            <div className="text-xs text-foreground/40">{lastAppt ? `Last: ${format(new Date(lastAppt.scheduledAt), "MMM d")}` : "No visits yet"}</div>
                          </div>
                          <div className="text-right shrink-0">
                            {patRevenue > 0 && <div className="text-xs font-bold text-emerald-600">${patRevenue}</div>}
                            <ChevronRight className="h-4 w-4 text-foreground/20 group-hover:text-primary ml-auto mt-0.5 transition-colors" />
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>

        </motion.div>
      </RequireRole>
    </AppShell>
  );
}
