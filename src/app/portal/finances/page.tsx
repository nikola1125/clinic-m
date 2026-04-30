"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { RequireRole, DataLoader } from "@/components/RequireRole";
import { useClinicStore } from "@/store/clinicStore";
import {
  DollarSign, TrendingUp, Wallet, Receipt, ArrowLeft,
  CheckCircle2, XCircle, Users, BarChart3, BadgeDollarSign,
  CalendarDays, ChevronRight,
} from "lucide-react";
import { format, startOfMonth, startOfYear, isAfter } from "date-fns";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

type FilterPeriod = "all" | "month" | "year";

export default function DoctorFinancesPage() {
  const session     = useClinicStore((s) => s.doctorSession);
  const doctors     = useClinicStore((s) => s.doctors);
  const appointments = useClinicStore((s) => s.appointments);
  const patients    = useClinicStore((s) => s.patients);

  const [period, setPeriod] = useState<FilterPeriod>("all");
  const [historyPage, setHistoryPage] = useState(0);
  const PAGE_SIZE = 8;

  const doctorId = session?.role === "doctor" ? session.doctorId : null;
  const doctor   = doctors.find((d) => d.id === doctorId) ?? null;

  const myAppts = useMemo(() =>
    appointments.filter((a) => a.doctorId === doctorId)
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()),
    [appointments, doctorId]
  );

  const completed = useMemo(() => myAppts.filter((a) => a.status === "completed"), [myAppts]);
  const rejected  = useMemo(() => myAppts.filter((a) => a.status === "rejected"),  [myAppts]);

  const filterByPeriod = (list: typeof completed) => {
    if (period === "all")   return list;
    const cutoff = period === "month" ? startOfMonth(new Date()) : startOfYear(new Date());
    return list.filter(a => isAfter(new Date(a.scheduledAt), cutoff));
  };

  const filteredCompleted = useMemo(() => filterByPeriod(completed), [completed, period]);
  const filteredRejected  = useMemo(() => filterByPeriod(rejected),  [rejected,  period]);

  const totalRevenue   = filteredCompleted.reduce((s, a) => s + a.price, 0);
  const avgRevenue     = filteredCompleted.length > 0 ? Math.round(totalRevenue / filteredCompleted.length) : 0;
  const completionRate = (myAppts.length > 0) ? Math.round((completed.length / myAppts.length) * 100) : 0;
  const lostRevenue    = filteredRejected.reduce((s, a) => s + a.price, 0);

  const revenueByPatient = useMemo(() => {
    const map: Record<string, number> = {};
    filteredCompleted.forEach(a => { map[a.patientId] = (map[a.patientId] ?? 0) + a.price; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [filteredCompleted]);

  const allHistory = useMemo(() =>
    [...filteredCompleted, ...filteredRejected]
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()),
    [filteredCompleted, filteredRejected]
  );

  const pagedHistory = allHistory.slice(historyPage * PAGE_SIZE, (historyPage + 1) * PAGE_SIZE);
  const totalPages   = Math.ceil(allHistory.length / PAGE_SIZE);

  return (
    <AppShell title="Finances" nav={[
      { label: "Dashboard",    href: "/portal" },
      { label: "Appointments", href: "/portal/appointments" },
      { label: "Patients",     href: "/portal/patients" },
    ]}>
      <RequireRole role="doctor">
        <DataLoader role="doctor" />
        <motion.div className="max-w-6xl mx-auto pb-16" variants={stagger} initial="hidden" animate="show">

          {/* ── Header ── */}
          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
            <Link href="/portal"
              className="flex items-center gap-2 rounded-2xl border border-foreground/10 bg-white px-4 py-2.5 text-sm font-bold text-foreground hover:bg-foreground/5 transition-all">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Financial Report</h1>
              <p className="text-sm text-foreground/50">Dr. {doctor?.name} · {doctor?.specialty}</p>
            </div>
          </motion.div>

          {/* ── Period Filter ── */}
          <motion.div variants={fadeUp} className="flex gap-2 mb-8">
            {([["all", "All Time"], ["month", "This Month"], ["year", "This Year"]] as const).map(([val, label]) => (
              <button key={val} onClick={() => { setPeriod(val); setHistoryPage(0); }}
                className={`px-5 py-2 rounded-2xl text-sm font-bold transition-all ${period === val ? "bg-primary text-white shadow-md" : "border border-foreground/10 bg-white text-foreground/60 hover:text-foreground"}`}>
                {label}
              </button>
            ))}
          </motion.div>

          {/* ── KPI Cards ── */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Earned",     value: `$${totalRevenue}`,     icon: BadgeDollarSign, bg: "bg-emerald-50", border: "border-emerald-200/60", text: "text-emerald-700" },
              { label: "Avg per Session",  value: `$${avgRevenue}`,       icon: TrendingUp,      bg: "bg-blue-50",    border: "border-blue-200/60",    text: "text-blue-700" },
              { label: "Completion Rate",  value: `${completionRate}%`,   icon: BarChart3,       bg: "bg-violet-50",  border: "border-violet-200/60",  text: "text-violet-700" },
              { label: "Lost (Rejected)",  value: `$${lostRevenue}`,      icon: XCircle,         bg: "bg-rose-50",    border: "border-rose-200/60",    text: "text-rose-700" },
            ].map(s => (
              <motion.div key={s.label} whileHover={{ y: -3, transition: { duration: 0.15 } }}
                className={`rounded-3xl border-2 ${s.border} ${s.bg} p-5`}>
                <div className={`h-10 w-10 rounded-xl ${s.bg} ${s.text} flex items-center justify-center mb-3`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div className={`text-3xl font-bold ${s.text} tabular-nums`}>{s.value}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-foreground/40 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            {/* ── Revenue by Patient ── */}
            <motion.div variants={fadeUp} className="lg:col-span-1 glass rounded-3xl p-6 shadow-premium">
              <h3 className="font-bold text-foreground flex items-center gap-2 mb-5">
                <Users className="h-5 w-5 text-primary" /> Revenue by Patient
              </h3>
              {revenueByPatient.length === 0 ? (
                <div className="text-sm text-foreground/40 text-center py-8">No data yet</div>
              ) : (
                <div className="space-y-4">
                  {revenueByPatient.map(([patId, rev], i) => {
                    const pat = patients.find(p => p.id === patId);
                    const pct = totalRevenue > 0 ? Math.round((rev / totalRevenue) * 100) : 0;
                    return (
                      <div key={patId}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                              {pat?.fullName?.charAt(0) || "P"}
                            </div>
                            <span className="text-sm font-medium text-foreground truncate max-w-[120px]">{pat?.fullName || "Patient"}</span>
                          </div>
                          <span className="text-sm font-bold text-emerald-600 shrink-0">${rev}</span>
                        </div>
                        <div className="h-2 rounded-full bg-foreground/5">
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, delay: i * 0.05 }}
                            className="h-full rounded-full bg-emerald-400" />
                        </div>
                        <div className="text-[10px] text-foreground/30 mt-0.5">{pct}% of total</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* ── Summary Stats ── */}
            <motion.div variants={fadeUp} className="lg:col-span-2 glass rounded-3xl p-6 shadow-premium">
              <h3 className="font-bold text-foreground flex items-center gap-2 mb-5">
                <CalendarDays className="h-5 w-5 text-primary" /> Summary
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Sessions Completed", value: filteredCompleted.length, color: "text-emerald-600" },
                  { label: "Sessions Rejected",  value: filteredRejected.length,  color: "text-rose-500" },
                  { label: "Unique Patients",     value: revenueByPatient.length,  color: "text-blue-600" },
                  { label: "Highest Single Earn", value: `$${filteredCompleted.reduce((m, a) => Math.max(m, a.price), 0)}`, color: "text-violet-600" },
                ].map(s => (
                  <div key={s.label} className="rounded-2xl bg-foreground/3 border border-foreground/5 p-4">
                    <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-xs text-foreground/50 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Inline bar: completed vs rejected */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-foreground/50">
                  <span>Earned vs Lost</span>
                  <span>${totalRevenue} / ${lostRevenue}</span>
                </div>
                <div className="h-3 rounded-full bg-foreground/5 overflow-hidden flex">
                  {(totalRevenue + lostRevenue) > 0 && (
                    <>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round((totalRevenue / (totalRevenue + lostRevenue)) * 100)}%` }}
                        transition={{ duration: 0.9 }}
                        className="h-full bg-emerald-400 rounded-l-full" />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round((lostRevenue / (totalRevenue + lostRevenue)) * 100)}%` }}
                        transition={{ duration: 0.9, delay: 0.1 }}
                        className="h-full bg-rose-300 rounded-r-full" />
                    </>
                  )}
                </div>
                <div className="flex gap-4 text-xs text-foreground/50">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" /> Earned</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-300 inline-block" /> Lost (rejected)</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Full Transaction History ── */}
          <motion.div variants={fadeUp} className="glass rounded-3xl p-6 lg:p-8 shadow-premium">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" /> Transaction History
                <span className="text-xs font-bold text-foreground/40 bg-foreground/5 px-2 py-0.5 rounded-full">{allHistory.length}</span>
              </h3>
            </div>

            {allHistory.length === 0 ? (
              <div className="text-center py-14 rounded-2xl border border-dashed border-foreground/10">
                <Receipt className="h-10 w-10 text-foreground/20 mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground/40">No transactions for this period</p>
              </div>
            ) : (
              <>
                {/* Table header */}
                <div className="hidden sm:grid grid-cols-5 gap-4 px-4 mb-2 text-[11px] font-bold uppercase tracking-wider text-foreground/30">
                  <span className="col-span-2">Patient</span>
                  <span>Date</span>
                  <span>Status</span>
                  <span className="text-right">Amount</span>
                </div>

                <div className="space-y-2">
                  {pagedHistory.map((a, i) => {
                    const pat = patients.find(p => p.id === a.patientId);
                    const isComplete = a.status === "completed";
                    return (
                      <motion.div key={a.id}
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                        className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4 items-center rounded-2xl border border-foreground/5 bg-white px-4 py-3.5 hover:border-foreground/10 transition-all">
                        {/* Patient */}
                        <div className="col-span-2 flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isComplete ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-400"}`}>
                            {pat?.fullName?.charAt(0) || "?"}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-sm text-foreground truncate">{pat?.fullName || "Patient"}</div>
                            <div className="text-xs text-foreground/40 truncate">{pat?.email}</div>
                          </div>
                        </div>
                        {/* Date */}
                        <div className="text-sm text-foreground/60">
                          {format(new Date(a.scheduledAt), "MMM d, yyyy")}
                          <div className="text-xs text-foreground/30">{format(new Date(a.scheduledAt), "h:mm a")}</div>
                        </div>
                        {/* Status */}
                        <div>
                          <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-bold uppercase ${isComplete ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"}`}>
                            {isComplete ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {a.status}
                          </span>
                        </div>
                        {/* Amount */}
                        <div className="text-right">
                          <span className={`text-base font-bold ${isComplete ? "text-emerald-600" : "text-rose-400 line-through"}`}>
                            {isComplete ? "+" : ""}${a.price}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-foreground/5">
                    <span className="text-sm text-foreground/40">
                      Page {historyPage + 1} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => setHistoryPage(p => Math.max(0, p - 1))} disabled={historyPage === 0}
                        className="px-4 py-2 rounded-xl border border-foreground/10 text-sm font-bold disabled:opacity-30 hover:bg-foreground/5 transition-all">
                        Prev
                      </button>
                      <button onClick={() => setHistoryPage(p => Math.min(totalPages - 1, p + 1))} disabled={historyPage === totalPages - 1}
                        className="px-4 py-2 rounded-xl border border-foreground/10 text-sm font-bold disabled:opacity-30 hover:bg-foreground/5 transition-all">
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>

        </motion.div>
      </RequireRole>
    </AppShell>
  );
}
