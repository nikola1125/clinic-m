"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SkeletonCard } from "@/components/SkeletonCard";
import { EmptyState } from "@/components/EmptyState";
import { api, type DoctorListItem } from "@/lib/api";

// ── Filter chips definition ───────────────────────────────────────────────

const SPECIALTY_CHIPS = [
  "Cardiology", "Neurology", "Gynecology", "Oncology",
  "Orthopedics", "Dermatology", "Pediatrics", "Psychiatry",
  "Endocrinology", "Gastroenterology", "Pulmonology", "Urology",
  "ENT", "Ophthalmology", "Rheumatology", "General Surgery",
  "Nephrology", "Hematology", "Neurosurgery", "General Medicine",
  "Radiology", "Infectious Disease",
];

const LANGUAGE_CHIPS = ["Albanian", "English", "Italian", "German", "French", "Turkish"];
const COUNTRY_CHIPS = ["Albania", "Kosovo"];

// ── Chip button ───────────────────────────────────────────────────────────

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="label-mono px-3 h-7 transition-colors shrink-0"
      style={{
        border: "1px solid var(--line)",
        borderRadius: "var(--r)",
        background: active ? "var(--ink)" : "transparent",
        color: active ? "var(--bone)" : "var(--muted)",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

// ── Row item ──────────────────────────────────────────────────────────────

function DoctorRow({ doc, locale }: { doc: DoctorListItem; locale: string }) {
  const t = useTranslations("doctors");
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/doctors/${doc.slug}`}
      className="group grid items-start gap-6 py-8"
      style={{
        gridTemplateColumns: "200px 1fr",
        borderBottom: "1px solid var(--line)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Portrait */}
      <div
        className="relative shrink-0 overflow-hidden"
        style={{
          width: 200,
          height: 200,
          borderRadius: "var(--r)",
          background: "var(--bone-2)",
          filter: hovered ? "grayscale(60%) brightness(0.95)" : "grayscale(20%)",
          transition: "filter 300ms ease",
        }}
      >
        {doc.portrait_url ? (
          <Image
            src={doc.portrait_url}
            alt={doc.name}
            fill
            className="object-cover"
            sizes="200px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-heading text-[48px] opacity-20" style={{ color: "var(--ink)" }}>
              {doc.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Info stack */}
      <div className="min-w-0">
        <p className="label-mono mb-1" style={{ color: "var(--oxblood)" }}>
          {doc.specialty} · {doc.hospital}
        </p>
        <h2
          className="font-heading text-[28px] leading-tight mb-2 transition-transform duration-200"
          style={{
            color: "var(--ink)",
            transform: hovered ? "translateX(-4px)" : "translateX(0)",
          }}
        >
          {doc.name}
        </h2>
        <p
          className="text-[14px] italic leading-relaxed mb-4 line-clamp-2"
          style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
        >
          {doc.bio}
        </p>

        {/* Chips row */}
        <div className="flex flex-wrap gap-2 mb-4">
          {doc.languages.slice(0, 3).map((lang) => (
            <span
              key={lang}
              className="label-mono px-2 h-6 flex items-center"
              style={{ border: "1px solid var(--line)", borderRadius: "var(--r)" }}
            >
              {lang}
            </span>
          ))}
          <span
            className="label-mono px-2 h-6 flex items-center"
            style={{ border: "1px solid var(--line)", borderRadius: "var(--r)" }}
          >
            {t("years_exp", { n: doc.years_experience })}
          </span>
          <span
            className="label-mono px-2 h-6 flex items-center"
            style={{ border: "1px solid var(--line)", borderRadius: "var(--r)" }}
          >
            {t("avg_response", { min: doc.avg_response_minutes })}
          </span>
          <span
            className="label-mono px-2 h-6 flex items-center"
            style={{ border: "1px solid var(--line)", borderRadius: "var(--r)", color: "var(--sage)" }}
          >
            {doc.license_authority}
          </span>
        </div>

        <span
          className="label-mono transition-all duration-200"
          style={{
            color: "var(--ink)",
            borderBottom: hovered ? "1px solid var(--ink)" : "1px solid transparent",
          }}
        >
          {t("read_profile")}
        </span>
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function DoctorsPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = useTranslations("doctors");
  const searchParams = useSearchParams();
  const router = useRouter();

  const [doctors, setDoctors] = useState<DoctorListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [specialty, setSpecialty] = useState(searchParams.get("specialty") ?? "");
  const [language, setLanguage] = useState(searchParams.get("language") ?? "");
  const [country, setCountry] = useState(searchParams.get("country") ?? "");
  const [sort, setSort] = useState<"name" | "years_experience" | "avg_response_minutes">(
    (searchParams.get("sort") as any) ?? "name"
  );

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getDoctors({
        q: q || undefined,
        specialty: specialty || undefined,
        language: language || undefined,
        country: country || undefined,
        sort,
        limit: 40,
      });
      setDoctors(data.items);
      setTotal(data.total);
    } catch {
      setDoctors([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [q, specialty, language, country, sort]);

  useEffect(() => {
    const timer = setTimeout(loadDoctors, 300);
    return () => clearTimeout(timer);
  }, [loadDoctors]);

  function toggleSpecialty(s: string) {
    setSpecialty((prev) => (prev === s ? "" : s));
  }
  function toggleLanguage(l: string) {
    setLanguage((prev) => (prev === l ? "" : l));
  }
  function toggleCountry(c: string) {
    setCountry((prev) => (prev === c ? "" : c));
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 72 }}>
        {/* ── Hero ── */}
        <section
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
          style={{ borderBottom: "1px solid var(--line)" }}
        >
          <p className="label-mono mb-3">{t("registry_label")}</p>
          <h1
            className="font-heading text-[48px] lg:text-[64px] leading-none mb-4"
            style={{ color: "var(--ink)" }}
          >
            {t("hero_heading")}
          </h1>
          <p className="label-mono">{t("hero_subhead")}</p>
        </section>

        {/* ── Controls bar ── */}
        <div
          className="sticky z-30 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4"
          style={{
            top: 72,
            background: "rgba(245,241,234,0.97)",
            borderBottom: "1px solid var(--line)",
          }}
        >
          {/* Search row */}
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("search_placeholder")}
              className="flex-1 bg-transparent text-[14px] outline-none py-2"
              style={{
                borderBottom: "1px solid var(--ink)",
                color: "var(--ink)",
                fontFamily: "var(--font-sans)",
              }}
            />
            <div className="flex items-center gap-2 shrink-0">
              <label className="label-mono">{t("sort_label")}</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="label-mono bg-transparent outline-none cursor-pointer"
                style={{ color: "var(--ink)", border: "none" }}
              >
                <option value="name">{t("sort_name")}</option>
                <option value="years_experience">{t("sort_experience")}</option>
                <option value="avg_response_minutes">{t("sort_response")}</option>
              </select>
            </div>
            <span className="label-mono shrink-0" style={{ color: "var(--muted)" }}>
              {t("results_count", { count: total })}
            </span>
          </div>

          {/* Filter chips */}
          <div className="flex flex-col gap-2">
            {/* Specialty */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <span className="label-mono shrink-0" style={{ color: "var(--muted)", minWidth: 80 }}>
                {t("filter_specialty")}
              </span>
              {SPECIALTY_CHIPS.map((s) => (
                <Chip key={s} label={s} active={specialty === s} onClick={() => toggleSpecialty(s)} />
              ))}
            </div>
            {/* Language + Country */}
            <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
              <span className="label-mono shrink-0" style={{ color: "var(--muted)", minWidth: 80 }}>
                {t("filter_language")}
              </span>
              {LANGUAGE_CHIPS.map((l) => (
                <Chip key={l} label={l} active={language === l} onClick={() => toggleLanguage(l)} />
              ))}
              <span className="label-mono shrink-0 ml-4" style={{ color: "var(--muted)" }}>
                {t("filter_country")}
              </span>
              {COUNTRY_CHIPS.map((c) => (
                <Chip key={c} label={c} active={country === c} onClick={() => toggleCountry(c)} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Results grid ── */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} lines={3} showAvatar />
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <div className="py-16">
              <EmptyState
                label={t("empty_label")}
                title={t("empty_title")}
                body={t("empty_body")}
                action={
                  <button
                    onClick={() => { setQ(""); setSpecialty(""); setLanguage(""); setCountry(""); }}
                    className="label-mono transition-opacity hover:opacity-60"
                    style={{ color: "var(--ink)", textDecoration: "underline" }}
                  >
                    Clear all filters
                  </button>
                }
              />
            </div>
          ) : (
            <div>
              {doctors.map((doc) => (
                <DoctorRow key={doc.id} doc={doc} locale={params.locale} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
