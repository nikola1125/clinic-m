import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { DoctorSpotlight } from "@/components/DoctorSpotlight";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="grow">
        <Hero />
        
        {/* Trust/Logo Cloud Section */}
        <div className="py-12 border-y border-foreground/5 bg-foreground/1">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-semibold uppercase tracking-widest text-foreground/30">
              Trusted by leading health organizations
            </p>
            <div className="mt-10 flex flex-wrap justify-center items-center gap-12 grayscale opacity-40">
              {/* Symbolic Logos */}
              <div className="text-xl font-black text-foreground">WHO</div>
              <div className="text-xl font-black text-foreground">UNICEF</div>
              <div className="text-xl font-black text-foreground">NHS</div>
              <div className="text-xl font-black text-foreground">RED CROSS</div>
              <div className="text-xl font-black text-foreground">MAYO CLINIC</div>
            </div>
          </div>
        </div>

        <Services />
        <DoctorSpotlight />

        {/* CTA Section */}
        <section className="py-24 bg-primary relative overflow-hidden">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white lg:text-6xl">
              Ready to take control of <br /> your <span className="underline decoration-accent underline-offset-8">health journey?</span>
            </h2>
            <p className="mt-8 text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Book your first consultation today and experience the Zenith Health difference. 
              Our specialists are ready to provide the personalized care you deserve.
            </p>
            <div className="mt-12 flex justify-center">
              <a
                href="/signup"
                className="rounded-2xl bg-white px-10 py-5 text-lg font-bold text-primary shadow-2xl transition-all hover:bg-zinc-50 hover:scale-105 active:scale-95"
              >
                Get Started Now
              </a>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </section>
      </main>

      <Footer />
    </div>
  );
}

