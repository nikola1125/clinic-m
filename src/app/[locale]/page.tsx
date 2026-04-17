import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustBanner } from "@/components/TrustBanner";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { HowItWorks } from "@/components/HowItWorks";
import { SpecialtyGrid } from "@/components/SpecialtyGrid";
import { WorkingHours } from "@/components/WorkingHours";
import { BlogSection } from "@/components/BlogSection";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Suspense } from "react";

import { Link } from "@/i18n/routing";
import { Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
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
      <ChatWidget />
    </div>
  );
}
