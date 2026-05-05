"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { RequireRole, DataLoader } from "@/components/RequireRole";
import { useClinicStore, type AppointmentStatus } from "@/store/clinicStore";
import {
  Calendar, Search, Clock, CheckCircle2, XCircle, CheckCheck,
  Filter, UserCircle, Stethoscope,
} from "lucide-react";
import { format } from "date-fns";

const ADMIN_NAV = [
  { label: "Overview", href: "/hq-command" },
  { label: "Doctors", href: "/hq-command/doctors" },
  { label: "Patients", href: "/hq-command/patients" },
  { label: "Appointments", href: "/hq-command/appointments" },
  { label: "Revenue", href: "/hq-command/revenue" },
];

const STATUS_CFG: Record<AppointmentStatus, { label: string; bg: string; text: string; icon: typeof Clock }> = {
  pending:   { label: "Pending",   bg: "bg-amber-50",   text: "text-amber-700",   icon: Clock },
  accepted:  { label: "Accepted",  bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle2 },
  rejected:  { label: "Rejected",  bg: "bg-red-50",     text: "text-red-700",     icon: XCircle },
  completed: { label: "Completed", bg: "bg-blue-50",    text: "text-blue-700",    icon: CheckCheck },
};

type FilterKey = "all" | AppointmentStatus;

export default function AdminAppointmentsPage() {
  const appointments = useClinicStore((s) => s.appointments);
  const doctors = useClinicStore((s) => s.doctors);
  const patients = useClinicStore((s) => s.patients);
  const setAppointmentStatus = useClinicStore((s) => s.setAppointmentStatus);

  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  const sorted = useMemo(() =>
    [...appointments].sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()),
    [appointments]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return sorted.filter((a) => {
      if (filter !== "all" && a.status !== filter) return false;
      if (!q) return true;
      const doc = doctors.find((d) => d.id === a.doctorId);
      const pat = patients.find((p) => p.id === a.patientId);
      return (
        (doc?.name ?? "").toLowerCase().includes(q) ||
        (pat?.fullName ?? "").toLowerCase().includes(q)
      );
    });
  }, [sorted, filter, query, doctors, patients]);

  const counts: Record<FilterKey, number> = {
    all: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    accepted: appointments.filter((a) => a.status === "accepted").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    rejected: appointments.filter((a) => a.status === "rejected").length,
  };

  return (
    <AppShell title="Admin Dashboard" nav={ADMIN_NAV}>
      <RequireRole role="admin">
        <DataLoader role="admin" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight text-foreground">
                All Appointments ({appointments.length})
              </div>
              <div className="text-sm text-foreground/60">
                View, filter, and manage all clinic appointments.
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/30" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by doctor or patient name..."
            className="w-full rounded-2xl border-none bg-white p-4 pl-12 text-sm focus:ring-2 focus:ring-primary shadow-sm outline-none transition-all"
          />
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["all", "pending", "accepted", "completed", "rejected"] as FilterKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                filter === key
                  ? "bg-primary text-white shadow-sm"
                  : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
              }`}
            >
              <Filter className="h-3 w-3" />
              {key === "all" ? "All" : STATUS_CFG[key].label}
              <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] ${filter === key ? "bg-white/20" : "bg-foreground/10"}`}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        {/* Appointments list */}
        <div className="grid gap-3">
          {filtered.length === 0 ? (
            <div className="glass rounded-4xl p-12 text-center shadow-premium">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground/5 mb-4">
                <Calendar className="h-8 w-8 text-foreground/30" />
              </div>
              <h3 className="text-xl font-bold text-foreground">No appointments found</h3>
              <p className="mt-2 text-foreground/50">
                {query ? "Try a different search term." : "No appointments match this filter."}
              </p>
            </div>
          ) : (
            filtered.map((appt) => {
              const doc = doctors.find((d) => d.id === appt.doctorId);
              const pat = patients.find((p) => p.id === appt.patientId);
              const cfg = STATUS_CFG[appt.status];
              const Icon = cfg.icon;

              return (
                <div
                  key={appt.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-foreground/5 bg-white p-5 transition-colors hover:border-primary/20 hover:shadow-sm"
                >
                  {/* Date */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex flex-col items-center justify-center text-foreground">
                      <div className="text-[10px] font-bold uppercase text-foreground/40">
                        {format(new Date(appt.scheduledAt), "MMM")}
                      </div>
                      <div className="text-lg font-bold leading-none">
                        {format(new Date(appt.scheduledAt), "d")}
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-sm font-bold text-foreground">
                      <span className="flex items-center gap-1 truncate"><Stethoscope className="h-3.5 w-3.5 text-primary shrink-0" />{doc?.name ?? "Unknown Doctor"}</span>
                      <span className="text-foreground/30">&rarr;</span>
                      <span className="flex items-center gap-1 truncate"><UserCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />{pat?.fullName ?? "Unknown Patient"}</span>
                    </div>
                    <div className="text-xs text-foreground/50 mt-1">
                      {format(new Date(appt.scheduledAt), "h:mm a")} &middot; ${appt.price}
                    </div>
                  </div>

                  {/* Status + Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <span className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase ${cfg.bg} ${cfg.text}`}>
                      <Icon className="h-3 w-3" />
                      {cfg.label}
                    </span>

                    {appt.status === "pending" && (
                      <>
                        <button
                          onClick={() => setAppointmentStatus(appt.id, "accepted")}
                          className="rounded-full bg-emerald-50 text-emerald-600 px-3 py-1.5 text-[10px] font-bold uppercase hover:bg-emerald-100 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => setAppointmentStatus(appt.id, "rejected")}
                          className="rounded-full bg-red-50 text-red-600 px-3 py-1.5 text-[10px] font-bold uppercase hover:bg-red-100 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {appt.status === "accepted" && (
                      <button
                        onClick={() => setAppointmentStatus(appt.id, "completed")}
                        className="rounded-full bg-blue-50 text-blue-600 px-3 py-1.5 text-[10px] font-bold uppercase hover:bg-blue-100 transition-colors"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </RequireRole>
    </AppShell>
  );
}
