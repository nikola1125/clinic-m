"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Heart, Cpu, Users } from "lucide-react";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Experienced Surgeons",
    desc: "Our board-certified oncologists bring decades of expertise in complex tumor resection and advanced surgical techniques.",
  },
  {
    icon: Heart,
    title: "Personalized Treatment",
    desc: "Every care plan is tailored to your unique diagnosis, health profile, and personal goals — because no two patients are the same.",
  },
  {
    icon: Cpu,
    title: "Modern Technology",
    desc: "From robotic-assisted surgery to next-generation imaging, we leverage the latest tools to deliver precise, minimally disruptive care.",
  },
  {
    icon: Users,
    title: "Patient-Centered Care",
    desc: "You are at the center of every decision. Our multidisciplinary team works around your schedule, your comfort, and your peace of mind.",
  },
];

export function TrustSection() {
  return (
    <section id="about" className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-widest text-primary"
          >
            Why Choose Us
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl font-heading"
          >
            Trusted care, built on <span className="text-gradient">expertise.</span>
          </motion.h2>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:gap-16">
          {reasons.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex gap-6"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <item.icon className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground font-heading">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-foreground/60">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
