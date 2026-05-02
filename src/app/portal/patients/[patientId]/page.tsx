"use client";

import { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { AutoSeed, RequireRole, DataLoader } from "@/components/RequireRole";
import { useClinicStore } from "@/store/clinicStore";
import { api } from "@/lib/api";
import {
  ArrowLeft, UserCircle, Mail, Phone, FileText,
  Calendar, UserPlus, UserMinus, Loader2,
} from "lucide-react";

export default function DoctorPatientDetailsPage({
  params,
}: {
  params: { patientId: string };
}) {
  const patients = useClinicStore((s) => s.patients);
  const refreshPatients = useClinicStore((s) => s.refreshPatients);

  const patient = useMemo(
    () => patients.find((x) => x.id === params.patientId) ?? null,
    [patients, params.patientId]
  );

  const [linking, setLinking] = useState(false);
  const [isLinked, setIsLinked] = useState(true);

  const handleLink = useCallback(async () => {
    setLinking(true);
    try {
      api.setRole("doctor");
      await api.linkPatient(params.patientId);
      setIsLinked(true);
      await refreshPatients("doctor");
    } catch (e) {
      console.error("Failed to link patient", e);
    } finally {
      setLinking(false);
    }
  }, [params.patientId, refreshPatients]);

  const handleUnlink = useCallback(async () => {
    setLinking(true);
    try {
      api.setRole("doctor");
      await api.unlinkPatient(params.patientId);
      setIsLinked(false);
      await refreshPatients("doctor");
    } catch (e) {
      console.error("Failed to unlink patient", e);
    } finally {
      setLinking(false);
    }
  }, [params.patientId, refreshPatients]);

  return (
    <AppShell
      title="Doctor Portal"
      nav={[
        { label: "Dashboard", href: "/portal" },
        { label: "Appointments", href: "/portal/appointments" },
        { label: "Patients", href: "/portal/patients" },
      ]}
    >
      <AutoSeed />
      <RequireRole role="doctor">
        <DataLoader role="doctor" />
        {!patient ? (
          <div className="glass rounded-4xl p-12 text-center shadow-premium">
            <UserCircle className="h-10 w-10 text-foreground/15 mx-auto mb-4" />
            <div className="text-lg font-bold text-foreground/40">Patient not found</div>
            <p className="mt-2 text-sm text-foreground/30 max-w-sm mx-auto">
              This patient may not be in your care yet. You can add them from the appointments page.
            </p>
            <Link href="/portal/patients"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary/90">
              <ArrowLeft className="h-4 w-4" /> Back to Patients
            </Link>
          </div>
        ) : (
          <motion.div className="grid gap-6"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {/* Patient Header */}
            <div className="glass rounded-4xl p-6 lg:p-8 shadow-premium border-2 border-foreground/5 relative overflow-hidden">
              <Link href="/portal/patients"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground/40 hover:text-primary transition-colors mb-4">
                <ArrowLeft className="h-3 w-3" /> Back to directory
              </Link>

              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary text-2xl font-bold shrink-0">
                  {patient.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">{patient.fullName}</h1>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1.5 text-sm text-foreground/50">
                      <Mail className="h-3.5 w-3.5" /> {patient.email}
                    </span>
                    {patient.phone && (
                      <span className="inline-flex items-center gap-1.5 text-sm text-foreground/50">
                        <Phone className="h-3.5 w-3.5" /> {patient.phone}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-sm text-foreground/50">
                      <Calendar className="h-3.5 w-3.5" /> Since {new Date(patient.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/portal/patients/${params.patientId}/medical-profile`}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-colors">
                  <FileText className="h-4 w-4" /> Medical Profile
                </Link>

                {isLinked ? (
                  <button onClick={handleUnlink} disabled={linking}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 px-5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50">
                    {linking ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserMinus className="h-4 w-4" />}
                    Remove from my patients
                  </button>
                ) : (
                  <button onClick={handleLink} disabled={linking}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-bold text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50">
                    {linking ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                    Add to my patients
                  </button>
                )}
              </div>

              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
            </div>

          </motion.div>
        )}
      </RequireRole>
    </AppShell>
  );
}
