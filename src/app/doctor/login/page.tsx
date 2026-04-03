"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AutoSeed } from "@/components/RequireRole";
import { DOCTOR_PASSWORD, useClinicStore } from "@/store/clinicStore";

export default function DoctorLoginPage() {
  const doctors = useClinicStore((s) => s.doctors);
  const setSession = useClinicStore((s) => s.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const matching = useMemo(
    () => doctors.find((d) => d.email.toLowerCase() === email.toLowerCase()) ?? null,
    [doctors, email]
  );

  const login = () => {
    setError(null);
    if (!matching) {
      setError("No doctor with that email.");
      return;
    }
    if (password !== DOCTOR_PASSWORD) {
      setError("Wrong password.");
      return;
    }
    setSession({ role: "doctor", doctorId: matching.id });
    window.location.href = "/doctor";
  };

  return (
    <AppShell title="Doctor Login" nav={[]}> 
      <AutoSeed />
      <div className="mx-auto max-w-lg">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8">
          <div className="text-2xl font-semibold tracking-tight text-zinc-900">
            Doctor login
          </div>
          <div className="mt-2 text-sm text-zinc-600">
            Use your doctor email created in Admin. Password is <code>doctor123</code>.
          </div>

          <div className="mt-6 grid gap-4">
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-zinc-700">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-xl border border-zinc-200 px-3 text-sm"
                placeholder="doctor@clinic.com"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-zinc-700">Password</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="h-10 rounded-xl border border-zinc-200 px-3 text-sm"
                placeholder="doctor123"
              />
            </label>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              onClick={login}
              className="h-11 rounded-xl bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Login
            </button>

            <a
              href="/admin/doctors"
              className="text-center text-sm font-semibold text-zinc-700 hover:text-zinc-900"
            >
              Go create/edit doctors
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
