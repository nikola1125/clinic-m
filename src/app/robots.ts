import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/portal/",
          "/patient/",
          "/hq-command/",
          "/meet/",
          "/api/",
        ],
      },
    ],
    sitemap: "https://mjekon.com/sitemap.xml",
    host: "https://mjekon.com",
  };
}
