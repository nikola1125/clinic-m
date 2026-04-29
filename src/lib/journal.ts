export type JournalCategory =
  | "Cardiology"
  | "Prevention"
  | "Mental Health"
  | "Pediatrics"
  | "Nutrition";

export interface JournalAuthor {
  name: string;
  role: string;
  doctorSlug?: string;
  bio: string;
  portraitUrl?: string;
  linkedIn?: string;
}

export interface JournalSection {
  type: "paragraph" | "pullquote" | "heading" | "subheading";
  text: string;
}

export interface JournalArticle {
  slug: string;
  title: string;
  category: JournalCategory;
  author: JournalAuthor;
  date: string;
  dek: string;
  readMinutes: number;
  content: JournalSection[];
}

export const JOURNAL_ARTICLES: JournalArticle[] = [
  // ── Cardiology ───────────────────────────────────────────────────────────
  {
    slug: "resting-heart-rate-what-it-reveals",
    title: "What your resting heart rate reveals about your health",
    category: "Cardiology",
    date: "2026-04-12",
    dek: "A cardiologist at Charité Berlin explains the numbers — and when you should book a check.",
    readMinutes: 7,
    author: {
      name: "Dr. Elona Hoxha",
      role: "Cardiologist — American Hospital Tirana",
      doctorSlug: "elona-hoxha",
      portraitUrl: "https://i.pravatar.cc/200?img=47",
      linkedIn: "https://linkedin.com",
      bio: "Dr. Hoxha trained at Charité Berlin and specialises in interventional cardiology. She has published on long-term PCI outcomes in Albanian cohorts.",
    },
    content: [
      {
        type: "paragraph",
        text: "Your resting heart rate — the number of times your heart beats per minute while you are at rest — is one of the most accessible windows into your cardiovascular health. For most adults it sits between 60 and 100 beats per minute, but cardiologists rarely look at the number alone.",
      },
      {
        type: "paragraph",
        text: "Elite endurance athletes routinely record resting heart rates in the low 40s. Their hearts have adapted to pump more blood with each beat, so fewer beats are needed. If you have never been particularly active and your rate suddenly drops to 45, however, that warrants investigation. Context is everything.",
      },
      {
        type: "pullquote",
        text: "A consistently elevated resting heart rate is a stronger predictor of all-cause mortality than hypertension alone.",
      },
      {
        type: "paragraph",
        text: "Research published in the European Heart Journal found that men with a resting heart rate above 84 had a 55 percent higher risk of dying from cardiovascular causes compared to those with a rate under 65, independent of other risk factors. The relationship is not perfectly linear, but the trend is robust.",
      },
      {
        type: "paragraph",
        text: "What raises your resting heart rate? Dehydration, anaemia, thyroid dysfunction, sleep deprivation, chronic stress, and even certain antihistamines all push the number up. Caffeine has a mild acute effect; regular aerobic exercise has a sustained lowering effect that compounds over months.",
      },
      {
        type: "subheading",
        text: "When to see a cardiologist",
      },
      {
        type: "paragraph",
        text: "A single measurement means little — the trend over weeks matters more. Most modern smartwatches measure resting heart rate during sleep with reasonable accuracy. If you consistently record values above 90 at rest, or notice your rate rising over several months without a clear cause, a 12-lead ECG and a conversation with a cardiologist is the right next step.",
      },
      {
        type: "paragraph",
        text: "The good news: interventions are straightforward. A structured aerobic programme three to five times per week for twelve weeks will lower most people's resting heart rate by five to ten beats. That modest change, sustained, meaningfully reduces your lifetime cardiovascular risk.",
      },
    ],
  },
  {
    slug: "echocardiography-guide-patients",
    title: "Echocardiography: what patients need to know",
    category: "Cardiology",
    date: "2026-03-28",
    dek: "An echo is not an X-ray and not an MRI. Understanding what it shows — and what it misses — helps you ask better questions.",
    readMinutes: 6,
    author: {
      name: "Dr. Fatos Zeneli",
      role: "Senior Cardiologist — QKUM Tirana",
      doctorSlug: "fatos-zeneli",
      portraitUrl: "https://i.pravatar.cc/200?img=63",
      linkedIn: "https://linkedin.com",
      bio: "Dr. Zeneli leads cardiac imaging at QKUM. He trained at Pitié-Salpêtrière and has 21 years of clinical experience.",
    },
    content: [
      {
        type: "paragraph",
        text: "When I tell a patient we are going to perform an echocardiogram, the most common response is a mix of anxiety and confusion. 'Is it serious?' they ask. The answer, almost always, is that an echocardiogram is a diagnostic tool, not a sentence.",
      },
      {
        type: "paragraph",
        text: "An echo uses ultrasound waves to create real-time images of your heart — its chambers, valves, wall motion, and ejection fraction. It is painless, involves no radiation, and takes roughly thirty minutes. The transthoracic variant, where a probe is placed on your chest, is the standard first step.",
      },
      {
        type: "pullquote",
        text: "Ejection fraction is not a score out of 100. It is the percentage of blood your ventricle pumps with each beat — and 55% is normal, not disappointing.",
      },
      {
        type: "paragraph",
        text: "The ejection fraction number tends to worry patients disproportionately. A healthy left ventricle ejects roughly 55 to 70 percent of the blood it contains with each beat. Anything below 40 percent is considered reduced and may indicate heart failure. Values between 40 and 50 are described as mildly reduced and warrant monitoring.",
      },
      {
        type: "paragraph",
        text: "What echocardiography cannot tell you: coronary artery blockages. For that you need a CT coronary angiogram or invasive catheterisation. An echo shows the consequences of coronary disease — reduced wall motion, scarring — but not the blockages themselves. This distinction matters when interpreting your results.",
      },
    ],
  },
  {
    slug: "atrial-fibrillation-everyday-life",
    title: "Living with atrial fibrillation: what changes and what does not",
    category: "Cardiology",
    date: "2026-02-14",
    dek: "AF is the most common heart rhythm disorder. Most patients can lead full, active lives with the right management plan.",
    readMinutes: 8,
    author: {
      name: "Dr. Shpend Limani",
      role: "Electrophysiologist — UCCK Prishtina",
      doctorSlug: "shpend-limani",
      portraitUrl: "https://i.pravatar.cc/200?img=59",
      linkedIn: "https://linkedin.com",
      bio: "Dr. Limani trained in electrophysiology at the Academic Medical Centre Amsterdam. He performs catheter ablation for atrial fibrillation and complex arrhythmias.",
    },
    content: [
      {
        type: "paragraph",
        text: "Atrial fibrillation affects roughly one in fifty adults worldwide, making it the most common sustained cardiac arrhythmia. When I tell patients they have AF, I am careful to distinguish between what the diagnosis means clinically and how it will feel in practice — because often, the two are very different.",
      },
      {
        type: "paragraph",
        text: "The atria — the upper chambers of the heart — fire chaotically instead of in organised pulses. The ventricular rate responds irregularly. Some patients feel palpitations intensely; others are entirely asymptomatic and discover AF on a routine ECG. Neither pattern predicts the seriousness of the condition.",
      },
      {
        type: "pullquote",
        text: "The most important goal in AF management is not eliminating every irregular beat. It is preventing stroke.",
      },
      {
        type: "paragraph",
        text: "Atrial fibrillation increases stroke risk fivefold because stagnant blood in the fibrillating left atrial appendage can form clots that travel to the brain. Anticoagulation — either with warfarin or, more commonly now, direct oral anticoagulants like apixaban or rivaroxaban — reduces that risk by roughly two-thirds. This is usually the first and most important medication decision.",
      },
      {
        type: "subheading",
        text: "Rate control vs rhythm control",
      },
      {
        type: "paragraph",
        text: "For many years, rate control — slowing the ventricular response to a manageable rhythm — was considered equivalent to rhythm control. More recent data from the EAST-AFNET trial challenged this, showing that early rhythm control in patients diagnosed within a year significantly reduced a composite of cardiovascular death, stroke, and hospitalisation.",
      },
      {
        type: "paragraph",
        text: "Catheter ablation, which I perform routinely, involves threading catheters to the heart and electrically isolating the pulmonary veins — the typical origin of AF triggers. In paroxysmal AF patients who have failed one antiarrhythmic drug, ablation results in freedom from AF in roughly 70 to 80 percent of cases at twelve months.",
      },
    ],
  },

  // ── Prevention ───────────────────────────────────────────────────────────
  {
    slug: "five-questions-before-specialist-visit",
    title: "Five questions to ask before your first specialist visit",
    category: "Prevention",
    date: "2026-04-08",
    dek: "Coming prepared saves time and leads to better outcomes. Here is what matters most.",
    readMinutes: 5,
    author: {
      name: "Dr. Spartak Rama",
      role: "General Practitioner — Polyclinic Nr. 3 Tirana",
      doctorSlug: "spartak-rama",
      portraitUrl: "https://i.pravatar.cc/200?img=62",
      linkedIn: "https://linkedin.com",
      bio: "Dr. Rama is a GP with a focus on preventive medicine. He consults on how primary care can better prepare patients for specialist referrals.",
    },
    content: [
      {
        type: "paragraph",
        text: "The average specialist appointment in Albania lasts eleven minutes. That is not enough time for a thorough history if the patient arrives unprepared. As a GP, much of my referral work is actually coaching patients on how to use that eleven minutes well.",
      },
      {
        type: "paragraph",
        text: "The first question to prepare: What exactly am I there to achieve? Many patients arrive hoping the specialist will 'figure it out'. Specialists appreciate patients who have articulated a specific concern — 'I want to understand why my left knee swells after runs longer than 8 km' is infinitely more useful than 'my knee hurts sometimes'.",
      },
      {
        type: "pullquote",
        text: "Bring a one-page symptom timeline. Date, symptom, severity on a scale of 1–10, what made it better or worse. This alone can halve the time needed for a history.",
      },
      {
        type: "paragraph",
        text: "The second question: What investigations has my GP already ordered, and what did they show? Bring printed results or have them on your phone. Repeating blood tests because a patient left results at home wastes everyone's time and money.",
      },
      {
        type: "paragraph",
        text: "Third: What medications are you taking, including supplements and over-the-counter drugs? Drug interactions are underappreciated by patients and even by some specialists who are not reviewing the full picture. Bring a list.",
      },
      {
        type: "paragraph",
        text: "Fourth: What is your family history for this condition? For cardiovascular, oncological, and neurological conditions, first-degree family history significantly changes the risk calculation and may unlock different investigations.",
      },
      {
        type: "paragraph",
        text: "Fifth, and perhaps most importantly: What would you like to leave the appointment knowing? This forces you to prioritise. If the answer is 'do I have condition X?' — say that explicitly at the start of the appointment. Specialists are problem-solvers. Give them the problem.",
      },
    ],
  },
  {
    slug: "second-opinions-change-diagnoses",
    title: "Second opinions: when they change the diagnosis",
    category: "Prevention",
    date: "2026-03-10",
    dek: "New data shows one in five oncology diagnoses is revised after an independent review.",
    readMinutes: 6,
    author: {
      name: "Dr. Genci Zhupa",
      role: "Medical Oncologist — QKUM Tirana",
      doctorSlug: "genci-zhupa",
      portraitUrl: "https://i.pravatar.cc/200?img=53",
      linkedIn: "https://linkedin.com",
      bio: "Dr. Zhupa leads the multidisciplinary tumour board at QKUM and has published on immunotherapy access in low-resource settings.",
    },
    content: [
      {
        type: "paragraph",
        text: "In oncology, a second opinion is not an expression of doubt in your doctor's competence. It is a standard of care. The Mayo Clinic found that 88 percent of patients who sought a second opinion received either a refined diagnosis, a new diagnosis, or a different treatment recommendation. In our own institutional audit at QKUM, roughly 22 percent of external pathology reviews resulted in a meaningful change to the initial diagnosis.",
      },
      {
        type: "paragraph",
        text: "The stakes are highest in histopathology — the microscopic examination of tissue. Distinguishing between a high-grade and a low-grade tumour, or between two subtypes that respond to entirely different drugs, requires extraordinary expertise. Most regional hospitals see a given tumour subtype perhaps twice a year. Large academic centres see it weekly. Experience creates pattern recognition that cannot be shortcut.",
      },
      {
        type: "pullquote",
        text: "A pathology slide does not change when a second pathologist reviews it. The interpretation does.",
      },
      {
        type: "paragraph",
        text: "Beyond oncology, second opinions matter in neurology, rare autoimmune disease, and complex spinal surgery — areas where the differential diagnosis is wide and the consequences of the wrong treatment are severe. In elective orthopaedic surgery, patients who seek a second opinion before a procedure choose non-surgical management at a rate that should give pause to any surgeon seeing 'obvious' surgical indications.",
      },
      {
        type: "paragraph",
        text: "The practical advice: when you receive a diagnosis that will meaningfully change your life — a cancer, a chronic autoimmune condition, a recommendation for major surgery — seek a written second opinion before proceeding. Most reputable specialists will support you in doing so. Those who do not are a signal in themselves.",
      },
    ],
  },

  // ── Mental Health ─────────────────────────────────────────────────────────
  {
    slug: "health-anxiety-between-consultations",
    title: "Managing health anxiety between consultations",
    category: "Mental Health",
    date: "2026-04-02",
    dek: "Our psychiatry partners share practical strategies for patients awaiting results.",
    readMinutes: 7,
    author: {
      name: "Dr. Ilir Ramaj",
      role: "Psychiatrist — Private Practice Tirana",
      doctorSlug: "ilir-ramaj",
      portraitUrl: "https://i.pravatar.cc/200?img=56",
      linkedIn: "https://linkedin.com",
      bio: "Dr. Ramaj trained at the Medical University Vienna and focuses on mood disorders, trauma, and health anxiety.",
    },
    content: [
      {
        type: "paragraph",
        text: "The period between a worrying symptom and a definitive diagnosis is, for many patients, the most psychologically distressing part of the entire illness experience. Uncertainty is uniquely threatening to the human mind. We are pattern-recognition machines; ambiguity is our greatest discomfort.",
      },
      {
        type: "paragraph",
        text: "Health anxiety — formally known as illness anxiety disorder or, in its more somatic presentations, somatic symptom disorder — affects roughly four to seven percent of the general population. It is dramatically underdiagnosed because patients present to physicians with physical complaints, not to psychiatrists with psychological ones.",
      },
      {
        type: "pullquote",
        text: "Googling symptoms at 2am is not information-seeking. It is reassurance-seeking — and the relief it provides lasts approximately nine minutes.",
      },
      {
        type: "paragraph",
        text: "The evidence base for health anxiety management converges on cognitive-behavioural therapy as the first-line intervention. The core technique is learning to tolerate uncertainty rather than attempting to eliminate it. Elimination is impossible; tolerance is a skill.",
      },
      {
        type: "subheading",
        text: "Practical strategies for the waiting period",
      },
      {
        type: "paragraph",
        text: "Time-boxed information: give yourself one fifteen-minute window per day to think about your health concern. Outside that window, when an anxious thought arises, note it mentally — 'I will address this at 7pm' — and redirect. This is not avoidance; it is scheduling.",
      },
      {
        type: "paragraph",
        text: "Body scanning with curiosity rather than alarm: anxiety amplifies sensations. A technique from acceptance and commitment therapy involves noticing a physical sensation — the tight chest, the twinge — and describing it in neutral, scientific language. Not 'this could be serious' but 'there is a sensation at about a 3/10 intensity in my mid-sternum, slightly worse on deep inspiration'. The reframe often reduces the alarm response markedly.",
      },
      {
        type: "paragraph",
        text: "If your health anxiety is significantly impairing your functioning — you are cancelling plans, seeking multiple consultations per month, unable to sleep — that is a clinical problem deserving clinical attention, not a moral failing. Please speak to a psychiatrist.",
      },
    ],
  },
  {
    slug: "burnout-doctors-patients",
    title: "When your doctor is burning out: what it means for your care",
    category: "Mental Health",
    date: "2026-02-28",
    dek: "Physician burnout is a patient safety issue, not only a workforce problem.",
    readMinutes: 6,
    author: {
      name: "Dr. Rudina Demiri",
      role: "Psychiatrist — QKUM Tirana",
      doctorSlug: "rudina-demiri",
      portraitUrl: "https://i.pravatar.cc/200?img=36",
      linkedIn: "https://linkedin.com",
      bio: "Dr. Demiri specialises in anxiety disorders and occupational mental health. She consults for several hospital systems on physician wellbeing programmes.",
    },
    content: [
      {
        type: "paragraph",
        text: "A 2024 survey by the Albanian Medical Chamber found that 61 percent of physicians working in public hospitals reported significant burnout symptoms, and 34 percent reported active thoughts of emigrating within the next two years. These are not abstract statistics. They have direct consequences for patients.",
      },
      {
        type: "paragraph",
        text: "Burnout manifests in three domains: emotional exhaustion, depersonalisation (a distancing from patients as coping mechanism), and reduced sense of personal accomplishment. The middle domain — depersonalisation — is the most dangerous from a patient perspective. A doctor who has mentally checked out does not order that extra investigation. Does not notice the subtle presentation. Does not call to follow up.",
      },
      {
        type: "pullquote",
        text: "Diagnostic error rates double in physicians with high depersonalisation scores. This is not a judgement — it is a physiological consequence of sustained overwork.",
      },
      {
        type: "paragraph",
        text: "Structural interventions are the only lasting solution. Adequate staffing, administrative burden reduction, and protected time away from clinical work. Individual interventions — mindfulness programmes, resilience training — have a modest evidence base and the troubling tendency to place the burden of systemic failure on the individual.",
      },
      {
        type: "paragraph",
        text: "For patients: trust your instincts. If a consultation feels rushed or dismissive in a way that does not reflect your understanding of your situation, it is entirely appropriate to seek a second opinion or request a different appointment time. This is not a criticism of your doctor — it is advocating for the quality of care you deserve.",
      },
    ],
  },

  // ── Pediatrics ────────────────────────────────────────────────────────────
  {
    slug: "fever-children-when-to-worry",
    title: "Fever in children: when to treat, when to watch, when to worry",
    category: "Pediatrics",
    date: "2026-04-18",
    dek: "Most fevers in children are harmless. Knowing the exceptions could save a life.",
    readMinutes: 8,
    author: {
      name: "Dr. Olta Petani",
      role: "Paediatrician — Spitali Pediatrik Tiranë",
      doctorSlug: "olta-petani",
      portraitUrl: "https://i.pravatar.cc/200?img=49",
      linkedIn: "https://linkedin.com",
      bio: "Dr. Petani trained at Great Ormond Street Hospital and specialises in neonatal care and childhood respiratory disease.",
    },
    content: [
      {
        type: "paragraph",
        text: "A fever in a child is one of the most common reasons for emergency department visits in Albania — and one of the most common situations where the emergency department visit could have been avoided. Not because the fever was not real, but because in most cases, a well parent with accurate information is more useful than a waiting room.",
      },
      {
        type: "paragraph",
        text: "Fever is defined as a core temperature above 38°C (100.4°F). It is a physiological response to infection, not a disease in itself. The temperature does not reliably predict severity; a child with bacterial meningitis may have a modest fever, while a child with a benign viral illness may spike to 40°C. What matters is how the child appears and behaves, not the number on the thermometer.",
      },
      {
        type: "pullquote",
        text: "A child who is alert, making eye contact, and can be distracted by a toy at 39.5°C is far less worrying than a quiet, floppy child at 38.2°C.",
      },
      {
        type: "subheading",
        text: "The 3-3-3 rule for worried parents",
      },
      {
        type: "paragraph",
        text: "Under 3 months: any fever requires same-day medical assessment. The immune system at this age cannot be trusted to signal severity through behaviour the way an older child's can. 3 to 36 months: fever with no identifiable source should be evaluated if it persists beyond 48 hours, or immediately if there are danger signs. Over 3 years: fever alone, in an alert, well-hydrated child, can generally be managed at home for 48 to 72 hours.",
      },
      {
        type: "paragraph",
        text: "The danger signs parents must know: non-blanching rash (press a glass against it — if it does not fade, call emergency services); bulging fontanelle in infants; neck stiffness; photophobia; persistent vomiting preventing oral rehydration; a child who cannot be woken or who looks critically unwell. These are not 'might be serious'. These are 'act now'.",
      },
    ],
  },
  {
    slug: "childhood-asthma-trigger-management",
    title: "Childhood asthma: identifying and controlling triggers at home",
    category: "Pediatrics",
    date: "2026-03-05",
    dek: "Environmental control is as important as medication in paediatric asthma management.",
    readMinutes: 6,
    author: {
      name: "Dr. Fitore Aliu",
      role: "Paediatric Pulmonologist — UCCK Prishtina",
      doctorSlug: "fitore-aliu",
      portraitUrl: "https://i.pravatar.cc/200?img=34",
      linkedIn: "https://linkedin.com",
      bio: "Dr. Aliu trained at Great Ormond Street Hospital and specialises in paediatric respiratory disease, including cystic fibrosis.",
    },
    content: [
      {
        type: "paragraph",
        text: "Asthma is the most common chronic disease of childhood, affecting roughly one in eight children in Kosovo and Albania. Its management is both straightforward and frequently suboptimal — not because effective medications are unavailable, but because environmental control receives inadequate attention at the clinical encounter.",
      },
      {
        type: "paragraph",
        text: "The common triggers fall into four categories: allergens (house dust mite, pet dander, mould, cockroach), irritants (tobacco smoke, wood-burning stoves, diesel exhaust), infections (particularly respiratory syncytial virus and rhinovirus in young children), and exercise — though the last is usually a sign of undertreated disease rather than a true contraindication to activity.",
      },
      {
        type: "pullquote",
        text: "A child who wheezes only in their grandmother's house with a cat is not a complicated asthma case. They are a child with a cat allergy.",
      },
      {
        type: "paragraph",
        text: "House dust mite control is the highest-yield intervention for mite-sensitised children. Impermeable mattress and pillow covers, washing bedding weekly above 60°C, and reducing soft furnishings in the bedroom have all demonstrated benefit in randomised trials. Removing the family pet is harder to recommend and enforce, but the evidence that it reduces exacerbations is robust.",
      },
      {
        type: "paragraph",
        text: "Indoor air quality in the Western Balkans is particularly relevant: wood and coal burning for heating is common in rural areas, and the particulate exposure it generates is strongly associated with both asthma exacerbations and long-term lung function decline. If the home is heated this way, we need to have an honest conversation about ventilation — and about whether the current inhaler regime is adequate for that level of exposure.",
      },
    ],
  },

  // ── Nutrition ─────────────────────────────────────────────────────────────
  {
    slug: "thyroid-disorders-albanian-women",
    title: "Thyroid disorders in Albanian women: an underdiagnosed epidemic",
    category: "Nutrition",
    date: "2026-02-20",
    dek: "New figures from QKUM suggest diagnosis rates remain 40% below the EU average.",
    readMinutes: 7,
    author: {
      name: "Dr. Aurora Selmani",
      role: "Endocrinologist — Hygeia Hospital Tirana",
      doctorSlug: "aurora-selmani",
      portraitUrl: "https://i.pravatar.cc/200?img=46",
      linkedIn: "https://linkedin.com",
      bio: "Dr. Selmani holds a PhD in endocrinology from the University of Pisa. She leads research into iodine deficiency and thyroid disease in Albania.",
    },
    content: [
      {
        type: "paragraph",
        text: "Albania's iodine deficiency problem has been quietly improving since salt iodisation was mandated in the early 2000s. But the legacy of two decades of insufficient iodine intake — and the ongoing deficiency in rural highland areas — means that thyroid disorders remain disproportionately common, and disproportionately undiagnosed, in Albanian women.",
      },
      {
        type: "paragraph",
        text: "Our research at QKUM found that 14 percent of women over 35 had subclinical hypothyroidism — elevated TSH with normal T4 — of whom only 31 percent had ever received a diagnosis. The symptoms of subclinical hypothyroidism are insidious: fatigue, modest weight gain, mild cognitive slowing, menstrual irregularities. They are the symptoms patients are told to accept as a normal part of ageing.",
      },
      {
        type: "pullquote",
        text: "If you are a woman over 35 in Albania and you have never had your TSH measured, you should ask your GP to order it today.",
      },
      {
        type: "paragraph",
        text: "The treatment for overt hypothyroidism is straightforward: levothyroxine, a synthetic thyroid hormone taken as a once-daily tablet. The decision to treat subclinical hypothyroidism is more nuanced. Most current guidelines recommend treatment when TSH is above 10 mIU/L, when the patient is pregnant or trying to conceive, or when there are significant symptoms attributable to thyroid dysfunction.",
      },
      {
        type: "paragraph",
        text: "What is less discussed is the nutritional component. Beyond iodine, selenium deficiency — also prevalent in Albanian soils — impairs the conversion of T4 to the active T3 form. Patients with persistent symptoms despite adequate levothyroxine therapy should have their selenium status assessed. Brazil nuts, two per day, provide the recommended daily selenium intake and cost next to nothing.",
      },
    ],
  },
  {
    slug: "mediterranean-diet-cardiovascular-protection",
    title: "The Mediterranean diet and cardiovascular protection: what the evidence actually says",
    category: "Nutrition",
    date: "2026-01-30",
    dek: "PREDIMED and its replication tell us something important — and something often misunderstood.",
    readMinutes: 6,
    author: {
      name: "Dr. Elona Hoxha",
      role: "Cardiologist — American Hospital Tirana",
      doctorSlug: "elona-hoxha",
      portraitUrl: "https://i.pravatar.cc/200?img=47",
      linkedIn: "https://linkedin.com",
      bio: "Dr. Hoxha trained at Charité Berlin. Beyond interventional cardiology, she advises on dietary approaches to cardiovascular risk reduction.",
    },
    content: [
      {
        type: "paragraph",
        text: "The PREDIMED trial, published in the New England Journal of Medicine in 2013, was one of the most important nutrition studies in a generation. It randomised 7,447 participants at high cardiovascular risk to three diets: a Mediterranean diet supplemented with extra-virgin olive oil, a Mediterranean diet supplemented with mixed nuts, or a low-fat control diet. The trial was stopped early because the Mediterranean groups showed such striking reductions in major cardiovascular events.",
      },
      {
        type: "paragraph",
        text: "The original paper was retracted due to randomisation irregularities at one centre, then republished with a sensitivity analysis that excluded the problematic site. The results held. This reanalysis process is science working as it should — and the conclusion was preserved: a Mediterranean dietary pattern, with high olive oil and nut intake, reduces cardiovascular events by approximately 30 percent compared to a low-fat diet.",
      },
      {
        type: "pullquote",
        text: "The Mediterranean diet is not a cuisine. It is an eating pattern: abundant plant foods, olive oil as the primary fat, fish twice a week, red meat rarely, wine moderately with meals.",
      },
      {
        type: "paragraph",
        text: "What the evidence does not support: the idea that olive oil is a medicine you can add to an otherwise poor diet. The benefit in PREDIMED came from a coherent dietary pattern in people who were already eating reasonably well. Adding three tablespoons of olive oil to a diet high in ultra-processed food and refined carbohydrates is unlikely to provide the same protection.",
      },
      {
        type: "paragraph",
        text: "The practical implication for Albanian and Kosovar patients: the traditional Albanian diet is already close to the Mediterranean pattern — legumes, vegetables, olive oil, lamb rather than beef. The transition to a more Western diet with more processed food, soft drinks, and fast food is a cardiovascular risk in slow motion. Returning to traditional eating patterns is evidence-based medicine.",
      },
    ],
  },
  {
    slug: "ultra-processed-food-inflammation",
    title: "Ultra-processed food and chronic inflammation: the mechanism that matters",
    category: "Nutrition",
    date: "2026-01-15",
    dek: "The Nova classification changed how nutritional epidemiology thinks about food. Here is why it matters clinically.",
    readMinutes: 5,
    author: {
      name: "Dr. Eneida Daka",
      role: "Endocrinologist — QKUM Tirana",
      doctorSlug: "eneida-daka",
      portraitUrl: "https://i.pravatar.cc/200?img=35",
      linkedIn: "https://linkedin.com",
      bio: "Dr. Daka specialises in obesity medicine and metabolic syndrome. She has a fellowship in metabolic diseases from Gemelli Hospital Rome.",
    },
    content: [
      {
        type: "paragraph",
        text: "The Nova classification system, developed by Brazilian epidemiologist Carlos Monteiro, sorts foods not by nutrient content but by the degree of industrial processing they have undergone. Ultra-processed foods — Group 4 in the Nova system — are formulations of substances derived from food or synthesised in laboratories, assembled with additives to make the final product hyperpalatable and shelf-stable.",
      },
      {
        type: "paragraph",
        text: "Why does this matter clinically? Because the epidemiological signal from ultra-processed food consumption is remarkably consistent across different populations and outcomes. A 10 percent increase in the proportion of ultra-processed food in the diet is associated with a 12 percent higher risk of cancer, an 11 percent higher risk of cardiovascular disease, and a significant increase in all-cause mortality.",
      },
      {
        type: "pullquote",
        text: "Emulsifiers, found in nearly every ultra-processed food, disrupt the gut mucous layer that separates luminal bacteria from the intestinal epithelium. The resulting low-grade endotoxaemia drives systemic inflammation.",
      },
      {
        type: "paragraph",
        text: "The mechanism via chronic inflammation is one of the more compelling hypotheses. The gut microbiome research has exploded over the past decade, and one consistent finding is that emulsifiers — polysorbate 80, carboxymethylcellulose, and others — alter the composition of gut bacteria and, more importantly, disrupt the protective mucus layer that keeps luminal bacteria away from intestinal epithelial cells.",
      },
      {
        type: "paragraph",
        text: "From a clinical perspective, this matters most in patients with metabolic syndrome, type 2 diabetes, inflammatory bowel disease, and non-alcoholic fatty liver disease. In these patients, I recommend a simple heuristic: if a food has more than five ingredients, or contains an ingredient you would not find in a home kitchen, reduce its frequency and proportion in the diet. This is not perfect nutrition science. It is a practical proxy that works.",
      },
    ],
  },
];

export function getArticle(slug: string): JournalArticle | undefined {
  return JOURNAL_ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: JournalCategory): JournalArticle[] {
  return JOURNAL_ARTICLES.filter((a) => a.category === category);
}

export const JOURNAL_CATEGORIES: JournalCategory[] = [
  "Cardiology",
  "Prevention",
  "Mental Health",
  "Pediatrics",
  "Nutrition",
];
