"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Video, AlertCircle, X, ChevronRight } from "lucide-react";

const specialties = [
  "Kardiologji", "Dermatologji", "Gjinekologji", "Neurologji",
  "Ortopedi", "Pediatri", "Urologji", "Okulistikë",
  "Gastroenterologji", "Endokrinologji", "Psikologji", "ORL",
  "Pneumologji", "Onkologji", "Hematologji", "Dentist",
  "Kirurgjia e Tumorit", "Fizioterapi",
];

const popularSearches = [
  "Kardiolog", "Dentist", "Gjinekolog", "Dermatolog", "Pediatër", "Okulist",
];

type Tab = "in-person" | "online" | "emergency";

export function SearchBar() {
  const [activeTab, setActiveTab] = useState<Tab>("in-person");
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const placeholders = [
    "Kërko një kardiolog...",
    "Kërko një dentist...",
    "Kërko një gjinekolog...",
    "Kërko një dermatolog...",
    "Kërko sipas simptomave...",
  ];

  // Cycle placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % placeholders.length);
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

  const filteredSpecialties = query.length > 0
    ? specialties.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : [];

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "in-person", label: "Në Klinikë", icon: <MapPin className="h-4 w-4" /> },
    { id: "online", label: "Online", icon: <Video className="h-4 w-4" /> },
    { id: "emergency", label: "Urgjencë", icon: <AlertCircle className="h-4 w-4" /> },
  ];

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto">
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300"
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
            className="absolute left-5 h-5 w-5 transition-colors"
            style={{ color: isFocused ? "var(--primary)" : "var(--foreground-muted)" }}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholders[placeholderIdx]}
            className="w-full rounded-2xl bg-transparent py-4 pl-14 pr-32 text-base font-medium text-foreground outline-none placeholder:text-foreground/35"
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
            className="absolute right-3 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-premium transition-all hover:scale-[1.03] active:scale-[0.97]"
            style={{ background: "var(--primary)" }}
          >
            <Search className="h-4 w-4" />
            Kërko
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
                    Specialitete
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
                    Kërkimet më të popullarizuara
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
