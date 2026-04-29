import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pricing");
  return {
    title: `${t("heading")} | MjekOn`,
    description: t("subhead"),
    openGraph: {
      title: `${t("heading")} | MjekOn`,
      description: t("subhead"),
      images: [{
        url: `/api/og?title=${encodeURIComponent(t("heading"))}&label=PRICING`,
        width: 1200,
        height: 630,
      }],
    },
    alternates: {
      canonical: "https://mjekon.com/en/pricing",
      languages: {
        sq: "https://mjekon.com/sq/pricing",
        en: "https://mjekon.com/en/pricing",
        it: "https://mjekon.com/it/pricing",
      },
    },
  };
}

// ── FAQ accordion (native details/summary, hairline borders) ──────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group" style={{ borderBottom: "1px solid var(--line)" }}>
      <summary
        className="flex items-center justify-between py-4 cursor-pointer list-none"
        style={{ color: "var(--ink)" }}
      >
        <span
          className="text-[15px] font-medium"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {q}
        </span>
        <span
          className="label-mono ml-6 shrink-0 transition-transform group-open:rotate-45"
          style={{ color: "var(--muted)" }}
        >
          +
        </span>
      </summary>
      <p
        className="pb-5 text-[14px] leading-relaxed"
        style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
      >
        {a}
      </p>
    </details>
  );
}

// ── Pricing rows ──────────────────────────────────────────────────────────

const PRICES = [
  { rowKey: "row_first", durKey: "row_first_dur", eur: "€40", all: "4,000 L" },
  { rowKey: "row_followup", durKey: "row_followup_dur", eur: "€25", all: "2,500 L" },
  { rowKey: "row_second", durKey: "row_second_dur", eur: "€60", all: "6,000 L" },
  { rowKey: "row_preop", durKey: "row_preop_dur", eur: "€80", all: "8,000 L" },
  { rowKey: "row_physio", durKey: "row_physio_dur", eur: "€30", all: "3,000 L" },
  { rowKey: "row_translator", durKey: "row_translator_dur", eur: "€10", all: "1,000 L" },
] as const;

const FAQ_PAIRS = [
  ["faq_q1", "faq_a1"],
  ["faq_q2", "faq_a2"],
  ["faq_q3", "faq_a3"],
  ["faq_q4", "faq_a4"],
  ["faq_q5", "faq_a5"],
  ["faq_q6", "faq_a6"],
  ["faq_q7", "faq_a7"],
  ["faq_q8", "faq_a8"],
] as const;

// ── Page ──────────────────────────────────────────────────────────────────

function FaqPageJsonLd({ pairs, t }: { pairs: readonly (readonly [string, string])[]; t: (k: string) => string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map(([qKey, aKey]) => ({
      "@type": "Question",
      name: t(qKey),
      acceptedAnswer: { "@type": "Answer", text: t(aKey) },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function PricingPage() {
  const t = await getTranslations("pricing");
  const includedItems: string[] = t.raw("included_items") as string[];

  return (
    <>
      <Navbar />
      <FaqPageJsonLd pairs={FAQ_PAIRS} t={t} />
      <main style={{ paddingTop: 72 }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

          {/* ── Hero ── */}
          <section
            className="py-16"
            style={{ borderBottom: "1px solid var(--line)" }}
          >
            <p className="label-mono mb-3">{t("label")}</p>
            <h1
              className="font-heading text-[48px] lg:text-[64px] leading-none mb-4"
              style={{ color: "var(--ink)" }}
            >
              {t("heading")}
            </h1>
            <p
              className="text-[15px] leading-relaxed max-w-xl"
              style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
            >
              {t("subhead")}
            </p>
          </section>

          {/* ── Pricing table ── */}
          <section className="py-12" style={{ borderBottom: "1px solid var(--line)" }}>
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  {(["col_service", "col_duration", "col_eur", "col_all"] as const).map((col) => (
                    <th
                      key={col}
                      className="label-mono py-3 text-left"
                      style={{ color: "var(--muted)", fontWeight: "normal" }}
                    >
                      {t(col)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRICES.map(({ rowKey, durKey, eur, all }) => (
                  <tr
                    key={rowKey}
                    style={{ borderBottom: "1px solid var(--line)" }}
                  >
                    <td
                      className="py-4 text-[15px] font-medium"
                      style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
                    >
                      {t(rowKey)}
                    </td>
                    <td className="py-4 label-mono" style={{ color: "var(--muted)" }}>
                      {t(durKey)}
                    </td>
                    <td
                      className="py-4 font-heading text-[20px]"
                      style={{ color: "var(--ink)" }}
                    >
                      {eur}
                    </td>
                    <td className="py-4 label-mono" style={{ color: "var(--muted)" }}>
                      {all}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Editorial notes */}
            <div className="mt-8 flex flex-col gap-2">
              {(["note1", "note2", "note3"] as const).map((key) => (
                <p
                  key={key}
                  className="text-[13px] italic"
                  style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
                >
                  — {t(key)}
                </p>
              ))}
            </div>
          </section>

          {/* ── What is included ── */}
          <section className="py-12" style={{ borderBottom: "1px solid var(--line)" }}>
            <h2
              className="font-heading text-[32px] leading-tight mb-8"
              style={{ color: "var(--ink)" }}
            >
              {t("included_title")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
              {includedItems.map((item, i) => (
                <div
                  key={i}
                  className="py-3 text-[14px]"
                  style={{
                    borderTop: "1px solid var(--line)",
                    color: "var(--ink)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="py-12">
            <h2
              className="font-heading text-[32px] leading-tight mb-8"
              style={{ color: "var(--ink)" }}
            >
              {t("faq_title")}
            </h2>
            <div style={{ borderTop: "1px solid var(--line)" }}>
              {FAQ_PAIRS.map(([qKey, aKey]) => (
                <FaqItem
                  key={qKey}
                  q={t(qKey)}
                  a={t(aKey)}
                />
              ))}
            </div>
          </section>

          {/* ── Bottom CTA ── */}
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 py-12"
            style={{ borderTop: "1px solid var(--line)" }}
          >
            <div>
              <p
                className="font-heading text-[28px] leading-tight mb-1"
                style={{ color: "var(--ink)" }}
              >
                Ready to book?
              </p>
              <p className="label-mono" style={{ color: "var(--muted)" }}>
                No account required. Select a specialist and pay at booking.
              </p>
            </div>
            <Link
              href="/doctors"
              className="label-mono flex h-12 items-center px-8 transition-opacity hover:opacity-80 shrink-0"
              style={{
                background: "var(--ink)",
                color: "var(--bone)",
                borderRadius: "var(--r)",
              }}
            >
              Browse specialists →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
