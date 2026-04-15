"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useClinicStore } from "@/store/clinicStore";
import { Calendar, Clock, User, Video, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function PatientDashboard() {
  const router = useRouter();
  const session = useClinicStore((s) => s.session);
  const patients = useClinicStore((s) => s.patients);
  const appointments = useClinicStore((s) => s.appointments);
  const doctors = useClinicStore((s) => s.doctors);
  const refreshPatients = useClinicStore((s) => s.refreshPatients);
  const refreshAppointments = useClinicStore((s) => s.refreshAppointments);
  const refreshDoctors = useClinicStore((s) => s.refreshDoctors);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session || session.role !== "patient") {
      router.replace("/login");
      return;
    }
    
    Promise.all([
      refreshPatients(),
      refreshAppointments(),
      refreshDoctors()
    ]).finally(() => setLoading(false));
  }, [session, router, refreshPatients, refreshAppointments, refreshDoctors]);

  if (!session || session.role !== "patient") return null;
  
  const patient = patients.find(p => p.id === session.patientId);
  const myAppointments = appointments
    .filter(a => a.patientId === session.patientId)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
    
  const upcoming = myAppointments.filter(a => new Date(a.scheduledAt) >= new Date() && a.status !== "completed" && a.status !== "rejected");
  const past = myAppointments.filter(a => new Date(a.scheduledAt) < new Date() || a.status === "completed" || a.status === "rejected");

  const getDoctor = (doctorId: string) => doctors.find(d => d.id === doctorId);

  return (
    <AppShell
      title="My Health"
      nav={[
        { label: "Dashboard", href: "/patient/dashboard" },
        { label: "Book Appointment", href: "/book" },
      ]}
    >
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="glass rounded-4xl p-8 shadow-premium relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Welcome back, {patient?.fullName?.split(" ")[0] || "Patient"}
              </h1>
              <p className="mt-2 text-foreground">
                Manage your appointments and stay on top of your health.
              </p>
            </div>
            <Link 
              href="/book"
              className="shrink-0 flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-premium transition-all hover:bg-primary/90 hover:scale-105 active:scale-100"
            >
              <Calendar className="h-4 w-4" />
              Book New Visit
            </Link>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px]" />
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming Appointments */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Upcoming Consultations
              </h2>
              
              {upcoming.length === 0 ? (
                <div className="glass rounded-3xl p-10 text-center shadow-premium">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/5 mb-4">
                    <Calendar className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">No upcoming visits</h3>
                  <p className="mt-2 text-sm text-foreground max-w-sm mx-auto">
                    You're all caught up! Book a new appointment if you need to see a doctor.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcoming.map((appt, i) => {
                    const doc = getDoctor(appt.doctorId);
                    const dt = new Date(appt.scheduledAt);
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={appt.id} 
                        className="glass rounded-3xl p-6 shadow-premium transition-transform hover:scale-[1.01]"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                              <span className="text-lg font-bold">{format(dt, "d")}</span>
                            </div>
                            <div>
                              <div className="font-bold text-lg text-foreground">{doc?.name || "Doctor"}</div>
                              <div className="text-sm text-foreground">{doc?.specialty || "Specialist"}</div>
                              <div className="mt-1 flex items-center gap-2 text-xs font-medium text-foreground">
                                <Clock className="h-3 w-3" />
                                {format(dt, "MMMM d, yyyy 'at' h:mm a")}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex w-full sm:w-auto flex-col gap-2">
                            <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider
                              ${appt.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}
                            `}>
                              {appt.status}
                            </span>
                            {appt.status === "accepted" && (
                              <Link 
                                href={`/meet/${appt.id}`}
                                className="flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
                              >
                                <Video className="h-3 w-3" />
                                Join Call
                              </Link>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
              
              {/* Past Appointments - Simple List */}
              {past.length > 0 && (
                <div className="mt-12 space-y-4">
                  <h2 className="text-xl font-bold text-foreground">Past History</h2>
                  {past.slice(0, 3).map(appt => {
                    const doc = getDoctor(appt.doctorId);
                    return (
                      <div key={appt.id} className="flex items-center justify-between py-4 border-b border-foreground/5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-foreground/5 border border-foreground/10">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{doc?.name}</div>
                            <div className="text-xs text-foreground">{format(new Date(appt.scheduledAt), "MMMM d, yyyy")}</div>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-foreground capitalize">{appt.status}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Profile Sidebar */}
            <div className="space-y-6">
              <div className="glass rounded-3xl p-6 shadow-premium">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Your Profile
                </h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="block text-foreground text-xs mb-1">Full Name</span>
                    <span className="font-medium">{patient?.fullName}</span>
                  </div>
                  <div>
                    <span className="block text-foreground text-xs mb-1">Email Address</span>
                    <span className="font-medium">{patient?.email}</span>
                  </div>
                  <div>
                    <span className="block text-foreground text-xs mb-1">Phone Number</span>
                    <span className="font-medium">{patient?.phone || "Not set"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
