import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Privacy Policy | MjekOn",
  description: "How MjekOn collects, processes, and protects your personal data under GDPR and Ligji Nr. 124/2025.",
  alternates: {
    canonical: "https://mjekon.com/en/legal/privacy",
    languages: {
      sq: "https://mjekon.com/sq/legal/privacy",
      en: "https://mjekon.com/en/legal/privacy",
      it: "https://mjekon.com/it/legal/privacy",
    },
  },
};

const SECTIONS = [
  { id: "controller", label: "1 · Controller" },
  { id: "data-collected", label: "2 · Data Collected" },
  { id: "legal-bases", label: "3 · Legal Bases" },
  { id: "how-we-use", label: "4 · How We Use Data" },
  { id: "disclosure", label: "5 · Disclosure" },
  { id: "retention", label: "6 · Retention" },
  { id: "your-rights", label: "7 · Your Rights" },
  { id: "transfers", label: "8 · International Transfers" },
  { id: "contact-dpo", label: "9 · DPO & Contact" },
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

function Cite({ law, article }: { law: string; article: string }) {
  return (
    <span
      className="label-mono px-1.5 py-0.5 rounded-sm"
      style={{
        background: "var(--bone-2)",
        color: "var(--ink)",
        fontSize: 10,
        border: "1px solid var(--line)",
      }}
    >
      {law} {article}
    </span>
  );
}

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="label-mono" style={{ color: "var(--muted)" }}>
              Effective: 1 June 2025 · Covers GDPR &amp; Ligji Nr. 124/2025
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

              <Section id="controller" title="1. Data Controller">
                <p>
                  The data controller is <strong style={{ color: "var(--ink)" }}>MjekOn Sh.p.k.</strong>,
                  Rruga Ismail Qemali 35, Tiranë 1001, Albania (NUIS: KXXXXXXXX).{" "}
                  <Cite law="GDPR" article="Art. 4(7)" /> <Cite law="Ligji 124/2025" article="Art. 5(ç)" />
                </p>
                <p>
                  Data Protection Officer: <a href="mailto:dpo@mjekon.com" style={{ color: "var(--ink)" }}>dpo@mjekon.com</a>.
                  The DPO is appointed under <Cite law="GDPR" article="Art. 37" /> and <Cite law="Ligji 124/2025" article="Art. 34" />.
                </p>
              </Section>

              <Section id="data-collected" title="2. Personal Data We Collect">
                <p>We collect the following categories of data:</p>
                <ul className="flex flex-col gap-1.5 pl-4 list-disc">
                  <li><strong style={{ color: "var(--ink)" }}>Identity data:</strong> full name, date of birth, national ID number (where applicable).</li>
                  <li><strong style={{ color: "var(--ink)" }}>Contact data:</strong> email address, phone number.</li>
                  <li>
                    <strong style={{ color: "var(--ink)" }}>Health data (special category):</strong> symptoms, diagnoses, prescriptions, consultation notes, lab results — processed only with explicit consent or for treatment purposes.{" "}
                    <Cite law="GDPR" article="Art. 9" /> <Cite law="Ligji 124/2025" article="Art. 12" />
                  </li>
                  <li><strong style={{ color: "var(--ink)" }}>Technical data:</strong> IP address, browser fingerprint, access logs. Retained for 90 days for security purposes.</li>
                  <li><strong style={{ color: "var(--ink)" }}>Payment data:</strong> transaction ID only — full card data is processed exclusively by our PCI-DSS certified payment processor and is never stored by MjekOn.</li>
                </ul>
              </Section>

              <Section id="legal-bases" title="3. Legal Bases for Processing">
                <p>We process your personal data on the following legal bases:</p>
                <div style={{ borderTop: "1px solid var(--line)" }}>
                  {[
                    {
                      purpose: "Providing the consultation service",
                      base: "Performance of contract",
                      citation: [<Cite key="a" law="GDPR" article="Art. 6(1)(b)" />, " ", <Cite key="b" law="Ligji 124/2025" article="Art. 8(b)" />],
                    },
                    {
                      purpose: "Processing health data for treatment",
                      base: "Explicit consent + medical necessity",
                      citation: [<Cite key="a" law="GDPR" article="Art. 9(2)(a)(h)" />, " ", <Cite key="b" law="Ligji 124/2025" article="Art. 12(a)(e)" />],
                    },
                    {
                      purpose: "Fraud prevention & security",
                      base: "Legitimate interest",
                      citation: [<Cite key="a" law="GDPR" article="Art. 6(1)(f)" />, " ", <Cite key="b" law="Ligji 124/2025" article="Art. 8(f)" />],
                    },
                    {
                      purpose: "Legal obligation (record retention)",
                      base: "Legal obligation",
                      citation: [<Cite key="a" law="GDPR" article="Art. 6(1)(c)" />, " ", <Cite key="b" law="Ligji 124/2025" article="Art. 8(c)" />],
                    },
                    {
                      purpose: "Analytics (aggregate, de-identified)",
                      base: "Consent",
                      citation: [<Cite key="a" law="GDPR" article="Art. 6(1)(a)" />, " ", <Cite key="b" law="Ligji 124/2025" article="Art. 8(a)" />],
                    },
                  ].map((row, i, arr) => (
                    <div
                      key={i}
                      className="py-3 grid grid-cols-[1fr_1fr_auto] gap-4 items-start"
                      style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--line)" : "none" }}
                    >
                      <span style={{ color: "var(--ink)" }}>{row.purpose}</span>
                      <span>{row.base}</span>
                      <span className="flex gap-1 flex-wrap">{row.citation}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Section id="how-we-use" title="4. How We Use Your Data">
                <p>We use your data to: (a) create and manage your account; (b) connect you with Physicians; (c) process payments; (d) send service notifications and appointment reminders; (e) detect and prevent fraud and abuse; (f) comply with legal obligations; (g) improve the platform (using only aggregated, anonymised analytics).</p>
                <p>We do not sell your personal data. We do not use health data for advertising purposes.</p>
              </Section>

              <Section id="disclosure" title="5. Disclosure of Data">
                <p>We share your data with: (a) Physicians, to the extent necessary to provide the consultation; (b) sub-processors listed at mjekon.com/legal/subprocessors, all operating under GDPR-compliant DPAs; (c) law enforcement or regulatory bodies when required by law <Cite law="GDPR" article="Art. 6(1)(c)" /> <Cite law="Ligji 124/2025" article="Art. 26" />.</p>
                <p>We do not share data with third parties for their own marketing purposes.</p>
              </Section>

              <Section id="retention" title="6. Data Retention">
                <p>
                  Account and health data: retained for <strong style={{ color: "var(--ink)" }}>7 years</strong> after the last consultation, in line with Albanian Health Law Nr. 10138/2009 Art. 54 and <Cite law="Ligji 124/2025" article="Art. 16" />.
                </p>
                <p>Access logs: 90 days. Payment transaction IDs: 5 years (accounting law). Analytics data: aggregated, never associated with individual identifiers beyond 24 hours.</p>
                <p>
                  After the retention period, data is securely deleted or anonymised in accordance with <Cite law="GDPR" article="Art. 5(1)(e)" /> and <Cite law="Ligji 124/2025" article="Art. 16(3)" />.
                </p>
              </Section>

              <Section id="your-rights" title="7. Your Rights">
                <p>
                  Under GDPR <Cite law="GDPR" article="Art. 15–22" /> and <Cite law="Ligji 124/2025" article="Art. 18–25" /> you have the right to:
                </p>
                <ul className="flex flex-col gap-1.5 pl-4 list-disc">
                  <li><strong style={{ color: "var(--ink)" }}>Access</strong> your personal data and receive a copy (Art. 15 / Art. 18).</li>
                  <li><strong style={{ color: "var(--ink)" }}>Rectification</strong> of inaccurate data (Art. 16 / Art. 19).</li>
                  <li><strong style={{ color: "var(--ink)" }}>Erasure</strong> ("right to be forgotten"), subject to legal retention obligations (Art. 17 / Art. 20).</li>
                  <li><strong style={{ color: "var(--ink)" }}>Restriction</strong> of processing in certain circumstances (Art. 18 / Art. 21).</li>
                  <li><strong style={{ color: "var(--ink)" }}>Portability</strong> of data you provided, in a structured, machine-readable format (Art. 20 / Art. 23).</li>
                  <li><strong style={{ color: "var(--ink)" }}>Objection</strong> to processing based on legitimate interest (Art. 21 / Art. 24).</li>
                  <li><strong style={{ color: "var(--ink)" }}>Withdraw consent</strong> at any time without affecting lawfulness of prior processing (Art. 7(3) / Art. 8(a)).</li>
                </ul>
                <p>
                  To exercise any right, email <a href="mailto:privacy@mjekon.com" style={{ color: "var(--ink)" }}>privacy@mjekon.com</a>. We will respond within 30 days <Cite law="GDPR" article="Art. 12(3)" /> <Cite law="Ligji 124/2025" article="Art. 17(2)" />.
                </p>
                <p>
                  You have the right to lodge a complaint with the Albanian{" "}
                  <a href="https://idp.al" target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink)" }}>
                    Information and Data Protection Commissioner (IDPC)
                  </a>{" "}
                  (<Cite law="Ligji 124/2025" article="Art. 57" />) or your local EU supervisory authority.
                </p>
              </Section>

              <Section id="transfers" title="8. International Transfers">
                <p>
                  All primary processing occurs within the EU (Frankfurt and Warsaw). <Cite law="GDPR" article="Art. 44–49" /> <Cite law="Ligji 124/2025" article="Chapter VI" />
                </p>
                <p>
                  Where a sub-processor operates outside the EU, we rely on Standard Contractual Clauses (SCCs) approved by the European Commission under <Cite law="GDPR" article="Art. 46(2)(c)" />. No transfers occur to countries without an adequacy decision or appropriate safeguards.
                </p>
              </Section>

              <Section id="contact-dpo" title="9. DPO Contact & Complaints">
                <p>
                  Data Protection Officer:{" "}
                  <a href="mailto:dpo@mjekon.com" style={{ color: "var(--ink)" }}>dpo@mjekon.com</a>
                </p>
                <p>
                  Privacy enquiries:{" "}
                  <a href="mailto:privacy@mjekon.com" style={{ color: "var(--ink)" }}>privacy@mjekon.com</a>
                </p>
                <p>MjekOn Sh.p.k., Rruga Ismail Qemali 35, Tiranë 1001, Albania</p>
                <p>Supervisory authority: IDPC — <a href="https://idp.al" target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink)" }}>idp.al</a></p>
              </Section>

              {/* Bottom nav */}
              <div className="py-8 flex gap-6">
                <Link href="/legal/terms" className="label-mono transition-opacity hover:opacity-60" style={{ color: "var(--muted)" }}>
                  Terms of Service →
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
