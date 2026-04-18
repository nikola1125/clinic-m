"use client";

const ECG_PATH_LEN = 960;

const d =
  "M0,30 L180,30 L200,30 L210,24 L220,30 " +
  "L280,30 " +
  "L300,30 L310,4 L320,58 L330,30 " +
  "L350,30 L365,20 L380,30 " +
  "L900,30";

export function EcgLine() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-1/3 -translate-y-1/2 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <style>{`
        @keyframes ecg-draw {
          0%   { stroke-dashoffset: ${ECG_PATH_LEN}; opacity: 0; }
          6%   { opacity: 0.9; }
          78%  { opacity: 0.9; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ecg-path { animation: none !important; opacity: 0 !important; }
        }
      `}</style>

      <svg
        viewBox="0 0 900 60"
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: 56, willChange: "auto" }}
      >
        {/* Soft glow — thicker low-opacity duplicate (no filter) */}
        <path
          d={d}
          fill="none"
          stroke="#6FAF8F"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.08"
        />

        {/* Main animated draw line */}
        <path
          d={d}
          fill="none"
          stroke="#6FAF8F"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ecg-path"
          style={{
            strokeDasharray: ECG_PATH_LEN,
            strokeDashoffset: ECG_PATH_LEN,
            opacity: 0,
            willChange: "stroke-dashoffset, opacity",
            animation: `ecg-draw 3.8s cubic-bezier(0.3, 0, 0.7, 1) infinite`,
            animationDelay: "0.75s",
          }}
        />
      </svg>
    </div>
  );
}
