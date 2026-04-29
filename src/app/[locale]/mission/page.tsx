import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { BrainDrainChart } from "@/components/BrainDrainChart";
import { Link } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Our Mission — Mirea",
    description:
      "80% of Albanian medical graduates leave within five years. We are building the infrastructure to reverse it.",
  };
}

// ── Drop-cap paragraph ─────────────────────────────────────────────────────

function DropCap({ children }: { children: string }) {
  const first = children.charAt(0);
  const rest = children.slice(1);
  return (
    <p
      className="text-[18px] leading-[1.75] mb-6"
      style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
    >
      <span
        className="float-left font-heading leading-none mr-2"
        style={{
          fontSize: "clamp(56px, 7vw, 72px)",
          lineHeight: 0.85,
          color: "var(--ink)",
          marginTop: "4px",
        }}
        aria-hidden="true"
      >
        {first}
      </span>
      {rest}
    </p>
  );
}

// ── Body paragraph ─────────────────────────────────────────────────────────

function Body({ children }: { children: string }) {
  return (
    <p
      className="text-[18px] leading-[1.75] mb-6"
      style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
    >
      {children}
    </p>
  );
}

// ── Pull-quote ─────────────────────────────────────────────────────────────

function PullQuote({ children }: { children: string }) {
  return (
    <blockquote
      className="my-10 pl-6"
      style={{ borderLeft: "2px solid var(--oxblood)" }}
    >
      <p
        className="font-heading italic leading-snug"
        style={{ fontSize: "clamp(24px, 3vw, 32px)", color: "var(--ink)" }}
      >
        {children}
      </p>
    </blockquote>
  );
}

// ── Chapter heading ────────────────────────────────────────────────────────

function ChapterHead({ n, title }: { n: number; title: string }) {
  return (
    <div
      className="flex items-baseline gap-4 mt-16 mb-8"
      style={{ borderTop: "1px solid var(--line)", paddingTop: "2rem" }}
    >
      <span className="label-mono shrink-0" style={{ color: "var(--muted)" }}>
        {String(n).padStart(2, "0")}
      </span>
      <h2
        className="font-heading text-[28px] leading-tight"
        style={{ color: "var(--ink)" }}
      >
        {title}
      </h2>
    </div>
  );
}

// ── Photo placeholder ──────────────────────────────────────────────────────

function PhotoPlaceholder({ caption }: { caption: string }) {
  return (
    <figure className="my-12 -mx-4 sm:mx-0">
      <div
        className="w-full"
        style={{
          height: "clamp(240px, 40vw, 420px)",
          background: "var(--bone-2)",
          borderRadius: "var(--r)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span className="label-mono" style={{ color: "var(--muted)" }}>
          PHOTOGRAPH
        </span>
      </div>
      <figcaption className="label-mono mt-3" style={{ color: "var(--muted)" }}>
        {caption}
      </figcaption>
    </figure>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function MissionPage() {
  const t = await getTranslations("mission");

  return (
    <>
      <ReadingProgressBar />
      <Navbar />

      {/* ── Full-bleed hero ── */}
      <section
        className="relative flex items-end"
        style={{ height: "100svh", background: "var(--ink)", overflow: "hidden" }}
      >
        {/* Duotone placeholder — replace src with real photograph */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,16,12,0.2) 0%, rgba(20,16,12,0.85) 100%)",
            mixBlendMode: "multiply",
          }}
          aria-hidden="true"
        />
        {/* Subtle texture overlay to simulate duotone */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, var(--ink) 0px, var(--ink) 1px, transparent 1px, transparent 8px)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          <p className="label-mono mb-4" style={{ color: "rgba(245,241,234,0.5)" }}>
            {t("label")}
          </p>
          <h1
            className="font-heading leading-none"
            style={{
              fontSize: "clamp(36px, 6vw, 80px)",
              color: "var(--bone)",
              maxWidth: "16ch",
            }}
          >
            {t("hero_line")}
          </h1>
          <p className="label-mono mt-4" style={{ color: "rgba(245,241,234,0.4)" }}>
            {t("hero_caption")}
          </p>
        </div>
      </section>

      <main>
        <article className="mx-auto px-4 sm:px-6 lg:px-8 py-20" style={{ maxWidth: "68ch" }}>

          {/* ── Chapter 1: The crisis ── */}
          <ChapterHead n={1} title="Kriza që askush nuk dëshiron ta emërtojë" />
          <DropCap>
            {"Çdo vit, rreth 1,800 mjekë largohen nga Shqipëria. Ata shkojnë në Gjermani, Itali, Britani, Shtetet e Bashkuara — vende ku pagat janë pesëfish, ku pajisjet funksionojnë, ku karriera nuk pengohet nga politika spitalore. Dhe ata kurrë nuk kthehen."}
          </DropCap>
          <Body>
            {"Shifra totale: mbi 80 për qind e mjekëve të trajnuar në Universitetin e Mjekësisë të Tiranës largohen brenda pesë vjetëve të diplomimit. Kjo nuk është migrim — kjo është tkurrje sistematike e kapacitetit mjekësor të një vendi."}
          </Body>
          <Body>
            {"Për pacientët që mbeten, efektet janë të prekshme. Radha që nisë nga ora katër e mëngjesit. Specialistët që sheh vetëm nëse njeh dikë. Diagnozat e vonuara sepse mjeku i neurogjise u transferua gjashtë muaj më parë dhe askush nuk e ka zëvendësuar ende."}
          </Body>

          {/* ── Chapter 2: The numbers ── */}
          <ChapterHead n={2} title="Numrat pas largimit" />
          <Body>
            {"Albania ka 1.2 mjekë për çdo 1,000 banorë. Mesatarja e BE-së është 3.7. Kosova, që ndau të njëjtin sistem shëndetësor deri në 1999, ka 1.0. Në krahasim, Gjermania — destinacioni kryesor i mjekëve shqiptarë — ka 4.4. Boshllëku nuk po mbyllet; po zgjerohet."}
          </Body>
          <PullQuote>
            {"Shqipëria po eksporton kapitalin e saj human mjekësor me ritme që nuk mund t'i kompensojë trajnimi i brendshëm."}
          </PullQuote>

          {/* Inline SVG chart */}
          <BrainDrainChart title={t("chart_title")} caption={t("chart_caption")} />

          <Body>
            {"Grafiku tregon modelin e njohur të migrimeve pas shok-it ekonomik: rritja e ngadaltë deri në 2015, pastaj akselerohet ndërkohë që rrjetet e diasporës thellojnë lidhjet e tyre. Rënia e vitit 2020 ishte e ngjarjes — pandemia ngriti një barrierë të përkohshme. Nga 2021, numrat e kapërcyen nivelin parapandemia me 10 për qind."}
          </Body>

          {/* Photo 1 */}
          <PhotoPlaceholder caption={t("photo1_caption")} />

          {/* ── Chapter 3: The system ── */}
          <ChapterHead n={3} title="Sistemi që i dërgoi" />
          <DropCap>
            {"Paga mesatare e një mjeku specialist në sektorin publik shqiptar është rreth 800 euro në muaj. Kolegu i tij në Hamburg merr 7,200. Por të krahasosh vetëm pagat është ta nënçmosh kompleksitetin. Mjekët nuk largohen vetëm për paratë."}
          </DropCap>
          <Body>
            {"Ata largohen sepse vendimmarrja klinike ndërhyhet politikisht. Largohen sepse pajisjet diagnostike prishen dhe mbeten pa riparuar muaj me radhë. Largohen sepse pacientët e tyre vdesin nga kushte të trajtueshme kur nuk keni infrastrukturë. Dhe largohen sepse janë të lodhur të ndjehen fajtorë për dëmtime sistematike mbi të cilat nuk kanë kontroll."}
          </Body>
          <PullQuote>
            {"Nuk largohen sepse nuk i duan pacientët e tyre. Largohen sepse sistemi ua ka bërë të pamundur t'i kujdesen siç duhet."}
          </PullQuote>

          {/* ── Chapter 4: The patients left behind ── */}
          <ChapterHead n={4} title="Pacientët e lënë pas" />
          <Body>
            {"Rrethi i brendshëm i çdo sfide shëndetësore globale janë ata që nuk mund të largohen. Në Shqipëri, ata janë pleqtë në zona rurale, familjet me të ardhura të ulëta, pacientët me sëmundje kronike komplekse. Ata nuk mund të udhëtojnë për diagnostikim në Gjermani. Nuk mund të paguajnë konsultim privat në Tiranë."}
          </Body>
          <Body>
            {"Statistikat e shëndetësisë publike tregojnë dëmin e akumuluar: shkalla e vdekshmërisë nga sëmundjet kardiovaskulare në Shqipëri mbetet 40 për qind mbi mesataren e BE-së. Kanceri diagnostikohet mesatarisht me 18 muaj vonesë krahasuar me Gjermaninë. Jo sepse sëmundjet janë të ndryshme — por sepse kapaciteti diagnostik është 40 vjet prapa."}
          </Body>

          {/* Photo 2 */}
          <PhotoPlaceholder caption={t("photo2_caption")} />

          {/* ── Chapter 5: The diaspora ── */}
          <ChapterHead n={5} title="Diaspora: ku janë dhe çfarë mendojnë" />
          <DropCap>
            {"Urdhri i Mjekëve Shqiptarë llogarit se mbi 12,000 mjekë me prejardhje shqiptare praktikojnë jashtë vendit. Kjo është dy herë numri i atyre që punojnë brenda Shqipërisë. Ata janë shkruar si të humbur — por ky është gabim i kushtueshëm."}
          </DropCap>
          <Body>
            {"Sondazhet tregojnë se mbi 60 për qind e mjekëve të diasporës shqiptare janë 'paksa' ose 'shumë' të interesuar për të ofruar konsulta ndaj pacientëve shqiptarë nëse do kishte infrastrukturë të besueshme. Jo domosdoshmërisht duke u kthyer fizikisht — por duke qenë të arritshëm."}
          </Body>
          <PullQuote>
            {"Telemjekësia nuk e zëvendëson kthimin. Por mund ta bëjë largimin pak më pak absolut."}
          </PullQuote>

          {/* ── Chapter 6: The ones who stayed ── */}
          <ChapterHead n={6} title="Ata që qëndruan" />
          <Body>
            {"Ka mjekë që qëndruan. Jo nga mungesa e alternativave — shumë prej tyre kishin oferta nga Gjermania, Austria, Zvicra — por nga zgjedhja e vetëdijshme. Ata flasin për 'borxhin ndaj vendit', flasin për pacientë që i njohin prej dhjetë vjetësh, flasin për kuptimin që nuk do ta gjenin kurrë duke trajtuar turizmin mjekësor gjerman."}
          </Body>
          <Body>
            {"Ata gjithashtu flasin për lodhjen. Për kohën kur njëri mjek bën punën e tre. Për sistemin administrativ që kërkon tre orë letër për çdo procedurë. Për moralin klinik të gërryer nga konsulta pas konsultë me infrastrukturë të pamjaftueshme."}
          </Body>

          {/* Photo 3 */}
          <PhotoPlaceholder caption={t("photo3_caption")} />

          {/* ── Chapter 7: What technology can do ── */}
          <ChapterHead n={7} title="Çfarë mund të bëjë teknologjia" />
          <DropCap>
            {"Telemjekësia nuk është zgjidhja. Por është pjesë e zgjidhjes. Dhe është e vetmja pjesë e zgjidhjes që mund të implementohet me shpejtësi, pa kërkuar reforma institucionale të cilat do të marrin dekada."}
          </DropCap>
          <Body>
            {"Një pacient me simptoma kardiovaskulare në Peshkopi nuk ka nevojë të udhëtojë 4 orë në Tiranë për konsultë fillestare. Nëse mund të arrijë tek kardiologu përmes ekranit, kardiologu mund të vendosë nëse udhëtimi është i nevojshëm — dhe si duhet të përgatitet. Ky vendim i ndriçuar ndryshon rezultatin."}
          </Body>
          <PullQuote>
            {"Problemi nuk është vetëm mungesa e mjekëve. Është shpërndarja e gabuar e atyre që kemi."}
          </PullQuote>
          <Body>
            {"Teknologjia gjithashtu mundëson mjekët e diasporës — ata 12,000 persona — të kontribuojnë pa braktisur karrierat e tyre europiane. Dy konsulta javore me pacientë shqiptarë, ofruar online, nuk e ndërhyjnë me praktikën gjermane. Por ato mund të ndryshojnë rrjedhën e sëmundjes për pesë famile."}
          </Body>

          {/* ── Chapter 8: Our bet ── */}
          <ChapterHead n={8} title="Basti ynë" />
          <Body>
            {"Mirea u ndërtua mbi besimin se infrastruktura e mirë mjekësore mund të thithë kapitalin njerëzor prapa — ose të paktën të shfrytëzojë atë që ekziston. Ne nuk jemi një startup teknologjik që i drejton mjekësisë. Jemi një infrastrukturë që mjekët mund ta kenë besim."}
          </Body>
          <Body>
            {"Kjo do të thotë: verifikim rigoroz i licensave. Privatësi e të dhënave sipas standardeve europiane. Tarifa transparente të publikuara. Mbështetje administrative që mjeket nuk kanë patur kurrë. Dhe më e rëndësishmja: frekuencë e besueshmërisë që ndërton reputacionin me kalimin e kohës."}
          </Body>
          <PullQuote>
            {"80 për qind largohen. Po ndërtojmë arsyen për t'u kthyer."}
          </PullQuote>
        </article>

        {/* ── What we do ── */}
        <section
          className="mx-auto px-4 sm:px-6 lg:px-8 py-16"
          style={{
            maxWidth: "68ch",
            borderTop: "1px solid var(--line)",
          }}
        >
          <p className="label-mono mb-3" style={{ color: "var(--muted)" }}>
            {t("what_we_do_label")}
          </p>
          <h2
            className="font-heading text-[36px] leading-tight mb-10"
            style={{ color: "var(--ink)" }}
          >
            {t("what_we_do_heading")}
          </h2>

          <div className="flex flex-col gap-6">
            {[
              { href: "/doctors", label: t("link_registry") },
              { href: "/for-clinicians", label: t("link_clinicians") },
              { href: "/mission#press", label: t("link_press") },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href as any}
                className="group flex items-center justify-between py-4 transition-colors"
                style={{ borderBottom: "1px solid var(--line)" }}
              >
                <span
                  className="font-heading text-[22px]"
                  style={{ color: "var(--ink)" }}
                >
                  {label}
                </span>
                <span
                  className="label-mono transition-transform group-hover:translate-x-1"
                  style={{ color: "var(--muted)" }}
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
