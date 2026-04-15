"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Phone, Mail } from "lucide-react";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  // Briefly attract attention after page load
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Expanded Options */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[99]"
            />

            {/* Contact Menu */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute bottom-20 right-0 w-72 rounded-3xl p-5 z-[101]"
              style={{
                background: "var(--card)",
                backdropFilter: "blur(20px)",
                border: "1px solid var(--card-border)",
                boxShadow: "0 20px 60px -12px rgba(0,0,0,0.15), 0 8px 24px -4px rgba(76,140,109,0.1)",
              }}
            >
              {/* Header */}
              <div className="mb-4">
                <h4 className="text-base font-bold text-foreground">Na Kontaktoni</h4>
                <p className="text-xs text-foreground/50 mt-1">Zgjidhni mënyrën e preferuar të komunikimit</p>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/355697009090?text=Përshëndetje!%20Dëshiroj%20të%20rezervoj%20një%20takim."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "#25D36612" }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm"
                    style={{ background: "#25D366" }}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: "#128C7E" }}>WhatsApp</div>
                    <div className="text-xs text-foreground/50">Përgjigje brenda 5 minutash</div>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href="tel:+355697009090"
                  className="flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "rgba(111,175,143,0.08)" }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm"
                    style={{ background: "var(--primary)" }}
                  >
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">Telefono</div>
                    <div className="text-xs text-foreground/50">+355 69 700 9090</div>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:info@zenithhealth.al"
                  className="flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "rgba(111,175,143,0.05)" }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm"
                    style={{ background: "var(--accent)" }}
                  >
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">Email</div>
                    <div className="text-xs text-foreground/50">info@zenithhealth.al</div>
                  </div>
                </a>
              </div>

              {/* Footer note */}
              <p className="mt-4 text-[10px] text-center text-foreground/30 leading-relaxed">
                Përgjigje e garantuar brenda orarit të punës
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        onClick={() => { setIsOpen(!isOpen); setShowPulse(false); }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex h-16 w-16 items-center justify-center rounded-full shadow-xl transition-colors z-[101]"
        style={{
          background: isOpen
            ? "var(--foreground)"
            : "linear-gradient(135deg, #25D366, #128C7E)",
          boxShadow: isOpen
            ? "0 8px 24px rgba(0,0,0,0.2)"
            : "0 8px 24px rgba(37,211,102,0.35)",
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="h-6 w-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        {showPulse && !isOpen && (
          <>
            <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "#25D366" }} />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-red-500 text-[8px] font-bold text-white flex items-center justify-center">
              1
            </span>
          </>
        )}
      </motion.button>
    </div>
  );
}
