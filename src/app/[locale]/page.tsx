import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustBanner } from "@/components/TrustBanner";
import { SpecialtyGrid } from "@/components/SpecialtyGrid";
import { DoctorSpotlight } from "@/components/DoctorSpotlight";
import { WorkingHours } from "@/components/WorkingHours";
import { Testimonials } from "@/components/Testimonials";
import { BlogSection } from "@/components/BlogSection";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function Home() {
  const t = useTranslations("Cta");
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="grow">
        {/* 1. HERO + SEARCH BAR */}
        <Hero />

        {/* 2. TRUST BANNER — real certifications */}
        <TrustBanner />

        {/* 3. SPECIALTY GRID — browse specialties */}
        <SpecialtyGrid />

        {/* 4. DOCTORS — "Our Specialists" */}
        <DoctorSpotlight />

        {/* 5. WORKING HOURS & AVAILABILITY */}
        <WorkingHours />

        {/* 6. HEALTH BLOG */}
        <BlogSection />

        {/* 7. TESTIMONIALS */}
        <Testimonials />

        {/* 10. FINAL CTA */}
        <section
          className="py-24 relative overflow-hidden"
          style={{ background: "#6FAF8F" }}
        >
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white lg:text-5xl">
              {t("heading_1")}
              <br />
              <span className="opacity-90">{t("heading_2")}</span>
            </h2>
            <p className="mt-6 text-lg text-white/75 max-w-xl mx-auto">
              {t("desc")}
            </p>
            <div className="mt-10">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-10 py-5 text-lg font-bold text-primary shadow-premium transition-all hover:bg-white/90 hover:scale-[1.03] active:scale-[0.97]"
              >
                {t("btn")}
              </Link>
            </div>
          </div>
          {/* Subtle decorative circles */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        </section>
      </main>

      {/* FOOTER */}
      <Footer />

      {/* FLOATING CHAT WIDGET */}
      <ChatWidget />
    </div>
  );
}
