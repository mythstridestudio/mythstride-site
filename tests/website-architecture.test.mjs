import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import path from "node:path";

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), "utf8");

test("locale routing is server-rendered for PT-BR, English and Spanish", async () => {
  const locales = await read("src/lib/locales.ts");
  const layout = await read("src/app/[locale]/layout.tsx");
  const routes = await read("src/content/pages.ts");
  const site = await read("src/content/site.ts");

  assert.match(locales, /publicLocales = \["pt-BR", "en", "es"\]/);
  assert.match(layout, /<html\s+lang=\{locale\}/);
  assert.match(routes, /\n  es: \{/);
  assert.match(site, /\n  es: \{/);
  for (const slug of ["features", "aethron", "wear-os", "closed-beta"]) {
    assert.match(routes, new RegExp(`"${slug}"`));
  }
});

test("institutional pages are public content without engineering-status chrome", async () => {
  const route = await read("src/app/[locale]/[page]/page.tsx");
  const shell = await read("src/components/site/LocalizedContentPage.tsx");
  assert.doesNotMatch(route, /isDraftPageSlug|noIndex/);
  assert.doesNotMatch(shell, /LegalDraftNotice|pendingFields|FeatureStatusBadge/);
});

test("public marketing contains only the Android closed-beta commercial status", async () => {
  const files = [
    "src/content/site.ts",
    "src/content/pages.ts",
    "src/components/site/ModernHomePage.tsx",
    "src/components/site/LocalizedFooter.tsx",
  ];
  const forbidden = /\b(?:draft|pending|under validation|in development|planned|roadmap|placeholder|future)\b|rascunho|pendente|em validação|em desenvolvimento|planejado|disponível futuramente|espaço reservado|arte futura|captura final|en validación|en desarrollo|planificado/iu;
  for (const file of files) {
    assert.doesNotMatch(await read(file), forbidden, file);
  }
  assert.match(await read("src/content/site.ts"), /BETA FECHADO PARA ANDROID/);
});

test("the public screenshot gallery has real approved media and no empty slots", async () => {
  const home = await read("src/components/site/ModernHomePage.tsx");
  const frame = await read("src/components/site/ScreenshotFrame.tsx");
  assert.match(home, /inventory-\$\{locale\}\.webp/);
  assert.doesNotMatch(frame, /placeholder|FeatureStatusBadge/);
  assert.match(frame, /image: \{ src: string; alt: string \}/);
});

test("waitlist includes disclosure, limits, honeypot and localized API language", async () => {
  const form = await read("src/components/WaitlistForm.tsx");
  assert.match(form, /maxLength=\{120\}/);
  assert.match(form, /maxLength=\{320\}/);
  assert.match(form, /waitlist-form__honeypot/);
  assert.match(form, /copy\.disclosure/);
  assert.match(form, /waitlistLanguage\[locale\]/);
  assert.match(form, /es: "es"/);
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
  assert.match(navigation, /getOtherLocales\(locale\)/);
  assert.match(navigation, /replacePathLocale\(pathname, candidate\)/);
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
