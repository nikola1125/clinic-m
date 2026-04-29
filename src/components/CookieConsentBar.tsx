"use client";

import { useEffect, useState } from "react";
import { useConsentStore } from "@/store/consentStore";
import Link from "next/link";

export function CookieConsentBar() {
  const { consentGiven, acceptAll, rejectAll } = useConsentStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Don't render until mounted (avoids SSR/hydration mismatch with localStorage)
  if (!mounted || consentGiven) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "var(--bone)",
        borderTop: "1px solid var(--line)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.04)",
      }}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p
          className="text-[13px] leading-relaxed flex-1"
          style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
        >
          We use essential cookies to run the platform, and optional analytics cookies to improve it.{" "}
          <Link
            href="/legal/cookies"
            className="underline underline-offset-2 transition-opacity hover:opacity-70"
            style={{ color: "var(--ink)" }}
          >
            Cookie policy
          </Link>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={rejectAll}
            className="label-mono h-8 px-4 transition-opacity hover:opacity-60"
            style={{
              border: "1px solid var(--line)",
              borderRadius: "var(--r)",
              color: "var(--muted)",
              background: "transparent",
            }}
          >
            Reject all
          </button>
          <button
            onClick={acceptAll}
            className="label-mono h-8 px-4 transition-opacity hover:opacity-80"
            style={{
              background: "var(--ink)",
              color: "var(--bone)",
              borderRadius: "var(--r)",
            }}
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
