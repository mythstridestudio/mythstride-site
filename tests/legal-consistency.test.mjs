import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import path from "node:path";

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), "utf8");

const legalSlugs = [
  "privacy",
  "terms",
  "delete-account",
  "third-party-services",
  "support",
  "community-guidelines",
  "purchases",
  "ai-transparency",
];

test("the published effective date matches the legal configuration", async () => {
  const [config, pages] = await Promise.all([
    read("src/config/legal.ts"),
    read("src/content/pages.ts"),
  ]);

  assert.match(config, /effectiveDate: "2026-09-15"/);

  for (const label of [
    "15 de setembro de 2026",
    "September 15, 2026",
    "15 de septiembre de 2026",
  ]) {
    assert.ok(config.includes(label), `legal.ts must record "${label}"`);
    assert.ok(pages.includes(label), `pages.ts must publish "${label}"`);
  }

  for (const stale of [
    "14 de setembro de 2026",
    "September 14, 2026",
    "14 de septiembre de 2026",
  ]) {
    assert.ok(!pages.includes(stale), `pages.ts still shows "${stale}"`);
  }
});

test("legal pages name the publisher, the package and the official contact", async () => {
  const pages = await read("src/content/pages.ts");

  assert.ok(pages.includes("MythStride Studio"));
  assert.ok(pages.includes("com.playmythstride.mythstride"));
  assert.ok(
    (pages.match(/contato@playmythstride\.com/g) ?? []).length >= 18,
    "every locale must carry the contact address across the legal pages",
  );
});

test("no public page carries editorial status wording", async () => {
  const pages = await read("src/content/pages.ts");
  const editorial =
    /rascunho|borrador|\bdraft\b|não vigente|nao vigente|não aprovad|\bpendente\b|\bpending\b|decisão do responsável|decisión pendiente|owner decision/iu;
  // Case-sensitive on purpose: the Spanish word "todo" is ordinary copy, the
  // uppercase engineering marker is not.
  const engineeringMarkers = /\bTBD\b|\bTODO\b|\bFIXME\b/u;

  assert.doesNotMatch(pages, editorial);
  assert.doesNotMatch(pages, engineeringMarkers);
});

test("every locale ships the same legal pages", async () => {
  const text = await read("src/content/pages.ts");

  for (const slug of legalSlugs) {
    const key = slug.includes("-") ? `"${slug}"` : slug;
    const occurrences = text.split(`\n    ${key}: {`).length - 1;
    assert.equal(
      occurrences,
      3,
      `${slug} must be defined for pt-BR, en and es (found ${occurrences})`,
    );
  }
});

test("delete-account is a usable public resource", async () => {
  const [pages, route, form] = await Promise.all([
    read("src/content/pages.ts"),
    read("src/app/[locale]/delete-account/page.tsx"),
    read("src/components/site/AccountDeletionRequestForm.tsx"),
  ]);

  // Indexable and canonical, so a Google Play reviewer can reach it.
  assert.match(route, /createLocalizedMetadata/);
  assert.doesNotMatch(route, /noIndex/);

  for (const heading of [
    "O que é excluído",
    "O que pode ser mantido",
    "What is deleted",
    "What may be kept",
    "Qué se elimina",
    "Qué puede conservarse",
  ]) {
    assert.ok(pages.includes(heading), `delete-account must include "${heading}"`);
  }

  assert.match(form, /requestAccountDeletionLink/);
});

test("third-party disclosure names the providers that are actually shipped", async () => {
  const pages = await read("src/content/pages.ts");

  for (const provider of [
    "Google",
    "Strava",
    "Resend",
    "Cloudflare",
    "Sentry",
    "AdMob",
    "GitHub",
  ]) {
    assert.ok(pages.includes(provider), `missing provider: ${provider}`);
  }

  // No Firebase or Crashlytics SDK is linked into the app, so neither may be
  // disclosed as if it were processing player data.
  assert.doesNotMatch(pages, /Firebase|Crashlytics/);
});
