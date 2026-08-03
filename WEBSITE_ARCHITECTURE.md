# Website architecture

## Runtime model

The site uses Next.js App Router with `output: "export"` and trailing slashes.
GitHub Pages serves the generated `out/` directory. There are no server
functions in this repository.

The route tree uses multiple root layouts:

- `(default)` renders the x-default language chooser with `lang="pt-BR"`;
- `[locale]` renders public PT-BR, English and Spanish pages with a server-stable
  `html lang`;
- `(internal)` preserves login, dashboard, admin and player routes while
  isolating authenticated providers from the marketing bundle.

`[locale]/[page]` statically generates the shared public and draft page shells
from `src/content/pages.ts`. Only the enumerated slugs and the three supported
locales are emitted. `delete-account` and `delete-account/confirm` are
dedicated route trees (not part of the `[page]` catch-all) because they host
the public account-deletion request/confirmation flow.

## Sources of truth

- `src/config/product-status.ts`: feature availability and localized status
  wording;
- `src/content/site.ts`: localized homepage/navigation/footer copy;
- `src/content/pages.ts`: substantial localized route content;
- `src/config/legal.ts`: owner-controlled legal and operational fields;
- `src/lib/metadata.ts`: canonical, hreflang, Open Graph and robots metadata;
- `src/lib/structured-data.ts`: factual Organization, WebSite and
  SoftwareApplication structured data.

Status wording must not be duplicated in page components. Draft legal values
must not be hard-coded into route copy.

## Rendering boundaries

Marketing content is server-rendered by default. Client JavaScript is limited
to:

- accessible mobile navigation;
- waitlist form and API state;
- account-deletion request form and confirmation-token client;
- keyboard-operable screenshot gallery.

`AuthProvider` and the legacy language context only wrap internal routes.
Framer Motion remains available to those existing authenticated interfaces but
is not required for the public landing page.

## Route indexing

Indexable:

- localized home;
- features;
- how it works;
- Aethron;
- Wear OS;
- events;
- community;
- closed beta;
- FAQ.

Noindex and nofollow:

- support and every unfinished legal/transparency draft, including
  `delete-account` and `delete-account/confirm`;
- login, dashboard and admin;
- player routes and the disabled profile preview.

The sitemap contains only approved public routes. `robots.txt` reinforces
exclusions, but authorization remains a backend responsibility.

## Public profiles

Static profile generation is disabled by default. The export emits only a
non-personal disabled-preview route required by static export. A future
approved runtime may opt in with:

- `MYTHSTRIDE_ENABLE_STATIC_PUBLIC_PROFILES=true`;
- `MYTHSTRIDE_STATIC_PLAYER_USERNAMES` containing explicitly approved fixture
  usernames.

Production builds must never opt in with real personal profile data.

## Assets

Original artwork is stored under `assets/source/`, which is excluded from the
runtime artifact. `scripts/optimize-assets.mjs` creates:

- desktop and mobile WebP hero variants;
- a compact application icon;
- optimized boss and Founder assets;
- optimized boss medals with transparency;
- an optimized internal Aethron background;
- a 1200×630 social preview derived from approved existing art.

Product screenshots in `assets/source/art/` are retained as historical
evidence but are not rendered because they contain outdated or unapproved
states.

## External integration

The waitlist client sends email, optional name, website source and a safe
PT/EN/ES language code to the existing API. The form does not promise access.

`src/lib/api/account-deletion.ts` calls the real, anonymous, non-enumerating
backend contract at `POST /api/account-deletion/request-link` and
`POST /api/account-deletion/confirm-link` (`MythStrideApi`
`AccountDeletionPublicController`). Both public routes use
`NEXT_PUBLIC_API_BASE_URL`, the same variable the waitlist client already
uses; no new environment variable was required. The confirmation token
travels only in the URL fragment (`#token=...`), is read client-side, is
stripped from the address bar immediately via `history.replaceState`, and is
never logged or persisted to storage.

No purchase, moderation or Aethron-provider endpoint was added in this phase.

`src/lib/account-deletion-contract.ts` isolates the shape of a *different*,
still-unbuilt, future *authenticated in-app* deletion integration (initiated
from the player's account settings after login). It exports no service
implementation and cannot call a backend; activation requires a separate
approved runtime task. It is unrelated to the public website flow described
above.

## CI

Pull requests run install, production audit, lint, TypeScript, focused tests,
source-content validation, static build, artifact checks and internal-link
validation (`.github/workflows/website-pr-validation.yml`). That workflow has
read-only repository permission and never deploys.

`.github/workflows/deploy.yml` is separate: it triggers on every push to
`main` (plus manual `workflow_dispatch`) and publishes `out/` to GitHub Pages,
which serves the live `playmythstride.com` domain (`public/CNAME`). **Merging
any PR into `main` triggers a real public deployment.** Anyone merging
website changes must decide that deployment consciously; it is not something
a PR-validation-only workflow run implies.
