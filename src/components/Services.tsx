"use client";

import { motion } from "framer-motion";
import { 
  HeartPulse, 
  Stethoscope, 
  Baby, 
  Brain, 
  Dna, 
  Eye, 
  Search, 
  ChevronRight 
} from "lucide-react";

const services = [
  {
    title: "General Medicine",
    desc: "Comprehensive health checkups and treatments for all ages.",
    icon: Stethoscope,
    color: "bg-blue-500",
  },
  {
    title: "Cardiology",
    desc: "Advanced heart care and diagnostic testing for cardiovascular health.",
    icon: HeartPulse,
    color: "bg-red-500",
  },
  {
    title: "Pediatrics",
    desc: "Specialized medical care and wellness support for children.",
    icon: Baby,
    color: "bg-amber-500",
  },
  {
    title: "Neurology",
    desc: "Expert treatment for brain, spine, and nervous system disorders.",
    icon: Brain,
    color: "bg-purple-500",
  },
  {
    title: "Genetics",
    desc: "Modern genetic testing and personalized health risk assessment.",
    icon: Dna,
    color: "bg-emerald-500",
  },
  {
    title: "Ophthalmology",
    desc: "Complete eye care including vision testing and surgical options.",
    icon: Eye,
    color: "bg-sky-500",
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base font-semibold uppercase tracking-wider text-primary"
          >
            Our Expertise
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl"
          >
            Specialized Care for <span className="text-gradient">Every Patient</span>
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-foreground/60 max-w-2xl mx-auto"
          >
            We offer a wide range of medical services provided by world-class specialists using 
            the latest clinical technologies.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative rounded-3xl border border-foreground/5 bg-white p-8 shadow-sm transition-all hover:shadow-premium dark:bg-slate-900/50 dark:backdrop-blur-xl"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${service.color} bg-opacity-10 text-white shadow-sm ring-1 ring-inset ring-foreground/5`}>
                <service.icon className={`h-6 w-6 ${service.color.replace('bg-', 'text-')}`} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-foreground">
                {service.title}
              </h3>
              <p className="mt-3 text-base text-foreground/60 leading-relaxed">
                {service.desc}
              </p>
              <div className="mt-6 flex items-center text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Learn more
                <ChevronRight className="ml-1 h-4 w-4" />
              </div>
              
              <div className="absolute top-0 right-0 p-8">
                <Search className="h-24 w-24 text-foreground/5 transition-colors group-hover:text-primary/5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
