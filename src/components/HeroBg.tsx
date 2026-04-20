"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

/**
 * HeroBg — full-page animated medical background with scroll parallax.
 * Uses depth layers (far/mid/near) for natural parallax feel.
 * Icons placed via Poisson-disk–style rejection for organic, even spacing.
 * Tap/click triggers scatter interaction.
 */

type Icon = { vb: string; render: "stroke" | "fill"; d: string };

const icons: Icon[] = [
  { vb: "0 0 24 24", render: "fill",   d: "M10 2h4v8h8v4h-8v8h-4v-8H2v-4h8V2z" },
  { vb: "0 0 32 16", render: "stroke", d: "M0 8h6l2-6 3 12 2.5-6h4l2-4 2 4H32" },
  { vb: "0 0 24 24", render: "stroke", d: "M10.5 1.5l-8 8a4.95 4.95 0 007 7l8-8a4.95 4.95 0 00-7-7zM11 13L6.5 8.5" },
  { vb: "0 0 24 24", render: "stroke", d: "M4 4v4a8 8 0 0016 0V4M8 1v3M16 1v3M12 16v3a3 3 0 006 0v-1" },
  { vb: "0 0 24 24", render: "fill",   d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" },
  { vb: "0 0 24 24", render: "stroke", d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4" },
  { vb: "0 0 24 24", render: "stroke", d: "M22 12h-4l-3 9L9 3l-3 9H2" },
  { vb: "0 0 24 24", render: "stroke", d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z" },
];

/* ── Depth layer config — each layer has its own parallax speed, opacity, size ── */
type DepthLayer = "far" | "mid" | "near";
const LAYER_CFG: Record<DepthLayer, {
  parallax: number; opRange: [number, number];
  sizeRange: [number, number]; floatRange: [number, number];
}> = {
  far:  { parallax: 0.02, opRange: [0.08, 0.14], sizeRange: [20, 28], floatRange: [18, 28] },
  mid:  { parallax: 0.05, opRange: [0.12, 0.20],  sizeRange: [28, 38], floatRange: [12, 20] },
  near: { parallax: 0.10, opRange: [0.16, 0.26],  sizeRange: [36, 48], floatRange: [8,  16] },
};

/* ── Seeded PRNG (mulberry32) — deterministic randomness so SSR = client ── */
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type FloaterConfig = {
  icon: number; xPct: number; yPct: number;
  delay: number; dur: number; dx: number; dy: number; rot: number;
  op: number; size: number; layer: DepthLayer; desktopOnly: boolean;
};

/* ── Poisson-disk–inspired placement for organic even spread ── */
function buildFloaters(): FloaterConfig[] {
  const rand = mulberry32(42);
  const out: FloaterConfig[] = [];
  const layers: DepthLayer[] = ["far","far","far","mid","mid","mid","mid","near","near","near"];

  function placeSet(count: number, desktopOnly: boolean, minDist: number) {
    const placed: { x: number; y: number }[] = [];
    const bands = Math.ceil(Math.sqrt(count * 1.5));
    const bandH = 100 / bands;
    const perBand = Math.ceil(count / bands);
    let remaining = count;

    for (let b = 0; b < bands && remaining > 0; b++) {
      const n = Math.min(perBand, remaining);
      const bandTop = b * bandH;

      for (let j = 0; j < n; j++) {
        let bestX = 0, bestY = 0, bestD = -1;
        for (let a = 0; a < 30; a++) {
          const cx = rand() * 92 + 4;
          const cy = bandTop + rand() * bandH * 0.88 + bandH * 0.06;
          let closest = Infinity;
          for (const p of placed) {
            closest = Math.min(closest, Math.sqrt((cx - p.x) ** 2 + (cy - p.y) ** 2));
          }
          if (closest > bestD) { bestD = closest; bestX = cx; bestY = cy; }
        }

        if (bestD >= minDist || placed.length < 3) {
          placed.push({ x: bestX, y: bestY });
          const layer = layers[Math.floor(rand() * layers.length)];
          const c = LAYER_CFG[layer];

          out.push({
            icon: Math.floor(rand() * icons.length),
            xPct: bestX,
            yPct: Math.min(99, Math.max(0.5, bestY)),
            delay: rand() * 8,
            dur: c.floatRange[0] + rand() * (c.floatRange[1] - c.floatRange[0]),
            dx: (rand() - 0.5) * 28,
            dy: (rand() - 0.5) * 22,
            rot: (rand() - 0.5) * 18,
            op: c.opRange[0] + rand() * (c.opRange[1] - c.opRange[0]),
            size: Math.round(c.sizeRange[0] + rand() * (c.sizeRange[1] - c.sizeRange[0])),
            layer,
            desktopOnly,
          });
          remaining--;
        }
      }
    }
  }

  placeSet(42, false, 8);
  placeSet(28, true, 10);
  return out;
}

const floaters = buildFloaters();

/* ── Scatter config ── */
const SCATTER_RADIUS = 180;
const SCATTER_FORCE = 100;

/* ── Single Floater with scroll parallax ── */
function Floater({
  f,
  scrollY,
  scatterTrigger,
}: {
  f: FloaterConfig;
  scrollY: number;
  scatterTrigger: { x: number; y: number; id: number } | null;
}) {
  const icon = icons[f.icon];
  const controls = useAnimation();
  const elRef = useRef<HTMLDivElement>(null);
  const [scattered, setScattered] = useState(false);

  // Parallax offset based on scroll position and depth layer
  const parallaxY = scrollY * LAYER_CFG[f.layer].parallax;

  // React to scatter triggers
  const prevTrigger = useRef<number>(0);
  if (scatterTrigger && scatterTrigger.id !== prevTrigger.current && elRef.current) {
    prevTrigger.current = scatterTrigger.id;
    const rect = elRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const ddx = cx - scatterTrigger.x;
    const ddy = cy - scatterTrigger.y;
    const dist = Math.sqrt(ddx * ddx + ddy * ddy);

    if (dist < SCATTER_RADIUS && dist > 0) {
      const force = ((SCATTER_RADIUS - dist) / SCATTER_RADIUS) * SCATTER_FORCE;
      const angle = Math.atan2(ddy, ddx);
      const pushX = Math.cos(angle) * force;
      const pushY = Math.sin(angle) * force;
      const spin = (Math.random() - 0.5) * 120;

      setScattered(true);
      controls.start({
        x: pushX,
        y: pushY,
        rotate: spin,
        scale: 1.2,
        opacity: Math.min(f.op * 1.8, 0.3),
        transition: { type: "spring", stiffness: 180, damping: 14, mass: 0.5 },
      }).then(() => {
        controls.start({
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          opacity: f.op,
          transition: { type: "spring", stiffness: 50, damping: 16, mass: 1.2, delay: 0.4 },
        }).then(() => setScattered(false));
      });
    }
  }

  return (
    <motion.div
      ref={elRef}
      animate={controls}
      className={`absolute${f.desktopOnly ? " hidden lg:block" : ""}`}
      style={{
        left: `${f.xPct}%`,
        top: `${f.yPct}%`,
        width: f.size,
        height: f.size,
        opacity: f.op,
        transform: `translateY(${parallaxY}px)`,
        willChange: scattered ? "transform, opacity" : "auto",
        "--dx": `${f.dx}px`,
        "--dy": `${f.dy}px`,
        "--rot": `${f.rot}deg`,
        animation: scattered ? "none" : `hero-float ${f.dur}s ease-in-out ${f.delay}s infinite`,
      } as React.CSSProperties}
    >
      <svg
        viewBox={icon.vb}
        className="h-full w-full"
        style={{ color: "var(--primary)" }}
        {...(icon.render === "fill"
          ? { fill: "currentColor", stroke: "none" }
          : { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
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
  const [scrollY, setScrollY] = useState(0);
  const idRef = useRef(0);
  const rafRef = useRef<number>(0);

  const handleInteraction = useCallback((clientX: number, clientY: number) => {
    idRef.current += 1;
    setTrigger({ x: clientX, y: clientY, id: idRef.current });
  }, []);

  useEffect(() => {
    // Scroll handler with rAF for smooth 60fps parallax
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    const onClickGlobal = (e: MouseEvent) => handleInteraction(e.clientX, e.clientY);
    const onTouchGlobal = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) handleInteraction(t.clientX, t.clientY);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("click", onClickGlobal, { passive: true });
    window.addEventListener("touchstart", onTouchGlobal, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClickGlobal);
      window.removeEventListener("touchstart", onTouchGlobal);
      cancelAnimationFrame(rafRef.current);
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
          50%  { transform: translateX(-4%) scaleY(1.04); }
          100% { transform: translateX(0) scaleY(1); }
        }
        @keyframes hero-float {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          33%      { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); }
          66%      { transform: translate(calc(var(--dx) * -0.6), calc(var(--dy) * -0.4)) rotate(calc(var(--rot) * -0.5)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-floater, .hero-wave-el { animation: none !important; }
        }
      `}</style>

      {/* Gradient wave layers — organic blobs at three depths */}
      <div
        className="hero-wave-el absolute -left-[10%] h-[35%] w-[120%] rounded-[50%]"
        style={{
          top: `calc(3% + ${scrollY * 0.015}px)`,
          background: "radial-gradient(ellipse at 25% 50%, rgba(111,175,143,0.13), transparent 70%)",
          animation: "hero-wave 24s ease-in-out infinite",
        }}
      />
      <div
        className="hero-wave-el absolute -right-[10%] h-[28%] w-[120%] rounded-[50%]"
        style={{
          top: `calc(38% + ${scrollY * 0.03}px)`,
          background: "radial-gradient(ellipse at 75% 50%, rgba(76,140,109,0.10), transparent 70%)",
          animation: "hero-wave 28s ease-in-out infinite reverse",
        }}
      />
      <div
        className="hero-wave-el absolute -left-[10%] h-[28%] w-[120%] rounded-[50%]"
        style={{
          top: `calc(68% + ${scrollY * 0.045}px)`,
          background: "radial-gradient(ellipse at 40% 50%, rgba(111,175,143,0.09), transparent 70%)",
          animation: "hero-wave 26s ease-in-out 3s infinite",
        }}
      />

      {/* Floating medical icons — Poisson-distributed with parallax */}
      {floaters.map((f, i) => (
        <Floater key={i} f={f} scrollY={scrollY} scatterTrigger={trigger} />
      ))}
    </div>
  );
}
