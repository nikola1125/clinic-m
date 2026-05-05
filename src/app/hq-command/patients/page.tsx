"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { RequireRole, DataLoader } from "@/components/RequireRole";
import { useClinicStore } from "@/store/clinicStore";
import {
  Users, Search, Calendar, Mail, Phone, ArrowUpDown,
  Stethoscope, DollarSign,
} from "lucide-react";
import { format } from "date-fns";

const ADMIN_NAV = [
  { label: "Overview", href: "/hq-command" },
  { label: "Doctors", href: "/hq-command/doctors" },
  { label: "Patients", href: "/hq-command/patients" },
  { label: "Appointments", href: "/hq-command/appointments" },
  { label: "Revenue", href: "/hq-command/revenue" },
];

type SortKey = "name" | "email" | "date" | "visits" | "revenue";

export default function AdminPatientsPage() {
  const patients = useClinicStore((s) => s.patients);
  const doctors = useClinicStore((s) => s.doctors);
  const appointments = useClinicStore((s) => s.appointments);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [doctorFilter, setDoctorFilter] = useState<string>("all");

  const patientStats = useMemo(() => {
    return patients.map((p) => {
      const appts = appointments.filter((a) => a.patientId === p.id);
      const completed = appts.filter((a) => a.status === "completed");
      const doctorIds = [...new Set(appts.map((a) => a.doctorId))];
      const linkedDoctors = doctorIds.map((dId) => doctors.find((d) => d.id === dId)).filter(Boolean);
      return {
        ...p,
        totalVisits: appts.length,
        completedVisits: completed.length,
        totalSpent: completed.reduce((s, a) => s + a.price, 0),
        linkedDoctors,
        doctorIds,
        lastVisit: appts.length > 0
          ? appts.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())[0]?.scheduledAt
          : null,
      };
    });
  }, [patients, appointments, doctors]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    let list = patientStats.filter(
      (p) =>
        (!q ||
          p.fullName.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          (p.phone ?? "").toLowerCase().includes(q) ||
          p.linkedDoctors.some((d) => d!.name.toLowerCase().includes(q))) &&
        (doctorFilter === "all" || p.doctorIds.includes(doctorFilter))
    );

    list.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "name":
          cmp = a.fullName.localeCompare(b.fullName);
          break;
        case "email":
          cmp = a.email.localeCompare(b.email);
          break;
        case "date":
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "visits":
          cmp = a.totalVisits - b.totalVisits;
          break;
        case "revenue":
          cmp = a.totalSpent - b.totalSpent;
          break;
      }
      return sortAsc ? cmp : -cmp;
    });

    return list;
  }, [patientStats, query, sortBy, sortAsc, doctorFilter]);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortAsc((v) => !v);
    else {
      setSortBy(key);
      setSortAsc(false);
    }
  };

  return (
    <AppShell title="Admin Dashboard" nav={ADMIN_NAV}>
      <RequireRole role="admin">
        <DataLoader role="admin" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight text-foreground">
                Patients ({filtered.length}{filtered.length !== patients.length ? ` / ${patients.length}` : ""})
              </div>
              <div className="text-sm text-foreground/60">
                All registered patients with their appointment history and linked doctors.
              </div>
            </div>
          </div>
        </div>

        {/* Search + Doctor filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/30" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, phone or doctor..."
              className="w-full rounded-2xl border-none bg-white p-4 pl-12 text-sm focus:ring-2 focus:ring-primary shadow-sm outline-none transition-all"
            />
          </div>
          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-foreground shadow-sm outline-none focus:ring-2 focus:ring-primary border-none"
          >
            <option value="all">All Doctors</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Sort bar */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {([
            ["name", "Name"],
            ["email", "Email"],
            ["date", "Join Date"],
            ["visits", "Visits"],
            ["revenue", "Revenue"],
          ] as [SortKey, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => toggleSort(key)}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                sortBy === key
                  ? "bg-primary text-white"
                  : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
              }`}
            >
              {label}
              {sortBy === key && (
                <ArrowUpDown className="h-3 w-3" />
              )}
            </button>
          ))}
        </div>

        {/* Patient list */}
        <div className="grid gap-3">
          {filtered.length === 0 ? (
            <div className="glass rounded-4xl p-12 text-center shadow-premium">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground/5 mb-4">
                <Users className="h-8 w-8 text-foreground/30" />
              </div>
              <h3 className="text-xl font-bold text-foreground">No patients found</h3>
              <p className="mt-2 text-foreground/50">
                {query || doctorFilter !== "all" ? "Try a different search or filter." : "No patients have registered yet."}
              </p>
            </div>
          ) : (
            filtered.map((p) => (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-foreground/5 bg-white p-5 transition-colors hover:border-primary/20 hover:shadow-sm"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="h-12 w-12 shrink-0 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-lg">
                    {p.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-foreground truncate">{p.fullName}</div>
                    <div className="flex items-center gap-3 text-xs text-foreground/50 mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="h-3 w-3" /> {p.email}
                      </span>
                      {p.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {p.phone}
                        </span>
                      )}
                    </div>
                    {p.linkedDoctors.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <Stethoscope className="h-3 w-3 text-foreground/30 shrink-0" />
                        {p.linkedDoctors.map((d) => (
                          <span key={d!.id} className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-bold">
                            {d!.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 text-xs shrink-0">
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{p.totalVisits}</div>
                    <div className="text-foreground/40 font-bold uppercase tracking-wider">Visits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-emerald-600">{p.completedVisits}</div>
                    <div className="text-foreground/40 font-bold uppercase tracking-wider">Done</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <DollarSign className="h-3 w-3 text-emerald-600" />
                      <span className="text-lg font-bold text-emerald-600">{p.totalSpent}</span>
                    </div>
                    <div className="text-foreground/40 font-bold uppercase tracking-wider">Spent</div>
                  </div>
                  <div className="text-center min-w-[80px]">
                    <div className="flex items-center gap-1 justify-center text-foreground/50">
                      <Calendar className="h-3 w-3" />
                      <span className="font-bold">{format(new Date(p.createdAt), "MMM d, yy")}</span>
                    </div>
                    <div className="text-foreground/40 font-bold uppercase tracking-wider">Joined</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </RequireRole>
    </AppShell>
  );
}
