"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AutoSeed } from "@/components/RequireRole";
import { useClinicStore } from "@/store/clinicStore";
import { setToken } from "@/lib/api";
import { Lock, Mail, Stethoscope } from "lucide-react";

export default function DoctorLoginPage() {
  const doctors = useClinicStore((s) => s.doctors);
  const setSession = useClinicStore((s) => s.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    setError(null);
    try {
      const { api } = await import("@/lib/api");
      const result = await api.login({ email, password });

      if (result.role !== "doctor") {
        throw new Error("Invalid credentials or not a doctor.");
      }

      setToken("doctor", result.access_token);
      setSession({ role: "doctor", doctorId: result.doctor_id });

      window.location.href = "/portal";
    } catch (err: any) {
      setError(err.message || "An error occurred during login.");
    }
  };

  return (
    <AppShell title="Doctor Login" nav={[]}>
      <AutoSeed />
      <div className="mx-auto max-w-lg pt-8">
        <div className="rounded-3xl bg-card p-8 shadow-premium ring-1 ring-foreground/5">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Doctor Login
              </h1>
              <p className="text-sm text-foreground/50">
                Access your patient portal
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-foreground/50">
                Username or Email
              </span>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 rounded-2xl border border-foreground/10 bg-background pl-11 pr-4 text-sm text-foreground transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="dr_smith or doctor@clinic.com"
                />
              </div>
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-foreground/50">
                Password
              </span>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="w-full h-12 rounded-2xl border border-foreground/10 bg-background pl-11 pr-4 text-sm text-foreground transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="••••••••"
                />
              </div>
            </label>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={login}
              className="h-12 rounded-2xl bg-primary text-sm font-bold text-white shadow-premium transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-100"
            >
              Sign In to Portal
            </button>

            <a
              href="/hq-command/login"
              className="text-center text-sm font-semibold text-foreground/50 hover:text-primary transition-colors"
            >
              Admin login →
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
