# Website release checklist

This checklist is for a later approved release. The modernization task itself
does not deploy.

## Code and artifact

- [ ] Review the branch diff against `origin/main`.
- [ ] Confirm production Node 20 compatibility.
- [ ] Run `npm ci`.
- [ ] Run `npm audit --omit=dev` and record the result.
- [ ] Reassess the development-only `brace-expansion` advisory before any
  supported ESLint major upgrade.
- [ ] Run lint, typecheck and focused tests.
- [ ] Run source-content validation.
- [ ] Build the static export.
- [ ] Run artifact and internal-link validation.
- [ ] Confirm `out/404.html`, robots, sitemap and manifest.
- [ ] Confirm no real player profile appears in static HTML.

## Product and content

- [ ] Product owner approves every status in the central registry.
- [ ] Android beta capacity, compatibility and invitation wording is current.
- [ ] Aethron generated-content and non-medical disclaimers are approved.
- [ ] No download, purchase, advertising or deletion action appears early.
- [ ] PT-BR and English receive product-language review.
- [ ] Spanish remains unpromoted until end-to-end support exists.
- [ ] Final approved screenshots replace the labeled slots in both locales.

## Legal and operations

- [ ] Owner resolves every field in `WEBSITE_LEGAL_PLACEHOLDERS.md`.
- [ ] Legal counsel reviews PT-BR and English drafts.
- [ ] Support and privacy channels are configured, secured and staffed.
- [ ] Account deletion works end to end before operational instructions go live.
- [ ] Reporting, blocking and appeal behavior matches deployed clients/backends.
- [ ] Draft notices and `noindex,nofollow` remain until formal approval.

## Accessibility and SEO

- [ ] Keyboard-test navigation, menu, gallery, forms and FAQ.
- [ ] Test Escape close and focus return.
- [ ] Test reduced motion and 200% text zoom.
- [ ] Test representative 320, 390, 500, 768 and 1440 pixel layouts.
- [ ] Check contrast and screen-reader status announcements.
- [ ] Verify canonical, hreflang, x-default and structured data in production.
- [ ] Validate the sitemap contains only approved public routes.

## Performance

- [ ] Hero variants remain below roughly 250 KB.
- [ ] Approved screenshots remain below roughly 150 KB each when practical.
- [ ] Initial mobile image payload remains below roughly 1.5 MB.
- [ ] Source masters remain outside `public/`.
- [ ] Run a production Lighthouse pass on home and one content page.

## Deferred owner/operations security tasks

These are intentionally not executed by the website modernization branch:

- [ ] Revoke the Resend credential after the owner confirms the replacement
  workflow.
- [ ] Merge and validate the Data Protection remediation work.
- [ ] Rotate production secrets through the approved operations process.
- [ ] Validate the eventual production deployment, DNS, TLS, headers and API
  connectivity.

## Deployment authorization

- [ ] Owner explicitly authorizes merge.
- [ ] Owner explicitly authorizes production deployment.
- [ ] Post-deployment smoke test and rollback owner are assigned.
