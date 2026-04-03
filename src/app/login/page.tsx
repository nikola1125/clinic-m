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

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const loginPatient = useClinicStore((s) => s.loginPatient);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMsg("");
    setLoading(true);
    try {
      const success = await loginPatient(data.email);
      if (success) {
        router.push("/patient/dashboard");
      } else {
        setErrorMsg("Invalid email or password. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
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
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-premium mb-4">
            <Activity className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h2>
          <p className="mt-2 text-sm text-foreground/50">Log in to your patient account</p>
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
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-foreground">
                  Password
                </label>
                <Link href="#" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
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
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ChevronRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-foreground/5 text-center">
            <p className="text-sm text-foreground/50">
              Don't have an account?{" "}
              <Link href="/signup" className="font-bold text-primary hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
        
        {/* Subtle Staff Link - Hidden but exists */}
        <div className="mt-12 text-center opacity-0 hover:opacity-100 transition-opacity">
          <Link href="/doctor/login" className="text-xs text-foreground/20 hover:text-primary underline">
            Staff Portal
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
