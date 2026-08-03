import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import path from "node:path";

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), "utf8");

test("account-deletion API client matches the public backend contract", async () => {
  const endpoints = await read("src/lib/api/endpoints.ts");
  assert.match(endpoints, /requestLink: "\/api\/account-deletion\/request-link"/);
  assert.match(endpoints, /confirmLink: "\/api\/account-deletion\/confirm-link"/);

  const client = await read("src/lib/api/account-deletion.ts");

  // Valid submission posts JSON to the request-link endpoint.
  assert.match(client, /API_ENDPOINTS\.accountDeletion\.requestLink/);
  assert.match(client, /method: "POST"/);

  // 202 from the backend (no thrown ApiError) resolves to a single generic
  // "requested" outcome — the same value regardless of whether the account
  // exists, which is what keeps the flow non-enumerating.
  assert.match(client, /return "requested";/);

  // Rate limiting (429) and any other failure path (config missing, network
  // failure, or any other HTTP error such as an unexpected 400) must not
  // leak details and must resolve to a safe, distinct-from-success outcome.
  assert.match(client, /error\.status === 429/);
  assert.match(client, /return "rateLimited";/);
  assert.match(
    client,
    /error instanceof ApiError \|\|\s*\n\s*error instanceof ApiConfigurationError \|\|\s*\n\s*error instanceof ApiNetworkError/,
  );
  assert.match(client, /return "unavailable";/);

  // Confirmation distinguishes an invalid/expired token (backend 400) from
  // rate limiting and from unavailability, without ever logging the token.
  assert.match(client, /error\.status === 400/);
  assert.match(client, /outcome: "invalid"/);
  assert.match(client, /outcome: "rateLimited"/);
  assert.match(client, /outcome: "unavailable"/);
  assert.doesNotMatch(client, /console\.(log|info|warn|error)/);
});

test("account-deletion request form validates email and never differentiates success by account existence", async () => {
  const form = await read("src/components/site/AccountDeletionRequestForm.tsx");

  assert.match(form, /emailPattern\.test\(normalizedEmail\)/);
  assert.match(form, /account-deletion-form__honeypot/);
  assert.match(form, /requestAccountDeletionLink\(normalizedEmail\)/);

  // Every backend-driven outcome maps to copy — no branch is left unhandled
  // and success text is the single generic `requested` string.
  for (const outcome of ["requested", "rateLimited", "unavailable", "validationError"]) {
    assert.match(form, new RegExp(outcome));
  }

  // The email is cleared after every submit attempt instead of lingering in
  // component state longer than necessary.
  assert.match(form, /setEmail\(""\)/);
});

test("account-deletion confirmation reads the token only from the URL fragment and never persists it", async () => {
  const client = await read("src/components/site/AccountDeletionConfirmClient.tsx");

  assert.match(client, /window\.location\.hash/);
  assert.match(client, /new URLSearchParams\(hash\)\.get\("token"\)/);

  // The fragment is stripped from the address bar after being read.
  assert.match(client, /window\.history\.replaceState/);

  // Token handling never touches storage or the console.
  assert.doesNotMatch(client, /localStorage/);
  assert.doesNotMatch(client, /sessionStorage/);
  assert.doesNotMatch(client, /console\.(log|info|warn|error)/);

  // A request without a usable token (missing/blank) surfaces a safe,
  // actionable state instead of calling the API with an empty value.
  assert.match(client, /phase: "missingToken"/);

  // Invalid or expired tokens (backend 400) and rate limiting resolve to
  // distinct, non-leaking states.
  assert.match(client, /phase: "invalid"/);
  assert.match(client, /phase: "rateLimited"/);
  assert.match(client, /phase: "unavailable"/);
});

test("delete-account route serves the request form and is excluded from the generic content catch-all", async () => {
  const pages = await read("src/content/pages.ts");
  assert.match(pages, /catchAllPageSlugs = pageSlugs\.filter/);
  assert.match(pages, /slug !== "delete-account"/);

  const catchAll = await read("src/app/[locale]/[page]/page.tsx");
  assert.match(catchAll, /catchAllPageSlugs/);
  assert.doesNotMatch(catchAll, /generateStaticParams\(\)\s*\{\s*return pageSlugs\.map/);

  const deleteAccountPage = await read("src/app/[locale]/delete-account/page.tsx");
  assert.match(deleteAccountPage, /AccountDeletionRequestForm/);
  assert.match(deleteAccountPage, /noIndex: true/);

  const confirmPage = await read("src/app/[locale]/delete-account/confirm/page.tsx");
  assert.match(confirmPage, /AccountDeletionConfirmClient/);
  assert.match(confirmPage, /noIndex: true/);
});

test("account-deletion copy stays generic and non-enumerating in all three locales", async () => {
  const site = await read("src/content/site.ts");
  const requestedMessages = [
    /Caso exista uma conta associada a esse email, enviaremos as próximas instruções\./,
    /If an account is associated with this email, we will send the next instructions\./,
    /Si existe una cuenta asociada a este email, enviaremos las próximas instrucciones\./,
  ];
  for (const pattern of requestedMessages) {
    assert.match(site, pattern);
  }
});
