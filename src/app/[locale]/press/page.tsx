import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Press & Media | MjekOn",
  description: "Press resources, brand assets, company boilerplate, and media contact for MjekOn.",
};

const BOILERPLATE = `MjekOn is an Albanian-founded telehealth platform connecting patients across Southeast Europe with specialist physicians. Founded in 2024, the company operates under Albanian law (Tiranë) and processes data in EU-certified data centres in Frankfurt and Warsaw. MjekOn's video-consultation infrastructure enables same-day access to over 40 specialties, reducing average wait times from weeks to hours.`;

const FOUNDERS = [
  {
    name: "Founder",
    title: "CEO & Co-Founder",
    note: "Portrait available on request — press@mjekon.com",
  },
  {
    name: "Co-Founder",
    title: "CTO & Co-Founder",
    note: "Portrait available on request — press@mjekon.com",
  },
];

const ASSETS = [
  { label: "Logo — bone variant (SVG)", file: "/brand/mjekon-logo-bone.svg" },
  { label: "Logo — ink variant (SVG)", file: "/brand/mjekon-logo-ink.svg" },
  { label: "Logo — bone variant (PNG 2×)", file: "/brand/mjekon-logo-bone@2x.png" },
  { label: "Logo — ink variant (PNG 2×)", file: "/brand/mjekon-logo-ink@2x.png" },
  { label: "Brand guidelines (PDF)", file: "/brand/mjekon-brand-guidelines.pdf" },
];

export default function PressPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 72 }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <section className="py-16" style={{ borderBottom: "1px solid var(--line)" }}>
            <p className="label-mono mb-3" style={{ color: "var(--muted)" }}>
              PRESS & MEDIA
            </p>
            <h1
              className="font-heading leading-none mb-4"
              style={{ fontSize: "clamp(32px,5vw,64px)", color: "var(--ink)" }}
            >
              Media resources.
            </h1>
            <p
              className="text-[15px] max-w-xl leading-relaxed"
              style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
            >
              All press enquiries:{" "}
              <a href="mailto:press@mjekon.com" style={{ color: "var(--ink)" }}>
                press@mjekon.com
              </a>
              . We aim to respond within one business day.
            </p>
          </section>

          {/* Boilerplate */}
          <section className="py-12" style={{ borderBottom: "1px solid var(--line)" }}>
            <p className="label-mono mb-6" style={{ color: "var(--muted)" }}>
              BOILERPLATE
            </p>
            <p
              className="text-[15px] leading-relaxed max-w-prose"
              style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
            >
              {BOILERPLATE}
            </p>
            <p
              className="label-mono mt-4 italic"
              style={{ color: "var(--muted)" }}
            >
              Free to reproduce verbatim with attribution to MjekOn.
            </p>
          </section>

          {/* Founders */}
          <section className="py-12" style={{ borderBottom: "1px solid var(--line)" }}>
            <p className="label-mono mb-6" style={{ color: "var(--muted)" }}>
              FOUNDERS
            </p>
            <div style={{ borderTop: "1px solid var(--line)" }}>
              {FOUNDERS.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between py-5"
                  style={{ borderBottom: i < FOUNDERS.length - 1 ? "1px solid var(--line)" : "none" }}
                >
                  <div>
                    <p
                      className="text-[15px] font-medium mb-1"
                      style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
                    >
                      {f.name}
                    </p>
                    <p className="label-mono mb-1" style={{ color: "var(--muted)" }}>
                      {f.title}
                    </p>
                    <p
                      className="text-[13px] italic"
                      style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
                    >
                      {f.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Brand assets */}
          <section className="py-12" style={{ borderBottom: "1px solid var(--line)" }}>
            <p className="label-mono mb-6" style={{ color: "var(--muted)" }}>
              BRAND ASSETS
            </p>
            <div style={{ borderTop: "1px solid var(--line)" }}>
              {ASSETS.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-4"
                  style={{ borderBottom: i < ASSETS.length - 1 ? "1px solid var(--line)" : "none" }}
                >
                  <span
                    className="text-[14px]"
                    style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
                  >
                    {a.label}
                  </span>
                  <a
                    href={a.file}
                    download
                    className="label-mono transition-opacity hover:opacity-60"
                    style={{ color: "var(--muted)" }}
                  >
                    Download →
                  </a>
                </div>
              ))}
            </div>
            <p
              className="label-mono mt-4 italic"
              style={{ color: "var(--muted)" }}
            >
              Do not alter, recolour, or distort any brand asset.
            </p>
          </section>

          {/* Contact */}
          <div className="py-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="label-mono mb-1" style={{ color: "var(--muted)" }}>
                  PRESS CONTACT
                </p>
                <p
                  className="text-[15px]"
                  style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
                >
                  <a href="mailto:press@mjekon.com" style={{ color: "var(--ink)" }}>
                    press@mjekon.com
                  </a>
                </p>
              </div>
              <div>
                <p className="label-mono mb-1" style={{ color: "var(--muted)" }}>
                  MEDICAL ENQUIRIES
                </p>
                <p
                  className="text-[15px]"
                  style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
                >
                  <a href="mailto:medical@mjekon.com" style={{ color: "var(--ink)" }}>
                    medical@mjekon.com
                  </a>
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
