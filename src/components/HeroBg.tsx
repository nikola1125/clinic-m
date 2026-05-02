"use client";

import { useEffect, useRef, useState } from "react";

/**
 * HeroBg — full-viewport ambient medical background.
 * Uses position:fixed to cover the entire visible page at all times,
 * regardless of scroll position. Icons are placed via Poisson-disk
 * rejection for even, organic spacing. Three depth layers provide
 * subtle scroll parallax. Motion is slow and unobtrusive.
 *
 * z-index strategy:
 *   - This layer sits at z-index:1 (behind content)
 *   - Images get `relative z-[2]` to stay above floaters
 *   - Text stays at default stacking (floaters visible behind/through)
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
  /* Additional medical icons for variety */
  { vb: "0 0 24 24", render: "stroke", d: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2" }, /* clock */
  { vb: "0 0 24 24", render: "stroke", d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7 7-7z" }, /* heart outline */
  { vb: "0 0 24 24", render: "stroke", d: "M3 12h4l3-9 4 18 3-9h4" }, /* pulse */
  { vb: "0 0 24 24", render: "stroke", d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }, /* briefcase */
  { vb: "0 0 24 24", render: "stroke", d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }, /* check circle */
  { vb: "0 0 24 24", render: "stroke", d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" }, /* lightning */
  { vb: "0 0 24 24", render: "stroke", d: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" }, /* heart fill */
  { vb: "0 0 24 24", render: "stroke", d: "M12 2a10 10 0 100 20 10 10 0 000-20z" }, /* circle */
  { vb: "0 0 24 24", render: "stroke", d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }, /* chat */
];

/* ── Depth layer config ── */
type DepthLayer = "far" | "mid" | "near";
const LAYER_CFG: Record<DepthLayer, {
  parallax: number; opRange: [number, number];
  sizeRange: [number, number]; floatRange: [number, number];
}> = {
  far:  { parallax: 0.015, opRange: [0.12, 0.22],  sizeRange: [18, 26], floatRange: [24, 36] },
  mid:  { parallax: 0.04,  opRange: [0.18, 0.30],  sizeRange: [26, 36], floatRange: [18, 28] },
  near: { parallax: 0.08,  opRange: [0.25, 0.40],  sizeRange: [32, 46], floatRange: [12, 20] },
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
  op: number; size: number; layer: DepthLayer; mobileVisible: boolean;
};

/* ── Poisson-disk–inspired placement for organic even spread ── */
function buildFloaters(): FloaterConfig[] {
  const rand = mulberry32(42);
  const out: FloaterConfig[] = [];
  const layers: DepthLayer[] = ["far","far","far","mid","mid","mid","mid","near","near","near"];

  function placeSet(count: number, mobileVisible: boolean, minDist: number) {
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
            mobileVisible,
          });
          remaining--;
        }
      }
    }
  }

  /* Mobile-visible: 48 floaters spread across the viewport */
  placeSet(48, true, 8);
  /* Desktop-only extra density: 36 more */
  placeSet(36, false, 10);
  return out;
}

const floaters = buildFloaters();

/* ── Single Floater with scroll parallax ── */
function Floater({
  f,
  scrollY,
}: {
  f: FloaterConfig;
  scrollY: number;
}) {
  const icon = icons[f.icon];

  // Parallax offset based on scroll position and depth layer
  const parallaxY = scrollY * LAYER_CFG[f.layer].parallax;

  return (
    <div
      className={`absolute hero-floater${f.mobileVisible ? "" : " hidden lg:block"}`}
      style={{
        left: `${f.xPct}%`,
        top: `${f.yPct}%`,
        width: f.size,
        height: f.size,
        opacity: f.op,
        transform: `translateY(${parallaxY}px)`,
        "--dx": `${f.dx}px`,
        "--dy": `${f.dy}px`,
        "--rot": `${f.rot}deg`,
        animation: `hero-float ${f.dur}s ease-in-out ${f.delay}s infinite`,
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
    </div>
  );
}

/* ── Gradient Orb that drifts ── */
function Orb({
  x, y, r, color, dur, delay, scrollY, parallax,
}: {
  x: number; y: number; r: number; color: string; dur: number; delay: number; scrollY: number; parallax: number;
}) {
  return (
    <div
      className="absolute hero-wave-el"
      style={{
        left: `${x}%`,
        top: `calc(${y}% + ${scrollY * parallax}px)`,
        width: r,
        height: r,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}, transparent 70%)`,
        filter: "blur(40px)",
        animation: `hero-wave ${dur}s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}

/* ── Pulsing ring ── */
function PulseRing({
  x, y, r, dur, delay, color, scrollY, parallax,
}: {
  x: number; y: number; r: number; dur: number; delay: number; color: string; scrollY: number; parallax: number;
}) {
  return (
    <div
      className="absolute hero-wave-el"
      style={{
        left: `${x}%`,
        top: `calc(${y}% + ${scrollY * parallax}px)`,
        width: r,
        height: r,
        borderRadius: "50%",
        border: `1.5px solid ${color}`,
        transform: "translate(-50%, -50%)",
        animation: `pulse-ring ${dur}s ease-out ${delay}s infinite`,
      }}
    />
  );
}

/* ── Subtle dot grid pattern ── */
function DotGrid({ scrollY }: { scrollY: number }) {
  return (
    <div
      className="absolute inset-0 hero-wave-el"
      style={{
        backgroundImage: "radial-gradient(rgba(111,175,143,0.06) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        transform: `translateY(${scrollY * 0.008}px)`,
      }}
    />
  );
}

/* ── Main component ── */
export function HeroBg() {
  const [scrollY, setScrollY] = useState(0);
  const [docHeight, setDocHeight] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Measure full document height and update on resize / DOM changes
    const measure = () => setDocHeight(document.documentElement.scrollHeight);
    measure();

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          measure();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);

    // Observe DOM changes that may alter page height
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 w-full overflow-hidden"
      style={{ zIndex: 3, height: docHeight || "100%" }}
    >
      <style>{`
        @keyframes hero-wave {
          0%   { transform: translateX(0) scaleY(1); }
          50%  { transform: translateX(-3%) scaleY(1.03); }
          100% { transform: translateX(0) scaleY(1); }
        }
        @keyframes hero-float {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          33%      { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); }
          66%      { transform: translate(calc(var(--dx) * -0.5), calc(var(--dy) * -0.3)) rotate(calc(var(--rot) * -0.4)); }
        }
        @keyframes pulse-ring {
          0%   { transform: translate(-50%, -50%) scale(0.6); opacity: 0; }
          30%  { opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-floater, .hero-wave-el { animation: none !important; }
        }
      `}</style>

      {/* ── Gradient wave layers (5 depths) ── */}
      <div
        className="hero-wave-el absolute -left-[10%] h-[30%] w-[120%] rounded-[50%]"
        style={{
          top: `calc(5% + ${scrollY * 0.012}px)`,
          background: "radial-gradient(ellipse at 30% 50%, rgba(111,175,143,0.09), transparent 75%)",
          animation: "hero-wave 32s ease-in-out infinite",
        }}
      />
      <div
        className="hero-wave-el absolute -right-[10%] h-[26%] w-[120%] rounded-[50%]"
        style={{
          top: `calc(35% + ${scrollY * 0.025}px)`,
          background: "radial-gradient(ellipse at 70% 50%, rgba(76,140,109,0.07), transparent 75%)",
          animation: "hero-wave 38s ease-in-out infinite reverse",
        }}
      />
      <div
        className="hero-wave-el absolute left-[20%] h-[22%] w-full rounded-[50%]"
        style={{
          top: `calc(65% + ${scrollY * 0.018}px)`,
          background: "radial-gradient(ellipse at 50% 50%, rgba(168,213,186,0.06), transparent 70%)",
          animation: "hero-wave 44s ease-in-out infinite",
        }}
      />
      <div
        className="hero-wave-el absolute -left-[15%] h-[28%] w-[110%] rounded-[50%]"
        style={{
          top: `calc(85% + ${scrollY * 0.022}px)`,
          background: "radial-gradient(ellipse at 40% 50%, rgba(111,175,143,0.08), transparent 75%)",
          animation: "hero-wave 36s ease-in-out infinite reverse",
        }}
      />
      <div
        className="hero-wave-el absolute right-[10%] h-[20%] w-[90%] rounded-[50%]"
        style={{
          top: `calc(15% + ${scrollY * 0.015}px)`,
          background: "radial-gradient(ellipse at 60% 50%, rgba(168,213,186,0.05), transparent 70%)",
          animation: "hero-wave 40s ease-in-out infinite",
        }}
      />

      {/* ── Soft gradient orbs that drift ── */}
      <Orb x={12} y={18} r={180} color="rgba(111,175,143,0.08)" dur={28} delay={0} scrollY={scrollY} parallax={0.02} />
      <Orb x={78} y={35} r={220} color="rgba(168,213,186,0.06)" dur={34} delay={5} scrollY={scrollY} parallax={0.03} />
      <Orb x={45} y={55} r={160} color="rgba(76,140,109,0.07)" dur={30} delay={10} scrollY={scrollY} parallax={0.025} />
      <Orb x={88} y={72} r={200} color="rgba(111,175,143,0.06)" dur={26} delay={15} scrollY={scrollY} parallax={0.018} />
      <Orb x={25} y={88} r={190} color="rgba(168,213,186,0.07)" dur={32} delay={8} scrollY={scrollY} parallax={0.022} />
      <Orb x={65} y={12} r={150} color="rgba(76,140,109,0.05)" dur={36} delay={3} scrollY={scrollY} parallax={0.015} />

      {/* ── Pulsing rings ── */}
      <PulseRing x={20} y={25} r={60} dur={5} delay={0} color="rgba(111,175,143,0.12)" scrollY={scrollY} parallax={0.03} />
      <PulseRing x={70} y={45} r={80} dur={6} delay={2} color="rgba(168,213,186,0.10)" scrollY={scrollY} parallax={0.02} />
      <PulseRing x={40} y={70} r={70} dur={4.5} delay={1.5} color="rgba(76,140,109,0.11)" scrollY={scrollY} parallax={0.025} />
      <PulseRing x={85} y={85} r={90} dur={5.5} delay={3} color="rgba(111,175,143,0.09)" scrollY={scrollY} parallax={0.02} />
      <PulseRing x={15} y={55} r={55} dur={6.5} delay={4} color="rgba(168,213,186,0.08)" scrollY={scrollY} parallax={0.035} />
      <PulseRing x={55} y={15} r={65} dur={4} delay={0.5} color="rgba(76,140,109,0.10)" scrollY={scrollY} parallax={0.018} />
      <PulseRing x={90} y={60} r={75} dur={5} delay={2.5} color="rgba(111,175,143,0.08)" scrollY={scrollY} parallax={0.025} />
      <PulseRing x={30} y={90} r={85} dur={6} delay={1} color="rgba(168,213,186,0.09)" scrollY={scrollY} parallax={0.02} />

      {/* ── Dot grid pattern ── */}
      <DotGrid scrollY={scrollY} />

      {/* ── Floating medical icons — evenly spaced, subtle parallax ── */}
      {floaters.map((f, i) => (
        <Floater key={i} f={f} scrollY={scrollY} />
      ))}
    </div>
  );
}
