import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import {
  JOURNAL_ARTICLES,
  getArticle,
  getArticlesByCategory,
  type JournalSection,
} from "@/lib/journal";
import { ArrowLeft } from "lucide-react";

// ── Static params ──────────────────────────────────────────────────────────

export function generateStaticParams() {
  return JOURNAL_ARTICLES.map((a) => ({ slug: a.slug }));
}

// ── Metadata + JSON-LD ─────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = getArticle(params.slug);
  if (!article) return {};
  return {
    title: `${article.title} | Mirea Journal`,
    description: article.dek,
    openGraph: {
      title: article.title,
      description: article.dek,
      type: "article",
      publishedTime: article.date,
      authors: [article.author.name],
    },
  };
}

function ArticleJsonLd({
  title,
  dek,
  date,
  authorName,
  slug,
}: {
  title: string;
  dek: string;
  date: string;
  authorName: string;
  slug: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: dek,
    datePublished: date,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "MjekOn",
      url: "https://mjekon.com",
    },
    url: `https://mjekon.com/en/journal/${slug}`,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Content renderer ───────────────────────────────────────────────────────

function RenderSection({ section, isFirst }: { section: JournalSection; isFirst: boolean }) {
  if (section.type === "pullquote") {
    return (
      <blockquote
        className="my-10 pl-6"
        style={{ borderLeft: "2px solid var(--oxblood)" }}
      >
        <p
          className="font-heading italic leading-snug"
          style={{ fontSize: "clamp(22px, 3vw, 32px)", color: "var(--ink)" }}
        >
          {section.text}
        </p>
      </blockquote>
    );
  }

  if (section.type === "heading") {
    return (
      <h2
        className="font-heading text-[26px] leading-tight mt-10 mb-4"
        style={{ color: "var(--ink)" }}
      >
        {section.text}
      </h2>
    );
  }

  if (section.type === "subheading") {
    return (
      <h3
        className="font-heading text-[20px] leading-tight mt-8 mb-3"
        style={{ color: "var(--ink)" }}
      >
        {section.text}
      </h3>
    );
  }

  // paragraph — drop cap on first paragraph
  if (isFirst) {
    const first = section.text.charAt(0);
    const rest = section.text.slice(1);
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

  return (
    <p
      className="text-[18px] leading-[1.75] mb-6"
      style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
    >
      {section.text}
    </p>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function JournalArticlePage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const article = getArticle(params.slug);
  if (!article) notFound();
  const doc = article!;

  const [t] = await Promise.all([getTranslations("journal")]);

  const related = getArticlesByCategory(doc.category)
    .filter((a) => a.slug !== doc.slug)
    .slice(0, 3);

  const formattedDate = new Date(doc.date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let paragraphCount = 0;

  return (
    <>
      <ArticleJsonLd
        title={doc.title}
        dek={doc.dek}
        date={doc.date}
        authorName={doc.author.name}
        slug={doc.slug}
      />
      <ReadingProgressBar />
      <Navbar />
      <main style={{ paddingTop: 72 }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: "68ch" }}>

          {/* ── Breadcrumb ── */}
          <div
            className="flex items-center gap-2 py-4"
            style={{ borderBottom: "1px solid var(--line)" }}
          >
            <Link
              href="/journal"
              className="label-mono flex items-center gap-1 transition-opacity hover:opacity-60"
              style={{ color: "var(--muted)" }}
            >
              <ArrowLeft className="h-[11px] w-[11px]" aria-hidden="true" />
              {t("back")}
            </Link>
            <span className="label-mono" style={{ color: "var(--line)" }}>/</span>
            <span
              className="label-mono px-2 h-5 flex items-center"
              style={{
                border: "1px solid var(--line)",
                borderRadius: "var(--r)",
                color: "var(--oxblood)",
              }}
            >
              {doc.category.toUpperCase()}
            </span>
          </div>

          {/* ── Article header ── */}
          <header className="pt-12 pb-8" style={{ borderBottom: "1px solid var(--line)" }}>
            <h1
              className="font-heading leading-tight mb-6"
              style={{ fontSize: "clamp(32px, 5vw, 52px)", color: "var(--ink)" }}
            >
              {doc.title}
            </h1>
            <p
              className="text-[16px] italic leading-relaxed mb-6"
              style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
            >
              {doc.dek}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <span className="label-mono" style={{ color: "var(--muted)" }}>
                {formattedDate}
              </span>
              <span className="label-mono" style={{ color: "var(--muted)" }}>
                {t("min_read", { n: doc.readMinutes })}
              </span>
              <span className="label-mono" style={{ color: "var(--muted)" }}>
                {t("by")} {doc.author.name}
              </span>
            </div>
          </header>

          {/* ── Article body ── */}
          <div className="py-12">
            {doc.content.map((section, i) => {
              const isFirstParagraph = section.type === "paragraph" && paragraphCount === 0;
              if (section.type === "paragraph") paragraphCount++;
              return (
                <RenderSection
                  key={i}
                  section={section}
                  isFirst={isFirstParagraph}
                />
              );
            })}
          </div>

          {/* ── Author footer ── */}
          <div
            className="py-12"
            style={{ borderTop: "1px solid var(--line)" }}
          >
            <p className="label-mono mb-6" style={{ color: "var(--muted)" }}>
              {t("written_by")}
            </p>
            <div className="flex items-start gap-5">
              {/* Portrait */}
              <div
                className="shrink-0 overflow-hidden"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "var(--r)",
                  background: "var(--bone-2)",
                  filter: "grayscale(20%)",
                  position: "relative",
                }}
              >
                {doc.author.portraitUrl ? (
                  <Image
                    src={doc.author.portraitUrl}
                    alt={doc.author.name}
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="font-heading text-[28px] opacity-20"
                      style={{ color: "var(--ink)" }}
                    >
                      {doc.author.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Bio block */}
              <div className="flex-1 min-w-0">
                <p
                  className="font-heading text-[20px] mb-1"
                  style={{ color: "var(--ink)" }}
                >
                  {doc.author.name}
                </p>
                <p className="label-mono mb-3" style={{ color: "var(--muted)" }}>
                  {doc.author.role}
                </p>
                <p
                  className="text-[14px] leading-relaxed mb-4"
                  style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
                >
                  {doc.author.bio}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  {doc.author.linkedIn && (
                    <a
                      href={doc.author.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label-mono transition-opacity hover:opacity-60"
                      style={{ color: "var(--ink)" }}
                    >
                      LinkedIn →
                    </a>
                  )}
                  {doc.author.doctorSlug && (
                    <Link
                      href={`/doctors/${doc.author.doctorSlug}`}
                      className="label-mono flex h-8 items-center px-4 transition-opacity hover:opacity-80"
                      style={{
                        background: "var(--ink)",
                        color: "var(--bone)",
                        borderRadius: "var(--r)",
                      }}
                    >
                      {t("book_author", { name: doc.author.name.split(" ").pop() ?? doc.author.name })}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Related articles ── */}
          {related.length > 0 && (
            <div
              className="py-12"
              style={{ borderTop: "1px solid var(--line)" }}
            >
              <p className="label-mono mb-6" style={{ color: "var(--muted)" }}>
                {t("also_read")}
              </p>
              <div className="flex flex-col gap-0">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/journal/${rel.slug}`}
                    className="group py-5"
                    style={{ borderBottom: "1px solid var(--line)" }}
                  >
                    <p className="label-mono mb-1" style={{ color: "var(--muted)" }}>
                      {new Date(rel.date).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      {" · "}
                      {t("min_read", { n: rel.readMinutes })}
                    </p>
                    <h3
                      className="font-heading text-[20px] leading-tight transition-colors duration-200 group-hover:opacity-70"
                      style={{ color: "var(--ink)" }}
                    >
                      {rel.title}
                    </h3>
                    <p
                      className="text-[14px] italic mt-1"
                      style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
                    >
                      {rel.dek}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
