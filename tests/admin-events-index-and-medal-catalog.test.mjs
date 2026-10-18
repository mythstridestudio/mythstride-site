import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const source = (p) => readFile(path.join(root, p), "utf8");

test("Eventos is the searchable index; Cadastrar Evento is a separate admin route", async () => {
  const tabs = await source("src/components/AdminSectionTabs.tsx");
  const list = await source("src/app/(internal)/admin/events/events-index-page.tsx");
  const indexRoute = await source("src/app/(internal)/admin/events/page.tsx");
  const createRoute = await source("src/app/(internal)/admin/events/create/page.tsx");
  const editor = await source("src/app/(internal)/admin/events/admin-events-page.tsx");
  assert.match(tabs, /label: "Eventos", href: "\/admin\/events"/);
  assert.match(tabs, /label: "Cadastrar Evento", href: "\/admin\/events\/create"/);
  assert.match(indexRoute, /AdminEventsIndexPage/);
  assert.match(createRoute, /AdminEventsPage/);
  assert.match(list, /AdminProtectedWorkspace active="events"/);
  assert.match(list, /\/admin\/events\/create\?eventId=/);
  assert.match(list, /filtered\.map/);
  assert.match(list, /setFilter/);
  assert.match(editor, /<AdminWorkspace active="create-event"/);
  assert.match(editor, /new URLSearchParams\(window\.location\.search\)\.get\("eventId"\)/);
  assert.match(editor, /setSelectedId\(requested\.id\)/);
  assert.match(editor, /setForm\(eventToForm\(requested\)\)/);
  assert.match(editor, /onSubmit=\{submit\}/);
});

test("full admin event catalog includes inactive and draft events via pagination", async () => {
  const api = await source("src/lib/api/admin-events.ts");
  assert.match(api, /\/api\/Eventos\/paged\?page=\$\{page\}&pageSize=100/);
  assert.match(api, /if \(!result\.hasNextPage \|\| page >= result\.totalPages\) break/);
  assert.match(api, /cache: "no-store"/);
});

test("medal admin can add event medal definitions and refresh delivery picker", async () => {
  const api = await source("src/lib/api/admin-events.ts");
  const panel = await source("src/app/(internal)/admin/medals/admin-event-medal-catalog-panel.tsx");
  const page = await source("src/app/(internal)/admin/medals/medals-page.tsx");
  const granting = await source("src/app/(internal)/admin/medals/admin-medal-grants-panel.tsx");
  assert.match(api, /createAdminEventMedal/);
  assert.match(api, /"\/api\/medalhas"/);
  assert.match(panel, /listAdminEvents\(token\)/);
  assert.match(panel, /createAdminEventMedal\(token,/);
  assert.match(panel, /eventoId: selectedEvent\.id/);
  assert.match(panel, /window\.confirm\(/);
  assert.match(page, /<AdminEventMedalCatalogPanel token=\{token\} onCreated=/);
  assert.match(page, /catalogRefreshKey=\{catalogRefreshKey\}/);
  assert.match(granting, /\[loadCatalog, catalogRefreshKey\]/);
});
