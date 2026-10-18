import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";

const root = process.cwd();
const { FOUR_ELEMENTS_2027, FOUR_ELEMENTS_COLLECTION_KEY, authenticatedPlayerId } =
  await import(pathToFileURL(path.join(root, "src/lib/medal-test-delivery.ts")).href);

const tokenFor = (claims) =>
  `eyJhbGciOiJub25lIn0.${Buffer.from(JSON.stringify(claims)).toString("base64url")}.sig`;

test("the four delivery IDs match the actual Four Elements draft seeder", () => {
  assert.equal(FOUR_ELEMENTS_COLLECTION_KEY, "four_elements_2027");
  assert.deepEqual(FOUR_ELEMENTS_2027.map((s) => s.element), [
    "terra", "fogo", "gelo", "sombra",
  ]);
  assert.deepEqual(FOUR_ELEMENTS_2027.map((s) => s.eventId), [
    "4e202701-0001-4000-8000-000000000001",
    "4e202701-0002-4000-8000-000000000002",
    "4e202701-0003-4000-8000-000000000003",
    "4e202701-0004-4000-8000-000000000004",
  ]);
  assert.equal(new Set(FOUR_ELEMENTS_2027.map((s) => s.eventId)).size, 4);
});

test("collection status can be requested only for the JWT's own player", () => {
  const id = "17c8e67a-8d67-4cdd-80ae-b6f89c310f25";
  assert.equal(authenticatedPlayerId(tokenFor({ jogadorId: id, role: "Admin" })), id);
  for (const token of [
    "",
    "not-a-jwt",
    tokenFor({ role: "Admin" }),
    tokenFor({ jogadorId: "not-a-guid", role: "Admin" }),
    tokenFor({ jogadorId: 123, role: "Admin" }),
    tokenFor({ jogadorId: "/api/players/another-user", role: "Admin" }),
  ]) {
    assert.equal(authenticatedPlayerId(token), null);
  }
});

test("website delivers actual awards, not simulated artwork or a recipient selector", async () => {
  const page = await readFile(path.join(root, "src/app/(internal)/admin/medals/medals-page.tsx"), "utf8");
  const panel = await readFile(path.join(root, "src/app/(internal)/admin/events/medal-test-delivery-panel.tsx"), "utf8");
  const api = await readFile(path.join(root, "src/lib/api/admin-events.ts"), "utf8");

  assert.match(page, /if \(status === "loading" \|\| !token \|\| !isAdmin\)/);
  assert.match(page, /<MedalTestDeliveryPanel token=\{token\}/);
  assert.match(panel, /grantAdminTestEventMedal\(token, stage\.eventId\)/);
  assert.match(panel, /removeAdminTestEventMedal\(token, eventId\)/);
  assert.match(panel, /getMyMedalCollections\(token, playerId\)/);
  assert.match(panel, /await reload\(\)/);
  assert.match(panel, /for \(const stage of missing\)/);
  assert.match(panel, /Esta função|Destin[oó]|Destino:/);
  assert.doesNotMatch(panel, /fetch\(.*?\)|recipientId|targetPlayerId|password|dangerouslySetInnerHTML/);
  assert.match(api, /\/api\/Eventos\/\$\{encodeURIComponent\(eventId\)\}\/medalha\/teste/);
  assert.match(api, /method: "POST"/);
  assert.match(api, /method: "DELETE"/);
  assert.match(api, /\/api\/players\/\$\{encodeURIComponent\(playerId\)\}\/medals\/collections/);
});
