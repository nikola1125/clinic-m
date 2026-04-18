"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

/**
 * HeroBg — full-page animated medical background.
 * Scrolls with the page. Icons scatter outward on tap/click.
 */

type Icon = { vb: string; render: "stroke" | "fill"; d: string; size: number };

const icons: Icon[] = [
  { vb: "0 0 24 24", render: "fill",   d: "M10 2h4v8h8v4h-8v8h-4v-8H2v-4h8V2z", size: 36 },
  { vb: "0 0 32 16", render: "stroke", d: "M0 8h6l2-6 3 12 2.5-6h4l2-4 2 4H32", size: 42 },
  { vb: "0 0 24 24", render: "stroke", d: "M10.5 1.5l-8 8a4.95 4.95 0 007 7l8-8a4.95 4.95 0 00-7-7zM11 13L6.5 8.5", size: 32 },
  { vb: "0 0 24 24", render: "stroke", d: "M4 4v4a8 8 0 0016 0V4M8 1v3M16 1v3M12 16v3a3 3 0 006 0v-1", size: 34 },
  { vb: "0 0 24 24", render: "fill",   d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z", size: 30 },
  { vb: "0 0 24 24", render: "stroke", d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4", size: 32 },
];

/* ── Generate floater configs spread across the full page height ── */
function buildFloaters() {
  const rows = 10;      // number of vertical bands
  const perRow = 6;     // icons per band on mobile
  const perRowLg = 9;   // icons per band on desktop
  const out: {
    icon: number; xPct: number; yPct: number;
    delay: number; dur: number; dx: number; dy: number; rot: number;
    op: number; desktop: boolean;
  }[] = [];

  const seed = (i: number) => ((i * 7 + 13) % 97) / 97; // deterministic pseudo-random

  for (let row = 0; row < rows; row++) {
    const yBase = (row / rows) * 100;
    // Mobile-visible icons
    for (let col = 0; col < perRow; col++) {
      const idx = row * perRow + col;
      const s = seed(idx);
      out.push({
        icon: idx % icons.length,
        xPct: (col / perRow) * 100 + s * (100 / perRow) * 0.7,
        yPct: yBase + s * (100 / rows) * 0.8,
        delay: s * 4,
        dur: 10 + s * 8,
        dx: (s - 0.5) * 80,
        dy: (seed(idx + 50) - 0.5) * 70,
        rot: (s - 0.5) * 40,
        op: 0.15 + s * 0.08,
        desktop: false,
      });
    }
    // Desktop-only extras
    for (let col = 0; col < (perRowLg - perRow); col++) {
      const idx = rows * perRow + row * (perRowLg - perRow) + col;
      const s = seed(idx + 200);
      out.push({
        icon: idx % icons.length,
        xPct: s * 95,
        yPct: yBase + s * (100 / rows) * 0.7,
        delay: s * 5,
        dur: 12 + s * 8,
        dx: (s - 0.5) * 70,
        dy: (seed(idx + 250) - 0.5) * 60,
        rot: (s - 0.5) * 35,
        op: 0.12 + s * 0.08,
        desktop: true,
      });
    }
  }
  return out;
}

const floaters = buildFloaters();

/* ── Scatter radius (px) — icons within this range from a tap get pushed away ── */
const SCATTER_RADIUS = 200;
const SCATTER_FORCE = 120;

/* ── Single Floater ── */
function Floater({
  f,
  scatterTrigger,
}: {
  f: (typeof floaters)[number];
  scatterTrigger: { x: number; y: number; id: number } | null;
}) {
  const icon = icons[f.icon];
  const controls = useAnimation();
  const elRef = useRef<HTMLDivElement>(null);
  const [scattered, setScattered] = useState(false);

  // React to scatter triggers
  const prevTrigger = useRef<number>(0);
  if (scatterTrigger && scatterTrigger.id !== prevTrigger.current && elRef.current) {
    prevTrigger.current = scatterTrigger.id;
    const rect = elRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = cx - scatterTrigger.x;
    const dy = cy - scatterTrigger.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < SCATTER_RADIUS && dist > 0) {
      const force = ((SCATTER_RADIUS - dist) / SCATTER_RADIUS) * SCATTER_FORCE;
      const angle = Math.atan2(dy, dx);
      const pushX = Math.cos(angle) * force;
      const pushY = Math.sin(angle) * force;
      const spin = (Math.random() - 0.5) * 180;

      setScattered(true);
      controls.start({
        x: pushX,
        y: pushY,
        rotate: spin,
        scale: 1.3,
        opacity: f.op * 1.5,
        transition: { type: "spring", stiffness: 200, damping: 12, mass: 0.6 },
      }).then(() => {
        controls.start({
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          opacity: f.op,
          transition: { type: "spring", stiffness: 60, damping: 14, mass: 1, delay: 0.3 },
        }).then(() => setScattered(false));
      });
    }
  }

  return (
    <motion.div
      ref={elRef}
      animate={controls}
      className={`absolute${f.desktop ? " hidden lg:block" : ""}`}
      style={{
        left: `${f.xPct}%`,
        top: `${f.yPct}%`,
        width: icon.size,
        height: icon.size,
        opacity: f.op,
        willChange: scattered ? "transform" : "auto",
        "--dx": `${f.dx}px`,
        "--dy": `${f.dy}px`,
        "--rot": `${f.rot}deg`,
        animation: scattered ? "none" : `hero-float ${f.dur}s ease-in-out ${f.delay}s infinite`,
      } as React.CSSProperties}
    >
      <svg
        viewBox={icon.vb}
        className="h-full w-full text-primary"
        {...(icon.render === "fill"
          ? { fill: "currentColor", stroke: "none" }
          : { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
        )}
      >
        <path d={icon.d} />
      </svg>
    </motion.div>
  );
}

/* ── Main component ── */
export function HeroBg() {
  const [trigger, setTrigger] = useState<{ x: number; y: number; id: number } | null>(null);
  const idRef = useRef(0);

  const handleInteraction = useCallback((clientX: number, clientY: number) => {
    idRef.current += 1;
    setTrigger({ x: clientX, y: clientY, id: idRef.current });
  }, []);

  useEffect(() => {
    const onClickGlobal = (e: MouseEvent) => handleInteraction(e.clientX, e.clientY);
    const onTouchGlobal = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) handleInteraction(t.clientX, t.clientY);
    };
    window.addEventListener("click", onClickGlobal, { passive: true });
    window.addEventListener("touchstart", onTouchGlobal, { passive: true });
    return () => {
      window.removeEventListener("click", onClickGlobal);
      window.removeEventListener("touchstart", onTouchGlobal);
    };
  }, [handleInteraction]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-1 overflow-hidden"
    >
      <style>{`
        @keyframes hero-wave {
          0%   { transform: translateX(0) scaleY(1); }
          50%  { transform: translateX(-6%) scaleY(1.06); }
          100% { transform: translateX(0) scaleY(1); }
        }
        @keyframes hero-float {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          25%      { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); }
          50%      { transform: translate(calc(var(--dx) * 0.4), calc(var(--dy) * -0.5)) rotate(calc(var(--rot) * -0.4)); }
          75%      { transform: translate(calc(var(--dx) * -0.3), calc(var(--dy) * 0.3)) rotate(calc(var(--rot) * 0.3)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-floater, .hero-wave-el { animation: none !important; }
        }
      `}</style>

      {/* Gradient wave layers — repeat at top and middle of page */}
      <div
        className="hero-wave-el absolute -left-[10%] h-[30%] w-[120%] rounded-[50%]"
        style={{
          top: "5%",
          background: "radial-gradient(ellipse at 30% 50%, rgba(111,175,143,0.18), transparent 70%)",
          animation: "hero-wave 20s ease-in-out infinite",
        }}
      />
      <div
        className="hero-wave-el absolute -right-[10%] h-[25%] w-[120%] rounded-[50%]"
        style={{
          top: "40%",
          background: "radial-gradient(ellipse at 70% 50%, rgba(76,140,109,0.14), transparent 70%)",
          animation: "hero-wave 24s ease-in-out infinite reverse",
        }}
      />
      <div
        className="hero-wave-el absolute -left-[10%] h-[25%] w-[120%] rounded-[50%]"
        style={{
          top: "70%",
          background: "radial-gradient(ellipse at 40% 50%, rgba(111,175,143,0.12), transparent 70%)",
          animation: "hero-wave 22s ease-in-out 2s infinite",
        }}
      />

      {/* Floating medical icons — scattered across full page */}
      {floaters.map((f, i) => (
        <Floater key={i} f={f} scatterTrigger={trigger} />
      ))}
    </div>
  );
}
