"use client";

import { AppShell } from "@/components/AppShell";
import { AutoSeed, RequireRole } from "@/components/RequireRole";
import { useClinicStore } from "@/store/clinicStore";
import { TrendingUp, DollarSign, Calendar, Activity } from "lucide-react";

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0);
}

export default function AdminRevenuePage() {
  const appointments = useClinicStore((s) => s.appointments);

  const completed = appointments.filter((a) => a.status === "completed");
  const accepted = appointments.filter((a) => a.status === "accepted");

  const total = sum(completed.map((a) => a.price));
  const pendingTotal = sum(accepted.map((a) => a.price));

  const byMonth = new Map<string, number>();
  for (const a of completed) {
    const d = new Date(a.scheduledAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    byMonth.set(key, (byMonth.get(key) ?? 0) + a.price);
  }

  const months = Array.from(byMonth.entries()).sort((a, b) => (a[0] < b[0] ? -1 : 1));

  return (
    <AppShell
      title="Admin Dashboard"
      nav={[
        { label: "Overview", href: "/hq-command" },
        { label: "Doctors", href: "/hq-command/doctors" },
        { label: "Revenue", href: "/hq-command/revenue" },
      ]}
    >
      <AutoSeed />
      <RequireRole role="admin">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight text-foreground">Revenue Tracking</div>
              <div className="mt-1 text-sm text-foreground">
                Monitor completed consultations and upcoming projected earnings.
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="glass rounded-4xl p-8 border-2 border-emerald-500/10 shadow-premium relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 text-emerald-500/10 group-hover:scale-110 transition-transform duration-500">
                <DollarSign className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="text-sm font-bold uppercase tracking-wide text-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-500" /> Total Realized
                </div>
                <div className="mt-4 text-5xl font-bold text-foreground">${total.toLocaleString()}</div>
                <div className="mt-4 inline-flex px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                  Completed appointments
                </div>
              </div>
            </div>

            <div className="glass rounded-4xl p-8 border-2 border-primary/10 shadow-premium relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 text-primary/10 group-hover:scale-110 transition-transform duration-500">
                <Calendar className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="text-sm font-bold uppercase tracking-wide text-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" /> Projected Upcoming
                </div>
                <div className="mt-4 text-5xl font-bold text-foreground">${pendingTotal.toLocaleString()}</div>
                <div className="mt-4 inline-flex px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                  Accepted appointments
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 glass rounded-4xl p-8 shadow-premium border-2 border-foreground/5">
            <div className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Monthly Breakdown
            </div>

            <div className="grid gap-3">
              {months.length === 0 ? (
                <div className="rounded-2xl border border-foreground/5 bg-white/50 p-8 text-center text-sm text-foreground">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-foreground/5 mb-3">
                    <DollarSign className="h-5 w-5 text-foreground" />
                  </div>
                  No completed revenue yet.
                </div>
              ) : (
                months.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-foreground/5 bg-white p-5 transition-colors hover:border-primary/20 hover:shadow-sm gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/5 text-foreground">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="text-lg font-bold text-foreground">{k}</div>
                    </div>
                    <div className="text-2xl font-bold text-primary px-4 py-2 bg-primary/5 rounded-xl self-start sm:self-auto">
                      ${v.toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </RequireRole>
    </AppShell>
  );
}
