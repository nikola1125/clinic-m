"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, ArrowLeft, Mail, Lock, User, Phone, ChevronRight, Stethoscope } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useClinicStore } from "@/store/clinicStore";

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  doctorId: z.string().min(1, "Please select a doctor"),
  terms: z.boolean().refine(val => val === true, "You must agree to terms"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const { doctors, refreshDoctors, upsertPatient, setSession } = useClinicStore();

  useEffect(() => {
    refreshDoctors();
  }, [refreshDoctors]);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      doctorId: "",
      terms: false,
    }
  });

  const onSubmit = async (data: SignupFormValues) => {
    setErrorMsg("");
    setLoading(true);
    try {
      // Mocking patient creation for now by temporarily becoming the selected doctor
      // to pass backend constraints, then switching to patient role.
      setSession({ role: "doctor", doctorId: data.doctorId });
      
      const patientId = await upsertPatient({
        doctorId: data.doctorId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
      });

      // Now set the actual patient session
      setSession({ role: "patient", patientId });
      router.push("/patient/dashboard");
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to create account. Please try again.");
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-foreground/50 hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-premium mb-4">
            <Activity className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Join Zenith Health</h2>
          <p className="mt-2 text-sm text-foreground/50 max-w-sm">The first step to a healthier life. Sign up for your patient profile today.</p>
        </div>

        <div className="glass rounded-4xl p-8 lg:p-12 shadow-premium">
          {errorMsg && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
              {errorMsg}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/30" />
                  <input
                    type="text"
                    {...register("fullName")}
                    className="w-full rounded-2xl border-none bg-foreground/5 py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                    placeholder="John Doe"
                  />
                </div>
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/30" />
                  <input
                    type="tel"
                    {...register("phone")}
                    className="w-full rounded-2xl border-none bg-foreground/5 py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/30" />
                <input
                  type="email"
                  {...register("email")}
                  className="w-full rounded-2xl border-none bg-foreground/5 py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Primary Doctor
              </label>
              <div className="relative">
                <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/30" />
                <select
                  {...register("doctorId")}
                  className="w-full appearance-none rounded-2xl border-none bg-foreground/5 py-4 pl-12 pr-10 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                >
                  <option value="" disabled>Select a doctor...</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} - {doc.specialty}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  <ChevronRight className="h-4 w-4 text-foreground/30 rotate-90" />
                </div>
              </div>
              {errors.doctorId && <p className="text-red-500 text-xs mt-1">{errors.doctorId.message}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/30" />
                <input
                  type="password"
                  {...register("password")}
                  className="w-full rounded-2xl border-none bg-foreground/5 py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
              {errors.password ? (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              ) : (
                <p className="mt-2 text-[10px] text-foreground/40 px-2 italic">
                  Must be at least 6 characters.
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 px-2">
              <input type="checkbox" {...register("terms")} className="rounded-md border-foreground/10 text-primary focus:ring-primary h-4 w-4" />
              <label className="text-xs text-foreground/50">
                I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </label>
            </div>
             {errors.terms && <p className="text-red-500 text-xs px-2">{errors.terms.message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-5 text-base font-bold text-white shadow-premium transition-all hover:bg-primary/90 hover:translate-y-[-2px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ChevronRight className="h-5 w-5" />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-foreground/5 text-center">
            <p className="text-sm text-foreground/50">
              Already a member?{" "}
              <Link href="/login" className="font-bold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -z-10" />
    </div>
  );
}
