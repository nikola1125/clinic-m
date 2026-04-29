"use client";

import { useEffect } from "react";
import { useConsentStore } from "@/store/consentStore";

const PLAUSIBLE_DOMAIN = "mjekon.com";
const PLAUSIBLE_SCRIPT = "https://plausible.io/js/script.js";

declare global {
  interface Window {
    plausible?: (...args: unknown[]) => void;
  }
}

/**
 * Loads Plausible Analytics only when:
 *  1. The user has NOT set navigator.doNotTrack = "1"
 *  2. The user has consented to analytics cookies
 *
 * No Google tags. No cross-site tracking. EU-hosted.
 */
export function PlausibleProvider() {
  const analyticsConsented = useConsentStore((s) => s.categories.analytics);
  const consentGiven = useConsentStore((s) => s.consentGiven);

  useEffect(() => {
    if (!consentGiven || !analyticsConsented) return;

    // Respect Do Not Track
    if (navigator.doNotTrack === "1") return;

    // Already loaded
    if (document.getElementById("plausible-script")) return;

    const script = document.createElement("script");
    script.id = "plausible-script";
    script.defer = true;
    script.setAttribute("data-domain", PLAUSIBLE_DOMAIN);
    script.src = PLAUSIBLE_SCRIPT;
    document.head.appendChild(script);

    // Expose plausible() helper for custom events
    window.plausible =
      window.plausible ||
      function (...args: unknown[]) {
        (window.plausible as any).q = (window.plausible as any).q || [];
        (window.plausible as any).q.push(args);
      };
  }, [consentGiven, analyticsConsented]);

  return null;
}
