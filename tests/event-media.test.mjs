import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const source = (path) => readFile(new URL(path, root), "utf8");

test("admin uploads event, banner and medal assets to the authenticated API", async () => {
  const [page, field, client] = await Promise.all([
    source("src/app/(internal)/admin/events/admin-events-page.tsx"),
    source("src/app/(internal)/admin/events/event-image-upload-field.tsx"),
    source("src/lib/api/admin-events.ts"),
  ]);

  assert.match(page, /kind="event"/);
  assert.match(page, /kind="banner"/);
  assert.match(page, /kind="medal"/);
  assert.match(page, /createAdminEventMedal\(token/);
  assert.match(page, /updateAdminEventMedal\(token/);
  assert.match(page, /publishAdminEvent\(token, saved\.id\)/);
  assert.match(page, /if \(isUploading \|\|/);
  assert.match(field, /accept="image\/png,image\/jpeg,image\/webp"/);
  assert.match(field, /uploadAdminEventMedia\(accessToken, kind, file\)/);
  assert.match(client, /\x60\/api\/Eventos\/media\/\$\{kind\}\x60/);
  assert.match(client, /Authorization/);
});
