import type { MetadataRoute } from "next";

const BASE = "https://mjekon.com";
const LOCALES = ["sq", "en", "it"] as const;

function localeUrls(path: string, priority = 0.8): MetadataRoute.Sitemap[number][] {
  return LOCALES.map((locale) => ({
    url: `${BASE}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${BASE}/${l}${path}`])
      ),
    },
  }));
}

// Static routes
const STATIC_PATHS = [
  { path: "", priority: 1.0 },
  { path: "/doctors", priority: 0.9 },
  { path: "/pricing", priority: 0.8 },
  { path: "/mission", priority: 0.7 },
  { path: "/trust", priority: 0.7 },
  { path: "/contact", priority: 0.7 },
  { path: "/press", priority: 0.5 },
  { path: "/status", priority: 0.4 },
  { path: "/legal/terms", priority: 0.4 },
  { path: "/legal/privacy", priority: 0.4 },
  { path: "/legal/cookies", priority: 0.4 },
  { path: "/for-clinicians", priority: 0.6 },
  { path: "/for-partners", priority: 0.6 },
  { path: "/journal", priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = STATIC_PATHS.flatMap(({ path, priority }) =>
    localeUrls(path, priority)
  );

  // Dynamic doctor slugs
  let doctorEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"}/doctors`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const doctors: { slug?: string; id: string }[] = await res.json();
      doctorEntries = doctors.flatMap((d) => {
        const slug = d.slug ?? d.id;
        return LOCALES.map((locale) => ({
          url: `${BASE}/${locale}/doctors/${slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.85,
        }));
      });
    }
  } catch {
    // silently skip if API is unavailable during build
  }

  return [...staticEntries, ...doctorEntries];
}
