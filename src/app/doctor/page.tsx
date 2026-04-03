"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { RequireRole, DataLoader } from "@/components/RequireRole";
import { formatDateTime } from "@/lib/format";
import { useClinicStore } from "@/store/clinicStore";
import { UserCircle, Calendar, CalendarCheck, Clock, Users, ArrowRight, Video, CheckCircle2, XCircle } from "lucide-react";

export default function DoctorHomePage() {
  const session = useClinicStore((s) => s.session);
  const doctors = useClinicStore((s) => s.doctors);
  const appointments = useClinicStore((s) => s.appointments);
  const patients = useClinicStore((s) => s.patients);

  const setAppointmentStatus = useClinicStore((s) => s.setAppointmentStatus);

  const doctorId = session?.role === "doctor" ? session.doctorId : null;
  const doctor = doctors.find((d) => d.id === doctorId) ?? null;

  const myAppointments = appointments
    .filter((a) => a.doctorId === doctorId)
    .sort((a, b) => (a.scheduledAt < b.scheduledAt ? -1 : 1));

  const pending = myAppointments.filter((a) => a.status === "pending");
  const upcoming = myAppointments.filter((a) => a.status === "accepted");

  const myPatients = patients.filter((p) => p.doctorId === doctorId);

  return (
    <AppShell
      title="Doctor Portal"
      nav={[
        { label: "Dashboard", href: "/doctor" },
        { label: "Appointments", href: "/doctor/appointments" },
        { label: "Patients", href: "/doctor/patients" },
      ]}
    >
      <RequireRole role="doctor">
        <DataLoader role="doctor" />
        <div className="grid gap-6">
          <div className="glass rounded-4xl p-8 lg:p-12 shadow-premium relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <UserCircle className="h-6 w-6" />
                <h2 className="text-xl font-bold">Welcome Back</h2>
              </div>
              <div className="mt-2 text-4xl font-bold tracking-tight text-foreground">
                Dr. {doctor ? doctor.name : "..."}
              </div>
              <div className="mt-2 text-lg text-foreground/60 font-medium">
                {doctor ? doctor.specialty : "Specialist"}
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-4 rounded-3xl border-2 border-amber-500/10 bg-amber-50/50 p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-700/60">
                      Pending
                    </div>
                    <div className="text-3xl font-bold text-amber-700">
                      {pending.length}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 rounded-3xl border-2 border-emerald-500/10 bg-emerald-50/50 p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <CalendarCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-700/60">
                      Upcoming
                    </div>
                    <div className="text-3xl font-bold text-emerald-700">
                      {upcoming.length}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 rounded-3xl border-2 border-primary/10 bg-primary/5 p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-primary/60">
                      Patients
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      {myPatients.length}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/doctor/appointments"
                  className="flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-sm font-bold text-white shadow-premium transition-all hover:bg-primary/90 hover:scale-105 active:scale-100"
                >
                  <Calendar className="h-5 w-5" />
                  View Schedule
                </Link>
                <Link
                  href="/doctor/patients"
                  className="flex items-center gap-2 rounded-2xl border border-foreground/10 bg-white px-8 py-4 text-sm font-bold text-foreground transition-all hover:bg-foreground/5"
                >
                  <Users className="h-5 w-5" />
                  Patient Directory
                </Link>
              </div>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Pending Requests */}
            <div className="glass rounded-4xl p-8 border-2 border-foreground/5 shadow-premium">
              <div className="flex items-center justify-between mb-6">
                <div className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" /> Pending Requests
                </div>
                {pending.length > 0 && (
                  <Link href="/doctor/appointments" className="text-sm font-bold text-primary hover:underline">
                    View All
                  </Link>
                )}
              </div>
              
              <div className="grid gap-4">
                {pending.length === 0 ? (
                  <div className="rounded-2xl border border-foreground/5 bg-white/50 p-8 text-center text-sm text-foreground/50">
                    No pending appointment requests.
                  </div>
                ) : (
                  pending.slice(0, 4).map((a) => (
                    <div
                      key={a.id}
                      className="rounded-2xl border border-foreground/5 bg-white p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-primary/20"
                    >
                      <div>
                        <div className="text-sm font-bold text-foreground">
                          {formatDateTime(a.scheduledAt)}
                        </div>
                        <div className="mt-1 text-sm font-medium text-primary bg-primary/10 inline-block px-2 py-0.5 rounded-full">
                          Consultation: ${a.price}
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto shrink-0">
                        <button
                          onClick={() => setAppointmentStatus(a.id, "accepted")}
                          className="flex flex-1 sm:flex-none items-center justify-center gap-1 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-100 transition-colors"
                        >
                          <CheckCircle2 className="h-4 w-4" /> Accept
                        </button>
                        <button
                          onClick={() => setAppointmentStatus(a.id, "rejected")}
                          className="flex flex-1 sm:flex-none items-center justify-center gap-1 rounded-xl border border-red-100 bg-white px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <XCircle className="h-4 w-4" /> Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="glass rounded-4xl p-8 border-2 border-foreground/5 shadow-premium">
              <div className="flex items-center justify-between mb-6">
                <div className="text-lg font-bold text-foreground flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-emerald-500" /> Upcoming Meetings
                </div>
                 {upcoming.length > 0 && (
                  <Link href="/doctor/appointments" className="text-sm font-bold text-primary hover:underline">
                    View All
                  </Link>
                )}
              </div>
              
              <div className="grid gap-4">
                {upcoming.length === 0 ? (
                  <div className="rounded-2xl border border-foreground/5 bg-white/50 p-8 text-center text-sm text-foreground/50">
                    No upcoming meetings scheduled.
                  </div>
                ) : (
                  upcoming.slice(0, 4).map((a) => (
                    <Link
                      key={a.id}
                      href={`/meet/${a.id}?role=doctor`}
                      className="group block rounded-2xl border border-foreground/5 bg-white p-5 transition-all hover:border-primary/30 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100 transition-colors">
                            <Video className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-foreground">
                              {formatDateTime(a.scheduledAt)}
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-xs font-bold text-primary">
                              Join Meeting <ArrowRight className="h-3 w-3" />
                            </div>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-foreground">
                          ${a.price}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </RequireRole>
    </AppShell>
  );
}
