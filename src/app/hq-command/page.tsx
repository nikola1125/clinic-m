"use client";

import { AppShell } from "@/components/AppShell";
import { RequireRole, DataLoader } from "@/components/RequireRole";
import { useClinicStore } from "@/store/clinicStore";
import { useMemo } from "react";
import {
  LayoutDashboard, Users, DollarSign,
  Stethoscope, Calendar, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function AdminHomePage() {
  const doctors = useClinicStore((s) => s.doctors);
  const patients = useClinicStore((s) => s.patients);
  const appointments = useClinicStore((s) => s.appointments);

  const stats = useMemo(() => {
    const totalAppts = appointments.length;
    const completed = appointments.filter(a => a.status === "completed").length;
    const pending = appointments.filter(a => a.status === "pending").length;
    const revenue = appointments
      .filter(a => a.status === "completed")
      .reduce((s, a) => s + a.price, 0);
    return { totalAppts, completed, pending, revenue };
  }, [appointments]);

  const recentAppts = useMemo(() =>
    [...appointments].sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()).slice(0, 5),
    [appointments]
  );

  return (
    <AppShell
      title="Admin Dashboard"
      nav={[
        { label: "Overview", href: "/hq-command" },
        { label: "Doctors", href: "/hq-command/doctors" },
        { label: "Patients", href: "/hq-command/patients" },
        { label: "Appointments", href: "/hq-command/appointments" },
        { label: "Revenue", href: "/hq-command/revenue" },
      ]}
    >
      <RequireRole role="admin">
        <DataLoader role="admin" />
        <div className="grid gap-6">
          <div className="glass rounded-4xl p-8 lg:p-12 shadow-premium relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <LayoutDashboard className="h-6 w-6" />
                <h2 className="text-xl font-bold">Platform Overview</h2>
              </div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                Manage Doctors, Pricing & Revenue
              </h1>
              <p className="mt-4 text-foreground/60 max-w-2xl text-lg">
                This administration console gives you full control over the clinic's digital presence. Add or modify doctor profiles and track appointments.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Doctors", value: doctors.length, icon: Stethoscope, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Patients", value: patients.length, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Appointments", value: stats.totalAppts, icon: Calendar, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Revenue", value: `$${stats.revenue}`, icon: DollarSign, color: "text-rose-600", bg: "bg-rose-50" },
            ].map(s => (
              <div key={s.label} className="rounded-2xl border border-foreground/5 bg-white p-5">
                <div className={`h-10 w-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-3`}><s.icon className="h-5 w-5" /></div>
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-foreground/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Doctor Performance */}
          <div className="glass rounded-4xl p-4 sm:p-6 shadow-premium">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2"><Stethoscope className="h-5 w-5 text-primary" /> Doctor Performance</h3>
              <Link href="/hq-command/doctors" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">Manage <ArrowRight className="h-3 w-3" /></Link>
            </div>
            {doctors.length === 0 ? (
              <div className="text-sm text-foreground/40 py-4 text-center">No doctors yet</div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="border-b border-foreground/5">
                      <th className="text-left py-3 px-2 text-xs font-bold uppercase tracking-wider text-foreground/40">Doctor</th>
                      <th className="text-center py-3 px-2 text-xs font-bold uppercase tracking-wider text-foreground/40">Appts</th>
                      <th className="text-center py-3 px-2 text-xs font-bold uppercase tracking-wider text-foreground/40">Revenue</th>
                      <th className="text-center py-3 px-2 text-xs font-bold uppercase tracking-wider text-foreground/40">Rate</th>
                      <th className="text-center py-3 px-2 text-xs font-bold uppercase tracking-wider text-foreground/40">Pending</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map(doc => {
                      const docAppts = appointments.filter(a => a.doctorId === doc.id);
                      const completed = docAppts.filter(a => a.status === "completed");
                      const pending = docAppts.filter(a => a.status === "pending").length;
                      const rev = completed.reduce((s, a) => s + a.price, 0);
                      const rate = docAppts.length > 0 ? Math.round((completed.length / docAppts.length) * 100) : 0;
                      return (
                        <tr key={doc.id} className="border-b border-foreground/5 last:border-0 hover:bg-foreground/2 transition-colors">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">{doc.name.charAt(0)}</div>
                              <div>
                                <div className="font-bold text-foreground">{doc.name}</div>
                                <div className="text-[11px] text-foreground/40">{doc.specialty}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-center font-bold text-foreground">{docAppts.length}</td>
                          <td className="py-3 px-2 text-center font-bold text-emerald-600">${rev}</td>
                          <td className="py-3 px-2 text-center">
                            <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${rate >= 70 ? "bg-emerald-50 text-emerald-700" : rate >= 40 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>
                              {rate}%
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            {pending > 0 ? (
                              <span className="inline-block rounded-full bg-amber-50 text-amber-700 px-2 py-0.5 text-[10px] font-bold">{pending}</span>
                            ) : (
                              <span className="text-foreground/20 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Appointments */}
            <div className="glass rounded-4xl p-6 shadow-premium">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /> Recent Appointments</h3>
                <Link href="/hq-command/appointments" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">View All <ArrowRight className="h-3 w-3" /></Link>
              </div>
              <div className="space-y-3">
                {recentAppts.length === 0 ? (
                  <div className="text-sm text-foreground/40 py-6 text-center">No appointments yet</div>
                ) : recentAppts.map(appt => {
                  const doc = doctors.find(d => d.id === appt.doctorId);
                  const pat = patients.find(p => p.id === appt.patientId);
                  return (
                    <div key={appt.id} className="flex items-center gap-4 rounded-2xl border border-foreground/5 bg-white p-4">
                      <div className="h-10 w-10 rounded-xl bg-foreground/5 flex items-center justify-center text-xs font-bold text-foreground/60">
                        {format(new Date(appt.scheduledAt), "MMM d")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-foreground text-sm">{doc?.name || "Doctor"} → {pat?.fullName || "Patient"}</div>
                        <div className="text-xs text-foreground/50">{format(new Date(appt.scheduledAt), "h:mm a")}</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${appt.status === "completed" ? "bg-blue-100 text-blue-700" : appt.status === "accepted" ? "bg-emerald-100 text-emerald-700" : appt.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>{appt.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div className="glass rounded-4xl p-6 shadow-premium">
              <h3 className="font-bold text-foreground flex items-center gap-2 mb-4"><Users className="h-5 w-5 text-primary" /> Quick Links</h3>
              <div className="grid gap-3">
                {[
                  { label: "Manage Patients", desc: `${patients.length} registered`, href: "/hq-command/patients", bg: "bg-emerald-50", color: "text-emerald-600", icon: Users },
                  { label: "View All Appointments", desc: `${stats.pending} pending`, href: "/hq-command/appointments", bg: "bg-amber-50", color: "text-amber-600", icon: Calendar },
                  { label: "Revenue Details", desc: `$${stats.revenue} total`, href: "/hq-command/revenue", bg: "bg-rose-50", color: "text-rose-600", icon: DollarSign },
                ].map(link => (
                  <Link key={link.href} href={link.href} className="flex items-center gap-4 rounded-2xl border border-foreground/5 bg-white p-4 hover:border-primary/20 hover:shadow-sm transition-all group">
                    <div className={`h-10 w-10 rounded-xl ${link.bg} ${link.color} flex items-center justify-center`}><link.icon className="h-5 w-5" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-foreground group-hover:text-primary transition-colors">{link.label}</div>
                      <div className="text-xs text-foreground/50">{link.desc}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-foreground/20 group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </RequireRole>
    </AppShell>
  );
}
