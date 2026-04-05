"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, Star, Mail, Calendar, Users } from "lucide-react";

const doctors = [
  {
    name: "Dr. Elena Rodriguez",
    specialty: "Chief of Cardiology",
    years: "15+ Years Exp.",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Dr. Marcus Chen",
    specialty: "Senior Neurologist",
    years: "12+ Years Exp.",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Dr. Sarah Johnson",
    specialty: "Pediatric Specialist",
    years: "10+ Years Exp.",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=800&auto=format&fit=crop",
  },
];

export function DoctorSpotlight() {
  return (
    <section id="doctors" className="py-24 bg-foreground/2">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
          <div className="max-w-2xl">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-accent shadow-premium mb-6">
              <Users className="h-5 w-5 sm:h-6 text-white" />
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-base font-semibold uppercase tracking-wider text-primary"
            >
              Meet Our Experts
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl"
            >
              World-class care from <span className="text-gradient">world-class doctors.</span>
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 bg-foreground/5 p-4 rounded-2xl md:bg-transparent md:p-0"
          >
            <div className="flex -space-x-3 overflow-hidden">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="inline-block h-10 w-10 rounded-full border-2 border-background bg-zinc-200 overflow-hidden">
                   <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" className="h-full w-full object-cover" />
                 </div>
               ))}
            </div>
            <div className="text-sm font-medium text-foreground/60">
              <span className="text-foreground font-bold">48+ Specialists</span> ready to help
            </div>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor, idx) => (
            <motion.div
              key={doctor.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-[2.5rem] bg-white shadow-sm ring-1 ring-foreground/5 transition-all hover:shadow-premium"
            >
              <div className="relative aspect-4/5 overflow-hidden">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                <div className="absolute bottom-6 left-6 right-6 flex translate-y-4 gap-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-md hover:bg-white/30">
                    <Mail className="h-4 w-4" />
                    Contact
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-primary/90">
                    <Calendar className="h-4 w-4" />
                    Book
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                    <Star className="h-3 w-3 fill-current" />
                    {doctor.rating}
                  </div>
                  <div className="text-xs font-medium text-foreground/40">{doctor.years}</div>
                </div>
                <h3 className="mt-4 text-2xl font-bold text-foreground">{doctor.name}</h3>
                <p className="mt-1 text-sm font-medium text-primary uppercase tracking-wide">{doctor.specialty}</p>
                
                <div className="mt-6 flex items-center gap-4 text-foreground/40">
                  <div className="flex items-center gap-1.5 grayscale opacity-50 transition-all group-hover:grayscale-0 group-hover:opacity-100">
                    <Award className="h-4 w-4" />
                    <span className="text-xs">Certified Board</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
