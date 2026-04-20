import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HeroBg } from "@/components/HeroBg";
import dynamic from "next/dynamic";

/* Below-fold components — lazy-loaded for smaller initial bundle */
const HowItWorks = dynamic(() => import("@/components/HowItWorks").then(m => m.HowItWorks));
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs").then(m => m.WhyChooseUs));
const SpecialtyGrid = dynamic(() => import("@/components/SpecialtyGrid").then(m => m.SpecialtyGrid));
const WorkingHours = dynamic(() => import("@/components/WorkingHours").then(m => m.WorkingHours));
import { BlogSection } from "@/components/BlogSection";
const Footer = dynamic(() => import("@/components/Footer").then(m => m.Footer));
import { ChatWidgetLazy } from "@/components/ChatWidgetLazy";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen">
      <HeroBg />
      <Navbar />

      <main id="main-content" className="grow" tabIndex={-1}>
        {/* 1. HERO */}
        <Hero />

        {/* 2. HOW IT WORKS */}
        <HowItWorks />

        {/* 4. WHY CHOOSE US */}
        <WhyChooseUs />

        {/* 5. BROWSE BY SPECIALTY */}
        <SpecialtyGrid />

        {/* 6. HEALTH BLOG */}
        <BlogSection />

        {/* 7. OPENING HOURS */}
        <WorkingHours />
      </main>

      <Footer />
      <ChatWidgetLazy />
    </div>
  );
}
