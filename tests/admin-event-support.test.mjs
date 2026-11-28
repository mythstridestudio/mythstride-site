import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";

const client = stripTypeScriptTypes(await readFile(new URL("../src/lib/api/client.ts", import.meta.url), "utf8"));
const clientUrl = "data:text/javascript;base64," + Buffer.from(client).toString("base64");
const source = stripTypeScriptTypes(await readFile(new URL("../src/lib/api/admin-events.ts", import.meta.url), "utf8"))
  .replace('from "./client"', 'from "' + clientUrl + '"');
const api = await import("data:text/javascript;base64," + Buffer.from(source).toString("base64"));

test("admin support requests use authenticated JSON and exact award identity", async () => {
  const originalFetch = globalThis.fetch;
  const originalUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.test";
  const requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    return Response.json({ added: 1, alreadyEnrolled: 1, removed: true });
  };
  try {
    assert.equal((await api.enrollAdminEventPlayers("test-token", "event-id", ["player-a", "player-b"], "  Suporte de inscrição  ", true)).added, 1);
    assert.equal(requests[0].url, "https://api.example.test/api/admin/event-support/event-id/enroll");
    assert.equal(requests[0].options.headers.get("Authorization"), "Bearer test-token");
    assert.equal(requests[0].options.headers.get("Content-Type"), "application/json");
    assert.equal(requests[0].options.method, "POST");
    assert.deepEqual(JSON.parse(requests[0].options.body), {
      playerIds: ["player-a", "player-b"], reason: "Suporte de inscrição", confirmFreeVirtualEvent: true,
    });
    assert.equal((await api.revokeAdminPlayerMedal("test-token", "player-a", "event-id", "award-id", "  Remoção de teste  ")).removed, true);
    assert.equal(requests[1].url, "https://api.example.test/api/admin/event-support/revoke-medal");
    assert.equal(requests[1].options.headers.get("Content-Type"), "application/json");
    assert.deepEqual(JSON.parse(requests[1].options.body), {
      playerId: "player-a", eventId: "event-id", awardId: "award-id", reason: "Remoção de teste",
    });
    globalThis.fetch = async () => Response.json({ message: "Há progresso registrado." }, { status: 409 });
    await assert.rejects(api.revokeAdminPlayerMedal("test-token", "player-a", "event-id", "award-id", "Remoção de teste"),
      error => error.status === 409);
    globalThis.fetch = async () => Response.json({}, { status: 403 });
    await assert.rejects(api.enrollAdminEventPlayers("test-token", "event-id", ["player-a"], "Inscrição suporte", true),
      error => error.status === 403);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_API_BASE_URL;
    else process.env.NEXT_PUBLIC_API_BASE_URL = originalUrl;
  }
});
