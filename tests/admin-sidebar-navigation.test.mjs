import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const source = (file) => readFile(path.join(root, file), "utf8");

test("admin is a left sidebar with working routes, mobile drawer and current-page semantics", async () => {
  const sidebar = await source("src/components/AdminSectionTabs.tsx");
  const shell = await source("src/components/AdminWorkspace.tsx");
  const topbar = await source("src/components/AuthenticatedTopbar.tsx");
  for (const [label, url] of [
    ["Visão Geral", "/admin"],
    ["Estatísticas", "/admin/statistics"],
    ["Usuários", "/admin/users"],
    ["Eventos", "/admin/events"],
    ["Cadastrar Evento", "/admin/events/create"],
    ["Medalhas", "/admin/medals"],
    ["Entregas", "/admin/deliveries"],
    ["Logs", "/admin/logs"],
  ]) {
    assert.match(sidebar, new RegExp(`label: "${label}"`));
    assert.match(sidebar, new RegExp(`href: "${url}"`));
  }
  assert.match(shell, /<AdminSectionTabs active=\{active\}/);
  assert.match(shell, /lg:flex-row/);
  assert.match(sidebar, /lg:sticky/);
  assert.match(sidebar, /aria-expanded=\{isOpen\}/);
  assert.match(sidebar, /aria-current=\{selected \? "page" : undefined\}/);
  assert.match(sidebar, /event\.key === "Escape"/);
  assert.match(sidebar, /onClick=\{\(\) => setIsOpen\(false\)\}/);
  assert.match(topbar, /href="\/admin"/);
});

test("admin navigation does not break event editing or medal delivery", async () => {
  const events = await source("src/app/(internal)/admin/events/admin-events-page.tsx");
  const medals = await source("src/app/(internal)/admin/medals/medals-page.tsx");
  const protectedScreen = await source("src/components/AdminProtectedWorkspace.tsx");
  assert.match(events, /<AdminWorkspace active="create-event"/);
  assert.match(events, /onSubmit=\{submit\}/);
  assert.match(medals, /<AdminWorkspace active="medals"/);
  assert.match(medals, /<AdminMedalGrantsPanel token=\{token\}/);
  assert.match(medals, /<MedalTestDeliveryPanel token=\{token\}/);
  assert.match(protectedScreen, /isAdminAccessToken\(token\)/);
  assert.match(protectedScreen, /router\.replace\("\/dashboard"\)/);
});

test("only backed by real endpoints: overview, player lookup, history and logs", async () => {
  const overview = await source("src/app/(internal)/admin/overview-page.tsx");
  const users = await source("src/app/(internal)/admin/users/users-page.tsx");
  const feed = await source("src/components/AdminAuditFeed.tsx");
  const audit = await source("src/lib/api/admin-console.ts");
  const routes = [
    "src/app/(internal)/admin/page.tsx",
    "src/app/(internal)/admin/users/page.tsx",
    "src/app/(internal)/admin/events/page.tsx",
    "src/app/(internal)/admin/medals/page.tsx",
    "src/app/(internal)/admin/deliveries/page.tsx",
    "src/app/(internal)/admin/logs/page.tsx",
  ];
  for (const route of routes) assert.ok((await source(route)).includes("Page"));
  assert.match(overview, /Promise\.allSettled/);
  assert.match(overview, /count === null \? "—"/);
  assert.match(overview, /MANUAL_MEDAL_GRANT_EVENT/);
  assert.match(users, /searchAdminMedalPlayers\(token, value\)/);
  assert.match(users, /listAdminPlayerMedals\(token, player\.playerId\)/);
  assert.match(feed, /getAdminAuditLogs\(token/);
  assert.match(feed, /onlyDeliveries \? MANUAL_MEDAL_GRANT_EVENT : undefined/);
  assert.match(audit, /\/api\/admin\/security-logs/);
});
