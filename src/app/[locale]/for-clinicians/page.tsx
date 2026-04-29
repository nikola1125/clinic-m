"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

// ── 60 specialties ─────────────────────────────────────────────────────────

const SPECIALTIES_60 = [
  "Allergy & Immunology","Anesthesiology","Cardiology","Cardiothoracic Surgery",
  "Clinical Genetics","Colorectal Surgery","Dermatology","Emergency Medicine",
  "Endocrinology","Family Medicine","Forensic Medicine","Gastroenterology",
  "General Medicine","General Surgery","Geriatrics","Gynecologic Oncology",
  "Gynecology","Hand Surgery","Hematology","Hepatology","Infectious Disease",
  "Internal Medicine","Interventional Cardiology","Interventional Radiology",
  "Medical Oncology","Neonatology","Nephrology","Neurology","Neurosurgery",
  "Nuclear Medicine","Obstetrics","Occupational Medicine","Ophthalmology",
  "Oral & Maxillofacial Surgery","Orthopedics","Otolaryngology","Palliative Care",
  "Pediatric Cardiology","Pediatric Surgery","Pediatrics","Physical Therapy",
  "Physiatry","Plastic Surgery","Psychiatry","Pulmonology","Radiation Oncology",
  "Radiology","Reproductive Medicine","Rheumatology","Sleep Medicine",
  "Sports Medicine","Surgical Oncology","Transplant Surgery","Trauma Surgery",
  "Urology","Vascular Surgery","Venereology","Virology","Wound Care",
  "Preventive Medicine",
];

const LANGUAGES = [
  "Albanian","English","Italian","German","French","Turkish","Greek",
  "Serbian","Arabic","Spanish","Portuguese","Romanian","Macedonian",
];

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const TIMES = ["Morning (08–12)","Afternoon (12–17)","Evening (17–21)"];

// ── Zod schema ──────────────────────────────────────────────────────────────

const schema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  country_of_practice: z.string().min(2),
  license_number: z.string().min(2),
  license_authority: z.string().min(2),
  specialty: z.string().min(2),
  years_experience: z.number().int().min(0).max(60),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  hospital_affiliation: z.string().optional(),
  essay: z.string().min(10).max(600),
  availability: z.record(z.string(), z.record(z.string(), z.boolean())).optional(),
});

type FormValues = z.infer<typeof schema>;

// ── Shared primitives ───────────────────────────────────────────────────────

function HLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="label-mono block mb-2" style={{ color: "var(--muted)" }}>
      {children}
    </label>
  );
}

function HInput(props: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  const { error, ...rest } = props;
  return (
    <div>
      <input
        {...rest}
        className="w-full bg-transparent outline-none text-[15px] py-2"
        style={{ borderBottom: `1px solid ${error ? "var(--oxblood)" : "var(--ink)"}`, color: "var(--ink)", fontFamily: "var(--font-sans)" }}
        onFocus={(e) => { e.currentTarget.style.borderBottomWidth = "2px"; rest.onFocus?.(e); }}
        onBlur={(e) => { e.currentTarget.style.borderBottomWidth = "1px"; rest.onBlur?.(e); }}
      />
      {error && <p className="label-mono mt-1" style={{ color: "var(--oxblood)" }}>{error}</p>}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function ForCliniciansPage() {
  const [specialtyQuery, setSpecialtyQuery] = useState("");
  const [specialtyOpen, setSpecialtyOpen] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [essayLen, setEssayLen] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      languages: [],
      availability: {},
    },
  });

  const selectedSpecialty = watch("specialty");
  const selectedLangs = watch("languages") ?? [];

  const filteredSpecialties = SPECIALTIES_60.filter((s) =>
    s.toLowerCase().includes(specialtyQuery.toLowerCase())
  );

  function toggleLang(lang: string) {
    const current = selectedLangs;
    const next = current.includes(lang)
      ? current.filter((l) => l !== lang)
      : [...current, lang];
    setValue("languages", next, { shouldValidate: true });
  }

  const onSubmit = async (data: FormValues) => {
    setServerError("");
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/applications/doctor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          availability: data.availability ?? {},
          languages: data.languages,
        }),
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
          <p className="label-mono mb-3" style={{ color: "var(--muted)" }}>JOIN</p>
          <h1
            className="font-heading leading-tight mb-6"
            style={{ fontSize: "clamp(32px, 5vw, 64px)", color: "var(--ink)", maxWidth: "18ch" }}
          >
            Praktikoni nga ku jeni. Trajtoni pacientë që flasin gjuhën tuaj.
          </h1>
          <p
            className="text-[18px] leading-relaxed"
            style={{ color: "var(--muted)", fontFamily: "var(--font-sans)", maxWidth: "56ch" }}
          >
            Mirea u jep mjekëve të diasporës shqiptare një rrugë për të ofruar kujdes cilësor
            ndaj pacientëve në Shqipëri dhe Kosovë — pa e braktisur karrierën europiane.
          </p>
        </section>

        {/* ── 3-col value props ── */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {[
              { n: "01", title: "Infrastrukturë e gatshme", body: "Platforma, sistemet e pagesave, dosjet elektronike dhe mbështetja administrative — të gjitha të menaxhuara nga ne." },
              { n: "02", title: "Pacientë që ju besojnë", body: "Pacientët shqipfonjës zgjedhin mjekun sipas specializimit, gjuhës dhe avansit. Ju gjeni raste klinike që ju interesojnë." },
              { n: "03", title: "Kushtet tuaja", body: "Vendosni disponueshmërinë tuaj. Dy orë në javë ose njëzet — platforma adaptohet me orarin tuaj klinik europian." },
            ].map(({ n, title, body }) => (
              <div
                key={n}
                className="py-8 pr-8"
                style={{ borderRight: "1px solid var(--line)" }}
              >
                <p className="label-mono mb-4" style={{ color: "var(--muted)" }}>{n}</p>
                <h3 className="font-heading text-[22px] mb-3" style={{ color: "var(--ink)" }}>{title}</h3>
                <p className="text-[14px] leading-relaxed" style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}>{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Data strip ── */}
        <section
          className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10"
          style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { value: "€1,200+", label: "Fitime mesatare / muaj" },
              { value: "8h", label: "Orë admin të kursyera / javë" },
              { value: "4.9 / 5", label: "Vlerësim mesatar mjekësh" },
              { value: "12 min", label: "Kohë mesatare rezervimi" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-heading text-[36px] leading-none mb-1" style={{ color: "var(--ink)" }}>{value}</p>
                <p className="label-mono" style={{ color: "var(--muted)" }}>{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pull-quotes ── */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            {[
              {
                quote: "Punoja çdo të shtunë mëngjes me pacientë nga Shkodra. Nuk duhej të bëja asnjë telefonatë administrative — platforma i menaxhon të gjitha.",
                author: "Dr. Fiona Krasniqi",
                role: "Kardiologe, Charité Berlin",
              },
              {
                quote: "Pacientët e mi bisedonin shqip. Kjo ndryshon gjithçka — besimi vendoset shumë më shpejt kur nuk ka barrierë gjuhësore.",
                author: "Dr. Artan Muçollari",
                role: "Neurolog, AKH Vienna",
              },
            ].map(({ quote, author, role }) => (
              <blockquote key={author} className="pl-6" style={{ borderLeft: "2px solid var(--oxblood)" }}>
                <p className="font-heading italic text-[22px] leading-snug mb-4" style={{ color: "var(--ink)" }}>
                  "{quote}"
                </p>
                <p className="label-mono" style={{ color: "var(--muted)" }}>{author} — {role}</p>
              </blockquote>
            ))}
          </div>
        </section>

        {/* ── Application form ── */}
        <section
          className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          <p className="label-mono mb-2" style={{ color: "var(--muted)" }}>FORMULARI I APLIKIMIT</p>
          <h2 className="font-heading text-[36px] leading-tight mb-10" style={{ color: "var(--ink)" }}>
            Aplikoni si mjek.
          </h2>

          {submitted ? (
            <div className="py-10" style={{ borderTop: "1px solid var(--line)" }}>
              <p className="label-mono mb-3" style={{ color: "var(--muted)" }}>APLIKIMI U PRANUA</p>
              <h3 className="font-heading text-[28px] mb-4" style={{ color: "var(--ink)" }}>
                Faleminderit. Do t'ju kontaktojmë brenda 5 ditëve pune.
              </h3>
              <div className="py-4 mb-6" style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
                <p className="label-mono mb-1" style={{ color: "var(--muted)" }}>KOD REFERIMI</p>
                <p className="font-heading text-[24px]" style={{ color: "var(--ink)" }}>{reference}</p>
              </div>
              <p className="label-mono" style={{ color: "var(--muted)" }}>
                Ruajeni kodin e referimit për korrespondencë të mëtejshme.
              </p>
            </div>
          ) : (
            <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r)", padding: "2.5rem" }}>
              {serverError && (
                <div className="mb-6 py-3" style={{ borderTop: "1px solid var(--oxblood)" }}>
                  <p className="label-mono" style={{ color: "var(--oxblood)" }}>{serverError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
                {/* Basic info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                  <div>
                    <HLabel>EMRI I PLOTË *</HLabel>
                    <HInput {...register("full_name")} placeholder="Dr. Artan Hoxha" error={errors.full_name?.message} />
                  </div>
                  <div>
                    <HLabel>EMAIL *</HLabel>
                    <HInput type="email" {...register("email")} placeholder="name@hospital.de" error={errors.email?.message} />
                  </div>
                  <div>
                    <HLabel>TELEFON</HLabel>
                    <HInput type="tel" {...register("phone")} placeholder="+49 151 000 0000" />
                  </div>
                  <div>
                    <HLabel>VENDI I PRAKTIKËS *</HLabel>
                    <HInput {...register("country_of_practice")} placeholder="Gjermania" error={errors.country_of_practice?.message} />
                  </div>
                </div>

                {/* License */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-7" style={{ borderTop: "1px solid var(--line)", paddingTop: "1.5rem" }}>
                  <div>
                    <HLabel>NR. I LICENSËS MJEKËSORE *</HLabel>
                    <HInput {...register("license_number")} placeholder="DE-2847-MED" error={errors.license_number?.message} />
                  </div>
                  <div>
                    <HLabel>AUTORITETI LËSHUES *</HLabel>
                    <HInput {...register("license_authority")} placeholder="Landesärztekammer Bayern" error={errors.license_authority?.message} />
                  </div>
                </div>

                {/* Specialty searchable combobox */}
                <div style={{ borderTop: "1px solid var(--line)", paddingTop: "1.5rem" }}>
                  <HLabel>SPECIALIZIMI *</HLabel>
                  <div className="relative">
                    <input
                      type="text"
                      value={specialtyQuery || selectedSpecialty || ""}
                      onChange={(e) => { setSpecialtyQuery(e.target.value); setSpecialtyOpen(true); }}
                      onFocus={() => setSpecialtyOpen(true)}
                      placeholder="Kërkoni specializimin tuaj…"
                      className="w-full bg-transparent outline-none text-[15px] py-2"
                      style={{ borderBottom: "1px solid var(--ink)", color: "var(--ink)", fontFamily: "var(--font-sans)" }}
                    />
                    {specialtyOpen && filteredSpecialties.length > 0 && (
                      <div
                        className="absolute z-20 w-full max-h-52 overflow-y-auto"
                        style={{ background: "var(--bone)", border: "1px solid var(--line)", borderRadius: "var(--r)", top: "100%", marginTop: 4 }}
                      >
                        {filteredSpecialties.map((s) => (
                          <button
                            key={s}
                            type="button"
                            className="w-full text-left px-4 py-2 label-mono transition-colors hover:opacity-60"
                            style={{ color: "var(--ink)", borderBottom: "1px solid var(--line)" }}
                            onMouseDown={() => {
                              setValue("specialty", s, { shouldValidate: true });
                              setSpecialtyQuery("");
                              setSpecialtyOpen(false);
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.specialty && <p className="label-mono mt-1" style={{ color: "var(--oxblood)" }}>{errors.specialty.message}</p>}
                </div>

                {/* Years + hospital */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                  <div>
                    <HLabel>VJET EKSPERIENCE *</HLabel>
                    <HInput type="number" min={0} max={60} {...register("years_experience", { valueAsNumber: true })} placeholder="8" error={errors.years_experience?.message} />
                  </div>
                  <div>
                    <HLabel>INSTITUCIONI (opsional)</HLabel>
                    <HInput {...register("hospital_affiliation")} placeholder="Charité Berlin" />
                  </div>
                </div>

                {/* Languages */}
                <div style={{ borderTop: "1px solid var(--line)", paddingTop: "1.5rem" }}>
                  <HLabel>GJUHËT * (zgjidhni të gjitha)</HLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLang(lang)}
                        className="label-mono px-3 h-7 transition-colors"
                        style={{
                          border: "1px solid var(--line)",
                          borderRadius: "var(--r)",
                          background: selectedLangs.includes(lang) ? "var(--ink)" : "transparent",
                          color: selectedLangs.includes(lang) ? "var(--bone)" : "var(--muted)",
                        }}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                  {errors.languages && <p className="label-mono mt-2" style={{ color: "var(--oxblood)" }}>{errors.languages.message}</p>}
                </div>

                {/* Availability grid */}
                <div style={{ borderTop: "1px solid var(--line)", paddingTop: "1.5rem" }}>
                  <HLabel>DISPONUESHMËRIA (opsionale)</HLabel>
                  <div className="overflow-x-auto mt-2">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th className="label-mono pb-2 text-left" style={{ color: "var(--muted)", width: 120 }}></th>
                          {DAYS.map((d) => (
                            <th key={d} className="label-mono pb-2 text-center" style={{ color: "var(--muted)" }}>{d}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {TIMES.map((time) => (
                          <tr key={time}>
                            <td className="label-mono py-2 pr-4" style={{ color: "var(--muted)", fontSize: 10 }}>{time}</td>
                            {DAYS.map((day) => (
                              <td key={day} className="text-center py-2">
                                <Controller
                                  name={`availability.${time}.${day}` as any}
                                  control={control}
                                  render={({ field }) => (
                                    <input
                                      type="checkbox"
                                      checked={!!field.value}
                                      onChange={(e) => field.onChange(e.target.checked)}
                                      className="h-4 w-4 cursor-pointer"
                                      style={{ accentColor: "var(--oxblood)" }}
                                    />
                                  )}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Essay */}
                <div style={{ borderTop: "1px solid var(--line)", paddingTop: "1.5rem" }}>
                  <div className="flex items-center justify-between mb-2">
                    <HLabel>PSE MIREA? (max 600 karaktere) *</HLabel>
                    <span className="label-mono" style={{ color: essayLen > 580 ? "var(--oxblood)" : "var(--muted)" }}>
                      {essayLen}/600
                    </span>
                  </div>
                  <textarea
                    {...register("essay")}
                    rows={5}
                    maxLength={600}
                    onInput={(e) => setEssayLen((e.target as HTMLTextAreaElement).value.length)}
                    placeholder="Përshkruani motivimin tuaj për t'u bashkuar me platformën dhe si mendoni të kontribuoni ndaj pacientëve shqipfonjës…"
                    className="w-full bg-transparent outline-none text-[15px] py-2 resize-none"
                    style={{ borderBottom: `1px solid ${errors.essay ? "var(--oxblood)" : "var(--ink)"}`, color: "var(--ink)", fontFamily: "var(--font-sans)" }}
                  />
                  {errors.essay && <p className="label-mono mt-1" style={{ color: "var(--oxblood)" }}>{errors.essay.message}</p>}
                </div>

                {/* CV upload */}
                <div style={{ borderTop: "1px solid var(--line)", paddingTop: "1.5rem" }}>
                  <HLabel>CV (PDF, maks. 5MB)</HLabel>
                  <label
                    className="label-mono flex items-center gap-3 cursor-pointer transition-opacity hover:opacity-70"
                    style={{ color: "var(--ink)" }}
                  >
                    <span style={{ border: "1px solid var(--line)", borderRadius: "var(--r)", padding: "4px 12px" }}>
                      {cvFile ? cvFile.name : "Ngarko CV →"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f && f.size <= 5 * 1024 * 1024) setCvFile(f);
                      }}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="label-mono h-12 w-full transition-opacity hover:opacity-80 disabled:opacity-40 mt-2"
                  style={{ background: "var(--oxblood)", color: "var(--bone)", borderRadius: "var(--r)" }}
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
