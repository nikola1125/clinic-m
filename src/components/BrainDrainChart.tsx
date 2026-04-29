"use client";

import { useState, useRef } from "react";

const DATA: { year: number; value: number }[] = [
  { year: 2010, value: 450 },
  { year: 2011, value: 520 },
  { year: 2012, value: 590 },
  { year: 2013, value: 650 },
  { year: 2014, value: 730 },
  { year: 2015, value: 860 },
  { year: 2016, value: 930 },
  { year: 2017, value: 1060 },
  { year: 2018, value: 1190 },
  { year: 2019, value: 1330 },
  { year: 2020, value: 970 },
  { year: 2021, value: 1160 },
  { year: 2022, value: 1430 },
  { year: 2023, value: 1590 },
  { year: 2024, value: 1760 },
  { year: 2025, value: 1830 },
];

const W = 800;
const H = 280;
const PAD = { top: 24, right: 24, bottom: 40, left: 56 };

const minVal = 0;
const maxVal = 2000;
const years = DATA.map((d) => d.year);
const minYear = years[0];
const maxYear = years[years.length - 1];

function toX(year: number) {
  return PAD.left + ((year - minYear) / (maxYear - minYear)) * (W - PAD.left - PAD.right);
}
function toY(val: number) {
  return PAD.top + (1 - (val - minVal) / (maxVal - minVal)) * (H - PAD.top - PAD.bottom);
}

const pathD = DATA.map((d, i) =>
  `${i === 0 ? "M" : "L"} ${toX(d.year).toFixed(1)} ${toY(d.value).toFixed(1)}`
).join(" ");

const YTICKS = [0, 500, 1000, 1500, 2000];

export function BrainDrainChart({
  title,
  caption,
}: {
  title: string;
  caption: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number; point: (typeof DATA)[0] } | null>(null);

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const rawX = ((e.clientX - rect.left) / rect.width) * W;
    const year = minYear + ((rawX - PAD.left) / (W - PAD.left - PAD.right)) * (maxYear - minYear);
    const nearest = DATA.reduce((a, b) =>
      Math.abs(b.year - year) < Math.abs(a.year - year) ? b : a
    );
    setCursor({ x: toX(nearest.year), y: toY(nearest.value), point: nearest });
  }

  return (
    <figure className="my-12">
      <p className="label-mono mb-4">{title}</p>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ overflow: "visible", cursor: "crosshair" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setCursor(null)}
        aria-label={title}
        role="img"
      >
        {/* Y gridlines + labels */}
        {YTICKS.map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              y1={toY(v)}
              x2={W - PAD.right}
              y2={toY(v)}
              stroke="var(--line)"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 8}
              y={toY(v) + 4}
              textAnchor="end"
              fontSize={10}
              fill="var(--muted)"
              fontFamily="var(--font-mono, monospace)"
            >
              {v === 0 ? "0" : `${v / 1000}k`}
            </text>
          </g>
        ))}

        {/* X labels */}
        {DATA.filter((_, i) => i % 2 === 0).map((d) => (
          <text
            key={d.year}
            x={toX(d.year)}
            y={H - PAD.bottom + 16}
            textAnchor="middle"
            fontSize={10}
            fill="var(--muted)"
            fontFamily="var(--font-mono, monospace)"
          >
            {d.year}
          </text>
        ))}

        {/* Data line */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--ink)"
          strokeWidth={1}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Data dots */}
        {DATA.map((d) => (
          <circle
            key={d.year}
            cx={toX(d.year)}
            cy={toY(d.value)}
            r={2.5}
            fill="var(--ink)"
          />
        ))}

        {/* Crosshair */}
        {cursor && (
          <g>
            <line
              x1={cursor.x}
              y1={PAD.top}
              x2={cursor.x}
              y2={H - PAD.bottom}
              stroke="var(--ink)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <line
              x1={PAD.left}
              y1={cursor.y}
              x2={W - PAD.right}
              y2={cursor.y}
              stroke="var(--ink)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <circle cx={cursor.x} cy={cursor.y} r={4} fill="var(--bone)" stroke="var(--ink)" strokeWidth={1.5} />
            <rect
              x={cursor.x + 8}
              y={cursor.y - 22}
              width={68}
              height={20}
              fill="var(--bone)"
              stroke="var(--line)"
              strokeWidth={1}
            />
            <text
              x={cursor.x + 14}
              y={cursor.y - 8}
              fontSize={10}
              fill="var(--ink)"
              fontFamily="var(--font-mono, monospace)"
            >
              {cursor.point.year} — {cursor.point.value.toLocaleString()}
            </text>
          </g>
        )}
      </svg>
      <figcaption
        className="label-mono mt-2"
        style={{ color: "var(--muted)" }}
      >
        {caption}
      </figcaption>
    </figure>
  );
}
