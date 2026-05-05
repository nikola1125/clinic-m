"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { RequireRole, DataLoader } from "@/components/RequireRole";
import { useClinicStore } from "@/store/clinicStore";
import {
  TrendingUp, DollarSign, Calendar, Activity, Stethoscope,
  Search, ArrowUpDown, Users, CheckCircle2, XCircle,
} from "lucide-react";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";

const ADMIN_NAV = [
  { label: "Overview", href: "/hq-command" },
  { label: "Doctors", href: "/hq-command/doctors" },
  { label: "Patients", href: "/hq-command/patients" },
  { label: "Appointments", href: "/hq-command/appointments" },
  { label: "Revenue", href: "/hq-command/revenue" },
];

type SortKey = "doctor" | "revenue" | "completed" | "rate";

export default function AdminRevenuePage() {
  const doctors = useClinicStore((s) => s.doctors);
  const patients = useClinicStore((s) => s.patients);
  const appointments = useClinicStore((s) => s.appointments);

  const [doctorFilter, setDoctorFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("revenue");
  const [sortAsc, setSortAsc] = useState(false);
  const [txPage, setTxPage] = useState(0);
  const TX_PER_PAGE = 15;

  const dateFilteredAppts = useMemo(() => {
    return appointments.filter((a) => {
      const dt = new Date(a.scheduledAt);
      if (dateFrom && isBefore(dt, startOfDay(new Date(dateFrom)))) return false;
      if (dateTo && isAfter(dt, endOfDay(new Date(dateTo)))) return false;
      return true;
    });
  }, [appointments, dateFrom, dateTo]);

  const totalCompleted = useMemo(() => dateFilteredAppts.filter((a) => a.status === "completed"), [dateFilteredAppts]);
  const totalAccepted = useMemo(() => dateFilteredAppts.filter((a) => a.status === "accepted"), [dateFilteredAppts]);
  const totalRevenue = useMemo(() => totalCompleted.reduce((s, a) => s + a.price, 0), [totalCompleted]);
  const projectedRevenue = useMemo(() => totalAccepted.reduce((s, a) => s + a.price, 0), [totalAccepted]);

  const doctorRevenue = useMemo(() => {
    return doctors.map((doc) => {
      const docAppts = dateFilteredAppts.filter((a) => a.doctorId === doc.id);
      const completed = docAppts.filter((a) => a.status === "completed");
      const rejected = docAppts.filter((a) => a.status === "rejected");
      const rev = completed.reduce((s, a) => s + a.price, 0);
      const rate = docAppts.length > 0 ? Math.round((completed.length / docAppts.length) * 100) : 0;
      const uniquePatients = [...new Set(docAppts.map((a) => a.patientId))].length;
      return {
        ...doc,
        totalAppts: docAppts.length,
        completedCount: completed.length,
        rejectedCount: rejected.length,
        revenue: rev,
        rate,
        uniquePatients,
      };
    });
  }, [doctors, dateFilteredAppts]);

  const filteredDoctors = useMemo(() => {
    const q = query.toLowerCase();
    let list = doctorRevenue.filter(
      (d) => !q || d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q)
    );
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "doctor": cmp = a.name.localeCompare(b.name); break;
        case "revenue": cmp = a.revenue - b.revenue; break;
        case "completed": cmp = a.completedCount - b.completedCount; break;
        case "rate": cmp = a.rate - b.rate; break;
      }
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [doctorRevenue, query, sortBy, sortAsc]);

  const transactions = useMemo(() => {
    let list = dateFilteredAppts.filter(
      (a) => a.status === "completed" || a.status === "rejected"
    );
    if (doctorFilter !== "all") list = list.filter((a) => a.doctorId === doctorFilter);
    return list.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
  }, [dateFilteredAppts, doctorFilter]);

  const pagedTx = transactions.slice(txPage * TX_PER_PAGE, (txPage + 1) * TX_PER_PAGE);
  const totalTxPages = Math.ceil(transactions.length / TX_PER_PAGE);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortAsc((v) => !v);
    else { setSortBy(key); setSortAsc(false); }
  };

  return (
    <AppShell title="Admin Dashboard" nav={ADMIN_NAV}>
      <RequireRole role="admin">
        <DataLoader role="admin" />
        <div className="grid gap-6 max-w-7xl mx-auto pb-12">

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight text-foreground">Revenue Tracking</div>
              <div className="text-sm text-foreground/60">All revenue from every doctor with filters.</div>
            </div>
          </div>

          {/* Date filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1">
              <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider shrink-0">From</label>
              <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setTxPage(0); }}
                className="flex-1 rounded-xl bg-white border border-foreground/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex items-center gap-2 flex-1">
              <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider shrink-0">To</label>
              <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setTxPage(0); }}
                className="flex-1 rounded-xl bg-white border border-foreground/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
            </div>
            {(dateFrom || dateTo) && (
              <button onClick={() => { setDateFrom(""); setDateTo(""); setTxPage(0); }}
                className="rounded-xl border border-foreground/10 bg-white px-4 py-2.5 text-xs font-bold text-foreground/60 hover:bg-foreground/5 transition-colors">
                Clear dates
              </button>
            )}
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, bg: "bg-emerald-50", border: "border-emerald-200/60", text: "text-emerald-700" },
              { label: "Projected", value: `$${projectedRevenue.toLocaleString()}`, icon: TrendingUp, bg: "bg-blue-50", border: "border-blue-200/60", text: "text-blue-700" },
              { label: "Completed", value: totalCompleted.length, icon: CheckCircle2, bg: "bg-violet-50", border: "border-violet-200/60", text: "text-violet-700" },
              { label: "Doctors", value: doctors.length, icon: Stethoscope, bg: "bg-amber-50", border: "border-amber-200/60", text: "text-amber-700" },
            ].map((s) => (
              <div key={s.label} className={`rounded-2xl border-2 ${s.border} ${s.bg} p-5`}>
                <div className={`h-10 w-10 rounded-xl ${s.bg} ${s.text} flex items-center justify-center mb-3`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div className={`text-2xl font-bold ${s.text} tabular-nums`}>{s.value}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-foreground/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Doctor revenue breakdown */}
          <div className="glass rounded-3xl p-6 shadow-premium">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" /> Revenue by Doctor
              </h3>
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30" />
                <input value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter doctors..."
                  className="w-full rounded-xl border border-foreground/10 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              {(["doctor", "revenue", "completed", "rate"] as SortKey[]).map((key) => (
                <button key={key} onClick={() => toggleSort(key)}
                  className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                    sortBy === key ? "bg-primary text-white" : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
                  }`}>
                  {key === "doctor" ? "Name" : key === "revenue" ? "Revenue" : key === "completed" ? "Sessions" : "Rate"}
                  {sortBy === key && <ArrowUpDown className="h-3 w-3" />}
                </button>
              ))}
            </div>

            {filteredDoctors.length === 0 ? (
              <div className="text-sm text-foreground/40 py-6 text-center">No doctors match your search.</div>
            ) : (
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr className="border-b border-foreground/5">
                      <th className="text-left py-3 px-2 text-xs font-bold uppercase tracking-wider text-foreground/40">Doctor</th>
                      <th className="text-center py-3 px-2 text-xs font-bold uppercase tracking-wider text-foreground/40">Sessions</th>
                      <th className="text-center py-3 px-2 text-xs font-bold uppercase tracking-wider text-foreground/40">Patients</th>
                      <th className="text-center py-3 px-2 text-xs font-bold uppercase tracking-wider text-foreground/40">Rate</th>
                      <th className="text-right py-3 px-2 text-xs font-bold uppercase tracking-wider text-foreground/40">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDoctors.map((doc) => {
                      const pct = totalRevenue > 0 ? Math.round((doc.revenue / totalRevenue) * 100) : 0;
                      return (
                        <tr key={doc.id} className="border-b border-foreground/5 last:border-0 hover:bg-foreground/2 transition-colors">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">{doc.name.charAt(0)}</div>
                              <div>
                                <div className="font-bold text-foreground">{doc.name}</div>
                                <div className="text-[11px] text-foreground/40">{doc.specialty}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className="font-bold text-foreground">{doc.completedCount}</span>
                            <span className="text-foreground/30 text-xs"> / {doc.totalAppts}</span>
                          </td>
                          <td className="py-3 px-2 text-center font-bold text-foreground">{doc.uniquePatients}</td>
                          <td className="py-3 px-2 text-center">
                            <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${doc.rate >= 70 ? "bg-emerald-50 text-emerald-700" : doc.rate >= 40 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>
                              {doc.rate}%
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <div className="font-bold text-emerald-600">${doc.revenue.toLocaleString()}</div>
                            {pct > 0 && <div className="text-[10px] text-foreground/30">{pct}% of total</div>}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="border-t-2 border-foreground/10 bg-foreground/2">
                      <td className="py-3 px-2 font-bold text-foreground text-sm">Total</td>
                      <td className="py-3 px-2 text-center font-bold text-foreground">{filteredDoctors.reduce((s, d) => s + d.completedCount, 0)}</td>
                      <td className="py-3 px-2 text-center font-bold text-foreground">—</td>
                      <td className="py-3 px-2 text-center">—</td>
                      <td className="py-3 px-2 text-right font-bold text-emerald-700 text-lg">${filteredDoctors.reduce((s, d) => s + d.revenue, 0).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Transaction History */}
          <div className="glass rounded-3xl p-6 shadow-premium">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Transaction History
                <span className="text-xs font-bold text-foreground/40 bg-foreground/5 px-2 py-0.5 rounded-full">{transactions.length}</span>
              </h3>
              <select value={doctorFilter} onChange={(e) => { setDoctorFilter(e.target.value); setTxPage(0); }}
                className="rounded-xl bg-white border border-foreground/10 px-3 py-2 text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary">
                <option value="all">All Doctors</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {transactions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-foreground/10 p-10 text-center">
                <DollarSign className="h-10 w-10 text-foreground/20 mx-auto mb-3" />
                <div className="text-sm font-bold text-foreground/40">No transactions found</div>
              </div>
            ) : (
              <>
                <div className="hidden sm:grid grid-cols-5 gap-4 text-xs font-bold uppercase tracking-wider text-foreground/40 px-4 mb-2">
                  <span className="col-span-2">Patient / Doctor</span>
                  <span>Date</span>
                  <span>Status</span>
                  <span className="text-right">Amount</span>
                </div>
                <div className="space-y-2">
                  {pagedTx.map((a) => {
                    const doc = doctors.find((d) => d.id === a.doctorId);
                    const pat = patients.find((p) => p.id === a.patientId);
                    const isComplete = a.status === "completed";
                    return (
                      <div key={a.id}
                        className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4 items-center rounded-2xl border border-foreground/5 bg-white px-4 py-3.5 hover:border-foreground/10 transition-all">
                        <div className="col-span-2 flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isComplete ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-400"}`}>
                            {pat?.fullName?.charAt(0) || "?"}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-sm text-foreground truncate">{pat?.fullName || "Patient"}</div>
                            <div className="text-xs text-foreground/40 truncate flex items-center gap-1">
                              <Stethoscope className="h-3 w-3" /> {doc?.name || "Doctor"}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-foreground/60">{format(new Date(a.scheduledAt), "MMM d, yyyy")}</div>
                        <div>
                          <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${isComplete ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-500"}`}>
                            {isComplete ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {a.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={`text-base font-bold ${isComplete ? "text-emerald-600" : "text-rose-400 line-through"}`}>
                            {isComplete ? "+" : ""}${a.price}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {totalTxPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-foreground/5">
                    <span className="text-sm text-foreground/40">Page {txPage + 1} of {totalTxPages}</span>
                    <div className="flex gap-2">
                      <button onClick={() => setTxPage((p) => Math.max(0, p - 1))} disabled={txPage === 0}
                        className="px-4 py-2 rounded-xl border border-foreground/10 text-sm font-bold disabled:opacity-30 hover:bg-foreground/5 transition-all">
                        Previous
                      </button>
                      <button onClick={() => setTxPage((p) => Math.min(totalTxPages - 1, p + 1))} disabled={txPage === totalTxPages - 1}
                        className="px-4 py-2 rounded-xl border border-foreground/10 text-sm font-bold disabled:opacity-30 hover:bg-foreground/5 transition-all">
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </RequireRole>
    </AppShell>
  );
}
