import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HeroBg } from "@/components/HeroBg";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Suspense } from "react";
import dynamic from "next/dynamic";

/* Below-fold components — lazy-loaded for smaller initial bundle */
const HowItWorks = dynamic(() => import("@/components/HowItWorks").then(m => m.HowItWorks));
const TrustBanner = dynamic(() => import("@/components/TrustBanner").then(m => m.TrustBanner));
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs").then(m => m.WhyChooseUs));
const SpecialtyGrid = dynamic(() => import("@/components/SpecialtyGrid").then(m => m.SpecialtyGrid));
const WorkingHours = dynamic(() => import("@/components/WorkingHours").then(m => m.WorkingHours));
const BlogSection = dynamic(() => import("@/components/BlogSection").then(m => m.BlogSection));
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

        {/* 3. TRUST BADGES */}
        <TrustBanner />

        {/* 4. WHY CHOOSE US */}
        <WhyChooseUs />

        {/* 5. BROWSE BY SPECIALTY — Suspense for loading state */}
        <Suspense
          fallback={
            <section className="py-12 lg:py-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} variant="stat" />
                  ))}
                </div>
              </div>
            </section>
          }
        >
          <SpecialtyGrid />
        </Suspense>

        {/* 6. OPENING HOURS */}
        <WorkingHours />

        {/* 7. HEALTH BLOG — Suspense for loading state */}
        <Suspense
          fallback={
            <section className="py-12 lg:py-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <SkeletonCard variant="article" />
                  <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((i) => (
                      <SkeletonCard key={i} showAvatar lines={2} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          }
        >
          <BlogSection />
        </Suspense>
      </main>

      <Footer />
      <ChatWidgetLazy />
    </div>
  );
}
