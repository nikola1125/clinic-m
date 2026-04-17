"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Video, AlertCircle, X, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

type Tab = "in-person" | "online" | "emergency";

const SPECIALTY_KEYS = [
  "sp1","sp2","sp3","sp4","sp5","sp6",
  "sp7","sp8","sp9","sp10","sp11","sp12",
  "sp13","sp14","sp15","sp16","sp17","sp18",
] as const;

const POPULAR_KEYS = ["pop1","pop2","pop3","pop4","pop5","pop6"] as const;

export function SearchBar() {
  const t = useTranslations("SearchBar");
  const [activeTab, setActiveTab] = useState<Tab>("in-person");
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const placeholderKeys = [
    "placeholder_1","placeholder_2","placeholder_3","placeholder_4","placeholder_5",
  ] as const;

  // Cycle placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % placeholderKeys.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const allSpecialties = SPECIALTY_KEYS.map((k) => t(k));
  const popularSearches = POPULAR_KEYS.map((k) => t(k));

  const filteredSpecialties = query.length > 0
    ? allSpecialties.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : [];

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "in-person", label: t("tab_in_person"), icon: <MapPin className="h-4 w-4" /> },
    { id: "online", label: t("tab_online"), icon: <Video className="h-4 w-4" /> },
    { id: "emergency", label: t("tab_emergency"), icon: <AlertCircle className="h-4 w-4" /> },
  ];

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto">
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative flex items-center gap-2 rounded-full px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold transition-all duration-300"
            style={{
              background: activeTab === tab.id ? "var(--primary)" : "transparent",
              color: activeTab === tab.id ? "white" : "var(--foreground-muted)",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <div
          className="relative flex items-center rounded-2xl transition-all duration-300"
          style={{
            background: "var(--card)",
            backdropFilter: "blur(20px)",
            border: isFocused
              ? "2px solid var(--primary)"
              : "2px solid var(--card-border)",
            boxShadow: isFocused
              ? "0 8px 32px -4px rgba(76,140,109,0.18), 0 0 0 4px rgba(111,175,143,0.08)"
              : "0 4px 16px -2px rgba(0,0,0,0.06)",
          }}
        >
          <Search
            className="absolute left-4 lg:left-5 h-4 w-4 lg:h-5 lg:w-5 transition-colors"
            style={{ color: isFocused ? "var(--primary)" : "var(--foreground-muted)" }}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={t(placeholderKeys[placeholderIdx])}
            className="w-full rounded-2xl bg-transparent py-3 lg:py-4 pl-12 lg:pl-14 pr-32 text-sm lg:text-base font-medium text-foreground outline-none placeholder:text-foreground/35"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className="absolute right-28 p-1 rounded-full hover:bg-foreground/5 transition-colors"
            >
              <X className="h-4 w-4 text-foreground/40" />
            </button>
          )}
          <button
            className="absolute right-3 flex items-center gap-2 rounded-xl px-4 lg:px-5 py-2 lg:py-2.5 text-xs lg:text-sm font-bold text-white shadow-premium transition-all hover:scale-[1.03] active:scale-[0.97]"
            style={{ background: "var(--primary)" }}
          >
            <Search className="h-3 w-3 lg:h-4 lg:w-4" />
            {t("search_btn")}
          </button>
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 rounded-2xl p-4 z-50"
              style={{
                background: "var(--card)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(95,143,123,0.12)",
                boxShadow: "0 16px 48px -8px rgba(0,0,0,0.12)",
              }}
            >
              {filteredSpecialties.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40 mb-3 px-2">
                    {t("specialties_label")}
                  </p>
                  <div className="space-y-1">
                    {filteredSpecialties.slice(0, 6).map((s) => (
                      <button
                        key={s}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-primary/5"
                        onClick={() => { setQuery(s); setIsFocused(false); }}
                      >
                        <Search className="h-4 w-4 text-primary/60" />
                        {s}
                        <ChevronRight className="h-4 w-4 ml-auto text-foreground/20" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40 mb-3 px-2">
                    {t("popular_label")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setQuery(s); }}
                        className="rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-[1.03]"
                        style={{
                          background: "rgba(111,175,143,0.08)",
                          color: "var(--primary-dark)",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
