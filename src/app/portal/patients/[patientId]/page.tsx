"use client";

import { use, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { AutoSeed, RequireRole, DataLoader } from "@/components/RequireRole";
import { useClinicStore } from "@/store/clinicStore";
import { api } from "@/lib/api";
import {
  ArrowLeft, UserCircle, Mail, Phone, FileText,
  Calendar, UserPlus, UserMinus, Loader2, Clock,
  CheckCircle2, XCircle, Video, CheckCheck,
} from "lucide-react";
import { format } from "date-fns";

export default function DoctorPatientDetailsPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);
  const patients = useClinicStore((s) => s.patients);
  const appointments = useClinicStore((s) => s.appointments);
  const refreshPatients = useClinicStore((s) => s.refreshPatients);

  const patient = useMemo(
    () => patients.find((x) => x.id === patientId) ?? null,
    [patients, patientId]
  );

  const [linking, setLinking] = useState(false);
  const [isLinked, setIsLinked] = useState(true);

  const handleLink = useCallback(async () => {
    setLinking(true);
    try {
      api.setRole("doctor");
      await api.linkPatient(patientId);
      setIsLinked(true);
      await refreshPatients("doctor");
    } catch (e) {
      console.error("Failed to link patient", e);
    } finally {
      setLinking(false);
    }
  }, [patientId, refreshPatients]);

  const handleUnlink = useCallback(async () => {
    setLinking(true);
    try {
      api.setRole("doctor");
      await api.unlinkPatient(patientId);
      setIsLinked(false);
      await refreshPatients("doctor");
    } catch (e) {
      console.error("Failed to unlink patient", e);
    } finally {
      setLinking(false);
    }
  }, [patientId, refreshPatients]);

  return (
    <AppShell
      title="Doctor Portal"
      nav={[
        { label: "Dashboard", href: "/portal" },
        { label: "Appointments", href: "/portal/appointments" },
        { label: "Patients", href: "/portal/patients" },
        { label: "Schedule", href: "/portal/schedule" },
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
                <Link href={`/portal/patients/${patientId}/medical-profile`}
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

            {/* Patient Timeline */}
            <div className="glass rounded-4xl p-4 sm:p-6 lg:p-8 shadow-premium">
              <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2 mb-4 sm:mb-5">
                <Clock className="h-5 w-5 text-primary" /> Appointment Timeline
              </h2>
              {(() => {
                const patAppts = appointments
                  .filter(a => a.patientId === patientId)
                  .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
                if (patAppts.length === 0) return (
                  <div className="rounded-2xl border border-dashed border-foreground/10 p-10 text-center">
                    <Calendar className="h-8 w-8 text-foreground/20 mx-auto mb-3" />
                    <div className="text-sm font-bold text-foreground/40">No appointments with this patient yet</div>
                  </div>
                );
                return (
                  <div className="relative">
                    <div className="absolute left-4 sm:left-5 top-0 bottom-0 w-px bg-foreground/10" />
                    <div className="space-y-3 sm:space-y-4">
                      {patAppts.map(a => {
                        const statusCfg: Record<string, { icon: typeof Clock; bg: string; text: string }> = {
                          pending:   { icon: Clock, bg: "bg-amber-100", text: "text-amber-600" },
                          accepted:  { icon: CheckCircle2, bg: "bg-emerald-100", text: "text-emerald-600" },
                          completed: { icon: CheckCheck, bg: "bg-blue-100", text: "text-blue-600" },
                          rejected:  { icon: XCircle, bg: "bg-red-100", text: "text-red-600" },
                        };
                        const cfg = statusCfg[a.status] ?? statusCfg.pending;
                        const Icon = cfg.icon;
                        return (
                          <div key={a.id} className="relative pl-10 sm:pl-12">
                            <div className={`absolute left-1.5 sm:left-2.5 top-3 h-5 w-5 rounded-full ${cfg.bg} ${cfg.text} flex items-center justify-center z-10`}>
                              <Icon className="h-3 w-3" />
                            </div>
                            <div className="rounded-xl sm:rounded-2xl border border-foreground/5 bg-white p-3 sm:p-4 hover:border-primary/10 transition-colors">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
                                <div className="text-xs sm:text-sm font-bold text-foreground">
                                  {format(new Date(a.scheduledAt), "MMM d, yyyy")}
                                  <span className="text-foreground/40 font-normal"> at </span>
                                  {format(new Date(a.scheduledAt), "h:mm a")}
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase w-fit ${cfg.bg} ${cfg.text}`}>
                                  {a.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mt-1.5 sm:mt-2 text-xs text-foreground/50">
                                <span>${a.price}</span>
                                {a.status === "accepted" && (
                                  <Link href={`/meet/${a.id}?role=doctor`} className="flex items-center gap-1 text-emerald-600 font-bold hover:underline">
                                    <Video className="h-3 w-3" /> Join meeting
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

          </motion.div>
        )}
      </RequireRole>
    </AppShell>
  );
}
