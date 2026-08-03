# Website release readiness

This report covers the `ship/v1-website-followups-2026-07-31` branch, a
follow-up to the already-merged `ship/v1-website-modernization-2026-07-29`
(merged into `main` at `3760f9a` before this branch was created). It records
what changed, what was validated, and what remains for the owner. It does not
declare deployment, legal approval or physical device/screen-reader testing
that was not actually performed.

## Scope of this follow-up

The prior modernization branch had already merged. This branch:

- integrates the public, non-enumerating account-deletion request/confirm
  flow with the real `MythStrideApi` backend contract;
- corrects legal-draft copy that had described deletion as unimplemented;
- updates the build-artifact validator and adds a dedicated test file for the
  new flow;
- documents an existing GitHub Pages auto-deploy-on-merge workflow that was
  not previously called out explicitly.

No DNS, Cloudflare, domain, database, production backend, or store
configuration was touched.

## Architecture

Next.js App Router, static export (`output: "export"`, `trailingSlash: true`,
images unoptimized). No server runtime. See `WEBSITE_ARCHITECTURE.md` for the
full route-tree and rendering breakdown; this report only calls out what this
branch changed.

## Locales

PT-BR (default), English, Spanish — unchanged (`src/lib/locales.ts`).

## Routes

Build output: 66 static pages. Delta from this branch:

- `delete-account` moved from the generic `[locale]/[page]` catch-all into a
  dedicated route tree so it can host the request form
  (`src/app/[locale]/delete-account/page.tsx`);
- `delete-account/confirm` is new (`src/app/[locale]/delete-account/confirm/page.tsx`).

Both remain `noindex, nofollow, nocache` and excluded from `sitemap.xml`;
`robots.txt`'s existing `Disallow: /{locale}/delete-account/` prefix rule
already covers the nested `/confirm/` path.

Internal/admin routes (`/login`, `/dashboard`, `/admin`, `/player`) are
unchanged by this branch: still excluded from the sitemap, disallowed in
`robots.txt`, and gated behind the existing `(internal)` layout/auth
providers.

## Public account-deletion flow

Backend contract verified read-only in `D:\projetos\MythStrideApi`
(`Controllers/AccountDeletionPublicController.cs`,
`Services/Privacy/AccountDeletionService.cs`), and cross-checked against that
repository's own `COMPLIANCE_CONTRACT_VALIDATION.md` (2026-07-30), which
states the public deletion flow is a website responsibility — the
authenticated Flutter app intentionally does not expose it.

- `POST /api/account-deletion/request-link` — body `{ email }`. Always
  returns `202` with a fixed generic message regardless of whether the
  account exists (backend never queries account existence in the response
  path). The site shows one success string for every outcome:
  *"Caso exista uma conta associada a esse email, enviaremos as próximas
  instruções."* (and EN/ES equivalents). `429` is shown as "too many
  attempts, try later"; any other failure (network, missing
  `NEXT_PUBLIC_API_BASE_URL`, unexpected status) shows a generic
  "unavailable, try later" message. No branch discloses account existence.
- `POST /api/account-deletion/confirm-link` — body `{ token }`. The backend
  builds the emailed link as `{DeletionUrl}/confirm#token=<urlsafe-token>`
  (URL **fragment**, never sent to any server on navigation). The site reads
  the token client-side only (`window.location.hash`), immediately strips it
  from the visible URL with `history.replaceState`, and never logs or
  persists it (no `localStorage`/`sessionStorage`, no `console.*`). `400`
  (invalid or expired — the backend does not distinguish the two) maps to one
  "invalid or expired, request a new link" message; `429` and other failures
  get their own generic messages.
- Both endpoints use the already-existing `NEXT_PUBLIC_API_BASE_URL`
  (`.env.example`); **no new environment variable was needed or added**.

### Honest limitation carried over from the backend

Confirming the link only verifies ownership. In the current backend
configuration (`AccountDeletion:GracePeriodDays`,
`PreserveSecurityAuditDays`, `PreservePurchaseRecordsDays` are all `null`,
and `ExecuteIrreversibleDeletion` is `false`), a confirmed request lands in
`AwaitingRetentionDecision`, not immediate deletion. The confirmation page
shows this honestly (*"Verification complete. Executing the deletion still
depends on the owner's final data-retention configuration."*) rather than
claiming the account was deleted. `src/config/product-status.ts`'s
`accountDeletion` entry was updated from `development` to `validation` to
match: the implementation exists and is reachable, but full operational
completion (retention values, irreversible execution) is still pending an
owner decision — see `WEBSITE_LEGAL_PLACEHOLDERS.md`.

`src/lib/account-deletion-contract.ts` is unrelated and untouched: it is a
placeholder for a *different*, still-unbuilt, authenticated in-app deletion
flow (from the player's account settings), not the public website flow.

## Tests

`npm test` (Node's built-in test runner, `tests/*.test.mjs`): **12/12
passing** (7 pre-existing + 5 new in `tests/account-deletion.test.mjs`). The
suite is source-pattern-based (matches the project's existing convention —
no TS execution or fetch mocking harness exists in this repo), so the new
tests assert, by reading the actual source:

- valid submission posts to `request-link`, and a `202`/no-throw path always
  resolves to the single `"requested"` outcome (non-enumeration);
- `429` and any other failure resolve to distinct, safe, non-leaking
  outcomes (`rateLimited` / `unavailable`), covering rate limiting, network
  failure and missing API configuration;
- `400` on confirm resolves to `"invalid"` (covers both invalid and expired,
  matching the backend's own non-distinguishing behavior);
- the token is read only from the URL fragment, is stripped via
  `history.replaceState`, and the component never touches storage or
  `console.*`;
- `delete-account` is excluded from the generic `[locale]/[page]`
  catch-all's `generateStaticParams`;
- the generic success copy is identical across all outcomes and present in
  all three locales.

`npm run validate:content`: passed (70 source files).
`npm run validate:links`: passed.
`npm run validate:build`: passed (64 artifacts). This script previously
*forbade* a `<form>` on `delete-account` (correct when the page was
informational); it now requires the form on `delete-account`, forbids one
everywhere else, requires the new `confirm` page's artifacts/`noindex`/draft
notice, and forbids a literal `#token=` from ever being baked into static
HTML.

## SEO

Unchanged mechanics (`src/lib/metadata.ts`): `metadataBase`, canonical,
hreflang (`pt-BR`/`en`/`es`/`x-default`), Open Graph, Twitter cards. Verified
in the built `out/`:

- `delete-account` and `delete-account/confirm` both render
  `<meta name="robots" content="noindex, nofollow, nocache"/>` in all three
  locales;
- `sitemap.xml` contains zero occurrences of `delete-account`;
- `robots.txt`'s existing `Disallow: /{locale}/delete-account/` rule covers
  the new nested `confirm` path by prefix;
- no `localhost` string appears in the built HTML.

## Security

- No `dangerouslySetInnerHTML` was added; the one pre-existing usage
  (`ModernHomePage.tsx`) serializes static/generated JSON-LD, not user input.
- No `target="_blank"` anywhere in `src`.
- No secrets, tokens, keys or connection strings were added to source,
  `.env.example`, workflows, or tests. `npm audit --omit=dev`: **0
  vulnerabilities**.
- The deletion-confirmation token is never logged, never sent to analytics
  (the site has no analytics integration), and never stored client-side
  beyond the in-memory React state needed to make the one confirmation
  request.
- **New finding, not previously documented**: `.github/workflows/deploy.yml`
  triggers on every push to `main` and publishes to GitHub Pages, which
  serves the real `playmythstride.com` domain. Merging any website PR is
  therefore a real production deployment trigger. See "Risks" below.

## Accessibility

New form/client components follow the existing project pattern: associated
`<label htmlFor>`, `aria-describedby` linking inputs to status messages,
`role="status"`/`role="alert"` with `aria-live="polite"` on the confirmation
page, visible (not icon-only) button text, honeypot field hidden the same
way as the existing waitlist form, and a skip link on both new pages
(reused from the shared layout). No physical screen-reader or device testing
was performed — this report does not claim it was.

## Dependencies

No `package.json`/`package-lock.json` changes in this branch (no new runtime
or dev dependency was needed).

- `npm audit --omit=dev`: **0 vulnerabilities** (production).
- `npm audit` (full): **9 high-severity** advisories, all the same
  pre-existing `brace-expansion` → `minimatch` → `@eslint/config-array` →
  `eslint`/`eslint-config-next` chain documented in
  `WEBSITE_IMPLEMENTATION_REPORT.md`. The only fix path is a forced ESLint 10
  major upgrade (`npm audit fix --force`), which was deliberately not applied
  here, consistent with the existing decision to avoid an unreviewed breaking
  toolchain change. These packages are dev/lint-only and are not shipped to
  the static export.

## Placeholders and images

No new image assets were added by this branch. The pre-existing placeholder
inventory (conceptual illustrations, no fabricated app screenshots) is
unchanged; see `WEBSITE_IMPLEMENTATION_REPORT.md` and
`WEBSITE_SCREENSHOT_REQUIREMENTS.md`.

## Risks

1. **GitHub Pages auto-deploys on merge to `main`.** This is the primary
   reason this task stops before merging. Merging the PR for this branch (or
   any future website PR) will publish the built site to
   `playmythstride.com` automatically, with no separate manual deploy step
   or approval gate in front of it. Whoever merges must do so knowing that.
2. `AccountDeletion:ExecuteIrreversibleDeletion` and the retention-period
   settings are backend/production configuration, not something this branch
   controls. Until an owner sets them, confirmed deletion requests will sit
   in `AwaitingRetentionDecision` rather than completing. The site is honest
   about this; it is listed here so it isn't mistaken for a website bug.
3. The development-only `brace-expansion` advisory chain (9 high) remains
   open, deferred behind a supported non-breaking ESLint fix.

## Owner data still required

Unchanged from `WEBSITE_LEGAL_PLACEHOLDERS.md` — every field there (legal
entity name, CNPJ/registration, business address, support/privacy email,
effective date, deletion/retention periods, minimum age, AI provider/training
statements, purchase and diamond retention policy) is still unset and still
renders "owner decision pending" in the relevant locale rather than an
invented value. This branch did not resolve or invent any of them.

## Future deployment (not performed)

For a later, deliberately authorized release:

1. Confirm the owner has reviewed this report's "Risks" and "Owner data
   still required" sections.
2. Resolve `WEBSITE_LEGAL_PLACEHOLDERS.md` fields through server/build
   environment configuration (not source).
3. Configure `AccountDeletion` retention values and
   `ExecuteIrreversibleDeletion` in the backend once the owner approves an
   irreversible-execution process.
4. Merge to `main` only with the explicit understanding that
   `.github/workflows/deploy.yml` will immediately publish to
   `playmythstride.com`.
5. Perform the physical accessibility/device/zoom testing listed in
   `WEBSITE_RELEASE_CHECKLIST.md`, which this task did not perform.

No deploy, DNS, Cloudflare, domain, database, backend, or store-console
change was made while producing this report.
