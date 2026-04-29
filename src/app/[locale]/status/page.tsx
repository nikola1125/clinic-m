import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "System Status | MjekOn",
  description: "Live operational status for MjekOn platform, video consultations, and partner integrations.",
};

type IndicatorLevel = "operational" | "degraded" | "down";

const DOT: Record<IndicatorLevel, string> = {
  operational: "var(--sage)",
  degraded: "#d97706",
  down: "var(--oxblood)",
};

const LABEL: Record<IndicatorLevel, string> = {
  operational: "Operational",
  degraded: "Degraded",
  down: "Down",
};

// ── TODO: wire each entry to a real /health sub-check endpoint ──
const SERVICES: { id: string; name: string; description: string; status: IndicatorLevel }[] = [
  {
    id: "platform",
    name: "Platform",
    description: "Web app, API, authentication, booking",
    status: "operational",
  },
  {
    id: "video",
    name: "Video Consultations",
    description: "WebRTC signalling, media relay, recording",
    status: "operational",
  },
  {
    id: "partners",
    name: "Partner Integrations",
    description: "Lab results, pharmacy APIs, insurance gateways",
    status: "operational",
  },
];

function StatusRow({
  name,
  description,
  status,
  last,
}: {
  name: string;
  description: string;
  status: IndicatorLevel;
  last: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between py-5"
      style={{ borderBottom: last ? "none" : "1px solid var(--line)" }}
    >
      <div>
        <p
          className="text-[15px] font-medium mb-0.5"
          style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
        >
          {name}
        </p>
        <p className="label-mono" style={{ color: "var(--muted)" }}>
          {description}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: DOT[status],
          }}
        />
        <span className="label-mono" style={{ color: "var(--muted)" }}>
          {LABEL[status]}
        </span>
      </div>
    </div>
  );
}

export default function StatusPage() {
  const allOperational = SERVICES.every((s) => s.status === "operational");

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 72 }}>
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          {/* Heading */}
          <section
            className="py-16"
            style={{ borderBottom: "1px solid var(--line)" }}
          >
            <p className="label-mono mb-3" style={{ color: "var(--muted)" }}>
              SYSTEM STATUS
            </p>
            <h1
              className="font-heading leading-none mb-4"
              style={{ fontSize: "clamp(32px,5vw,56px)", color: "var(--ink)" }}
            >
              {allOperational ? "All systems operational." : "Partial degradation detected."}
            </h1>
            <p
              className="text-[14px]"
              style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
            >
              Last updated: {new Date().toUTCString()} — updates are manual for now.
              {/* TODO: replace with a dynamic fetch from /health sub-checks */}
            </p>
          </section>

          {/* Services */}
          <section className="py-4" style={{ borderBottom: "1px solid var(--line)" }}>
            <div style={{ borderTop: "1px solid var(--line)" }}>
              {SERVICES.map((svc, i) => (
                <StatusRow
                  key={svc.id}
                  name={svc.name}
                  description={svc.description}
                  status={svc.status}
                  last={i === SERVICES.length - 1}
                />
              ))}
            </div>
          </section>

          {/* Footer note */}
          <div className="py-10">
            <p className="label-mono" style={{ color: "var(--muted)" }}>
              Incidents are reported at{" "}
              <a
                href="mailto:security@mjekon.com"
                style={{ color: "var(--ink)" }}
              >
                security@mjekon.com
              </a>
              . See also our{" "}
              <a href="/.well-known/security.txt" style={{ color: "var(--ink)" }}>
                security.txt
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
