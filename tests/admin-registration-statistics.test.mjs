import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const file = (name) => readFile(path.join(root, name), "utf8");

test("admin Statistics is present in desktop/mobile nav and guarded like the other tabs", async () => {
  const nav = await file("src/components/AdminSectionTabs.tsx");
  const page = await file("src/app/(internal)/admin/statistics/statistics-page.tsx");
  const route = await file("src/app/(internal)/admin/statistics/page.tsx");
  assert.match(nav, /label: "Estatísticas", href: "\/admin\/statistics"/);
  assert.match(nav, /"statistics"/);
  assert.match(page, /<AdminProtectedWorkspace active="statistics"/);
  assert.match(route, /AdminStatisticsPage/);
});

test("statistics are sourced from admin-only endpoint and never fabricated from search results", async () => {
  const api = await file("src/lib/api/admin-statistics.ts");
  const page = await file("src/app/(internal)/admin/statistics/statistics-page.tsx");
  const overview = await file("src/app/(internal)/admin/overview-page.tsx");
  assert.match(api, /\/api\/admin\/statistics\/registrations/);
  assert.match(api, /cache: "no-store"/);
  assert.match(page, /getAdminRegistrationStatistics\(token\)/);
  assert.match(page, /data\?\.totalPlayers/);
  assert.match(page, /data\?\.totalAccounts/);
  assert.match(page, /data\?\.totalEventRegistrations/);
  assert.match(page, /data\?\.uniqueEventParticipants/);
  assert.match(page, /data\?\.eventRegistrationsLast7Days/);
  assert.match(page, /event\.inAppRegistrations/);
  assert.match(page, /event\.officialRosterEntries/);
  assert.match(page, /não equivalem a ingressos externos/);
  assert.match(page, /"—"/);
  assert.match(overview, /getAdminRegistrationStatistics\(token\)/);
  assert.match(overview, /href: "\/admin\/statistics"/);
});
