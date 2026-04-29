"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "@/i18n/routing";
import { useConsentStore, type ConsentCategory } from "@/store/consentStore";

// ── Cookie inventory ──────────────────────────────────────────────────────────

const COOKIES: {
  name: string;
  purpose: string;
  provider: string;
  duration: string;
  category: ConsentCategory;
}[] = [
  {
    name: "clinic_store_v1",
    purpose: "Stores session authentication state (role, IDs). Required for login.",
    provider: "MjekOn",
    duration: "Session",
    category: "necessary",
  },
  {
    name: "cookie_consent",
    purpose: "Stores your cookie preferences so you are not asked again.",
    provider: "MjekOn",
    duration: "1 year",
    category: "necessary",
  },
  {
    name: "plausible_ignore",
    purpose: "Tells Plausible Analytics to ignore your visits (opt-out marker).",
    provider: "Plausible Analytics",
    duration: "1 year",
    category: "necessary",
  },
  {
    name: "_plausible / plausible.io",
    purpose: "Anonymous page-view and event analytics. No personal data or cross-site tracking.",
    provider: "Plausible Analytics (EU-hosted)",
    duration: "Session",
    category: "analytics",
  },
];

const CATEGORY_DOT: Record<ConsentCategory, string> = {
  necessary: "var(--ink)",
  analytics: "var(--sage)",
  marketing: "var(--oxblood)",
};

// ── Consent toggle row ────────────────────────────────────────────────────────

function ConsentRow({
  category,
  label,
  description,
}: {
  category: ConsentCategory;
  label: string;
  description: string;
}) {
  const { categories, setConsent } = useConsentStore();
  const isNecessary = category === "necessary";
  const enabled = categories[category];

  return (
    <div
      className="flex items-start justify-between gap-6 py-5"
      style={{ borderBottom: "1px solid var(--line)" }}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              background: CATEGORY_DOT[category],
              flexShrink: 0,
            }}
          />
          <p
            className="text-[14px] font-medium"
            style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
          >
            {label}
          </p>
          {isNecessary && (
            <span className="label-mono" style={{ color: "var(--muted)" }}>
              (always on)
            </span>
          )}
        </div>
        <p
          className="text-[13px] leading-relaxed"
          style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
        >
          {description}
        </p>
      </div>
      <div className="shrink-0 pt-1">
        {isNecessary ? (
          <div
            className="label-mono h-7 px-3 flex items-center"
            style={{
              border: "1px solid var(--line)",
              borderRadius: "var(--r)",
              color: "var(--muted)",
            }}
          >
            Required
          </div>
        ) : (
          <button
            onClick={() => setConsent({ [category]: !enabled })}
            className="label-mono h-7 px-3 transition-colors"
            style={{
              border: `1px solid ${enabled ? "var(--ink)" : "var(--line)"}`,
              borderRadius: "var(--r)",
              background: enabled ? "var(--ink)" : "transparent",
              color: enabled ? "var(--bone)" : "var(--muted)",
            }}
            aria-pressed={enabled}
          >
            {enabled ? "On" : "Off"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CookiesPage() {
  const { acceptAll, rejectAll, consentGiven } = useConsentStore();

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 72 }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <section className="py-16" style={{ borderBottom: "1px solid var(--line)" }}>
            <p className="label-mono mb-3" style={{ color: "var(--muted)" }}>
              LEGAL
            </p>
            <h1
              className="font-heading leading-none mb-4"
              style={{ fontSize: "clamp(32px,5vw,64px)", color: "var(--ink)" }}
            >
              Cookie Policy
            </h1>
            <p className="label-mono" style={{ color: "var(--muted)" }}>
              Effective: 1 June 2025 · Covers EU ePrivacy Directive &amp; Ligji Nr. 124/2025 Art. 32
            </p>
          </section>

          {/* Intro */}
          <section className="py-10" style={{ borderBottom: "1px solid var(--line)" }}>
            <p
              className="text-[14px] leading-relaxed max-w-prose"
              style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
            >
              Cookies are small text files stored on your device. We use them to keep you logged in
              (necessary) and to understand how the platform is used (analytics, only with your
              consent). We do not use cookies for advertising or cross-site tracking.
            </p>
          </section>

          {/* Preference controls */}
          <section className="py-10" style={{ borderBottom: "1px solid var(--line)" }}>
            <p className="label-mono mb-6" style={{ color: "var(--muted)" }}>
              YOUR PREFERENCES
            </p>
            <div style={{ borderTop: "1px solid var(--line)" }}>
              <ConsentRow
                category="necessary"
                label="Strictly Necessary"
                description="Required for authentication, security, and your consent choice. Cannot be disabled."
              />
              <ConsentRow
                category="analytics"
                label="Analytics"
                description="Privacy-friendly page-view analytics via Plausible (EU-hosted, no cross-site tracking, no fingerprinting). Helps us identify broken pages and improve performance."
              />
              <ConsentRow
                category="marketing"
                label="Marketing"
                description="Currently unused. Reserved for future first-party remarketing only."
              />
            </div>
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={acceptAll}
                className="label-mono h-9 px-6 transition-opacity hover:opacity-80"
                style={{
                  background: "var(--ink)",
                  color: "var(--bone)",
                  borderRadius: "var(--r)",
                }}
              >
                Accept all
              </button>
              <button
                onClick={rejectAll}
                className="label-mono h-9 px-4 transition-opacity hover:opacity-60"
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: "var(--r)",
                  color: "var(--muted)",
                }}
              >
                Reject non-essential
              </button>
              {consentGiven && (
                <span className="label-mono" style={{ color: "var(--sage)" }}>
                  ✓ Saved
                </span>
              )}
            </div>
          </section>

          {/* Cookie table */}
          <section className="py-10" style={{ borderBottom: "1px solid var(--line)" }}>
            <p className="label-mono mb-6" style={{ color: "var(--muted)" }}>
              COOKIE INVENTORY
            </p>
            <div style={{ border: "1px solid var(--line)", overflowX: "auto" }}>
              {/* Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "180px 1fr 160px 100px 100px",
                  padding: "8px 16px",
                  borderBottom: "1px solid var(--line)",
                  background: "var(--bone-2)",
                  minWidth: 700,
                }}
              >
                {["NAME", "PURPOSE", "PROVIDER", "DURATION", "CATEGORY"].map((h) => (
                  <span key={h} className="label-mono" style={{ color: "var(--muted)" }}>
                    {h}
                  </span>
                ))}
              </div>
              {COOKIES.map((c, i) => (
                <div
                  key={c.name}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "180px 1fr 160px 100px 100px",
                    padding: "12px 16px",
                    alignItems: "start",
                    borderBottom: i < COOKIES.length - 1 ? "1px solid var(--line)" : "none",
                    minWidth: 700,
                  }}
                >
                  <span
                    className="label-mono break-all"
                    style={{ color: "var(--ink)", fontSize: 11 }}
                  >
                    {c.name}
                  </span>
                  <span
                    className="text-[13px] leading-relaxed pr-4"
                    style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
                  >
                    {c.purpose}
                  </span>
                  <span
                    className="text-[13px]"
                    style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
                  >
                    {c.provider}
                  </span>
                  <span className="label-mono" style={{ color: "var(--muted)" }}>
                    {c.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      style={{
                        display: "inline-block",
                        width: 6,
                        height: 6,
                        background: CATEGORY_DOT[c.category],
                        flexShrink: 0,
                      }}
                    />
                    <span className="label-mono" style={{ color: "var(--muted)" }}>
                      {c.category}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom nav */}
          <div className="py-10 flex gap-6">
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
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
