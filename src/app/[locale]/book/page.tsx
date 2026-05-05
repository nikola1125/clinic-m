"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateTime } from "@/lib/format";
import { useClinicStore } from "@/store/clinicStore";
import { api, type AvailabilitySlot } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Activity, Calendar, CheckCircle2, ChevronLeft, ChevronRight, Clock, Stethoscope, User } from "lucide-react";
import { format, addDays, startOfDay, getDay } from "date-fns";
import Image from "next/image";

const steps = ["Select Doctor", "Select Service", "Choose Date", "Confirm"];

export default function BookPage() {
  const router = useRouter();

  const doctors = useClinicStore((s) => s.doctors);
  const session = useClinicStore((s) => s.patientSession);
  const patients = useClinicStore((s) => s.patients);
  const addAppointment = useClinicStore((s) => s.addAppointment);
  const refreshDoctors = useClinicStore((s) => s.refreshDoctors);

  const [step, setStep] = useState(0);
  const [doctorId, setDoctorId] = useState<string>("");
  const [consultId, setConsultId] = useState<string>("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [isBooking, setIsBooking] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!session) {
      router.replace("/login");
      return;
    }
    api.setRole("patient");
  }, [session, router]);

  useEffect(() => {
    refreshDoctors();
  }, [refreshDoctors]);

  const fetchAvailability = useCallback(async (docId: string) => {
    setLoadingSlots(true);
    try {
      const slots = await api.getDoctorAvailability(docId);
      setAvailability(slots ?? []);
    } catch {
      setAvailability([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (doctorId) {
      useClinicStore.getState().refreshDoctorConsults(doctorId);
      fetchAvailability(doctorId);
    }
  }, [doctorId, fetchAvailability]);

  const doctor = doctors.find((d) => d.id === doctorId) ?? null;
  const consult = doctor?.consults.find((c) => c.id === consultId) ?? null;
  const me = session ? patients.find((p) => p.id === session.patientId) : undefined;

  // Build next 14 days with availability info
  const dateOptions = useMemo(() => {
    const days: { date: Date; dateStr: string; slot: AvailabilitySlot | null; dayLabel: string }[] = [];
    for (let i = 1; i <= 14; i++) {
      const d = addDays(startOfDay(new Date()), i);
      // getDay returns 0=Sun,1=Mon...6=Sat; backend uses 0=Mon...6=Sun
      const jsDow = getDay(d);
      const backendDow = jsDow === 0 ? 6 : jsDow - 1;
      const slot = availability.find(s => s.day_of_week === backendDow && s.is_active) ?? null;
      days.push({ date: d, dateStr: format(d, "yyyy-MM-dd"), slot, dayLabel: format(d, "EEE, MMM d") });
    }
    return days;
  }, [availability]);

  // Generate time slots for selected date
  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    const opt = dateOptions.find(d => d.dateStr === selectedDate);
    if (!opt?.slot) return [];
    const slot = opt.slot;
    const dur = slot.slot_duration_min || 30;
    const [sh, sm] = slot.start_time.split(":").map(Number);
    const [eh, em] = slot.end_time.split(":").map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    const slots: string[] = [];
    for (let m = startMin; m + dur <= endMin; m += dur) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      slots.push(`${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
    }
    return slots;
  }, [selectedDate, dateOptions]);

  // Update scheduledAt when date+time selected
  useEffect(() => {
    if (selectedDate && selectedTime) {
      setScheduledAt(`${selectedDate}T${selectedTime}`);
    } else {
      setScheduledAt("");
    }
  }, [selectedDate, selectedTime]);

  const canProceed = useMemo(() => {
    if (step === 0) return !!doctorId;
    if (step === 1) return !!consultId;
    if (step === 2) return !!scheduledAt;
    return true;
  }, [step, doctorId, consultId, scheduledAt]);

  const handleNext = () => {
    if (step < steps.length - 1 && canProceed) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const book = async () => {
    if (!doctor || !consult || !session) return;
    setIsBooking(true);

    try {
      await addAppointment({
        doctorId: doctor.id,
        patientId: session.patientId,
        consultId: consult.id,
        scheduledAt: new Date(scheduledAt).toISOString(),
        status: "pending",
        price: consult.price,
      });
      setConfirmed(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsBooking(false);
    }
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">

          {/* Header */}
          <div className="mb-8 sm:mb-12 relative overflow-hidden rounded-3xl bg-primary/10 px-6 py-12 text-center shadow-premium sm:px-8 sm:py-16">
            <Image
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop"
              alt="Hospital Reception"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
            <div className="relative z-10">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Book Consultation</h1>
              <p className="mt-3 text-base sm:text-lg text-foreground/70 max-w-xl mx-auto font-medium sm:mt-4">Follow the steps below to schedule your visit with our world-class specialists.</p>
            </div>
          </div>

          {/* Stepper */}
          {!confirmed && (
            <div className="mb-8 sm:mb-12">
              <div className="flex items-center justify-between relative px-2 sm:px-4">
                <div className="absolute left-6 right-6 top-1/2 h-0.5 -translate-y-1/2 bg-foreground/5 z-0 sm:left-8 sm:right-8" />
                <div
                  className="absolute left-8 top-1/2 h-0.5 -translate-y-1/2 bg-primary z-0 transition-all duration-500 ease-in-out"
                  style={{ width: `calc(${(step / (steps.length - 1)) * 100}% - 4rem)` }}
                />

                {steps.map((label, i) => {
                  const isActive = i === step;
                  const isCompleted = i < step;
                  return (
                    <div key={label} className="relative z-10 flex flex-col items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-300
                        ${isActive ? "border-primary bg-primary text-white shadow-premium" :
                          isCompleted ? "border-primary bg-primary text-white" :
                            "border-foreground/10 bg-white text-foreground/40"}`}
                      >
                        {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <span className="font-bold">{i + 1}</span>}
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-wider hidden sm:block
                        ${isActive || isCompleted ? "text-primary" : "text-foreground/40"}`}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main Card */}
          <div className="glass rounded-4xl p-8 sm:p-12 shadow-premium relative overflow-hidden min-h-[400px]">
            {confirmed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center h-full py-12"
              >
                <div className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center mb-8">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Booking Confirmed!</h2>
                <p className="mt-4 text-foreground/60 max-w-md">
                  Your appointment with <span className="font-bold text-foreground">{doctor?.name}</span> for <span className="font-bold text-foreground">{consult?.title}</span> has been successfully requested.
                </p>
                <div className="mt-10 flex gap-4">
                  <Link href="/patient/dashboard" className="rounded-2xl bg-primary px-8 py-4 text-sm font-bold text-white shadow-premium hover:bg-primary/90 transition-colors">
                    Go to Dashboard
                  </Link>
                </div>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {/* Step 1: Doctor */}
                  {step === 0 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-primary" /> Select a Specialist
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {doctors.map(d => (
                          <div
                            key={d.id}
                            onClick={() => { setDoctorId(d.id); setConsultId(""); setSelectedDate(""); setSelectedTime(""); }}
                            className={`cursor-pointer rounded-2xl border-2 p-5 transition-all flex items-center gap-4
                              ${doctorId === d.id ? "border-primary bg-primary/5 shadow-md" : "border-foreground/5 bg-white hover:border-primary/30"}
                            `}
                          >
                            <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0 bg-foreground/5">
                              <Image src={`https://i.pravatar.cc/150?u=${d.id}`} alt={d.name} fill sizes="48px" className="object-cover" />
                            </div>
                            <div>
                              <h4 className="font-bold text-foreground text-lg">{d.name}</h4>
                              <p className="text-sm text-foreground/50">{d.specialty}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Service */}
                  {step === 1 && doctor && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" /> Select Consultation Type
                      </h3>
                      {doctor.consults.length === 0 ? (
                        <p className="text-foreground/50">This doctor has no services listed.</p>
                      ) : (
                        <div className="grid gap-4">
                          {doctor.consults.map(c => (
                            <div
                              key={c.id}
                              onClick={() => setConsultId(c.id)}
                              className={`cursor-pointer flex justify-between items-center rounded-2xl border-2 p-5 transition-all
                                ${consultId === c.id ? "border-primary bg-primary/5 shadow-md" : "border-foreground/5 bg-white hover:border-primary/30"}
                              `}
                            >
                              <span className="font-bold text-foreground">{c.title}</span>
                              <span className="font-bold text-primary bg-white px-3 py-1 rounded-full shadow-sm">${c.price}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 3: Date & Time Slots */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" /> Choose Date & Time
                      </h3>

                      {loadingSlots ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
                        </div>
                      ) : availability.filter(s => s.is_active).length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-foreground/10 p-10 text-center">
                          <Calendar className="h-10 w-10 text-foreground/20 mx-auto mb-3" />
                          <p className="text-sm font-bold text-foreground/40">This doctor has not set their availability yet.</p>
                          <p className="text-xs text-foreground/30 mt-1">Please try another doctor or check back later.</p>
                        </div>
                      ) : (
                        <>
                          {/* Date selector */}
                          <div>
                            <p className="text-sm font-bold text-foreground/60 mb-3">Select a date</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                              {dateOptions.map(opt => (
                                <button
                                  key={opt.dateStr}
                                  disabled={!opt.slot}
                                  onClick={() => { setSelectedDate(opt.dateStr); setSelectedTime(""); }}
                                  className={`rounded-xl border-2 p-3 text-sm font-bold transition-all text-center ${
                                    !opt.slot
                                      ? "border-foreground/5 text-foreground/20 cursor-not-allowed bg-foreground/2"
                                      : selectedDate === opt.dateStr
                                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                                        : "border-foreground/5 bg-white text-foreground hover:border-primary/30"
                                  }`}
                                >
                                  {opt.dayLabel}
                                  {!opt.slot && <span className="block text-[10px] font-normal text-foreground/30 mt-0.5">Unavailable</span>}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Time slots */}
                          {selectedDate && (
                            <div>
                              <p className="text-sm font-bold text-foreground/60 mb-3">Select a time</p>
                              {timeSlots.length === 0 ? (
                                <p className="text-sm text-foreground/40">No available slots on this day.</p>
                              ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                  {timeSlots.map(t => {
                                    const [h, m] = t.split(":").map(Number);
                                    const ampm = h >= 12 ? "PM" : "AM";
                                    const h12 = h % 12 || 12;
                                    const label = `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
                                    return (
                                      <button
                                        key={t}
                                        onClick={() => setSelectedTime(t)}
                                        className={`flex items-center justify-center gap-1 rounded-xl border-2 py-2.5 px-2 text-sm font-bold transition-all ${
                                          selectedTime === t
                                            ? "border-primary bg-primary text-white shadow-sm"
                                            : "border-foreground/5 bg-white text-foreground hover:border-primary/30"
                                        }`}
                                      >
                                        <Clock className="h-3.5 w-3.5" />
                                        {label}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Step 4: Confirm */}
                  {step === 3 && doctor && consult && (
                    <div className="space-y-8">
                      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" /> Review & Confirm
                      </h3>

                      <div className="bg-white rounded-2xl p-6 border border-foreground/5 shadow-sm space-y-4">
                        <div className="flex items-center gap-4 border-b border-foreground/5 pb-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <User className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{me?.fullName}</p>
                            <p className="text-xs text-foreground/50">{me?.email}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div>
                            <p className="text-xs text-foreground/40 uppercase tracking-wider font-bold mb-1">Provider</p>
                            <p className="font-semibold text-sm">{doctor.name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-foreground/40 uppercase tracking-wider font-bold mb-1">Service</p>
                            <p className="font-semibold text-sm">{consult.title}</p>
                          </div>
                          <div className="col-span-2 mt-2">
                            <p className="text-xs text-foreground/40 uppercase tracking-wider font-bold mb-1">Schedule</p>
                            <p className="font-semibold flex items-center gap-2 text-primary">
                              <Clock className="h-4 w-4" />
                              {formatDateTime(new Date(scheduledAt).toISOString())}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center rounded-2xl bg-foreground/5 p-6">
                        <span className="font-bold text-foreground">Total Cost</span>
                        <span className="text-2xl font-bold text-primary">${consult.price}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Navigation Buttons */}
          {!confirmed && (
            <div className="mt-8 flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={step === 0}
                className={`flex items-center gap-2 font-bold px-6 py-3 rounded-full transition-colors ${step === 0 ? "opacity-0 pointer-events-none" : "text-foreground hover:bg-foreground/5"}`}
              >
                <ChevronLeft className="h-5 w-5" /> Back
              </button>

              {step < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-full shadow-premium hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                >
                  Next <ChevronRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={book}
                  disabled={isBooking || !canProceed}
                  className="flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-full shadow-premium hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isBooking ? "Confirming..." : "Confirm Booking"} <CheckCircle2 className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
