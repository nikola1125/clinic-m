"use client";

import { useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { AutoSeed, RequireRole } from "@/components/RequireRole";
import { formatDateTime } from "@/lib/format";
import { useClinicStore, type AppointmentStatus } from "@/store/clinicStore";
import { Calendar, UserCircle, Activity, Video, CheckCircle2, XCircle, Clock, CheckCheck } from "lucide-react";
import Link from "next/link";

function StatusPill({ status }: { status: AppointmentStatus }) {
  const styles: Record<AppointmentStatus, string> = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    accepted: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rejected: "border-red-200 bg-red-50 text-red-700",
    completed: "border-blue-200 bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default function DoctorAppointmentsPage() {
  const session = useClinicStore((s) => s.session);
  const doctors = useClinicStore((s) => s.doctors);
  const patients = useClinicStore((s) => s.patients);
  const appointments = useClinicStore((s) => s.appointments);
  const setAppointmentStatus = useClinicStore((s) => s.setAppointmentStatus);

  const doctorId = session?.role === "doctor" ? session.doctorId : null;

  const myAppointments = useMemo(() => {
    return appointments
      .filter((a) => a.doctorId === doctorId)
      .sort((a, b) => (a.scheduledAt < b.scheduledAt ? -1 : 1));
  }, [appointments, doctorId]);

  const doctor = doctors.find((d) => d.id === doctorId) ?? null;

  return (
    <AppShell
      title="Doctor Portal"
      nav={[
        { label: "Dashboard", href: "/doctor" },
        { label: "Appointments", href: "/doctor/appointments" },
        { label: "Patients", href: "/doctor/patients" },
      ]}
    >
      <AutoSeed />
      <RequireRole role="doctor">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                Schedule & Appointments
              </div>
              <div className="mt-1 text-sm text-foreground/50">
                Manage consultation requests, join active meetings, and review patient history.
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            {myAppointments.length === 0 ? (
              <div className="glass rounded-4xl p-12 text-center shadow-premium bg-white/50">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-foreground/5 mb-4 text-primary opacity-50">
                  <Calendar className="h-8 w-8" />
                </div>
                <div className="text-lg font-bold text-foreground">No appointments arranged yet</div>
                <div className="mt-2 text-sm text-foreground/60 max-w-sm mx-auto">
                  Patients have not scheduled any consultations with you yet. Check back later or make sure your availability is set.
                </div>
              </div>
            ) : (
              myAppointments.map((a) => {
                const patient = patients.find((p) => p.id === a.patientId) ?? null;
                const consult = doctor?.consults.find((c) => c.id === a.consultId) ?? null;

                return (
                  <div
                    key={a.id}
                    className="glass rounded-4xl p-6 sm:p-8 shadow-sm transition-all hover:shadow-md border-2 border-foreground/5 group"
                  >
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center gap-2 text-lg font-bold text-foreground">
                            <Clock className="w-5 h-5 text-primary" />
                            {formatDateTime(a.scheduledAt)}
                          </div>
                          <StatusPill status={a.status} />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3 rounded-2xl bg-white p-4 border border-foreground/5">
                            <UserCircle className="w-8 h-8 text-foreground/30 mt-1" />
                            <div>
                              <div className="text-xs font-bold uppercase tracking-wider text-foreground/40 mb-1">Patient</div>
                              <div className="text-sm font-bold text-foreground">
                                {patient ? patient.fullName : a.patientId}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 rounded-2xl bg-white p-4 border border-foreground/5">
                            <Activity className="w-8 h-8 text-primary/30 mt-1" />
                            <div>
                              <div className="text-xs font-bold uppercase tracking-wider text-foreground/40 mb-1">Consultation</div>
                              <div className="text-sm font-bold text-foreground">
                                {consult ? consult.title : "General Visit"}
                              </div>
                              <div className="text-sm font-bold text-primary mt-1">
                                ${a.price}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col justify-center gap-3 pl-0 lg:pl-6 lg:border-l border-foreground/5 shrink-0">
                        {a.status === "pending" && (
                          <>
                            <button
                              onClick={() => setAppointmentStatus(a.id, "accepted")}
                              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-6 py-3 text-sm font-bold text-emerald-600 transition-colors hover:bg-emerald-100 w-full"
                            >
                              <CheckCircle2 className="h-4 w-4" /> Accept Request
                            </button>
                            <button
                              onClick={() => setAppointmentStatus(a.id, "rejected")}
                              className="flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-6 py-3 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 w-full"
                            >
                              <XCircle className="h-4 w-4" /> Reject Request
                            </button>
                          </>
                        )}

                        {a.status === "accepted" && (
                          <>
                            <Link
                              href={`/meet/${a.id}?role=doctor`}
                              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-100 shadow-md shadow-emerald-500/20 w-full"
                            >
                              <Video className="h-4 w-4" /> Join Video Call
                            </Link>
                            <button
                              onClick={() => setAppointmentStatus(a.id, "completed")}
                              className="flex items-center justify-center gap-2 rounded-xl border border-foreground/10 bg-white px-6 py-3 text-sm font-bold text-foreground transition-colors hover:bg-foreground/5 w-full"
                            >
                              <CheckCheck className="h-4 w-4" /> Mark Completed
                            </button>
                          </>
                        )}

                        {patient && (
                          <Link
                            href={`/doctor/patients/${patient.id}`}
                            className="flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-6 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/10 w-full mt-auto"
                          >
                            <UserCircle className="h-4 w-4" /> View Patient File
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </RequireRole>
    </AppShell>
  );
}
