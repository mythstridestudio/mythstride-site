import type { MetadataRoute } from "next";
import { draftPageSlugs } from "@/content/pages";
import { localePath, publicLocales } from "@/lib/locales";
import { siteUrl } from "@/lib/metadata";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const draftPaths = draftPageSlugs.flatMap((slug) =>
    publicLocales.map((locale) => localePath(locale, `/${slug}`)),
  );

  return {
    rules: {
      userAgent: "*",
      allow: ["/", ...publicLocales.map((locale) => localePath(locale))],
      disallow: [
        "/login/",
        "/dashboard/",
        "/admin/",
        "/player/",
        ...draftPaths,
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
