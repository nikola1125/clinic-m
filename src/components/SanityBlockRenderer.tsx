"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { Info, AlertTriangle, Lightbulb, AlertCircle } from "lucide-react";

const calloutIcons: Record<string, React.ReactNode> = {
  info: <Info className="h-5 w-5 text-blue-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  tip: <Lightbulb className="h-5 w-5 text-green-500" />,
  important: <AlertCircle className="h-5 w-5 text-red-500" />,
};

const calloutBg: Record<string, string> = {
  info: "rgba(59,130,246,0.08)",
  warning: "rgba(245,158,11,0.08)",
  tip: "rgba(34,197,94,0.08)",
  important: "rgba(239,68,68,0.08)",
};

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <div className="relative aspect-video overflow-hidden rounded-xl img-above-floaters">
            <Image
              src={urlFor(value).width(1200).url()}
              alt={value.alt || ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 68ch"
            />
          </div>
          {value.caption && (
            <figcaption
              className="mt-2 text-center text-sm italic"
              style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
            >
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    callout: ({ value }) => {
      const style = value?.style || "info";
      return (
        <div
          className="my-8 flex gap-3 rounded-xl p-5"
          style={{ background: calloutBg[style] || calloutBg.info }}
        >
          <div className="shrink-0 pt-0.5">
            {calloutIcons[style] || calloutIcons.info}
          </div>
          <p
            className="text-[15px] leading-relaxed"
            style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
          >
            {value?.text}
          </p>
        </div>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2
        className="font-heading text-[26px] leading-tight mt-10 mb-4"
        style={{ color: "var(--ink)" }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className="font-heading text-[20px] leading-tight mt-8 mb-3"
        style={{ color: "var(--ink)" }}
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className="my-10 pl-6"
        style={{ borderLeft: "2px solid var(--oxblood)" }}
      >
        <p
          className="font-heading italic leading-snug"
          style={{ fontSize: "clamp(22px, 3vw, 32px)", color: "var(--ink)" }}
        >
          {children}
        </p>
      </blockquote>
    ),
    normal: ({ children }) => (
      <p
        className="text-[18px] leading-[1.75] mb-6"
        style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
      >
        {children}
      </p>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.blank ? "_blank" : undefined}
        rel={value?.blank ? "noopener noreferrer" : undefined}
        className="underline underline-offset-2 transition-opacity hover:opacity-70"
        style={{ color: "var(--primary-dark)" }}
      >
        {children}
      </a>
    ),
    highlight: ({ children }) => (
      <mark
        className="rounded px-1"
        style={{ background: "rgba(111,175,143,0.2)" }}
      >
        {children}
      </mark>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul
        className="list-disc pl-6 mb-6 space-y-2 text-[18px] leading-[1.75]"
        style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
      >
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol
        className="list-decimal pl-6 mb-6 space-y-2 text-[18px] leading-[1.75]"
        style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
      >
        {children}
      </ol>
    ),
  },
};

export function SanityBlockRenderer({ body }: { body: any[] }) {
  if (!body || body.length === 0) {
    return (
      <p
        className="text-[16px] italic"
        style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}
      >
        This article has no content yet.
      </p>
    );
  }
  return <PortableText value={body} components={components} />;
}
