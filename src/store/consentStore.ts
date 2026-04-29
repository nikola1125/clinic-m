"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ConsentCategory = "necessary" | "analytics" | "marketing";

export type ConsentState = {
  consentGiven: boolean;
  categories: Record<ConsentCategory, boolean>;

  setConsent: (cats: Partial<Record<ConsentCategory, boolean>>) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  resetConsent: () => void;
};

export const useConsentStore = create<ConsentState>()(
  persist(
    (set) => ({
      consentGiven: false,
      categories: {
        necessary: true,
        analytics: false,
        marketing: false,
      },

      setConsent: (cats) =>
        set((s) => ({
          consentGiven: true,
          categories: { ...s.categories, ...cats, necessary: true },
        })),

      acceptAll: () =>
        set({
          consentGiven: true,
          categories: { necessary: true, analytics: true, marketing: true },
        }),

      rejectAll: () =>
        set({
          consentGiven: true,
          categories: { necessary: true, analytics: false, marketing: false },
        }),

      resetConsent: () =>
        set({
          consentGiven: false,
          categories: { necessary: true, analytics: false, marketing: false },
        }),
    }),
    {
      name: "cookie_consent",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : sessionStorage
      ),
    }
  )
);
