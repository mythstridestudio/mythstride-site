import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "out");
const locales = ["pt-BR", "en", "es"];
const publicSlugs = [
  "features",
  "how-it-works",
  "aethron",
  "wear-os",
  "events",
  "community",
  "closed-beta",
  "faq",
];
const draftSlugs = [
  "support",
  "privacy",
  "terms",
  "delete-account",
  "community-guidelines",
  "purchases",
  "ai-transparency",
  "third-party-services",
];
const failures = [];

async function exists(relativePath) {
  try {
    await access(path.join(out, relativePath));
    return true;
  } catch {
    return false;
  }
}

const requiredArtifacts = [
  "index.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "manifest.webmanifest",
  "login/index.html",
  "dashboard/index.html",
  "admin/events/index.html",
  "player/index.html",
  "player/profile-preview-disabled/index.html",
];

for (const locale of locales) {
  requiredArtifacts.push(`${locale}/index.html`);
  for (const slug of [...publicSlugs, ...draftSlugs]) {
    requiredArtifacts.push(`${locale}/${slug}/index.html`);
  }
  requiredArtifacts.push(`${locale}/delete-account/confirm/index.html`);
}

for (const artifact of requiredArtifacts) {
  if (!(await exists(artifact))) failures.push(`missing build artifact: ${artifact}`);
}

for (const locale of locales) {
  const home = await readFile(path.join(out, locale, "index.html"), "utf8");
  if (!home.includes(`<html lang="${locale}"`)) {
    failures.push(`${locale} home has incorrect html lang`);
  }
  if (!home.includes(`rel="canonical" href="https://playmythstride.com/${locale}/"`)) {
    failures.push(`${locale} home has incorrect canonical`);
  }
  if (
    !home.includes('hrefLang="pt-BR"') ||
    !home.includes('hrefLang="en"') ||
    !home.includes('hrefLang="es"')
  ) {
    failures.push(`${locale} home is missing hreflang alternates`);
  }
  if (!home.includes('id="join"')) {
    failures.push(`${locale} home is missing the waitlist target`);
  }

  for (const slug of draftSlugs) {
    const html = await readFile(
      path.join(out, locale, slug, "index.html"),
      "utf8",
    );
    if (!html.includes('name="robots" content="noindex, nofollow')) {
      failures.push(`${locale}/${slug} is missing noindex,nofollow`);
    }
    if (!html.includes("data-legal-draft")) {
      failures.push(`${locale}/${slug} is missing the visible draft notice`);
    }
    if (slug === "delete-account") {
      // The public, non-enumerating deletion-request form is the intended
      // implementation of this page: it must exist, and its response text
      // must stay generic (never confirm or deny that an email has an
      // account) regardless of locale wording.
      if (!/<form[\s>]/i.test(html)) {
        failures.push(`${locale}/${slug} is missing the account-deletion request form`);
      }
      if (/#token=/i.test(html)) {
        failures.push(`${locale}/${slug} leaks a deletion token into static HTML`);
      }
    } else if (/<form[\s>]/i.test(html)) {
      failures.push(`${locale}/${slug} unexpectedly contains a form`);
    }
  }

  const confirmHtml = await readFile(
    path.join(out, locale, "delete-account", "confirm", "index.html"),
    "utf8",
  );
  if (!confirmHtml.includes('name="robots" content="noindex, nofollow')) {
    failures.push(`${locale}/delete-account/confirm is missing noindex,nofollow`);
  }
  if (!confirmHtml.includes("data-legal-draft")) {
    failures.push(`${locale}/delete-account/confirm is missing the visible draft notice`);
  }
  if (/<form[\s>]/i.test(confirmHtml)) {
    failures.push(`${locale}/delete-account/confirm unexpectedly contains a form`);
  }
  if (/#token=/i.test(confirmHtml)) {
    failures.push(`${locale}/delete-account/confirm leaks a deletion token into static HTML`);
  }
}

async function collectHtml(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectHtml(target)));
    else if (entry.name.endsWith(".html")) files.push(target);
  }
  return files;
}

for (const file of await collectHtml(out)) {
  const html = await readFile(file, "utf8");
  const relative = path.relative(out, file);
  const forbidden = [
    [/\bAugusto\b/i, "personal profile fixture"],
    [/screen-(?:run|shop|inventory|dashboard)\.(?:jpg|png|webp)/i, "debug or unapproved screenshot"],
    [/(?:R\$\s*\d|\$\s*\d+\.\d{2})/i, "fake price"],
    [/NEXT_PUBLIC_STATIC_PLAYER_USERNAMES/i, "public profile export variable"],
  ];
  for (const [pattern, label] of forbidden) {
    if (pattern.test(html)) failures.push(`${relative}: ${label}`);
  }
}

const sitemap = await readFile(path.join(out, "sitemap.xml"), "utf8");
for (const slug of draftSlugs) {
  if (sitemap.includes(`/${slug}/`)) {
    failures.push(`sitemap includes draft route: ${slug}`);
  }
}
for (const forbidden of ["/login/", "/dashboard/", "/admin/", "/player/"]) {
  if (sitemap.includes(forbidden)) {
    failures.push(`sitemap includes internal route: ${forbidden}`);
  }
}

JSON.parse(await readFile(path.join(out, "manifest.webmanifest"), "utf8"));

if (failures.length) {
  console.error("Build validation failed:\n" + failures.join("\n"));
  process.exit(1);
}

console.log(`Build validation passed for ${requiredArtifacts.length} artifacts.`);
