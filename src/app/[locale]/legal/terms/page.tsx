import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Terms of Service | MjekOn",
  description: "Terms governing use of MjekOn's telehealth platform. Governed by Albanian law.",
  alternates: {
    canonical: "https://mjekon.com/en/legal/terms",
    languages: {
      sq: "https://mjekon.com/sq/legal/terms",
      en: "https://mjekon.com/en/legal/terms",
      it: "https://mjekon.com/it/legal/terms",
    },
  },
};

const SECTIONS = [
  { id: "acceptance", label: "1 · Acceptance" },
  { id: "services", label: "2 · Services" },
  { id: "accounts", label: "3 · Accounts" },
  { id: "patient-relationships", label: "4 · Patient Relationships" },
  { id: "prohibited", label: "5 · Prohibited Conduct" },
  { id: "ip", label: "6 · Intellectual Property" },
  { id: "liability", label: "7 · Liability" },
  { id: "governing-law", label: "8 · Governing Law" },
  { id: "amendments", label: "9 · Amendments" },
  { id: "contact-legal", label: "10 · Contact" },
] as const;

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-10" style={{ borderBottom: "1px solid var(--line)", scrollMarginTop: 80 }}>
      <h2
        className="font-heading mb-5"
        style={{ fontSize: "clamp(20px,2.5vw,28px)", color: "var(--ink)" }}
      >
        {title}
      </h2>
      <div
        className="flex flex-col gap-4 text-[14px] leading-relaxed max-w-prose"
        style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
      >
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 72 }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <section className="py-16" style={{ borderBottom: "1px solid var(--line)" }}>
            <p className="label-mono mb-3" style={{ color: "var(--muted)" }}>
              LEGAL
            </p>
            <h1
              className="font-heading leading-none mb-4"
              style={{ fontSize: "clamp(32px,5vw,64px)", color: "var(--ink)" }}
            >
              Terms of Service
            </h1>
            <p className="label-mono" style={{ color: "var(--muted)" }}>
              Effective: 1 June 2025 · Version 1.0
            </p>
          </section>

          {/* Two-column: ToC + body */}
          <div className="lg:flex lg:gap-16 py-4">

            {/* Sticky ToC */}
            <aside
              className="hidden lg:block shrink-0"
              style={{ width: 200, position: "sticky", top: 88, alignSelf: "flex-start" }}
            >
              <p className="label-mono mb-3" style={{ color: "var(--muted)" }}>CONTENTS</p>
              <nav
                className="flex flex-col"
                style={{ borderLeft: "1px solid var(--line)" }}
              >
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="label-mono px-4 py-1.5 transition-opacity hover:opacity-60"
                    style={{ color: "var(--muted)" }}
                  >
                    {s.label}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">

              <Section id="acceptance" title="1. Acceptance of Terms">
                <p>By accessing or using MjekOn's platform (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, you must not use the Service.</p>
                <p>These Terms constitute a binding contract between you and MjekOn Sh.p.k., a company incorporated under Albanian law (NUIS: KXXXXXXXX), with registered offices at Rruga Ismail Qemali 35, Tiranë 1001, Albania ("MjekOn", "we", "us").</p>
              </Section>

              <Section id="services" title="2. Description of Services">
                <p>MjekOn operates a telehealth platform enabling patients to book video consultations with licensed medical professionals ("Physicians"). We provide the technology infrastructure; we do not practice medicine ourselves.</p>
                <p>The Service is available in Albania, Kosovo, North Macedonia, Italy, and other jurisdictions at our discretion. Availability may be restricted without notice where required by local law.</p>
                <p>Consultations conducted on the platform do not replace emergency medical services. In a medical emergency call 127 (Albania) or the relevant emergency number in your country.</p>
              </Section>

              <Section id="accounts" title="3. Account Registration">
                <p>You must provide accurate, current, and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.</p>
                <p>You must be at least 18 years old, or have parental consent, to create an account. Patients under 18 require a guardian to hold the account.</p>
                <p>We reserve the right to suspend or terminate accounts that violate these Terms or that we reasonably suspect of fraudulent activity.</p>
              </Section>

              <Section id="patient-relationships" title="4. Patient–Physician Relationships">
                <p>The physician–patient relationship is formed exclusively between you and the individual Physician. MjekOn facilitates the connection but is not a party to that relationship.</p>
                <p>Physicians on our platform are independently licensed practitioners who have passed our licence-verification process. They operate under the applicable codes of conduct of their national medical bodies.</p>
                <p>Medical advice given during a consultation is for informational purposes only and does not substitute in-person examination where clinically indicated.</p>
                <p>Consultation records are retained in accordance with our Privacy Policy and applicable medical record retention laws (7 years under Albanian Health Law Nr. 10138/2009).</p>
              </Section>

              <Section id="prohibited" title="5. Prohibited Conduct">
                <p>You may not: (a) use the Service to obtain controlled substances prescriptions in violation of local law; (b) impersonate any person or entity; (c) scrape, copy, or systematically extract data from the platform; (d) interfere with or disrupt the Service's infrastructure; (e) use the Service for any purpose that is illegal or harmful to others; (f) record consultations without the explicit consent of the Physician.</p>
              </Section>

              <Section id="ip" title="6. Intellectual Property">
                <p>All content, design, trademarks, and software on the Service are the property of MjekOn or its licensors and are protected by Albanian and international intellectual property law.</p>
                <p>You retain ownership of any health data you submit. You grant MjekOn a limited licence to process that data solely to provide the Service, as described in the Privacy Policy.</p>
              </Section>

              <Section id="liability" title="7. Limitation of Liability">
                <p>To the maximum extent permitted by Albanian law, MjekOn's aggregate liability for any claims arising out of or relating to the Service shall not exceed the fees you paid in the twelve months preceding the claim.</p>
                <p>MjekOn is not liable for: (a) the medical decisions of Physicians; (b) technical failures of third-party video infrastructure; (c) any indirect, incidental, or consequential damages.</p>
                <p>Nothing in these Terms excludes liability for death or personal injury caused by our negligence, fraud, or any other liability that cannot be excluded under Albanian law.</p>
              </Section>

              <Section id="governing-law" title="8. Governing Law & Dispute Resolution">
                <p>These Terms are governed by and construed in accordance with the laws of the Republic of Albania, without regard to conflict-of-law principles.</p>
                <p>Any dispute arising from these Terms shall first be submitted to good-faith negotiation. If unresolved within 30 days, the parties submit to the exclusive jurisdiction of the courts of Tiranë, Albania.</p>
                <p>Consumer users in the EU retain the right to use the EU Online Dispute Resolution platform at <a href="https://ec.europa.eu/odr" style={{ color: "var(--ink)" }}>ec.europa.eu/odr</a>.</p>
              </Section>

              <Section id="amendments" title="9. Amendments">
                <p>We may amend these Terms at any time. Material changes will be notified by email at least 14 days before they take effect. Continued use of the Service after the effective date constitutes acceptance.</p>
                <p>The version history of these Terms is available upon request.</p>
              </Section>

              <Section id="contact-legal" title="10. Contact">
                <p>
                  Legal enquiries:{" "}
                  <a href="mailto:legal@mjekon.com" style={{ color: "var(--ink)" }}>legal@mjekon.com</a>
                </p>
                <p>MjekOn Sh.p.k., Rruga Ismail Qemali 35, Tiranë 1001, Albania</p>
              </Section>

              {/* Bottom nav */}
              <div className="py-8 flex gap-6">
                <Link href="/legal/privacy" className="label-mono transition-opacity hover:opacity-60" style={{ color: "var(--muted)" }}>
                  Privacy Policy →
                </Link>
                <Link href="/legal/cookies" className="label-mono transition-opacity hover:opacity-60" style={{ color: "var(--muted)" }}>
                  Cookie Policy →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
