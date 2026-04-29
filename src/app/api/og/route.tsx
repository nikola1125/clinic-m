import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "MjekOn";
  const label = searchParams.get("label") ?? "TELEHEALTH";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "64px",
          background: "#F5F0E8", // var(--bone)
          fontFamily: "serif",
        }}
      >
        {/* Hairline top rule */}
        <div
          style={{
            position: "absolute",
            top: 64,
            left: 64,
            right: 64,
            height: 1,
            background: "rgba(26,22,14,0.15)",
          }}
        />

        {/* Label */}
        <div
          style={{
            fontSize: 13,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(26,22,14,0.45)",
            marginBottom: 20,
            fontFamily: "monospace",
          }}
        >
          MJEKON · {label}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 40 ? 44 : 64,
            lineHeight: 1.05,
            color: "#1A160E", // var(--ink)
            maxWidth: 900,
          }}
        >
          {title}
        </div>

        {/* Bottom rule */}
        <div
          style={{
            position: "absolute",
            bottom: 64,
            left: 64,
            right: 64,
            height: 1,
            background: "rgba(26,22,14,0.15)",
          }}
        />

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 64,
            fontSize: 12,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(26,22,14,0.35)",
            fontFamily: "monospace",
          }}
        >
          mjekon.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
