"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, ArrowLeft, Mail, Lock, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useClinicStore } from "@/store/clinicStore";
import { setToken } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("Adresë emaili e pavlefshme"),
  password: z.string().min(1, "Fjalëkalimi është i detyrueshëm"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const setSession = useClinicStore((s) => s.setSession);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMsg("");
    setLoading(true);
    try {
      const { api } = await import("@/lib/api");
      const result = await api.login(data);
      // Store token for the specific role
      setToken(result.role, result.access_token);
      
      if (result.role === "admin") {
        setSession({ role: "admin" });
        router.push("/hq-command");
      } else if (result.role === "doctor") {
        setSession({ role: "doctor", doctorId: result.doctor_id });
        router.push("/portal");
      } else {
        setSession({ role: "patient", patientId: result.patient_id });
        router.push("/patient/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Ndodhi një gabim gjatë identifikimit.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-premium mb-4">
            <Activity className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Mirësevini përsëri</h2>
          <p className="mt-2 text-sm text-foreground/50">Identifikohuni në llogarinë tuaj të pacientit</p>
        </div>

        <div className="glass rounded-4xl p-8 shadow-premium">
          {errorMsg && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-foreground">
                  Fjalëkalimi
                </label>
                <Link href="#" className="text-xs font-medium text-primary hover:underline">
                  Keni harruar fjalëkalimin?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/30" />
                <input
                  type="password"
                  {...register("password")}
                  className="w-full rounded-2xl border-none bg-foreground/5 py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-bold text-white shadow-premium transition-all hover:bg-primary/90 hover:translate-y-[-2px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Duke u identifikuar..." : "Hyr"}
              {!loading && <ChevronRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-foreground/5 text-center">
            <p className="text-sm text-foreground/50">
              Nuk keni llogari?{" "}
              <Link href="/signup" className="font-bold text-primary hover:underline">
                Regjistrohuni këtu
              </Link>
            </p>
          </div>
        </div>
        
        {/* Subtle Staff Link - Hidden but exists */}
        <div className="mt-12 text-center opacity-0 hover:opacity-100 transition-opacity">
          <Link href="/portal/login" className="text-xs text-foreground/20 hover:text-primary underline">
            Portali i Stafit
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
