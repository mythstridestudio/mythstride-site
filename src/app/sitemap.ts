import type { MetadataRoute } from "next";
import { publicPageSlugs } from "@/content/pages";
import { publicLocales, localePath } from "@/lib/locales";
import { siteUrl } from "@/lib/metadata";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicLocales.flatMap((locale) => {
    const paths = ["/", ...publicPageSlugs.map((slug) => `/${slug}`)];

    return paths.map((path) => ({
      url: new URL(localePath(locale, path), siteUrl).toString(),
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority: path === "/" ? 1 : 0.7,
      alternates: {
        languages: {
          "pt-BR": new URL(localePath("pt-BR", path), siteUrl).toString(),
          en: new URL(localePath("en", path), siteUrl).toString(),
        },
      },
    }));
  });
}
