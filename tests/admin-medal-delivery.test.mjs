import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const file = (p) => readFile(path.join(root, p), "utf8");

test("site names the section Admin and splits Eventos / Entrega de Medalhas", async () => {
  const topbar = await file("src/components/AuthenticatedTopbar.tsx");
  const tabs = await file("src/components/AdminSectionTabs.tsx");
  const events = await file("src/app/(internal)/admin/events/admin-events-page.tsx");
  const medals = await file("src/app/(internal)/admin/medals/medals-page.tsx");
  assert.match(topbar, /<ScrollIcon className="h-4 w-4" \/>\s*Admin/);
  assert.match(tabs, /label: "Eventos"/);
  assert.match(tabs, /label: "Entrega de Medalhas"/);
  assert.match(events, /<AdminSectionTabs active="events"/);
  assert.doesNotMatch(events, /<MedalTestDeliveryPanel/);
  assert.match(medals, /<AdminSectionTabs active="medals"/);
  assert.match(medals, /if \(status === "loading" \|\| !token \|\| !isAdmin\)/);
  assert.match(medals, /<AdminMedalGrantsPanel token=\{token\}/);
  assert.match(medals, /<MedalTestDeliveryPanel token=\{token\}/);
});

test("admin manual medal delivery requires recipient selection, reason and explicit consent", async () => {
  const panel = await file("src/app/(internal)/admin/medals/admin-medal-grants-panel.tsx");
  const api = await file("src/lib/api/admin-events.ts");
  assert.match(panel, /searchAdminMedalPlayers\(token, query\)/);
  assert.match(panel, /listAdminMedalCatalog\(token, term\)/);
  assert.match(panel, /listAdminPlayerMedals\(token, playerId\)/);
  assert.match(panel, /validReason = reason\.trim\(\)\.length >= 10 && reason\.trim\(\)\.length <= 400/);
  assert.match(panel, /window\.confirm\(/);
  assert.match(panel, /grantAdminMedalToPlayer\(token, selectedPlayer\.playerId, medal\.eventId, reason\)/);
  assert.match(panel, /alreadyOwned/);
  assert.doesNotMatch(panel, /dangerouslySetInnerHTML/);
  assert.match(api, /\/api\/admin\/medals\/players/);
  assert.match(api, /\/api\/admin\/medals\/catalog/);
  assert.match(api, /\/api\/admin\/medals\/grants/);
});
