import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const read = (file) => readFile(path.join(root, file), "utf8");

test("all 66 original mobile achievement artworks are mirrored and mapped", async () => {
  const art = await read("src/lib/achievement-art.ts");
  const filenames = (await readdir(path.join(root, "public/assets/mythstride/achievement")))
    .filter((file) => file.endsWith(".png")).sort();
  const codesBlock = art.split("ACHIEVEMENT_ART_CODES = new Set<string>([")[1]?.split("]);")[0];
  assert.ok(codesBlock, "achievement artwork codes must exist");
  const mapped = Array.from(codesBlock.matchAll(/"([a-z0-9_]+)"/g), (match) => match[1] + ".png").sort();
  assert.equal(filenames.length, 66);
  assert.deepEqual(filenames, mapped, "every catalogued achievement must have matching artwork");
  assert.match(art, /getAssetPath\(\`\/assets\/mythstride\/achievement\//);
});

test("public profile uses exact backend achievement codes instead of translated names", async () => {
  const page = await read("src/app/(internal)/player/[username]/public-player-profile-page.tsx");
  const api = await read("src/lib/api/types.ts");
  assert.match(api, /code\?: string \| null/);
  assert.match(page, /resolveAchievementImage\(achievement\.code, achievement\.iconUrl\)/);
  assert.match(page, /onError=\{\(\) => setFailed\(true\)\}/);
  assert.doesNotMatch(page, /getBossMedalPath\(achievement\.name\)/);
});

test("dashboard and public profile share the exact current boss health card", async () => {
  const card = await read("src/components/relic/CurrentBossCard.tsx");
  const dashboard = await read("src/app/(internal)/dashboard/dashboard-shell.tsx");
  const profile = await read("src/app/(internal)/player/[username]/public-player-profile-page.tsx");
  assert.match(card, /<BossHealthBar value=\{bossHealth\}/);
  assert.match(card, /boss-hud|BossHealthBar/);
  assert.match(dashboard, /<CurrentBossCard/);
  assert.match(profile, /<CurrentBossCard/);
  assert.doesNotMatch(profile, /<MythProgressMeter/);
});
