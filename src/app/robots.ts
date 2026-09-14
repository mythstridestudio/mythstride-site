import type { MetadataRoute } from "next";
import { localePath, publicLocales } from "@/lib/locales";
import { siteUrl } from "@/lib/metadata";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", ...publicLocales.map((locale) => localePath(locale))],
      disallow: [
        "/login/",
        "/dashboard/",
        "/admin/",
        "/player/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
