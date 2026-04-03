"use client";

import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { RequireRole, DataLoader } from "@/components/RequireRole";
import { useClinicStore } from "@/store/clinicStore";
import { Users, DollarSign, LayoutDashboard, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AdminHomePage() {
  const setSession = useClinicStore((s) => s.setSession);
  const session = useClinicStore((s) => s.session);

  useEffect(() => {
    if (!session) setSession({ role: "admin" });
  }, [session, setSession]);

  return (
    <AppShell
      title="Admin Dashboard"
      nav={[
        { label: "Overview", href: "/admin" },
        { label: "Doctors", href: "/admin/doctors" },
        { label: "Revenue", href: "/admin/revenue" },
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
              
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/admin/doctors"
                  className="group flex flex-col gap-2 rounded-2xl border border-foreground/5 bg-white p-6 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Users className="h-6 w-6" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-foreground/30 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-foreground">Manage Doctors</h3>
                  <p className="text-sm text-foreground/50">Add, edit, or remove medical staff and consultation pricing.</p>
                </Link>
                
                <Link
                  href="/admin/revenue"
                  className="group flex flex-col gap-2 rounded-2xl border border-foreground/5 bg-white p-6 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-foreground/30 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-foreground">View Revenue</h3>
                  <p className="text-sm text-foreground/50">Track consultation earnings and view clinic financial performance.</p>
                </Link>
              </div>
            </div>
            
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          </div>
        </div>
      </RequireRole>
    </AppShell>
  );
}
