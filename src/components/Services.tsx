"use client";

import { motion } from "framer-motion";
import { Scissors, Eye, Microscope, Users, ChevronRight } from "lucide-react";

const services = [
  {
    title: "Tumor Surgery",
    desc: "Expert oncological resection and reconstruction, guided by precision imaging and minimally invasive techniques.",
    icon: Scissors,
  },
  {
    title: "Minimally Invasive Procedures",
    desc: "Laparoscopic and robotic-assisted interventions that reduce recovery time and improve patient comfort.",
    icon: Eye,
  },
  {
    title: "Follow-up Care",
    desc: "Structured long-term monitoring plans that give patients confidence and catch recurrence early.",
    icon: Microscope,
  },
  {
    title: "Multidisciplinary Evaluation",
    desc: "Cross-specialty tumor boards review every case together — surgeons, oncologists, radiologists, and more.",
    icon: Users,
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="py-16 lg:py-20"
      style={{ background: "rgba(207, 232, 216, 0.15)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-widest text-primary"
          >
            Our Expertise
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl"
          >
            Specialized Care for{" "}
            <span className="text-gradient">Every Patient</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-foreground/60 max-w-2xl mx-auto"
          >
            Our oncology team combines surgical excellence with compassionate
            care at every stage of your treatment journey.
          </motion.p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col rounded-3xl bg-card p-8 shadow-card ring-1 ring-foreground/5 transition-all hover:shadow-premium"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                <service.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {service.title}
              </h3>
              <p className="mt-3 text-sm text-foreground/60 leading-relaxed flex-1">
                {service.desc}
              </p>
              <div className="mt-6 flex items-center text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Learn more <ChevronRight className="ml-1 h-4 w-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
