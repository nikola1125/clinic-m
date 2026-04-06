"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, Star, Users } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 -z-10 h-full w-full">
        <img
          src="https://images.unsplash.com/photo-1519494140261-d90193639b42?q=80&w=2000&auto=format&fit=crop"
          alt="Clinic Background"
          className="h-full w-full object-cover opacity-15 grayscale-[50%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <Star className="h-4 w-4 fill-current" />
              <span>Trust Zenith: #1 Medical Clinic in the Region</span>
            </div>
            
            <h1 className="mt-8 text-5xl font-bold tracking-tight text-foreground lg:text-7xl">
              Healthcare tailored <br />
              <span className="text-gradient">for your life.</span>
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-foreground/60 max-w-xl">
              Experience the future of medicine with Zenith Health. Our world-class specialists and 
              cutting-edge technology provide personalized care that fits your schedule.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-lg font-semibold text-white shadow-premium transition-all hover:bg-primary/90 hover:scale-[1.03] active:scale-[0.97]"
              >
                <Calendar className="h-5 w-5" />
                Book Appointment
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-lg font-semibold text-foreground/70 transition-all hover:bg-foreground/5 hover:text-foreground"
              >
                Our Services
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-2 gap-6 sm:flex sm:items-center sm:gap-8 border-t border-foreground/5 pt-10">
              <div>
                <div className="text-2xl font-bold text-foreground">15k+</div>
                <div className="text-sm text-foreground/50">Happy Patients</div>
              </div>
              <div className="hidden sm:block h-10 w-px bg-foreground/10" />
              <div>
                <div className="text-2xl font-bold text-foreground">48+</div>
                <div className="text-sm text-foreground/50">Expert Doctors</div>
              </div>
              <div className="hidden sm:block h-10 w-px bg-foreground/10" />
              <div className="flex -space-x-3 overflow-hidden col-span-2 sm:col-auto justify-start mt-2 sm:mt-0">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="inline-block h-10 w-10 rounded-full border-2 border-background bg-zinc-200 overflow-hidden">
                     <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-primary text-xs font-bold text-white">
                  +1k
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 aspect-4/5 overflow-hidden rounded-[3rem] shadow-premium">
              <img
                src="https://images.unsplash.com/photo-1538108149393-fbbd81895a07?q=80&w=2000&auto=format&fit=crop"
                alt="Zenith Health Clinic"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            {/* Minimalist floating card */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="glass absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-8 z-20 flex items-center gap-4 rounded-3xl p-4 sm:p-6 shadow-premium backdrop-blur-xl"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-accent shadow-premium">
                <Users className="h-5 w-5 sm:h-6 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">Available Now</div>
                <div className="text-xs text-foreground/50">8 Specialists Online</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Background blobs for depth */}
      <div className="absolute top-0 right-0 -z-10 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent/5 blur-[120px]" />
    </section>
  );
}
