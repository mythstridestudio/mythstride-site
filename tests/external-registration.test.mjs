import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();

// Node strips the types on import, so the rules are exercised directly.
const {
  buildRegistrationRequest,
  describeErrorBody,
  isValidRegistrationUrl,
  previewDestination,
  toProviderValue,
} = await import(pathToFileURL(path.join(root, "src/lib/external-registration.ts")).href);

const PUBLIC_URL = "https://www.sympla.com.br/evento/corrida-da-serra/123456";
const AFFILIATE_URL = "https://www.sympla.com.br/evento/corrida-da-serra/123456?d=MYTHSTRIDE";

test("only absolute https links on a real host are accepted", () => {
  for (const url of [
    PUBLIC_URL,
    AFFILIATE_URL,
    "https://bileto.sympla.com.br/event/99",
    "https://bit.ly/corrida-serra",
    "  https://www.sympla.com.br/evento/x  ",
  ]) {
    assert.equal(isValidRegistrationUrl(url), true, url);
  }

  for (const url of [
    "",
    "http://www.sympla.com.br/evento/x",
    "javascript:alert(1)",
    "data:text/html,hi",
    "file:///etc/passwd",
    "www.sympla.com.br/evento/x",
    "/eventos/1",
    "https://localhost/x",
    "https://192.168.0.10/x",
    "https://user:pass@www.sympla.com.br/x",
    "https://www.sympla.com.br/a b",
    `https://www.sympla.com.br/${"a".repeat(1000)}`,
  ]) {
    assert.equal(isValidRegistrationUrl(url), false, url);
  }
});

test("the affiliate link wins, the public one is the fallback, nothing without a provider", () => {
  const draft = { provider: "Sympla", registrationUrl: PUBLIC_URL, affiliateRegistrationUrl: AFFILIATE_URL };
  assert.equal(previewDestination(draft), "affiliate");
  assert.equal(previewDestination({ ...draft, affiliateRegistrationUrl: "" }), "public");
  assert.equal(previewDestination({ ...draft, affiliateRegistrationUrl: "javascript:x" }), "public");
  assert.equal(previewDestination({ ...draft, registrationUrl: "", affiliateRegistrationUrl: "" }), "none");
  assert.equal(previewDestination({ ...draft, provider: "" }), "none");
});

test("saving sends trimmed links, nulls for blanks, and clears everything without a provider", () => {
  assert.deepEqual(
    buildRegistrationRequest({ provider: "Sympla", registrationUrl: `  ${PUBLIC_URL} `, affiliateRegistrationUrl: " " }),
    { ok: true, request: { provider: "Sympla", registrationUrl: PUBLIC_URL, affiliateRegistrationUrl: null } },
  );
  assert.deepEqual(
    buildRegistrationRequest({ provider: "", registrationUrl: PUBLIC_URL, affiliateRegistrationUrl: AFFILIATE_URL }),
    { ok: true, request: { provider: null, registrationUrl: null, affiliateRegistrationUrl: null } },
  );
  const invalid = buildRegistrationRequest({
    provider: "Sympla",
    registrationUrl: PUBLIC_URL,
    affiliateRegistrationUrl: "http://www.sympla.com.br/x",
  });
  assert.equal(invalid.ok, false);
  assert.match(invalid.error, /HTTPS/);
});

test("the provider is only ever one the API knows", () => {
  assert.equal(toProviderValue("Sympla"), "Sympla");
  assert.equal(toProviderValue("Other"), "Other");
  assert.equal(toProviderValue(null), "");
  assert.equal(toProviderValue("Eventbrite"), "");
});

test("API error bodies are turned into readable messages", () => {
  assert.equal(describeErrorBody("Evento não encontrado.", "x"), "Evento não encontrado.");
  assert.equal(
    describeErrorBody({ name: "Eventos_InvalidTransition", value: "Transição inválida." }, "x"),
    "Transição inválida.",
  );
  assert.equal(
    describeErrorBody({ title: "One or more validation errors occurred.", errors: { RegistrationUrl: ["Deve ser HTTPS."] } }, "x"),
    "Deve ser HTTPS.",
  );
  assert.equal(describeErrorBody(null, "fallback"), "fallback");
});

test("the admin page exposes the tab and never shows sales or revenue", async () => {
  const page = await readFile(path.join(root, "src/app/(internal)/admin/events/admin-events-page.tsx"), "utf8");
  const panel = await readFile(
    path.join(root, "src/app/(internal)/admin/events/external-registration-panel.tsx"),
    "utf8",
  );
  assert.match(page, /\["registration", "Inscrição externa", null\]/);
  assert.match(page, /<ExternalRegistrationPanel/);
  assert.match(panel, /inscricao-externa|getEventExternalRegistration/);
  assert.doesNotMatch(panel, /dangerouslySetInnerHTML/);
  assert.doesNotMatch(panel, /R\$|Receita|Vendas:|Convers[aã]o/);
});
