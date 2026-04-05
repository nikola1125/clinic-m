"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useClinicStore } from "@/store/clinicStore";
import { Lock, Mail, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const setSession = useClinicStore((s) => s.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    setError(null);
    try {
      const { api } = await import("@/lib/api");
      const result = await api.login({ email, password });
      
      if (result.role !== "admin") {
        throw new Error("Invalid credentials or not an admin.");
      }
      
      sessionStorage.setItem("access_token", result.access_token);
      setSession({ role: "admin" });
      
      window.location.href = "/hq-command";
    } catch (err: any) {
      setError(err.message || "An error occurred during login.");
    }
  };

  return (
    <AppShell title="HQ Login" nav={[]}>
      <div className="mx-auto max-w-lg pt-12">
        <div className="glass rounded-4xl p-8 lg:p-10 border-2 border-primary/20 shadow-premium relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground text-white mb-6 shadow-lg">
              <ShieldAlert className="h-8 w-8" />
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              HQ Command Login
            </h1>
            <p className="mt-2 text-sm text-foreground/60 max-w-xs">
              System administration access. Only authorized personnel may enter.
            </p>

            <div className="mt-8 w-full flex flex-col gap-5 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-foreground/50 mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/30" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border-none bg-white py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary shadow-sm outline-none transition-all"
                    placeholder="admin@clinic.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-foreground/50 mb-2">
                  Passcode
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/30" />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="w-full rounded-2xl border-none bg-white py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary shadow-sm outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 text-center animate-in fade-in slide-in-from-bottom-2">
                  {error}
                </div>
              ) : null}

              <button
                onClick={login}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-4 text-sm font-bold text-white shadow-premium transition-all hover:bg-foreground/90 hover:scale-[1.02] active:scale-100"
              >
                Authenticate
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
