import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

const read = (name) => readFile(path.join(process.cwd(), name), "utf8");

test("medal wall is a static-export route and loads real earned medals, never sample data", async () => {
  const route = await read("src/app/(internal)/medals/page.tsx");
  const wall = await read("src/app/(internal)/medals/medals-wall-page.tsx");
  const api = await read("src/lib/api/medals.ts");

  assert.match(route, /<Suspense/);
  assert.match(wall, /getPublicEarnedMedals\(username\)/);
  assert.match(api, /\/api\/public\/player\//);
  assert.match(api, /encodeURIComponent\(username\.trim\(\)\)/);
  assert.match(api, /cache: "no-store"/);
  assert.doesNotMatch(wall, /mock|fake|sampleMedals/i);
  assert.match(wall, /medal\.medalha\.imagemUrl/);
  assert.match(wall, /medal\.estatisticas/);
  assert.match(wall, /medals\.length === 0/);
});

test("medal wall is linked in desktop/mobile nav, private dashboard and public player profile", async () => {
  const nav = await read("src/components/AuthenticatedTopbar.tsx");
  const dashboard = await read("src/app/(internal)/dashboard/dashboard-shell.tsx");
  const profile = await read("src/app/(internal)/player/[username]/public-player-profile-page.tsx");

  assert.equal((nav.match(/href=\{medalWallHref\}/g) ?? []).length, 2);
  assert.match(dashboard, /\/medals\?username=/);
  assert.match(profile, /\/medals\?username=/);
});

test("medal wall text is available in PT, EN and ES", async () => {
  const keys = ["title", "earned", "distance", "duration", "pace", "shareWall", "emptyTitle", "notFound", "viewWall"];
  for (const locale of ["pt", "en", "es"]) {
    const obj = JSON.parse(await read("src/lib/translations/" + locale + ".json"));
    assert.equal(typeof obj.authTopbar.medals, "string", locale);
    for (const key of keys) assert.equal(typeof obj.medalWall[key], "string", locale + "." + key);
  }
});
