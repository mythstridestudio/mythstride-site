import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), "utf8");

test("organizer landing is reachable from the PT-BR campaign alias and all locales", async () => {
  const localeRoute = await read("src/app/[locale]/organizadores/page.tsx");
  const campaignRoute = await read("src/app/(default)/organizadores/page.tsx");
  const sitemap = await read("src/app/sitemap.ts");
  const header = await read("src/components/site/LocalizedNavigation.tsx");
  const footer = await read("src/components/site/LocalizedFooter.tsx");
  const labels = await read("src/content/site.ts");

  assert.match(localeRoute, /generateStaticParams/);
  assert.match(localeRoute, /publicLocales\.map/);
  assert.match(localeRoute, /createLocalizedMetadata/);
  assert.match(campaignRoute, /OrganizersLanding locale="pt-BR"/);
  assert.match(sitemap, /"\/organizadores"/);
  assert.match(header, /"\/organizadores"/);
  assert.match(footer, /"\/organizadores"/);
  assert.match(labels, /organizers: "Organizadores"/);
  assert.match(labels, /organizers: "Organizers"/);
});

test("organizer page has functional contact links and does not invent a backend", async () => {
  const component = await read("src/components/site/OrganizersLanding.tsx");
  const content = await read("src/content/organizers.ts");
  assert.match(component, /mailto:contato@playmythstride\.com/);
  assert.match(component, /encodeURIComponent\(copy\.mailSubject\)/);
  assert.match(component, /encodeURIComponent\(copy\.mailBody\)/);
  assert.match(component, /id="como-funciona"/);
  assert.match(component, /<details key=\{item\.question\}>/);
  assert.doesNotMatch(component, /fetch\(|localStorage|sessionStorage/);
  assert.match(content, /Para caminhadas, analisamos caso a caso/);
  assert.match(content, /walking events, we review/);
  assert.match(content, /En las caminatas, revisamos/);
  assert.match(content, /Sem custo para o organizador nesta fase/);
  assert.match(content, /Subject to review/);
  assert.match(content, /Sujeto a evaluación/);
  assert.match(content, /"pt-BR": \{/);
  assert.match(content, /\n  en: \{/);
  assert.match(content, /\n  es: \{/);
});
