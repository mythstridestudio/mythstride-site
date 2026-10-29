import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const read = (file) => readFile(path.join(process.cwd(), file), "utf8");

test("public profile achievement gallery uses original art at a readable size", async () => {
  const profile = await read("src/app/(internal)/player/[username]/public-player-profile-page.tsx");
  const section = profile.split("function AchievementGrid(")[1].split("function JourneyStatistics(")[0];

  assert.match(section, /resolveAchievementImage\(achievement\.code, achievement\.iconUrl\)/);
  assert.match(section, /grid-cols-\[repeat\(auto-fit,minmax\(min\(100%,215px\),1fr\)\)\]/);
  assert.match(profile, /width=\{192\}/);
  assert.match(section, /achievement\.rarity/);
  assert.match(section, /achievement\.unlockedAt/);
  assert.doesNotMatch(section, /border-2 border-dashed|rarity-well|rounded-full border-2/);
  assert.doesNotMatch(section, /legendaryAchievements/);
  assert.match(section, /medalWall\.title/);
});

test("achievement gallery title and earning copy are translated", async () => {
  for (const lang of ["pt", "en", "es"]) {
    const translations = JSON.parse(await read(`src/lib/translations/${lang}.json`));
    for (const key of ["achievementGalleryTitle", "featuredAchievementCount", "unlockedOn"]) {
      assert.ok(translations.publicProfile.journey[key], `${lang} missing ${key}`);
    }
  }
});
