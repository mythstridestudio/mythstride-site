import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const file = (p) => readFile(path.join(root, p), "utf8");

test("admin users page shows the selected player's runs and sync state", async () => {
  const page = await file("src/app/(internal)/admin/users/users-page.tsx");
  const panel = await file("src/app/(internal)/admin/users/player-activity-panel.tsx");
  const api = await file("src/lib/api/admin-players.ts");
  assert.match(page, /<PlayerActivityPanel key=\{selected\.playerId\} token=\{token\} playerId=\{selected\.playerId\} \/>/);
  assert.match(panel, /getAdminPlayerActivity\(token, playerId, days\)/);
  assert.match(panel, /Importações recebidas/);
  assert.match(panel, /Corridas no histórico/);
  assert.doesNotMatch(panel, /dangerouslySetInnerHTML/);
  assert.match(api, /\/api\/admin\/players\/\$\{encodeURIComponent\(playerId\)\}\/runs\?days=\$\{days\}/);
  assert.match(api, /cache: "no-store"/);
  // Never surface integration secrets in the admin client contract.
  assert.doesNotMatch(api, /accessToken:\s*string|refreshToken|rawPayload/i);
});
