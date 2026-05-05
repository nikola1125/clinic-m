/**
 * One-time migration: imports all hardcoded journal articles into Sanity.
 *
 * Setup:
 *   1. Get a write token from https://www.sanity.io/manage → project → API → Tokens → Add API token (Editor)
 *   2. Run:  SANITY_TOKEN=your_token node scripts/migrate-to-sanity.mjs
 */

import { createClient } from "@sanity/client";

const PROJECT_ID = "ernhozas";
const DATASET = "production";
const TOKEN = process.env.SANITY_TOKEN;

if (!TOKEN) {
  console.error("Error: SANITY_TOKEN env var is required.");
  console.error("Get a token at: https://www.sanity.io/manage → API → Tokens");
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  token: TOKEN,
  useCdn: false,
});

// ── Convert JournalSection[] to Portable Text blocks ──────────────────────
function toBlocks(sections) {
  return sections.map((s, i) => {
    const styleMap = {
      paragraph: "normal",
      heading: "h2",
      subheading: "h3",
      pullquote: "blockquote",
    };
    return {
      _type: "block",
      _key: `block_${i}`,
      style: styleMap[s.type] || "normal",
      children: [{ _type: "span", _key: `span_${i}`, text: s.text, marks: [] }],
      markDefs: [],
    };
  });
}

// ── Hardcoded articles data ────────────────────────────────────────────────
const ARTICLES = [
  {
    slug: "resting-heart-rate-what-it-reveals",
    title: "What your resting heart rate reveals about your health",
    category: "Cardiology",
    date: "2026-04-12",
    dek: "A cardiologist at Charité Berlin explains the numbers — and when you should book a check.",
    readMinutes: 7,
    author: { name: "Dr. Elona Hoxha", role: "Cardiologist — American Hospital Tirana", doctorSlug: "elona-hoxha" },
    content: [
      { type: "paragraph", text: "Your resting heart rate — the number of times your heart beats per minute while you are at rest — is one of the most accessible windows into your cardiovascular health. For most adults it sits between 60 and 100 beats per minute, but cardiologists rarely look at the number alone." },
      { type: "paragraph", text: "Elite endurance athletes routinely record resting heart rates in the low 40s. Their hearts have adapted to pump more blood with each beat, so fewer beats are needed. If you have never been particularly active and your rate suddenly drops to 45, however, that warrants investigation. Context is everything." },
      { type: "pullquote", text: "A consistently elevated resting heart rate is a stronger predictor of all-cause mortality than hypertension alone." },
      { type: "paragraph", text: "Research published in the European Heart Journal found that men with a resting heart rate above 84 had a 55 percent higher risk of dying from cardiovascular causes compared to those with a rate under 65, independent of other risk factors. The relationship is not perfectly linear, but the trend is robust." },
      { type: "paragraph", text: "What raises your resting heart rate? Dehydration, anaemia, thyroid dysfunction, sleep deprivation, chronic stress, and even certain antihistamines all push the number up. Caffeine has a mild acute effect; regular aerobic exercise has a sustained lowering effect that compounds over months." },
      { type: "subheading", text: "When to see a cardiologist" },
      { type: "paragraph", text: "A single measurement means little — the trend over weeks matters more. Most modern smartwatches measure resting heart rate during sleep with reasonable accuracy. If you consistently record values above 90 at rest, or notice your rate rising over several months without a clear cause, a 12-lead ECG and a conversation with a cardiologist is the right next step." },
      { type: "paragraph", text: "The good news: interventions are straightforward. A structured aerobic programme three to five times per week for twelve weeks will lower most people's resting heart rate by five to ten beats. That modest change, sustained, meaningfully reduces your lifetime cardiovascular risk." },
    ],
  },
  {
    slug: "echocardiography-guide-patients",
    title: "Echocardiography: what patients need to know",
    category: "Cardiology",
    date: "2026-03-28",
    dek: "An echo is not an X-ray and not an MRI. Understanding what it shows — and what it misses — helps you ask better questions.",
    readMinutes: 6,
    author: { name: "Dr. Fatos Zeneli", role: "Senior Cardiologist — QKUM Tirana", doctorSlug: "fatos-zeneli" },
    content: [
      { type: "paragraph", text: "When I tell a patient we are going to perform an echocardiogram, the most common response is a mix of anxiety and confusion. 'Is it serious?' they ask. The answer, almost always, is that an echocardiogram is a diagnostic tool, not a sentence." },
      { type: "paragraph", text: "An echo uses ultrasound waves to create real-time images of your heart — its chambers, valves, wall motion, and ejection fraction. It is painless, involves no radiation, and takes roughly thirty minutes. The transthoracic variant, where a probe is placed on your chest, is the standard first step." },
      { type: "pullquote", text: "Ejection fraction is not a score out of 100. It is the percentage of blood your ventricle pumps with each beat — and 55% is normal, not disappointing." },
      { type: "paragraph", text: "The ejection fraction number tends to worry patients disproportionately. A healthy left ventricle ejects roughly 55 to 70 percent of the blood it contains with each beat. Anything below 40 percent is considered reduced and may indicate heart failure. Values between 40 and 50 are described as mildly reduced and warrant monitoring." },
      { type: "paragraph", text: "What echocardiography cannot tell you: coronary artery blockages. For that you need a CT coronary angiogram or invasive catheterisation. An echo shows the consequences of coronary disease — reduced wall motion, scarring — but not the blockages themselves. This distinction matters when interpreting your results." },
    ],
  },
  {
    slug: "atrial-fibrillation-everyday-life",
    title: "Living with atrial fibrillation: what changes and what does not",
    category: "Cardiology",
    date: "2026-02-14",
    dek: "AF is the most common heart rhythm disorder. Most patients can lead full, active lives with the right management plan.",
    readMinutes: 8,
    author: { name: "Dr. Shpend Limani", role: "Electrophysiologist — UCCK Prishtina", doctorSlug: "shpend-limani" },
    content: [
      { type: "paragraph", text: "Atrial fibrillation affects roughly one in fifty adults worldwide, making it the most common sustained cardiac arrhythmia. When I tell patients they have AF, I am careful to distinguish between what the diagnosis means clinically and how it will feel in practice — because often, the two are very different." },
      { type: "pullquote", text: "The most important goal in AF management is not eliminating every irregular beat. It is preventing stroke." },
      { type: "subheading", text: "Rate control vs rhythm control" },
      { type: "paragraph", text: "For many years, rate control — slowing the ventricular response to a manageable rhythm — was considered equivalent to rhythm control. More recent data from the EAST-AFNET trial challenged this, showing that early rhythm control in patients diagnosed within a year significantly reduced a composite of cardiovascular death, stroke, and hospitalisation." },
      { type: "paragraph", text: "Catheter ablation involves threading catheters to the heart and electrically isolating the pulmonary veins — the typical origin of AF triggers. In paroxysmal AF patients who have failed one antiarrhythmic drug, ablation results in freedom from AF in roughly 70 to 80 percent of cases at twelve months." },
    ],
  },
  {
    slug: "five-questions-before-specialist-visit",
    title: "Five questions to ask before your first specialist visit",
    category: "Prevention",
    date: "2026-04-08",
    dek: "Coming prepared saves time and leads to better outcomes. Here is what matters most.",
    readMinutes: 5,
    author: { name: "Dr. Spartak Rama", role: "General Practitioner — Polyclinic Nr. 3 Tirana", doctorSlug: "spartak-rama" },
    content: [
      { type: "paragraph", text: "The average specialist appointment in Albania lasts eleven minutes. That is not enough time for a thorough history if the patient arrives unprepared. As a GP, much of my referral work is actually coaching patients on how to use that eleven minutes well." },
      { type: "pullquote", text: "Bring a one-page symptom timeline. Date, symptom, severity on a scale of 1–10, what made it better or worse. This alone can halve the time needed for a history." },
      { type: "paragraph", text: "Fifth, and perhaps most importantly: What would you like to leave the appointment knowing? This forces you to prioritise. If the answer is 'do I have condition X?' — say that explicitly at the start of the appointment. Specialists are problem-solvers. Give them the problem." },
    ],
  },
  {
    slug: "second-opinions-change-diagnoses",
    title: "Second opinions: when they change the diagnosis",
    category: "Prevention",
    date: "2026-03-10",
    dek: "New data shows one in five oncology diagnoses is revised after an independent review.",
    readMinutes: 6,
    author: { name: "Dr. Genci Zhupa", role: "Medical Oncologist — QKUM Tirana", doctorSlug: "genci-zhupa" },
    content: [
      { type: "paragraph", text: "In oncology, a second opinion is not an expression of doubt in your doctor's competence. It is a standard of care. The Mayo Clinic found that 88 percent of patients who sought a second opinion received either a refined diagnosis, a new diagnosis, or a different treatment recommendation." },
      { type: "pullquote", text: "A pathology slide does not change when a second pathologist reviews it. The interpretation does." },
      { type: "paragraph", text: "The practical advice: when you receive a diagnosis that will meaningfully change your life — a cancer, a chronic autoimmune condition, a recommendation for major surgery — seek a written second opinion before proceeding." },
    ],
  },
  {
    slug: "health-anxiety-between-consultations",
    title: "Managing health anxiety between consultations",
    category: "Mental Health",
    date: "2026-04-02",
    dek: "Our psychiatry partners share practical strategies for patients awaiting results.",
    readMinutes: 7,
    author: { name: "Dr. Ilir Ramaj", role: "Psychiatrist — Private Practice Tirana", doctorSlug: "ilir-ramaj" },
    content: [
      { type: "paragraph", text: "The period between a worrying symptom and a definitive diagnosis is, for many patients, the most psychologically distressing part of the entire illness experience. Uncertainty is uniquely threatening to the human mind." },
      { type: "pullquote", text: "Googling symptoms at 2am is not information-seeking. It is reassurance-seeking — and the relief it provides lasts approximately nine minutes." },
      { type: "subheading", text: "Practical strategies for the waiting period" },
      { type: "paragraph", text: "Time-boxed information: give yourself one fifteen-minute window per day to think about your health concern. Outside that window, when an anxious thought arises, note it mentally — 'I will address this at 7pm' — and redirect. This is not avoidance; it is scheduling." },
    ],
  },
  {
    slug: "burnout-doctors-patients",
    title: "When your doctor is burning out: what it means for your care",
    category: "Mental Health",
    date: "2026-02-28",
    dek: "Physician burnout is a patient safety issue, not only a workforce problem.",
    readMinutes: 6,
    author: { name: "Dr. Rudina Demiri", role: "Psychiatrist — QKUM Tirana", doctorSlug: "rudina-demiri" },
    content: [
      { type: "paragraph", text: "A 2024 survey by the Albanian Medical Chamber found that 61 percent of physicians working in public hospitals reported significant burnout symptoms, and 34 percent reported active thoughts of emigrating within the next two years." },
      { type: "pullquote", text: "Diagnostic error rates double in physicians with high depersonalisation scores. This is not a judgement — it is a physiological consequence of sustained overwork." },
      { type: "paragraph", text: "For patients: trust your instincts. If a consultation feels rushed or dismissive in a way that does not reflect your understanding of your situation, it is entirely appropriate to seek a second opinion or request a different appointment time." },
    ],
  },
  {
    slug: "fever-children-when-to-worry",
    title: "Fever in children: when to treat, when to watch, when to worry",
    category: "Pediatrics",
    date: "2026-04-18",
    dek: "Most fevers in children are harmless. Knowing the exceptions could save a life.",
    readMinutes: 8,
    author: { name: "Dr. Olta Petani", role: "Paediatrician — Spitali Pediatrik Tiranë", doctorSlug: "olta-petani" },
    content: [
      { type: "paragraph", text: "A fever in a child is one of the most common reasons for emergency department visits in Albania — and one of the most common situations where the emergency department visit could have been avoided." },
      { type: "pullquote", text: "A child who is alert, making eye contact, and can be distracted by a toy at 39.5°C is far less worrying than a quiet, floppy child at 38.2°C." },
      { type: "subheading", text: "The 3-3-3 rule for worried parents" },
      { type: "paragraph", text: "Under 3 months: any fever requires same-day medical assessment. 3 to 36 months: fever with no identifiable source should be evaluated if it persists beyond 48 hours. Over 3 years: fever alone, in an alert, well-hydrated child, can generally be managed at home for 48 to 72 hours." },
    ],
  },
  {
    slug: "childhood-asthma-trigger-management",
    title: "Childhood asthma: identifying and controlling triggers at home",
    category: "Pediatrics",
    date: "2026-03-05",
    dek: "Environmental control is as important as medication in paediatric asthma management.",
    readMinutes: 6,
    author: { name: "Dr. Fitore Aliu", role: "Paediatric Pulmonologist — UCCK Prishtina", doctorSlug: "fitore-aliu" },
    content: [
      { type: "paragraph", text: "Asthma is the most common chronic disease of childhood, affecting roughly one in eight children in Kosovo and Albania. Its management is both straightforward and frequently suboptimal." },
      { type: "pullquote", text: "A child who wheezes only in their grandmother's house with a cat is not a complicated asthma case. They are a child with a cat allergy." },
      { type: "paragraph", text: "House dust mite control is the highest-yield intervention for mite-sensitised children. Impermeable mattress and pillow covers, washing bedding weekly above 60°C, and reducing soft furnishings in the bedroom have all demonstrated benefit in randomised trials." },
    ],
  },
  {
    slug: "thyroid-disorders-albanian-women",
    title: "Thyroid disorders in Albanian women: an underdiagnosed epidemic",
    category: "Nutrition",
    date: "2026-02-20",
    dek: "New figures from QKUM suggest diagnosis rates remain 40% below the EU average.",
    readMinutes: 7,
    author: { name: "Dr. Aurora Selmani", role: "Endocrinologist — Hygeia Hospital Tirana", doctorSlug: "aurora-selmani" },
    content: [
      { type: "paragraph", text: "Albania's iodine deficiency problem has been quietly improving since salt iodisation was mandated in the early 2000s. But the legacy of two decades of insufficient iodine intake means that thyroid disorders remain disproportionately common, and disproportionately undiagnosed, in Albanian women." },
      { type: "pullquote", text: "If you are a woman over 35 in Albania and you have never had your TSH measured, you should ask your GP to order it today." },
      { type: "paragraph", text: "Beyond iodine, selenium deficiency — also prevalent in Albanian soils — impairs the conversion of T4 to the active T3 form. Brazil nuts, two per day, provide the recommended daily selenium intake and cost next to nothing." },
    ],
  },
  {
    slug: "mediterranean-diet-cardiovascular-protection",
    title: "The Mediterranean diet and cardiovascular protection: what the evidence actually says",
    category: "Nutrition",
    date: "2026-01-30",
    dek: "PREDIMED and its replication tell us something important — and something often misunderstood.",
    readMinutes: 6,
    author: { name: "Dr. Elona Hoxha", role: "Cardiologist — American Hospital Tirana", doctorSlug: "elona-hoxha" },
    content: [
      { type: "paragraph", text: "The PREDIMED trial randomised 7,447 participants at high cardiovascular risk to three diets. The Mediterranean groups showed such striking reductions in major cardiovascular events that the trial was stopped early." },
      { type: "pullquote", text: "The Mediterranean diet is not a cuisine. It is an eating pattern: abundant plant foods, olive oil as the primary fat, fish twice a week, red meat rarely, wine moderately with meals." },
      { type: "paragraph", text: "The practical implication for Albanian and Kosovar patients: the traditional Albanian diet is already close to the Mediterranean pattern. Returning to traditional eating patterns is evidence-based medicine." },
    ],
  },
  {
    slug: "ultra-processed-food-inflammation",
    title: "Ultra-processed food and chronic inflammation: the mechanism that matters",
    category: "Nutrition",
    date: "2026-01-15",
    dek: "The Nova classification changed how nutritional epidemiology thinks about food. Here is why it matters clinically.",
    readMinutes: 5,
    author: { name: "Dr. Eneida Daka", role: "Endocrinologist — QKUM Tirana", doctorSlug: "eneida-daka" },
    content: [
      { type: "paragraph", text: "The Nova classification system sorts foods not by nutrient content but by the degree of industrial processing they have undergone. Ultra-processed foods are formulations of substances derived from food or synthesised in laboratories." },
      { type: "pullquote", text: "Emulsifiers, found in nearly every ultra-processed food, disrupt the gut mucous layer that separates luminal bacteria from the intestinal epithelium. The resulting low-grade endotoxaemia drives systemic inflammation." },
      { type: "paragraph", text: "From a clinical perspective, this matters most in patients with metabolic syndrome, type 2 diabetes, inflammatory bowel disease, and non-alcoholic fatty liver disease." },
    ],
  },
];

// ── Migration ──────────────────────────────────────────────────────────────

async function migrate() {
  console.log("Starting migration to Sanity...\n");

  // 1. Create unique categories
  const categoryNames = [...new Set(ARTICLES.map((a) => a.category))];
  const categoryMap = {};

  for (const name of categoryNames) {
    const existing = await client.fetch(`*[_type == "category" && title == $name][0]`, { name });
    if (existing) {
      categoryMap[name] = existing._id;
      console.log(`  Category exists: ${name}`);
    } else {
      const doc = await client.create({ _type: "category", title: name });
      categoryMap[name] = doc._id;
      console.log(`  Created category: ${name}`);
    }
  }

  // 2. Create unique authors
  const authorMap = {};
  const seenAuthors = new Map();
  for (const a of ARTICLES) {
    seenAuthors.set(a.author.doctorSlug, a.author);
  }

  for (const [slug, author] of seenAuthors) {
    const existing = await client.fetch(`*[_type == "author" && slug.current == $slug][0]`, { slug });
    if (existing) {
      authorMap[slug] = existing._id;
      console.log(`  Author exists: ${author.name}`);
    } else {
      const doc = await client.create({
        _type: "author",
        name: author.name,
        role: author.role,
        slug: { _type: "slug", current: slug },
      });
      authorMap[slug] = doc._id;
      console.log(`  Created author: ${author.name}`);
    }
  }

  // 3. Create articles
  console.log("\nMigrating articles...");
  for (const article of ARTICLES) {
    const existing = await client.fetch(`*[_type == "article" && slug.current == $slug][0]`, { slug: article.slug });
    if (existing) {
      console.log(`  Skipping (exists): ${article.title}`);
      continue;
    }

    await client.create({
      _type: "article",
      title: article.title,
      slug: { _type: "slug", current: article.slug },
      dek: article.dek,
      publishedAt: article.date,
      readMinutes: article.readMinutes,
      featured: false,
      category: { _type: "reference", _ref: categoryMap[article.category] },
      author: { _type: "reference", _ref: authorMap[article.author.doctorSlug] },
      body: toBlocks(article.content),
    });
    console.log(`  ✓ Created: ${article.title}`);
  }

  console.log("\nMigration complete!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
