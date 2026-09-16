# MythStride — Google Play website readiness checklist

Internal working document. **Not published on the website.**

Status date: 2026-09-15. Evaluated against the static export produced by
`npm run build` in this repository and the real behaviour of the Flutter app,
the Wear OS app and the backend.

---

## Checklist

| Item | Result |
|---|---|
| PRIVACY POLICY | **PASS** |
| ACCOUNT DELETION WEB RESOURCE | **FAIL** |
| TERMS | **PASS** |
| THIRD PARTY DISCLOSURE | **PASS** |
| SUPPORT PAGE | **PASS** |
| HEALTH/FITNESS DISCLOSURE | **PASS** |
| LOCATION DISCLOSURE | **PASS** |
| WEAR OS DISCLOSURE | **PASS** |
| PT-BR | **PASS** |
| EN | **PASS** |
| ES | **PASS** |
| PUBLIC ACCESS WITHOUT LOGIN | **PASS** |
| NO DRAFT/PENDING PUBLIC TEXT | **PASS** |
| OWNER DECISIONS REMAINING | **15** (8 blockers, 7 recommended) |

---

## Detail

**PRIVACY POLICY — PASS.**
`/{locale}/privacy/` in all three locales, 21 sections. Identifies MythStride,
MythStride Studio, the Android package and the contact channel. Covers data
categories, purposes, health and fitness, Wear OS, location, AI, advertising,
named third parties with policy links, no-sale statement, international
processing, security, retention, deletion, LGPD rights, minimum age, changes,
contact and an effective date of 15 September 2026. Every claim is traceable to
code or configuration; nothing was invented.

**ACCOUNT DELETION WEB RESOURCE — FAIL.**
The page itself is complete: `/{locale}/delete-account/` is public, needs no
login and no installed app, explains the request and e-mail-verification flow,
lists exactly what is deleted and what is retained, warns about the guild
leadership block, and drives a real, non-enumerating backend endpoint
(`POST /api/account-deletion/request-link`).

It is marked FAIL for two reasons that are outside this repository:

1. `AccountDeletion:ExecuteIrreversibleDeletion` is `false` in the committed
   backend configuration, so confirmed requests are scheduled but never
   executed. The page states that deletion happens and is permanent — that must
   be true in production before submission (**B1**).
2. No approved production waiting period exists, so no timeframe could be
   published without inventing one (**B2**). Play expects the deletion resource
   to state a timeframe.

Flip both and this becomes PASS without further page changes beyond adding the
approved period.

**TERMS — PASS.**
`/{locale}/terms/`, 17 sections covering the service, eligibility, accounts,
physical-activity responsibility, game mechanics, integrity, virtual items and
their lack of monetary value, external services, Aethron, availability,
intellectual property, suspension, deletion effects, liability limits under
Brazilian law, changes, governing law and effective date. No commercial or
jurisdictional condition was invented; entity identification is deferred to
**B7**.

**THIRD PARTY DISCLOSURE — PASS.**
`/{locale}/third-party-services/` lists only providers that are actually in the
build — Google (Sign-In, Play services, Wear Data Layer), Strava, Resend,
Cloudflare, Sentry, Google AdMob, GitHub Pages — each with an explicit status
(active / optional and enabled by the player / included but turned off),
purpose, data involved and policy link. Firebase and Crashlytics are **not**
listed because no Firebase SDK is compiled into the app; a regression test
enforces that.

**SUPPORT PAGE — PASS.**
`/{locale}/support/` names MythStride Studio and `contato@playmythstride.com`,
and links to Privacy, Terms, Delete account, Third-party services and Community
Guidelines. The footer carries the same links on every page in all locales.

**HEALTH/FITNESS DISCLOSURE — PASS.**
Dedicated privacy section stating which fitness data is processed, where it
comes from, when it is collected, why, how the player controls it, that it
reaches the servers rather than staying on device, that it is never used for
advertising or sold, that MythStride is not a medical device, and — explicitly
— that the Android app does **not** use Health Connect and does not read other
health apps. Verified: no `android.permission.health.*` in the phone manifest,
and the `health` package is only reached under `Platform.isIOS`.

**LOCATION DISCLOSURE — PASS.**
States precise location during an active run, foreground-service continuation
with a visible notification, no background-location permission, no collection
outside a run, route points sent to the server for distance and integrity
checks including mock-location detection, no behavioural advertising, and how
to revoke the permission. Matches the manifest exactly.

**WEAR OS DISCLOSURE — PASS.**
States that the watch app is a non-standalone companion, which sensors it uses,
that heart rate, distance, steps, duration and run state travel to the paired
phone over the local Play Services channel, and that the phone — not the watch —
submits the result to the server. Matches `WEAR_DATA_LAYER_PROTOCOL.md` and the
watch manifest.

**PT-BR / EN / ES — PASS.**
All eight institutional pages exist in all three locales with semantically
equivalent content and the same section structure. A test asserts three
definitions per legal slug and that the effective date appears in all three
languages. No page carries stale content from a previous version.

**PUBLIC ACCESS WITHOUT LOGIN — PASS.**
Static export; no authentication anywhere on the public routes. All legal pages
return `index, follow`, carry a correct canonical plus `pt-BR` / `en` / `es` /
`x-default` alternates, and appear in `sitemap.xml`. `robots.txt` disallows only
`/login/`, `/dashboard/`, `/admin/` and `/player/`.

**NO DRAFT/PENDING PUBLIC TEXT — PASS.**
A full-text scan of the exported HTML for *rascunho, draft, não vigente, não
aprovado, pendente, pending, TBD, decisão do responsável* finds nothing, and a
regression test keeps it that way. (The one remaining occurrence of "Rascunho"
in the repository is the event-status label on the internal, `noindex` admin
screen, which is a legitimate domain term.)

Caveat outside this repository: the **Android app** still renders
"RASCUNHO — NÃO APROVADO PARA PUBLICAÇÃO" over its legal screens
(**B3**/**B4**). That contradicts the site and must be fixed before upload.

---

## Verdict

```
GOOGLE PLAY WEBSITE READINESS: FAIL
PRIVACY POLICY READY:          YES
ACCOUNT DELETION READY:        NO
DATA SAFETY MATRIX READY:      YES
OWNER ACTION REQUIRED:         YES
```

The website content is finished and accurate. The overall result is FAIL
because the deletion page currently promises an outcome that production
configuration does not yet deliver (B1) and because the deletion timeframe and
the legal entity behind "MythStride Studio" could not be confirmed from any
repository and were therefore not invented (B2, B7).

Full list and severities: `PLAY_STORE_OWNER_ACTIONS.md`.
Data safety answers: `PLAY_STORE_DISCLOSURE_MATRIX.md`.
