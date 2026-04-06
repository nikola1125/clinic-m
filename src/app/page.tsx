import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { DoctorSpotlight } from "@/components/DoctorSpotlight";
import { Services } from "@/components/Services";
import { TrustSection } from "@/components/TrustSection";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="grow">
        {/* 1. HERO */}
        <Hero />

        {/* 2. TRUST BAR */}
        <div className="py-10 border-y border-foreground/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-foreground/30">
              Trusted by leading health organizations
            </p>
            <div className="mt-8 flex flex-wrap justify-center items-center gap-10 sm:gap-16 grayscale opacity-35">
              {["WHO", "UNICEF", "NHS", "RED CROSS", "MAYO CLINIC"].map(
                (org) => (
                  <div
                    key={org}
                    className="text-lg font-black text-foreground tracking-wider"
                  >
                    {org}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* 3. DOCTORS — "Our Specialists" */}
        <DoctorSpotlight />

        {/* 4. SERVICES — oncology, light sage bg */}
        <Services />

        {/* 5. TRUST SECTION — "Why Choose Us" */}
        <TrustSection />

        {/* 6. TESTIMONIALS */}
        <Testimonials />

        {/* 7. FINAL CTA — bg #6FAF8F per spec */}
        <section
          className="py-24 relative overflow-hidden"
          style={{ background: "#6FAF8F" }}
        >
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white lg:text-5xl">
              Take the first step
              <br />
              <span className="opacity-90">toward your care.</span>
            </h2>
            <p className="mt-6 text-lg text-white/75 max-w-xl mx-auto">
              Our specialists are ready to guide you through every stage of your
              journey — with expertise, compassion, and clarity.
            </p>
            <div className="mt-10">
              <a
                href="/book"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-10 py-5 text-lg font-bold text-primary shadow-premium transition-all hover:bg-white/90 hover:scale-[1.03] active:scale-[0.97]"
              >
                Book Appointment
              </a>
            </div>
          </div>
          {/* Subtle decorative circles */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        </section>
      </main>

      {/* 8. FOOTER — slightly darker neutral */}
      <Footer />
    </div>
  );
}
