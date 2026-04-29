import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { API_BASE_URL, type DoctorDetail } from "@/lib/api";
import { ArrowLeft, ShieldCheck } from "lucide-react";

// ── Data fetching ─────────────────────────────────────────────────────────

async function fetchDoctor(slug: string): Promise<DoctorDetail | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/registry/doctors/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── Metadata + JSON-LD ────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata> {
  const doc = await fetchDoctor(params.slug);
  if (!doc) return {};
  return {
    title: `${doc.name} — ${doc.specialty} | MjekOn`,
    description: doc.bio.slice(0, 160),
    openGraph: {
      title: `${doc.name} — ${doc.specialty}`,
      description: doc.bio.slice(0, 160),
      images: doc.portrait_url ? [doc.portrait_url] : [],
    },
  };
}

function PhysicianJsonLd({ doc }: { doc: DoctorDetail }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doc.name,
    image: doc.portrait_url ?? undefined,
    description: doc.bio,
    medicalSpecialty: doc.specialty,
    hospitalAffiliation: doc.affiliations,
    knowsLanguage: doc.languages,
    hasCredential: doc.license_number
      ? { "@type": "EducationalOccupationalCredential", credentialCategory: doc.license_number }
      : undefined,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Section heading ───────────────────────────────────────────────────────

function SectionHead({ label }: { label: string }) {
  return (
    <h2
      className="label-mono py-4"
      style={{ borderTop: "1px solid var(--line)", color: "var(--muted)" }}
    >
      {label}
    </h2>
  );
}

// ── FAQ accordion (native details/summary) ────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details
      className="group"
      style={{ borderBottom: "1px solid var(--line)" }}
    >
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
          className="label-mono ml-4 shrink-0 transition-transform group-open:rotate-45"
          style={{ color: "var(--muted)" }}
        >
          +
        </span>
      </summary>
      <p
        className="pb-4 text-[14px] leading-relaxed"
        style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
      >
        {a}
      </p>
    </details>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function DoctorProfilePage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const [doc, t] = await Promise.all([
    fetchDoctor(params.slug),
    getTranslations("doctors"),
  ]);

  if (!doc) notFound();
  const doctor = doc!;

  return (
    <>
      <PhysicianJsonLd doc={doctor} />
      <Navbar />
      <main style={{ paddingTop: 72 }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* ── Breadcrumb ── */}
          <div
            className="flex items-center gap-2 py-4"
            style={{ borderBottom: "1px solid var(--line)" }}
          >
            <Link
              href="/doctors"
              className="label-mono flex items-center gap-1 transition-opacity hover:opacity-60"
              style={{ color: "var(--muted)" }}
            >
              <ArrowLeft className="h-[11px] w-[11px]" aria-hidden="true" />
              {t("breadcrumb_registry")}
            </Link>
            <span className="label-mono" style={{ color: "var(--line)" }}>/</span>
            <span className="label-mono" style={{ color: "var(--ink)" }}>{doctor.name}</span>
          </div>

          {/* ── Two-column layout ── */}
          <div className="flex flex-col lg:flex-row gap-12 py-12">

            {/* ── Left: sticky sidebar (320px) ── */}
            <aside
              className="shrink-0 lg:sticky lg:top-[88px] lg:self-start"
              style={{ width: "100%", maxWidth: 320 }}
            >
              {/* Portrait */}
              <div
                className="relative w-full overflow-hidden mb-6"
                style={{
                  aspectRatio: "4/5",
                  borderRadius: "var(--r)",
                  background: "var(--bone-2)",
                  filter: "grayscale(15%)",
                }}
              >
                {doctor.portrait_url ? (
                  <Image
                    src={doctor.portrait_url}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                    sizes="320px"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-heading text-[72px] opacity-20" style={{ color: "var(--ink)" }}>
                      {doctor.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Meta table */}
              <table className="w-full mb-6" style={{ borderCollapse: "collapse" }}>
                <tbody>
                  {[
                    { k: "Specialty", v: doctor.specialty },
                    { k: "Hospital", v: doctor.hospital },
                    { k: "Country", v: doctor.country },
                    { k: "Experience", v: t("years_exp", { n: doctor.years_experience }) },
                    { k: "Avg. response", v: t("avg_response", { min: doctor.avg_response_minutes }) },
                    { k: "License", v: doctor.license_number },
                    { k: "Authority", v: doctor.license_authority },
                  ].map(({ k, v }) =>
                    v ? (
                      <tr key={k} style={{ borderBottom: "1px solid var(--line)" }}>
                        <td className="label-mono py-2 pr-4" style={{ color: "var(--muted)", width: "40%" }}>{k}</td>
                        <td className="label-mono py-2" style={{ color: "var(--ink)" }}>{v}</td>
                      </tr>
                    ) : null
                  )}
                </tbody>
              </table>

              {/* License verified badge */}
              <div
                className="flex items-center gap-2 mb-6 px-3 py-2"
                style={{ border: "1px solid var(--line)", borderRadius: "var(--r)" }}
              >
                <ShieldCheck className="h-[14px] w-[14px] shrink-0" style={{ color: "var(--sage)" }} aria-hidden="true" />
                <span className="label-mono" style={{ color: "var(--sage)" }}>{t("license_verified")}</span>
              </div>

              {/* Primary CTA */}
              <Link
                href={`/book?doctor=${doctor.slug}`}
                className="flex h-12 w-full items-center justify-center label-mono transition-opacity hover:opacity-80"
                style={{
                  background: "var(--ink)",
                  color: "var(--bone)",
                  borderRadius: "var(--r)",
                }}
              >
                {t("book_cta", { name: doctor.name.split(" ").slice(-1)[0] })}
              </Link>
            </aside>

            {/* ── Right: scrolling content ── */}
            <div className="flex-1 min-w-0">

              {/* Display name + specialty */}
              <p className="label-mono mb-3" style={{ color: "var(--oxblood)" }}>
                {doctor.specialty} · {doctor.hospital}
              </p>
              <h1
                className="font-heading leading-none mb-4"
                style={{ fontSize: "clamp(40px, 5vw, 64px)", color: "var(--ink)" }}
              >
                {doctor.name}
              </h1>

              {/* About */}
              <SectionHead label={t("section_about")} />
              <p
                className="text-[16px] leading-relaxed mb-8"
                style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
              >
                {doctor.bio}
              </p>

              {/* Training */}
              {doctor.training.length > 0 && (
                <>
                  <SectionHead label={t("section_training")} />
                  <div className="mb-8">
                    {doctor.training.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start justify-between gap-4 py-3"
                        style={{ borderBottom: "1px solid var(--line)" }}
                      >
                        <div>
                          <p className="text-[15px] font-medium" style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}>
                            {item.degree}
                          </p>
                          <p className="label-mono mt-0.5">{item.institution}</p>
                        </div>
                        <span className="label-mono shrink-0">{item.year}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Hospital affiliations */}
              {doctor.affiliations.length > 0 && (
                <>
                  <SectionHead label={t("section_affiliations")} />
                  <div className="flex flex-wrap gap-2 mb-8">
                    {doctor.affiliations.map((aff) => (
                      <span
                        key={aff}
                        className="label-mono px-3 h-7 flex items-center"
                        style={{ border: "1px solid var(--line)", borderRadius: "var(--r)" }}
                      >
                        {aff}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* Publications */}
              {doctor.publications.length > 0 && (
                <>
                  <SectionHead label={t("section_publications")} />
                  <div className="mb-8">
                    {doctor.publications.map((pub, i) => (
                      <div
                        key={i}
                        className="py-3"
                        style={{ borderBottom: "1px solid var(--line)" }}
                      >
                        <p className="text-[14px] italic" style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}>
                          {pub.title}
                        </p>
                        <p className="label-mono mt-1">{pub.journal} · {pub.year}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Languages */}
              {doctor.languages.length > 0 && (
                <>
                  <SectionHead label={t("section_languages")} />
                  <div className="flex flex-wrap gap-2 mb-8">
                    {doctor.languages.map((lang) => (
                      <span
                        key={lang}
                        className="label-mono px-3 h-7 flex items-center"
                        style={{ border: "1px solid var(--line)", borderRadius: "var(--r)" }}
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* Typical cases */}
              {doctor.cases.length > 0 && (
                <>
                  <SectionHead label={t("section_cases")} />
                  <div className="flex flex-wrap gap-2 mb-8">
                    {doctor.cases.map((c) => (
                      <span
                        key={c}
                        className="label-mono px-3 h-7 flex items-center"
                        style={{
                          background: "var(--bone-2)",
                          border: "1px solid var(--line)",
                          borderRadius: "var(--r)",
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* Testimonials */}
              {doctor.testimonials.length > 0 && (
                <>
                  <SectionHead label={t("section_testimonials")} />
                  <div className="mb-8 flex flex-col gap-6">
                    {doctor.testimonials.map((item, i) => (
                      <blockquote
                        key={i}
                        className="pl-4"
                        style={{ borderLeft: "2px solid var(--oxblood)" }}
                      >
                        <p
                          className="font-heading text-[20px] leading-snug mb-2"
                          style={{ color: "var(--ink)" }}
                        >
                          &ldquo;{item.quote}&rdquo;
                        </p>
                        <footer className="label-mono">
                          {item.patient} · {item.detail}
                        </footer>
                      </blockquote>
                    ))}
                  </div>
                </>
              )}

              {/* FAQ */}
              <SectionHead label={t("section_faq")} />
              <div className="mb-12" style={{ borderTop: "1px solid var(--line)" }}>
                <FaqItem q={t("faq_q1")} a={t("faq_a1")} />
                <FaqItem q={t("faq_q2")} a={t("faq_a2")} />
                <FaqItem q={t("faq_q3")} a={t("faq_a3")} />
                <FaqItem q={t("faq_q4")} a={t("faq_a4")} />
              </div>

              {/* Bottom CTA */}
              <div
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-8"
                style={{ borderTop: "1px solid var(--line)" }}
              >
                <div>
                  <p className="font-heading text-[24px]" style={{ color: "var(--ink)" }}>
                    {doctor.name}
                  </p>
                  <p className="label-mono mt-1">{doctor.specialty} · {doctor.license_authority}</p>
                </div>
                <Link
                  href={`/book?doctor=${doctor.slug}`}
                  className="label-mono flex h-12 items-center px-8 transition-opacity hover:opacity-80 shrink-0"
                  style={{
                    background: "var(--ink)",
                    color: "var(--bone)",
                    borderRadius: "var(--r)",
                  }}
                >
                  {t("book_cta", { name: doctor.name.split(" ").slice(-1)[0] })}
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
