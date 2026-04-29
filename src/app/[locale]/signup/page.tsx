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
import { setToken } from "@/lib/api";

const signupSchema = z.object({
  fullName: z.string().min(2, "Emri duhet të ketë të paktën 2 karaktere"),
  email: z.string().email("Adresë emaili e pavlefshme"),
  phone: z.string().optional(),
  password: z.string().min(6, "Fjalëkalimi duhet të ketë të paktën 6 karaktere"),
  terms: z.boolean().refine(val => val === true, "Duhet të pranoni kushtet"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const { setSession } = useClinicStore();

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      terms: false,
    }
  });

  const onSubmit = async (data: SignupFormValues) => {
    setErrorMsg("");
    setLoading(true);
    try {
      const { api } = await import("@/lib/api");
      const result = await api.register({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      
      setToken("patient", result.access_token);
      setSession({ role: "patient", patientId: result.patient_id });
      router.push("/patient/dashboard");
    } catch (e: any) {
      setErrorMsg(e.message || "Dështoi krijimi i llogarisë. Ju lutem provoni përsëri.");
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-foreground/50 hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kthehu në Faqen Kryesore
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Bashkohu me MjekOn</h2>
          <p className="mt-2 text-sm text-foreground/50 max-w-sm">Hapi i parë drejt një jete më të shëndetshme. Regjistrohuni sot për profilin tuaj.</p>
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
                  Emri i Plotë
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
                  Numri i Telefonit
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
                Adresa e Emailit
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
              <label className="text-sm font-semibold text-foreground block mb-2">
                Fjalëkalimi
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
                  Duhet të ketë të paktën 6 karaktere.
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 px-2">
              <input type="checkbox" {...register("terms")} className="rounded-md border-foreground/10 text-primary focus:ring-primary h-4 w-4" />
              <label className="text-xs text-foreground/50">
                Pranoj <Link href="/terms" className="text-primary hover:underline">Kushtet e Shërbimit</Link> dhe <Link href="/privacy" className="text-primary hover:underline">Politikën e Privatësisë</Link>.
              </label>
            </div>
             {errors.terms && <p className="text-red-500 text-xs px-2">{errors.terms.message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-5 text-base font-bold text-white shadow-premium transition-all hover:bg-primary/90 hover:translate-y-[-2px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Duke krijuar llogarinë..." : "Krijo Llogari"}
              {!loading && <ChevronRight className="h-5 w-5" />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-foreground/5 text-center">
            <p className="text-sm text-foreground/50">
              Keni një llogari?{" "}
              <Link href="/login" className="font-bold text-primary hover:underline">
                Hyni
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
