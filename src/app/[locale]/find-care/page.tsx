"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { API_BASE_URL } from "@/lib/api";
import { AlertTriangle } from "lucide-react";

// ── Zod schema (mirrors backend TriageRequest) ────────────────────────────

const triageSchema = z.object({
  text: z.string().min(10, "Please describe your symptoms in at least 10 characters.").max(2000),
  locale: z.enum(["sq", "en", "it"]),
});

type TriageForm = z.infer<typeof triageSchema>;

// ── API response types ────────────────────────────────────────────────────

interface TriageSuggestion {
  specialty: string;
  confidence: number;
  rationale: string;
}

interface TriageResult {
  suggestions: TriageSuggestion[];
  red_flags: string[];
}

// ── Confidence bar ────────────────────────────────────────────────────────

function ConfidenceBar({ value, label }: { value: number; label: string }) {
  const pct = Math.round(value * 100);
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        <span className="label-mono" style={{ color: "var(--muted)" }}>{label}</span>
        <span className="label-mono">{pct}%</span>
      </div>
      <div className="h-px w-full" style={{ background: "var(--line)" }}>
        <div
          className="h-px"
          style={{ width: `${pct}%`, background: "var(--ink)", transition: "width 600ms ease" }}
        />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function FindCarePage() {
  const t = useTranslations("findCare");
  const locale = useLocale() as "sq" | "en" | "it";
  const [result, setResult] = useState<TriageResult | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const quickChips: string[] = t.raw("quickChips") as string[];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TriageForm>({
    resolver: zodResolver(triageSchema),
    defaultValues: { text: "", locale },
  });

  const currentText = watch("text");

  async function onSubmit(data: TriageForm) {
    setServerError(null);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/triage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status === 429) {
        setServerError("Rate limit reached — please wait before submitting again.");
        return;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setServerError(err.detail ?? "An error occurred. Please try again.");
        return;
      }
      setResult(await res.json());
    } catch {
      setServerError("Unable to reach the server. Please check your connection.");
    }
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 72 }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

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

          {/* ── Form ── */}
          <form onSubmit={handleSubmit(onSubmit)} className="py-12">

            {/* Textarea */}
            <div className="mb-6">
              <textarea
                {...register("text")}
                rows={6}
                placeholder={t("placeholder")}
                className="w-full bg-transparent resize-none outline-none text-[20px] leading-relaxed py-3 transition-all duration-200"
                style={{
                  fontFamily: "var(--font-sans)",
                  color: "var(--ink)",
                  borderBottom: errors.text
                    ? "2px solid var(--oxblood)"
                    : "1px solid var(--ink)",
                }}
                onFocus={(e) => {
                  if (!errors.text) {
                    e.currentTarget.style.borderBottomWidth = "2px";
                  }
                }}
                onBlur={(e) => {
                  if (!errors.text) {
                    e.currentTarget.style.borderBottomWidth = "1px";
                  }
                }}
              />
              {errors.text && (
                <p className="label-mono mt-1" style={{ color: "var(--oxblood)" }}>
                  {errors.text.message}
                </p>
              )}
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {quickChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setValue("text", chip)}
                  className="label-mono px-3 h-7 transition-colors cursor-pointer"
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: "var(--r)",
                    background: currentText === chip ? "var(--ink)" : "transparent",
                    color: currentText === chip ? "var(--bone)" : "var(--muted)",
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Controls row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Language select */}
              <div className="flex items-center gap-3">
                <label className="label-mono shrink-0">{t("lang_label")}</label>
                <select
                  {...register("locale")}
                  className="label-mono bg-transparent outline-none cursor-pointer"
                  style={{
                    color: "var(--ink)",
                    border: "1px solid var(--line)",
                    borderRadius: "var(--r)",
                    padding: "4px 12px",
                    height: 28,
                  }}
                >
                  <option value="sq">SQ</option>
                  <option value="en">EN</option>
                  <option value="it">IT</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="label-mono flex h-10 items-center px-6 transition-opacity hover:opacity-80 disabled:opacity-40"
                style={{
                  background: "var(--oxblood)",
                  color: "var(--bone)",
                  borderRadius: "var(--r)",
                  cursor: isSubmitting ? "default" : "pointer",
                }}
              >
                {isSubmitting ? t("analysing") : t("analyse_btn")}
              </button>
            </div>

            {serverError && (
              <p className="label-mono mt-4" style={{ color: "var(--oxblood)" }}>
                {serverError}
              </p>
            )}
          </form>

          {/* ── Results ── */}
          {result && (
            <section style={{ borderTop: "1px solid var(--line)" }} className="py-12">

              {/* Red flags box */}
              {result.red_flags.length > 0 && (
                <div
                  className="mb-10 p-5"
                  style={{
                    border: "1px solid var(--oxblood)",
                    borderRadius: "var(--r)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle
                      className="h-[14px] w-[14px] shrink-0"
                      style={{ color: "var(--oxblood)" }}
                      aria-hidden="true"
                    />
                    <span className="label-mono" style={{ color: "var(--oxblood)" }}>
                      {t("red_flags_title")}
                    </span>
                  </div>
                  <p
                    className="text-[13px] mb-3"
                    style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
                  >
                    {t("red_flags_note")}
                  </p>
                  <ul className="space-y-1">
                    {result.red_flags.map((flag, i) => (
                      <li
                        key={i}
                        className="text-[14px]"
                        style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
                      >
                        — {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              <p className="label-mono mb-6">{t("result_label")}</p>
              <div
                className="grid gap-px"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(result.suggestions.length, 3)}, 1fr)`,
                  border: "1px solid var(--line)",
                  borderRadius: "var(--r)",
                }}
              >
                {result.suggestions.map((s, i) => (
                  <div
                    key={s.specialty}
                    className="p-6"
                    style={{
                      borderLeft: i > 0 ? "1px solid var(--line)" : "none",
                      background: "var(--bone)",
                    }}
                  >
                    <p className="font-heading text-[32px] leading-tight mb-3" style={{ color: "var(--ink)" }}>
                      {s.specialty}
                    </p>
                    <p
                      className="text-[14px] italic leading-relaxed mb-4"
                      style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
                    >
                      {s.rationale}
                    </p>
                    <ConfidenceBar value={s.confidence} label={t("confidence_label")} />
                    <Link
                      href={`/doctors?specialty=${encodeURIComponent(s.specialty)}`}
                      className="label-mono block mt-5 transition-opacity hover:opacity-60"
                      style={{ color: "var(--ink)" }}
                    >
                      See {s.specialty} specialists →
                    </Link>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <p
                className="label-mono mt-8 leading-relaxed"
                style={{ color: "var(--muted)", borderTop: "1px solid var(--line)", paddingTop: "1.5rem" }}
              >
                {t("disclaimer")}
              </p>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
