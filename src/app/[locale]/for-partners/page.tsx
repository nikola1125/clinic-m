"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

// ── Zod schema ──────────────────────────────────────────────────────────────

const schema = z.object({
  business_name: z.string().min(2),
  nipt: z.string().min(3).max(30),
  partner_type: z.enum(["Pharmacy", "Lab", "Imaging", "Other"]),
  city: z.string().min(2),
  address: z.string().min(5),
  contact_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  services: z.array(z.string()),
  coverage_area: z.string().optional(),
  expected_volume: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const SERVICES_LIST = [
  "Prescription Dispensing","OTC Medications","Blood Tests","Urine Analysis",
  "Hormonal Panels","Imaging (X-ray)","Ultrasound","MRI","CT Scan",
  "Vaccination","Blood Pressure Monitoring","Diabetes Management",
  "Allergy Testing","Nutritional Counseling","Home Delivery",
];

// ── Onboarding step cards ──────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    n: "01",
    title: "Aplikoni & verifikoheni",
    body: "Plotësoni formularin e mëposhtëm. Ekipi ynë shqyrton aplikimin brenda 5 ditëve pune dhe konfirmon partneritetin.",
  },
  {
    n: "02",
    title: "Integrimi teknik",
    body: "Platformën e lidhim me sistemin tuaj të inventarit ose laboratorit nëpërmjet API ose importit manual — pa nevojë për zhvillues nga ana juaj.",
  },
  {
    n: "03",
    title: "Komisionet & pagesa",
    body: "Merrni 80% të vlerës neto të çdo porosie ose shërbimi të drejtuar nga platforma. Pagesa çdo 15 ditë në llogarinë bankare.",
  },
  {
    n: "04",
    title: "Raportim & rritje",
    body: "Dashboardi i partnerit ofron analitikë kohore — volumi, kthimet, demografikët e pacientëve — dhe mbështetje dedikuar 24/7.",
  },
];

// ── Shared primitives ───────────────────────────────────────────────────────

function HLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="label-mono block mb-2" style={{ color: "var(--muted)" }}>
      {children}
    </label>
  );
}

function HInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }
) {
  const { error, ...rest } = props;
  return (
    <div>
      <input
        {...rest}
        className="w-full bg-transparent outline-none text-[15px] py-2"
        style={{
          borderBottom: `1px solid ${error ? "var(--oxblood)" : "var(--ink)"}`,
          color: "var(--ink)",
          fontFamily: "var(--font-sans)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderBottomWidth = "2px";
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderBottomWidth = "1px";
          rest.onBlur?.(e);
        }}
      />
      {error && (
        <p className="label-mono mt-1" style={{ color: "var(--oxblood)" }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function ForPartnersPage() {
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { services: [] },
  });

  const selectedServices = watch("services") ?? [];

  function toggleService(s: string) {
    const next = selectedServices.includes(s)
      ? selectedServices.filter((x) => x !== s)
      : [...selectedServices, s];
    setValue("services", next);
  }

  const onSubmit = async (data: FormValues) => {
    setServerError("");
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/applications/partner`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail ?? "Submission failed");
      }
      const result = await res.json();
      setReference(result.reference);
      setSubmitted(true);
    } catch (e: any) {
      setServerError(e.message || "Dërgimi dështoi. Ju lutem provoni përsëri.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 72 }}>

        {/* ── Hero ── */}
        <section
          className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20"
          style={{ borderBottom: "1px solid var(--line)" }}
        >
          <p className="label-mono mb-3" style={{ color: "var(--muted)" }}>
            PARTNERITET
          </p>
          <h1
            className="font-heading leading-tight mb-6"
            style={{
              fontSize: "clamp(32px, 5vw, 64px)",
              color: "var(--ink)",
              maxWidth: "20ch",
            }}
          >
            Zgjeroni rrjetin tuaj. Shërbeni pacientë të referuar.
          </h1>
          <p
            className="text-[18px] leading-relaxed"
            style={{
              color: "var(--muted)",
              fontFamily: "var(--font-sans)",
              maxWidth: "56ch",
            }}
          >
            Farmacitë, laboratorët dhe qendrat e imazherisë bashkohen me Mirean
            për të marrë referime direkte nga mjekët tanë — me pagesa transparente
            dhe integrim të thjeshtë.
          </p>
        </section>

        {/* ── How it works ── */}
        <section
          className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16"
          style={{ borderBottom: "1px solid var(--line)" }}
        >
          <p className="label-mono mb-10" style={{ color: "var(--muted)" }}>
            SI FUNKSIONON
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
            {HOW_IT_WORKS.map(({ n, title, body }, i) => (
              <div
                key={n}
                className="py-6 pr-8"
                style={{
                  borderRight:
                    i < HOW_IT_WORKS.length - 1
                      ? "1px solid var(--line)"
                      : "none",
                }}
              >
                <p
                  className="font-heading text-[48px] leading-none mb-4"
                  style={{ color: "var(--line)" }}
                >
                  {n}
                </p>
                <h3
                  className="font-heading text-[20px] mb-3"
                  style={{ color: "var(--ink)" }}
                >
                  {title}
                </h3>
                <p
                  className="text-[13px] leading-relaxed"
                  style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Stats strip ── */}
        <section
          className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10"
          style={{ borderBottom: "1px solid var(--line)" }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { value: "340+", label: "Receta të referuara / muaj" },
              { value: "22", label: "Partnerë aktivë" },
              { value: "48h", label: "Kohë mesatare integrimi" },
              { value: "80%", label: "Komision neto për partner" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p
                  className="font-heading text-[36px] leading-none mb-1"
                  style={{ color: "var(--ink)" }}
                >
                  {value}
                </p>
                <p className="label-mono" style={{ color: "var(--muted)" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Application form ── */}
        <section
          className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          <p className="label-mono mb-2" style={{ color: "var(--muted)" }}>
            FORMULARI I APLIKIMIT
          </p>
          <h2
            className="font-heading text-[36px] leading-tight mb-10"
            style={{ color: "var(--ink)" }}
          >
            Aplikoni si partner.
          </h2>

          {submitted ? (
            <div className="py-10" style={{ borderTop: "1px solid var(--line)" }}>
              <p className="label-mono mb-3" style={{ color: "var(--muted)" }}>
                APLIKIMI U PRANUA
              </p>
              <h3
                className="font-heading text-[28px] mb-4"
                style={{ color: "var(--ink)" }}
              >
                Faleminderit. Ekipi ynë do t'ju kontaktojë brenda 5 ditëve pune.
              </h3>
              <div
                className="py-4 mb-6"
                style={{
                  borderTop: "1px solid var(--line)",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <p className="label-mono mb-1" style={{ color: "var(--muted)" }}>
                  KOD REFERIMI
                </p>
                <p
                  className="font-heading text-[24px]"
                  style={{ color: "var(--ink)" }}
                >
                  {reference}
                </p>
              </div>
              <p className="label-mono" style={{ color: "var(--muted)" }}>
                Ruajeni kodin e referimit për korrespondencë të mëtejshme.
              </p>
            </div>
          ) : (
            <div
              style={{
                border: "1px solid var(--line)",
                borderRadius: "var(--r)",
                padding: "2.5rem",
              }}
            >
              {serverError && (
                <div
                  className="mb-6 py-3"
                  style={{ borderTop: "1px solid var(--oxblood)" }}
                >
                  <p className="label-mono" style={{ color: "var(--oxblood)" }}>
                    {serverError}
                  </p>
                </div>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-7"
              >
                {/* Business info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                  <div>
                    <HLabel>EMRI I BIZNESIT *</HLabel>
                    <HInput
                      {...register("business_name")}
                      placeholder="Farmacia Rilindja"
                      error={errors.business_name?.message}
                    />
                  </div>
                  <div>
                    <HLabel>NIPT *</HLabel>
                    <HInput
                      {...register("nipt")}
                      placeholder="L91234567A"
                      error={errors.nipt?.message}
                    />
                  </div>
                </div>

                {/* Type */}
                <div>
                  <HLabel>LLOJI I PARTNERIT *</HLabel>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(["Pharmacy", "Lab", "Imaging", "Other"] as const).map(
                      (t) => (
                        <label
                          key={t}
                          className="label-mono flex items-center gap-2 cursor-pointer px-3 h-8 transition-colors"
                          style={{
                            border: "1px solid var(--line)",
                            borderRadius: "var(--r)",
                          }}
                        >
                          <input
                            type="radio"
                            value={t}
                            {...register("partner_type")}
                            className="hidden"
                          />
                          <span
                            style={{
                              color:
                                watch("partner_type") === t
                                  ? "var(--ink)"
                                  : "var(--muted)",
                              fontWeight:
                                watch("partner_type") === t ? 700 : 400,
                            }}
                          >
                            {t}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                  {errors.partner_type && (
                    <p
                      className="label-mono mt-1"
                      style={{ color: "var(--oxblood)" }}
                    >
                      {errors.partner_type.message}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-7"
                  style={{
                    borderTop: "1px solid var(--line)",
                    paddingTop: "1.5rem",
                  }}
                >
                  <div>
                    <HLabel>QYTETI *</HLabel>
                    <HInput
                      {...register("city")}
                      placeholder="Tiranë"
                      error={errors.city?.message}
                    />
                  </div>
                  <div>
                    <HLabel>ADRESA *</HLabel>
                    <HInput
                      {...register("address")}
                      placeholder="Rruga Myslym Shyri, Nr. 12"
                      error={errors.address?.message}
                    />
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                  <div>
                    <HLabel>KONTAKTI KRYESOR *</HLabel>
                    <HInput
                      {...register("contact_name")}
                      placeholder="Blerina Gjoni"
                      error={errors.contact_name?.message}
                    />
                  </div>
                  <div>
                    <HLabel>EMAIL *</HLabel>
                    <HInput
                      type="email"
                      {...register("email")}
                      placeholder="info@farmacia.al"
                      error={errors.email?.message}
                    />
                  </div>
                  <div>
                    <HLabel>TELEFON *</HLabel>
                    <HInput
                      type="tel"
                      {...register("phone")}
                      placeholder="+355 4 222 3344"
                      error={errors.phone?.message}
                    />
                  </div>
                </div>

                {/* Services */}
                <div
                  style={{
                    borderTop: "1px solid var(--line)",
                    paddingTop: "1.5rem",
                  }}
                >
                  <HLabel>SHËRBIMET E OFRUARA</HLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {SERVICES_LIST.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleService(s)}
                        className="label-mono px-3 h-7 transition-colors"
                        style={{
                          border: "1px solid var(--line)",
                          borderRadius: "var(--r)",
                          background: selectedServices.includes(s)
                            ? "var(--ink)"
                            : "transparent",
                          color: selectedServices.includes(s)
                            ? "var(--bone)"
                            : "var(--muted)",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Extra */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                  <div>
                    <HLabel>ZONA E MBULIMIT (opsional)</HLabel>
                    <HInput
                      {...register("coverage_area")}
                      placeholder="Tiranë, Durrës, Shkodër"
                    />
                  </div>
                  <div>
                    <HLabel>VOLUMI I PRITUR (opsional)</HLabel>
                    <HInput
                      {...register("expected_volume")}
                      placeholder="50-100 porosi / muaj"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <HLabel>SHËNIME SHTESË (opsionale)</HLabel>
                  <textarea
                    {...register("notes")}
                    rows={3}
                    className="w-full bg-transparent outline-none text-[15px] py-2 resize-none"
                    style={{
                      borderBottom: "1px solid var(--ink)",
                      color: "var(--ink)",
                      fontFamily: "var(--font-sans)",
                    }}
                    placeholder="Çdo informacion shtesë rreth biznesit tuaj, certifikimeve ose kërkesave specifike…"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="label-mono h-12 w-full transition-opacity hover:opacity-80 disabled:opacity-40 mt-2"
                  style={{
                    background: "var(--oxblood)",
                    color: "var(--bone)",
                    borderRadius: "var(--r)",
                  }}
                >
                  {isSubmitting ? "Duke dërguar…" : "Dërgoni Aplikimin →"}
                </button>
              </form>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
