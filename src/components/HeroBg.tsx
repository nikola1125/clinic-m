"use client";

/**
 * HeroBg — lightweight animated medical-themed background.
 * Pure CSS keyframes + inline SVG icons. No heavy libraries.
 * Icons drift slowly at low opacity so text stays readable.
 */

type Icon = { vb: string; render: "stroke" | "fill"; d: string; size: number };

const icons: Icon[] = [
  // Medical cross (filled)
  { vb: "0 0 24 24", render: "fill", d: "M10 2h4v8h8v4h-8v8h-4v-8H2v-4h8V2z", size: 34 },
  // ECG heartbeat line (stroked)
  { vb: "0 0 32 16", render: "stroke", d: "M0 8h6l2-6 3 12 2.5-6h4l2-4 2 4H32", size: 40 },
  // Pill capsule (stroked)
  { vb: "0 0 24 24", render: "stroke", d: "M10.5 1.5l-8 8a4.95 4.95 0 007 7l8-8a4.95 4.95 0 00-7-7zM11 13L6.5 8.5", size: 30 },
  // Stethoscope (stroked)
  { vb: "0 0 24 24", render: "stroke", d: "M4 4v4a8 8 0 0016 0V4M8 1v3M16 1v3M12 16v3a3 3 0 006 0v-1", size: 32 },
  // Heart (filled)
  { vb: "0 0 24 24", render: "fill", d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z", size: 28 },
  // Shield with check (stroked)
  { vb: "0 0 24 24", render: "stroke", d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4", size: 30 },
];

const floaters = [
  { icon: 0, x: "6%",   y: "10%",  delay: 0,   dur: 24, dx: 35,  dy: -25, rot: 18,  op: 0.08 },
  { icon: 1, x: "70%",  y: "6%",   delay: 2,   dur: 28, dx: -30, dy: 20,  rot: -8,  op: 0.10 },
  { icon: 2, x: "85%",  y: "50%",  delay: 1,   dur: 22, dx: -25, dy: -35, rot: 22,  op: 0.07 },
  { icon: 3, x: "20%",  y: "65%",  delay: 4,   dur: 30, dx: 25,  dy: -18, rot: -14, op: 0.08 },
  { icon: 4, x: "50%",  y: "15%",  delay: 1.5, dur: 26, dx: -18, dy: 22,  rot: 10,  op: 0.09 },
  { icon: 5, x: "35%",  y: "78%",  delay: 3,   dur: 27, dx: 28,  dy: -28, rot: -16, op: 0.07 },
  { icon: 0, x: "62%",  y: "68%",  delay: 6,   dur: 25, dx: -22, dy: 18,  rot: 14,  op: 0.06 },
  { icon: 1, x: "12%",  y: "38%",  delay: 5,   dur: 29, dx: 18,  dy: -22, rot: -10, op: 0.08 },
  { icon: 4, x: "80%",  y: "28%",  delay: 7,   dur: 23, dx: -20, dy: 20,  rot: 12,  op: 0.06 },
  { icon: 2, x: "42%",  y: "48%",  delay: 3.5, dur: 31, dx: 24,  dy: -16, rot: -20, op: 0.055 },
] as const;

export function HeroBg() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-5 overflow-hidden"
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

      {/* Gradient wave layers */}
      <div
        className="hero-wave-el absolute -bottom-1/4 -left-[10%] h-[60%] w-[120%] rounded-[50%]"
        style={{
          background: "radial-gradient(ellipse at 30% 50%, rgba(111,175,143,0.08), transparent 70%)",
          animation: "hero-wave 20s ease-in-out infinite",
        }}
      />
      <div
        className="hero-wave-el absolute -top-1/4 -right-[10%] h-[50%] w-[120%] rounded-[50%]"
        style={{
          background: "radial-gradient(ellipse at 70% 50%, rgba(76,140,109,0.06), transparent 70%)",
          animation: "hero-wave 24s ease-in-out infinite reverse",
        }}
      />

      {/* Floating medical icons */}
      {floaters.map((f, i) => {
        const icon = icons[f.icon];
        return (
          <div
            key={i}
            className="hero-floater absolute"
            style={{
              left: f.x,
              top: f.y,
              width: icon.size,
              height: icon.size,
              opacity: f.op,
              "--dx": `${f.dx}px`,
              "--dy": `${f.dy}px`,
              "--rot": `${f.rot}deg`,
              animation: `hero-float ${f.dur}s ease-in-out ${f.delay}s infinite`,
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
          </div>
        );
      })}
    </div>
  );
}
