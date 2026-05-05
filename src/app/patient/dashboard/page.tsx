"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useClinicStore } from "@/store/clinicStore";
import { 
  Calendar, Clock, User, Video, FileText, Plus, Pill, 
  HeartPulse, ChevronRight, Phone, Mail, Activity, 
  ShieldCheck, Sparkles, Stethoscope, ArrowRight, ClipboardList, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { format, isToday, isTomorrow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { api, type Prescription, type Diagnosis, type ActiveMedication, type MedicalProfile } from "@/lib/api";

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
  const [activeTab, setActiveTab] = useState<"upcoming" | "accepted" | "history">("upcoming");
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [medications, setMedications] = useState<ActiveMedication[]>([]);
  const [medicalProfile, setMedicalProfile] = useState<MedicalProfile | null>(null);
  const [countdown, setCountdown] = useState("");

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
    api.setRole("patient");
    Promise.all([
      refreshPatients("patient"),
      refreshAppointments("patient"),
      refreshDoctors(),
      api.getMyPrescriptions().catch(() => []),
      api.getMyDiagnoses().catch(() => []),
      api.getMyMedications().catch(() => []),
      api.getMyMedicalProfile().catch(() => null),
    ]).then(([, , , rx, dx, meds, profile]) => {
      setPrescriptions(rx as Prescription[]);
      setDiagnoses(dx as Diagnosis[]);
      setMedications((meds ?? []) as ActiveMedication[]);
      setMedicalProfile((profile ?? null) as MedicalProfile | null);
    }).finally(() => setLoading(false));
  }, [hasHydrated, session, router, refreshPatients, refreshAppointments, refreshDoctors]);

  // Countdown timer for next appointment
  const patientId = session?.patientId ?? "";
  useEffect(() => {
    if (!patientId) return;
    const updateCountdown = () => {
      const next = appointments
        .filter(a => a.patientId === patientId && (a.status === "accepted" || a.status === "pending"))
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0];
      if (!next) { setCountdown(""); return; }
      const diff = new Date(next.scheduledAt).getTime() - Date.now();
      if (diff <= 0) { setCountdown("Now"); return; }
      const days = Math.floor(diff / 86400000);
      const hrs = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      if (days > 0) setCountdown(`${days}d ${hrs}h`);
      else if (hrs > 0) setCountdown(`${hrs}h ${mins}m`);
      else setCountdown(`${mins}m`);
    };
    updateCountdown();
    const id = setInterval(updateCountdown, 30000);
    return () => clearInterval(id);
  }, [appointments, patientId]);

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

  const pendingAppts  = myAppts.filter(a => a.status === "pending");
  const acceptedAppts = myAppts.filter(a => a.status === "accepted");
  const historyAppts  = myAppts.filter(a => a.status === "completed" || a.status === "rejected");
  const nextAccepted  = acceptedAppts[0];
  const nextAppt      = nextAccepted ?? pendingAppts[0];
  const getDoctor = (id: string) => doctors.find(d => d.id === id);

  const quickActions = [
    { icon: Plus, label: "Book Visit", href: "/book", color: "bg-primary text-white" },
    { icon: Video, label: "Join Call", href: nextAccepted ? `/meet/${nextAccepted.id}?role=patient` : "#", color: nextAccepted ? "bg-emerald-500 text-white" : "bg-foreground/10 text-foreground/40", disabled: !nextAccepted },
    { icon: FileText, label: "Records", href: "/patient/medical-record", color: "bg-amber-100 text-amber-700" },
    { icon: Pill, label: "Prescriptions", href: "/patient/medical-record", color: "bg-rose-100 text-rose-700" },
  ];

  const healthStats = [
    { label: "Total Visits", value: myAppts.length, icon: Activity, color: "text-blue-600" },
    { label: "Upcoming", value: pendingAppts.length + acceptedAppts.length, icon: Calendar, color: "text-emerald-600" },
    { label: "My Doctors", value: new Set(myAppts.map(a => a.doctorId)).size, icon: Stethoscope, color: "text-purple-600" },
  ];

  return (
    <AppShell title="My Health" nav={[{ label: "Dashboard", href: "/patient/dashboard" }, { label: "Medical Record", href: "/patient/medical-record" }, { label: "Book Appointment", href: "/book" }]}>
      <motion.div className="max-w-6xl mx-auto pb-12" variants={staggerContainer} initial="hidden" animate="show">
        
        {/* ── Hero Welcome ── */}
        <motion.div variants={fadeUp} className="glass rounded-3xl p-5 sm:p-8 lg:p-10 mb-6 sm:mb-8 shadow-premium relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row gap-5 sm:gap-8">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                <span className="text-sm font-bold text-primary">{getGreeting()}</span>
                <span className="text-foreground/30 hidden sm:inline">|</span>
                <span className="text-xs sm:text-sm text-foreground/60">{format(new Date(), "EEE, MMM d, yyyy")}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                {patient?.fullName || "Welcome back"}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-foreground/60 max-w-lg">
                Track your appointments, manage prescriptions, and stay connected with your healthcare team.
              </p>
            </div>
            
            {nextAppt && (
              <div className="lg:w-80 shrink-0">
                <div className="rounded-2xl bg-primary text-white p-4 sm:p-5 shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="h-4 w-4 opacity-80" />
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">Next Appointment</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold">{getApptTimeLabel(nextAppt.scheduledAt)}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm opacity-90">{format(new Date(nextAppt.scheduledAt), "h:mm a")}</span>
                    {countdown && (
                      <span className="flex items-center gap-1 text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        {countdown}
                      </span>
                    )}
                  </div>
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
                  {(["upcoming", "accepted", "history"] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === tab ? "bg-white shadow-sm text-foreground" : "text-foreground/50 hover:text-foreground"}`}>
                      {tab === "upcoming" ? `Pending (${pendingAppts.length})` : tab === "accepted" ? `Accepted (${acceptedAppts.length})` : `History (${historyAppts.length})`}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  {(activeTab === "upcoming" ? pendingAppts : activeTab === "accepted" ? acceptedAppts : historyAppts.slice().reverse()).length === 0 ? (
                    <div className="text-center py-12 rounded-2xl border border-dashed border-foreground/10">
                      <Calendar className="h-10 w-10 text-foreground/20 mx-auto mb-3" />
                      <p className="text-sm font-medium text-foreground/40">No {activeTab === "upcoming" ? "pending" : activeTab} appointments</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(activeTab === "upcoming" ? pendingAppts : activeTab === "accepted" ? acceptedAppts : historyAppts.slice().reverse()).slice(0, 5).map((appt, i) => {
                        const doc = getDoctor(appt.doctorId);
                        const isLive = appt.status === "accepted";
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

            {/* ── Prescriptions & Diagnoses ── */}
            {(prescriptions.length > 0 || diagnoses.length > 0) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Prescriptions */}
                <motion.div variants={fadeUp} className="glass rounded-3xl p-6 shadow-premium">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-rose-500" />
                      <h2 className="text-base font-bold">Active Prescriptions</h2>
                    </div>
                    <Link href="/patient/medical-record" className="text-xs text-primary hover:underline flex items-center gap-1">
                      View all <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  {prescriptions.filter(rx => rx.status === "active").length === 0 ? (
                    <p className="text-sm text-foreground/40 text-center py-6">No active prescriptions</p>
                  ) : (
                    <div className="space-y-2">
                      {prescriptions.filter(rx => rx.status === "active").slice(0, 4).map((rx) => (
                        <div key={rx.id} className="flex items-center gap-3 rounded-xl bg-rose-50/50 border border-rose-100 p-3">
                          <div className="h-9 w-9 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                            <Pill className="h-4 w-4 text-rose-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{rx.medication_name}</p>
                            <p className="text-xs text-foreground/50">{rx.dosage} · {rx.frequency}</p>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold shrink-0">Active</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Diagnoses */}
                <motion.div variants={fadeUp} className="glass rounded-3xl p-6 shadow-premium">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-purple-500" />
                      <h2 className="text-base font-bold">My Diagnoses</h2>
                    </div>
                    <Link href="/patient/medical-record" className="text-xs text-primary hover:underline flex items-center gap-1">
                      View all <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  {diagnoses.length === 0 ? (
                    <p className="text-sm text-foreground/40 text-center py-6">No diagnoses on record</p>
                  ) : (
                    <div className="space-y-2">
                      {diagnoses.slice(0, 4).map((dx) => (
                        <div key={dx.id} className="flex items-center gap-3 rounded-xl bg-purple-50/50 border border-purple-100 p-3">
                          <div className="h-9 w-9 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                            <AlertCircle className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{dx.description}</p>
                            {dx.icd_code && <p className="text-xs text-foreground/50 font-mono">{dx.icd_code}</p>}
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${dx.status === "active" ? "bg-amber-100 text-amber-700" : dx.status === "resolved" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                            {dx.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            )}

            {/* ── Medical Profile + Medications ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {/* Medical Profile Summary */}
              <motion.div variants={fadeUp} className="glass rounded-3xl p-6 shadow-premium">
                <div className="flex items-center gap-2 mb-4">
                  <HeartPulse className="h-5 w-5 text-primary" />
                  <h2 className="text-base font-bold">Medical Profile</h2>
                </div>
                {medicalProfile ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {medicalProfile.blood_type && (
                        <div className="rounded-xl bg-red-50 border border-red-100 p-2 sm:p-3 text-center">
                          <div className="text-base sm:text-lg font-bold text-red-600">{medicalProfile.blood_type}</div>
                          <div className="text-[9px] sm:text-[10px] font-bold text-red-400 uppercase">Blood Type</div>
                        </div>
                      )}
                      {medicalProfile.height_cm && (
                        <div className="rounded-xl bg-blue-50 border border-blue-100 p-2 sm:p-3 text-center">
                          <div className="text-base sm:text-lg font-bold text-blue-600">{medicalProfile.height_cm}<span className="text-xs">cm</span></div>
                          <div className="text-[9px] sm:text-[10px] font-bold text-blue-400 uppercase">Height</div>
                        </div>
                      )}
                      {medicalProfile.weight_kg && (
                        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-2 sm:p-3 text-center">
                          <div className="text-base sm:text-lg font-bold text-emerald-600">{medicalProfile.weight_kg}<span className="text-xs">kg</span></div>
                          <div className="text-[9px] sm:text-[10px] font-bold text-emerald-400 uppercase">Weight</div>
                        </div>
                      )}
                    </div>
                    {Array.isArray(medicalProfile.allergies) && medicalProfile.allergies.length > 0 && (
                      <div>
                        <div className="text-xs font-bold text-foreground/40 uppercase mb-2">Allergies</div>
                        <div className="flex flex-wrap gap-1.5">
                          {medicalProfile.allergies.map((a, i) => (
                            <span key={i} className="rounded-full bg-red-100 text-red-700 px-2.5 py-1 text-[11px] font-bold">{String(a)}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {Array.isArray(medicalProfile.chronic_conditions) && medicalProfile.chronic_conditions.length > 0 && (
                      <div>
                        <div className="text-xs font-bold text-foreground/40 uppercase mb-2">Chronic Conditions</div>
                        <div className="flex flex-wrap gap-1.5">
                          {medicalProfile.chronic_conditions.map((c, i) => (
                            <span key={i} className="rounded-full bg-amber-100 text-amber-700 px-2.5 py-1 text-[11px] font-bold">{String(c)}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {medicalProfile.emergency_contact && Object.keys(medicalProfile.emergency_contact).length > 0 && (
                      <div className="rounded-xl bg-foreground/5 p-3">
                        <div className="text-[10px] font-bold text-foreground/40 uppercase mb-1">Emergency Contact</div>
                        <div className="text-sm font-bold text-foreground">
                          {String(medicalProfile.emergency_contact.name || medicalProfile.emergency_contact.phone || "Set")}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-foreground/40 text-center py-6">No medical profile data yet</div>
                )}
              </motion.div>

              {/* Active Medications */}
              <motion.div variants={fadeUp} className="glass rounded-3xl p-6 shadow-premium">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-blue-500" />
                    <h2 className="text-base font-bold">Active Medications</h2>
                  </div>
                  <Link href="/patient/medical-record" className="text-xs text-primary hover:underline flex items-center gap-1">
                    View all <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                {medications.filter(m => m.status === "active").length === 0 ? (
                  <p className="text-sm text-foreground/40 text-center py-6">No active medications</p>
                ) : (
                  <div className="space-y-2">
                    {medications.filter(m => m.status === "active").slice(0, 5).map(med => (
                      <div key={med.id} className="flex items-center gap-3 rounded-xl bg-blue-50/50 border border-blue-100 p-3">
                        <div className="h-9 w-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                          <Pill className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{med.name}</p>
                          <p className="text-xs text-foreground/50">{med.dosage} &middot; {med.frequency}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[10px] text-foreground/30">{format(new Date(med.started_at), "MMM d")}</div>
                          {med.ends_at && <div className="text-[10px] text-foreground/30">&rarr; {format(new Date(med.ends_at), "MMM d")}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

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

            {/* ── Health Timeline ── */}
            <motion.div variants={fadeUp} className="glass rounded-3xl p-4 sm:p-6 lg:p-8 shadow-premium mt-6 sm:mt-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <Activity className="h-5 w-5 text-primary" />
                <h2 className="text-base sm:text-lg font-bold text-foreground">Health Timeline</h2>
              </div>
              {(() => {
                type TimelineItem = { id: string; date: string; type: "appointment" | "prescription" | "diagnosis"; label: string; detail: string; color: string; bgColor: string };
                const items: TimelineItem[] = [
                  ...myAppts.map(a => ({
                    id: `a-${a.id}`,
                    date: a.scheduledAt,
                    type: "appointment" as const,
                    label: `${a.status === "completed" ? "Visit completed" : a.status === "accepted" ? "Upcoming visit" : a.status === "pending" ? "Pending visit" : "Cancelled visit"}`,
                    detail: `${getDoctor(a.doctorId)?.name || "Doctor"} · $${a.price}`,
                    color: a.status === "completed" ? "text-blue-600" : a.status === "accepted" ? "text-emerald-600" : a.status === "pending" ? "text-amber-600" : "text-red-600",
                    bgColor: a.status === "completed" ? "bg-blue-100" : a.status === "accepted" ? "bg-emerald-100" : a.status === "pending" ? "bg-amber-100" : "bg-red-100",
                  })),
                  ...prescriptions.map(rx => ({
                    id: `rx-${rx.id}`,
                    date: rx.issued_at,
                    type: "prescription" as const,
                    label: `Prescription: ${rx.medication_name}`,
                    detail: `${rx.dosage} · ${rx.frequency}`,
                    color: "text-rose-600",
                    bgColor: "bg-rose-100",
                  })),
                  ...diagnoses.map(dx => ({
                    id: `dx-${dx.id}`,
                    date: dx.diagnosed_at,
                    type: "diagnosis" as const,
                    label: `Diagnosis: ${dx.description}`,
                    detail: dx.icd_code ? `ICD: ${dx.icd_code} · ${dx.status}` : dx.status,
                    color: "text-purple-600",
                    bgColor: "bg-purple-100",
                  })),
                ];
                items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                if (items.length === 0) return (
                  <div className="rounded-2xl border border-dashed border-foreground/10 p-10 text-center">
                    <Activity className="h-8 w-8 text-foreground/20 mx-auto mb-3" />
                    <div className="text-sm font-bold text-foreground/40">No health events recorded yet</div>
                  </div>
                );

                return (
                  <div className="relative">
                    <div className="absolute left-4 sm:left-5 top-0 bottom-0 w-px bg-foreground/10" />
                    <div className="space-y-2.5 sm:space-y-3">
                      {items.slice(0, 15).map(item => (
                        <div key={item.id} className="relative pl-10 sm:pl-12">
                          <div className={`absolute left-1.5 sm:left-2.5 top-3 h-5 w-5 rounded-full ${item.bgColor} ${item.color} flex items-center justify-center z-10`}>
                            {item.type === "appointment" ? <Calendar className="h-3 w-3" /> : item.type === "prescription" ? <Pill className="h-3 w-3" /> : <Stethoscope className="h-3 w-3" />}
                          </div>
                          <div className="rounded-xl border border-foreground/5 bg-white p-2.5 sm:p-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-0">
                              <span className="text-xs sm:text-sm font-bold text-foreground">{item.label}</span>
                              <span className="text-[10px] text-foreground/40 shrink-0">{format(new Date(item.date), "MMM d, yyyy")}</span>
                            </div>
                            <div className="text-xs text-foreground/50 mt-0.5">{item.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </>
        )}
      </motion.div>
    </AppShell>
  );
}
