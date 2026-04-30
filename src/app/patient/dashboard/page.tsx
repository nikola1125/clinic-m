"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useClinicStore } from "@/store/clinicStore";
import { 
  Calendar, Clock, User, Video, FileText, Plus, Pill, 
  HeartPulse, ChevronRight, Phone, Mail, Activity, 
  ShieldCheck, Sparkles, Stethoscope, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const staggerContainer = { show: { transition: { staggerChildren: 0.08 } } };

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getApptTimeLabel(dateStr: string) {
  const d = new Date(dateStr);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return format(d, "EEEE, MMM d");
}

export default function PatientDashboard() {
  const router = useRouter();
  const hasHydrated = useClinicStore((s) => s._hasHydrated);
  const setHasHydrated = useClinicStore((s) => s.setHasHydrated);
  const session = useClinicStore((s) => s.patientSession);
  const patients = useClinicStore((s) => s.patients);
  const appointments = useClinicStore((s) => s.appointments);
  const doctors = useClinicStore((s) => s.doctors);
  const refreshPatients = useClinicStore((s) => s.refreshPatients);
  const refreshAppointments = useClinicStore((s) => s.refreshAppointments);
  const refreshDoctors = useClinicStore((s) => s.refreshDoctors);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    if (!hasHydrated) {
      const t = setTimeout(() => setHasHydrated(true), 50);
      return () => clearTimeout(t);
    }
  }, [hasHydrated, setHasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!session) {
      router.replace("/login");
      return;
    }
    Promise.all([
      refreshPatients("patient"),
      refreshAppointments("patient"),
      refreshDoctors()
    ]).finally(() => setLoading(false));
  }, [hasHydrated, session, router, refreshPatients, refreshAppointments, refreshDoctors]);

  if (!hasHydrated || !session) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
    </div>
  );

  const patient = patients.find(p => p.id === session.patientId);
  const myAppts = useMemo(() => 
    appointments
      .filter(a => a.patientId === session.patientId)
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()),
    [appointments, session.patientId]
  );

  const upcoming = myAppts.filter(a => !isPast(new Date(a.scheduledAt)) && a.status !== "rejected");
  const past = myAppts.filter(a => isPast(new Date(a.scheduledAt)) || a.status === "completed" || a.status === "rejected");
  const nextAppt = upcoming[0];
  const getDoctor = (id: string) => doctors.find(d => d.id === id);

  const quickActions = [
    { icon: Plus, label: "Book Visit", href: "/book", color: "bg-primary text-white" },
    { icon: Video, label: "Join Call", href: nextAppt ? `/meet/${nextAppt.id}?role=patient` : "#", color: nextAppt?.status === "accepted" ? "bg-emerald-500 text-white" : "bg-foreground/10 text-foreground/40", disabled: !nextAppt || nextAppt.status !== "accepted" },
    { icon: FileText, label: "Records", href: "#", color: "bg-amber-100 text-amber-700" },
    { icon: Pill, label: "Prescriptions", href: "#", color: "bg-rose-100 text-rose-700" },
  ];

  const healthStats = [
    { label: "Total Visits", value: myAppts.length, icon: Activity, color: "text-blue-600" },
    { label: "Upcoming", value: upcoming.length, icon: Calendar, color: "text-emerald-600" },
    { label: "My Doctors", value: new Set(myAppts.map(a => a.doctorId)).size, icon: Stethoscope, color: "text-purple-600" },
  ];

  return (
    <AppShell title="My Health" nav={[{ label: "Dashboard", href: "/patient/dashboard" }, { label: "Book Appointment", href: "/book" }]}>
      <motion.div className="max-w-6xl mx-auto pb-12" variants={staggerContainer} initial="hidden" animate="show">
        
        {/* ── Hero Welcome ── */}
        <motion.div variants={fadeUp} className="glass rounded-3xl p-8 lg:p-10 mb-8 shadow-premium relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-bold text-primary">{getGreeting()}</span>
                <span className="text-foreground/30">|</span>
                <span className="text-sm text-foreground/60">{format(new Date(), "EEEE, MMMM d, yyyy")}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                {patient?.fullName || "Welcome back"}
              </h1>
              <p className="mt-2 text-foreground/60 max-w-lg">
                Track your appointments, manage prescriptions, and stay connected with your healthcare team.
              </p>
            </div>
            
            {nextAppt && (
              <div className="lg:w-80 shrink-0">
                <div className="rounded-2xl bg-primary text-white p-5 shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="h-4 w-4 opacity-80" />
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">Next Appointment</span>
                  </div>
                  <div className="text-2xl font-bold">{getApptTimeLabel(nextAppt.scheduledAt)}</div>
                  <div className="text-sm opacity-90">{format(new Date(nextAppt.scheduledAt), "h:mm a")}</div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                      {getDoctor(nextAppt.doctorId)?.name?.charAt(0) || "D"}
                    </div>
                    <div className="text-sm font-medium">{getDoctor(nextAppt.doctorId)?.name || "Doctor"}</div>
                  </div>
                  {nextAppt.status === "accepted" ? (
                    <Link href={`/meet/${nextAppt.id}?role=patient`} className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-white/20 py-2.5 text-sm font-bold hover:bg-white/30 transition-colors">
                      <Video className="h-4 w-4" /> Join Now
                    </Link>
                  ) : (
                    <div className="mt-4 rounded-xl bg-amber-400/20 py-2.5 text-sm font-bold text-center text-amber-100">
                      Awaiting confirmation
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
        </motion.div>

        {loading ? (
          <div className="flex justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" /></div>
        ) : (
          <>
            {/* ── Quick Actions & Stats ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <motion.div variants={fadeUp} className="lg:col-span-2">
                <h3 className="text-sm font-bold text-foreground/50 uppercase tracking-wider mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {quickActions.map((action) => (
                    <Link key={action.label} href={action.href} className={`group rounded-2xl p-4 transition-all hover:scale-[1.02] ${action.disabled ? "pointer-events-none opacity-60" : ""}`}>
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-3 ${action.color}`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{action.label}</div>
                    </Link>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <h3 className="text-sm font-bold text-foreground/50 uppercase tracking-wider mb-4">Health Overview</h3>
                <div className="space-y-3">
                  {healthStats.map(stat => (
                    <div key={stat.label} className="flex items-center justify-between rounded-2xl bg-white border border-foreground/5 p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-foreground/5 flex items-center justify-center">
                          <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                        <span className="text-sm font-medium text-foreground/70">{stat.label}</span>
                      </div>
                      <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ── Appointments Timeline ── */}
            <motion.div variants={fadeUp} className="glass rounded-3xl p-6 lg:p-8 shadow-premium">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold text-foreground">Appointments</h2>
                </div>
                <div className="flex gap-1 p-1 rounded-xl bg-foreground/5">
                  {(["upcoming", "past"] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === tab ? "bg-white shadow-sm text-foreground" : "text-foreground/50 hover:text-foreground"}`}>
                      {tab} ({tab === "upcoming" ? upcoming.length : past.length})
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  {(activeTab === "upcoming" ? upcoming : past.slice().reverse()).length === 0 ? (
                    <div className="text-center py-12 rounded-2xl border border-dashed border-foreground/10">
                      <Calendar className="h-10 w-10 text-foreground/20 mx-auto mb-3" />
                      <p className="text-sm font-medium text-foreground/40">No {activeTab} appointments</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(activeTab === "upcoming" ? upcoming : past.slice().reverse()).slice(0, 5).map((appt, i) => {
                        const doc = getDoctor(appt.doctorId);
                        const isLive = activeTab === "upcoming" && appt.status === "accepted";
                        return (
                          <motion.div key={appt.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="group flex items-center gap-4 rounded-2xl border border-foreground/5 bg-white p-4 hover:border-primary/20 hover:shadow-sm transition-all">
                            <div className={`h-14 w-14 shrink-0 rounded-2xl flex flex-col items-center justify-center ${isLive ? "bg-emerald-50 text-emerald-600" : "bg-foreground/5 text-foreground/60"}`}>
                              <span className="text-[10px] font-bold uppercase">{format(new Date(appt.scheduledAt), "MMM")}</span>
                              <span className="text-xl font-bold">{format(new Date(appt.scheduledAt), "d")}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-foreground truncate">{doc?.name || "Doctor"}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${appt.status === "accepted" ? "bg-emerald-100 text-emerald-700" : appt.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>{appt.status}</span>
                              </div>
                              <div className="text-xs text-foreground/50">{doc?.specialty} • {format(new Date(appt.scheduledAt), "h:mm a")}</div>
                            </div>
                            {isLive ? (
                              <Link href={`/meet/${appt.id}?role=patient`} className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-600 transition-colors">
                                <Video className="h-3.5 w-3.5" /> Join
                              </Link>
                            ) : (
                              <span className="text-xs font-bold text-foreground/30">${appt.price}</span>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* ── My Doctors & Profile ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <motion.div variants={fadeUp} className="lg:col-span-2">
                <h3 className="text-sm font-bold text-foreground/50 uppercase tracking-wider mb-4">My Doctors</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {Array.from(new Set(myAppts.map(a => a.doctorId))).map((docId, i) => {
                    const doc = getDoctor(docId);
                    if (!doc) return null;
                    const apptCount = myAppts.filter(a => a.doctorId === docId).length;
                    return (
                      <motion.div key={docId} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-4 rounded-2xl bg-white border border-foreground/5 p-4 hover:border-primary/20 transition-all">
                        <div className="h-12 w-12 rounded-full bg-linear-to-br from-primary/20 to-primary/10 text-primary font-bold text-lg flex items-center justify-center">{doc.name.charAt(0)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-foreground truncate">{doc.name}</div>
                          <div className="text-xs text-foreground/50">{doc.specialty}</div>
                        </div>
                        <Link href={`/book?doctor=${doc.id}`} className="text-xs font-bold text-primary hover:underline">Book</Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <h3 className="text-sm font-bold text-foreground/50 uppercase tracking-wider mb-4">Profile</h3>
                <div className="glass rounded-3xl p-6 shadow-premium">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 rounded-full bg-linear-to-br from-primary to-primary/60 text-white font-bold text-2xl flex items-center justify-center">
                      {patient?.fullName?.charAt(0) || "P"}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{patient?.fullName}</div>
                      <div className="text-xs text-foreground/50">Patient since {patient?.createdAt ? format(new Date(patient.createdAt), "MMM yyyy") : "2024"}</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm"><Mail className="h-4 w-4 text-foreground/40" /> {patient?.email}</div>
                    <div className="flex items-center gap-3 text-sm"><Phone className="h-4 w-4 text-foreground/40" /> {patient?.phone || "Not set"}</div>
                    <div className="flex items-center gap-3 text-sm"><ShieldCheck className="h-4 w-4 text-foreground/40" /> Verified Account</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </motion.div>
    </AppShell>
  );
}
