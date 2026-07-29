import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import path from "node:path";

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), "utf8");

test("locale routing is server-rendered for PT-BR and English", async () => {
  const locales = await read("src/lib/locales.ts");
  const layout = await read("src/app/[locale]/layout.tsx");
  const routes = await read("src/content/pages.ts");

  assert.match(locales, /publicLocales = \["pt-BR", "en"\]/);
  assert.match(layout, /<html\s+lang=\{locale\}/);
  for (const slug of ["features", "aethron", "wear-os", "closed-beta"]) {
    assert.match(routes, new RegExp(`"${slug}"`));
  }
});

test("feature status registry contains the truthful roadmap", async () => {
  const status = await read("src/config/product-status.ts");
  const expected = {
    bossBattles: "beta",
    friends: "beta",
    weeklyRanking: "beta",
    aethron: "validation",
    strava: "validation",
    wearOs: "validation",
    raids: "development",
    diamondPurchases: "future",
    ios: "planned",
    appleWatch: "planned",
  };

  for (const [feature, value] of Object.entries(expected)) {
    assert.match(status, new RegExp(`${feature}: "${value}"`));
  }
});

test("status badge is localized, detailed and not color-only", async () => {
  const badge = await read(
    "src/components/product/FeatureStatusBadge.tsx",
  );
  assert.match(badge, /getStatusContent\(status, locale\)/);
  assert.match(badge, /status-badge__mark/);
  assert.match(badge, /status-badge__label/);
  assert.match(badge, /status-badge__description/);
});

test("draft pages receive noindex metadata and a visible notice", async () => {
  const route = await read("src/app/[locale]/[page]/page.tsx");
  const notice = await read("src/components/site/LegalDraftNotice.tsx");
  assert.match(route, /noIndex: isDraftPageSlug\(page\)/);
  assert.match(notice, /data-legal-draft/);
  assert.match(notice, /not an approved policy/);
});

test("waitlist includes disclosure, limits, honeypot and localized API language", async () => {
  const form = await read("src/components/WaitlistForm.tsx");
  assert.match(form, /maxLength=\{120\}/);
  assert.match(form, /maxLength=\{320\}/);
  assert.match(form, /waitlist-form__honeypot/);
  assert.match(form, /copy\.disclosure/);
  assert.match(form, /locale === "pt-BR" \? "pt" : "en"/);
});

test("mobile navigation exposes state and keyboard close behavior", async () => {
  const navigation = await read(
    "src/components/site/LocalizedNavigation.tsx",
  );
  assert.match(navigation, /aria-expanded=\{isOpen\}/);
  assert.match(navigation, /aria-controls="mobile-navigation"/);
  assert.match(navigation, /event\.key === "Escape"/);
  assert.match(navigation, /triggerRef\.current\?\.focus\(\)/);
  assert.match(navigation, /\{isOpen \? \(/);
});

test("source contains no exact placeholder links", async () => {
  async function walk(directory) {
    const files = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) files.push(...(await walk(target)));
      else if (/\.(?:ts|tsx)$/.test(entry.name)) files.push(target);
    }
    return files;
  }

  for (const file of await walk(path.join(root, "src"))) {
    const content = await readFile(file, "utf8");
    assert.doesNotMatch(content, /href\s*=\s*["']#["']/);
  }
});
