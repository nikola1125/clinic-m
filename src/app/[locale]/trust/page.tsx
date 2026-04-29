import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Trust & Security | MjekOn",
  description: "How MjekOn protects your health data — EU data centres, end-to-end encryption, GDPR, Ligji Nr. 124/2025, and independent security audits.",
};

const CELLS = [
  {
    id: "eu-dc",
    label: "EU Data Centres",
    detail: "All data is stored exclusively in Frankfurt (DE) and Warsaw (PL) — both ISO 27001-certified facilities operated by Hetzner Cloud. No US or non-EU jurisdictions.",
    tag: "Infrastructure",
  },
  {
    id: "enc-rest",
    label: "Encryption at Rest",
    detail: "AES-256 full-disk encryption on every volume. Database columns containing health data are additionally encrypted at the application layer with envelope encryption (KEK stored in HSM).",
    tag: "Encryption",
  },
  {
    id: "enc-transit",
    label: "Encryption in Transit",
    detail: "TLS 1.3 enforced on all endpoints. HSTS with one-year max-age. Video calls use DTLS-SRTP. Internal service-to-service traffic uses mTLS.",
    tag: "Encryption",
  },
  {
    id: "licence",
    label: "Licence Verification",
    detail: "Every physician on the platform is manually verified against national medical registry APIs (Order of Albanian Physicians, CNOM-IT, BÄK-DE) before activation.",
    tag: "Compliance",
  },
  {
    id: "soc2",
    label: "SOC 2 Type II",
    detail: "We are currently undergoing our inaugural SOC 2 Type II audit (Trust Services Criteria: Security, Availability, Confidentiality). Report expected Q4 2026. Contact us for the current bridge letter.",
    tag: "Audit",
  },
  {
    id: "gdpr",
    label: "GDPR Compliance",
    detail: "MjekOn processes health data under GDPR Art. 9(2)(h) (medical treatment) and Art. 9(2)(a) (explicit consent). A DPA is available for B2B partners. DPO: dpo@mjekon.com.",
    tag: "Regulation",
  },
  {
    id: "ligji124",
    label: "Ligji Nr. 124/2025",
    detail: "We comply fully with Albania's Law on Personal Data Protection Nr. 124/2025, including the mandatory registration with the Information and Data Protection Commissioner (IDPC) and the cross-border transfer provisions of Chapter VI.",
    tag: "Regulation",
  },
  {
    id: "incident",
    label: "Incident Response",
    detail: "Documented IRP with RPO < 1 h, RTO < 4 h. GDPR-mandated 72-hour notification to the supervisory authority. Affected users notified within 24 hours of confirmation. Runbooks are version-controlled in our private security repo.",
    tag: "Operations",
  },
  {
    id: "subprocessors",
    label: "Sub-processors",
    detail: "Our current sub-processor list: Hetzner (hosting), Resend (transactional email), Cloudflare (CDN/DNS), LiveKit (video infra). All operate under GDPR-compliant DPAs. Updated list at mjekon.com/legal/subprocessors.",
    tag: "Supply Chain",
  },
  {
    id: "residency",
    label: "Data Residency",
    detail: "Patient health records never leave the EU. Analytics (aggregated, non-health) may be processed by EU-based processors only. Explicit data residency guarantees available in enterprise plans.",
    tag: "Infrastructure",
  },
  {
    id: "keymgmt",
    label: "Key Management",
    detail: "Encryption keys are managed via a dedicated KMS (HashiCorp Vault on-prem). Key rotation is automatic every 90 days. Master keys are stored on hardware security modules with M-of-N control.",
    tag: "Encryption",
  },
  {
    id: "vulndisclosure",
    label: "Vulnerability Disclosure",
    detail: "We follow coordinated disclosure. Please report findings to security@mjekon.com (PGP key on security.txt). We aim to triage within 24 hours and patch critical vulnerabilities within 72 hours.",
    tag: "Security",
  },
] as const;

const TAG_COLORS: Record<string, string> = {
  Infrastructure: "var(--sage)",
  Encryption: "var(--ink)",
  Compliance: "var(--oxblood)",
  Audit: "var(--muted)",
  Regulation: "var(--oxblood)",
  Operations: "var(--muted)",
  "Supply Chain": "var(--muted)",
  Security: "var(--ink)",
};

export default function TrustPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 72 }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <section className="py-16" style={{ borderBottom: "1px solid var(--line)" }}>
            <p className="label-mono mb-3" style={{ color: "var(--muted)" }}>
              TRUST & SECURITY
            </p>
            <h1
              className="font-heading leading-none mb-4"
              style={{ fontSize: "clamp(32px,5vw,64px)", color: "var(--ink)" }}
            >
              We earn trust by<br />disclosing everything.
            </h1>
            <p
              className="text-[15px] max-w-xl leading-relaxed"
              style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
            >
              Health data is the most sensitive data that exists. Every control below
              is a standing commitment — not a marketing promise.
            </p>
          </section>

          {/* 12-cell grid */}
          <section className="py-12" style={{ borderBottom: "1px solid var(--line)" }}>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              style={{ border: "1px solid var(--line)" }}
            >
              {CELLS.map((cell, i) => (
                <div
                  key={cell.id}
                  id={cell.id}
                  className="p-6 flex flex-col gap-3"
                  style={{
                    borderRight: (i % 3 < 2) ? "1px solid var(--line)" : "none",
                    borderBottom: i < CELLS.length - (CELLS.length % 3 || 3) ? "1px solid var(--line)" : "none",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className="text-[15px] font-medium"
                      style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
                    >
                      {cell.label}
                    </p>
                    <span className="label-mono shrink-0 flex items-center gap-1.5">
                      <span style={{
                        display: "inline-block",
                        width: 6,
                        height: 6,
                        background: TAG_COLORS[cell.tag] ?? "var(--muted)",
                        flexShrink: 0,
                      }} />
                      <span style={{ color: "var(--muted)" }}>{cell.tag}</span>
                    </span>
                  </div>
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
                  >
                    {cell.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Links */}
          <div className="py-10 flex flex-col sm:flex-row gap-6">
            <Link
              href="/legal/privacy"
              className="label-mono transition-opacity hover:opacity-60"
              style={{ color: "var(--muted)" }}
            >
              Privacy Policy →
            </Link>
            <Link
              href="/legal/terms"
              className="label-mono transition-opacity hover:opacity-60"
              style={{ color: "var(--muted)" }}
            >
              Terms of Service →
            </Link>
            <a
              href="/.well-known/security.txt"
              className="label-mono transition-opacity hover:opacity-60"
              style={{ color: "var(--muted)" }}
            >
              security.txt →
            </a>
            <a
              href="mailto:security@mjekon.com"
              className="label-mono transition-opacity hover:opacity-60"
              style={{ color: "var(--muted)" }}
            >
              security@mjekon.com →
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
