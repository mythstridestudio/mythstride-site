import type { MetadataRoute } from "next";
import { draftPageSlugs } from "@/content/pages";
import { siteUrl } from "@/lib/metadata";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const draftPaths = draftPageSlugs.flatMap((slug) => [
    `/pt-BR/${slug}/`,
    `/en/${slug}/`,
  ]);

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/pt-BR/", "/en/"],
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
