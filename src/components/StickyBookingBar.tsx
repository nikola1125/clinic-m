"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function StickyBookingBar() {
  const t = useTranslations("Cta");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          // Mobile: full-width bar at bottom. Desktop: compact pill at bottom-right
          className="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between gap-3 rounded-2xl px-4 py-3 shadow-2xl lg:left-auto lg:right-6 lg:w-auto lg:rounded-full lg:px-6 lg:py-3"
          style={{
            background: "linear-gradient(135deg, #4C8C6D, #6FAF8F)",
            boxShadow: "0 8px 40px -4px rgba(76,140,109,0.5)",
          }}
        >
          {/* Mobile label */}
          <span className="text-sm font-semibold text-white/90 lg:hidden">
            {t("sticky_label")}
          </span>

          <Link
            href="/book"
            className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-white/25 active:scale-[0.97] lg:bg-transparent lg:p-0 lg:hover:bg-transparent lg:gap-2"
          >
            <CalendarCheck className="h-4 w-4 shrink-0" />
            <span>{t("btn")}</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
