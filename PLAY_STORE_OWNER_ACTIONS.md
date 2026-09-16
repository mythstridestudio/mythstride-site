# Google Play — decisions and actions that only the owner can complete

Status date: 2026-09-15. Scope of the session that produced this file: the
public website at `playmythstride.com`. The legal and support pages were
rewritten against the real behaviour of `D:\projetos\Mythstride` (Flutter
phone app), `C:\Users\Augusto\AndroidStudioProjects\mythstride_watch` (Wear OS
app) and `D:\projetos\MythStrideApi` (backend).

Nothing here is a guess. Every item exists because a fact could **not** be
established from the repositories, or because the published pages now assert
something that a production setting must make true before submission.

Two severities are used:

- **BLOCKER BEFORE PUBLISH** — the store submission or a published page is
  wrong/inaccurate until this is done.
- **RECOMMENDED** — should be resolved, but does not by itself make the site
  or the listing inaccurate.

---

## BLOCKER BEFORE PUBLISH

### B1. Irreversible account deletion is switched off in the backend

`AccountDeletion:ExecuteIrreversibleDeletion` is `false` in every committed
settings file (`MythStride/appsettings.json`,
`MythStride/appsettings.Development.json`). With it off,
`AccountDeletionExecutionService.ProcessDueRequestsAsync` returns early and
**no data is ever erased** — confirmed requests are only recorded and
scheduled (`MythStride/Services/Privacy/AccountDeletionExecutionService.cs`,
and the note written in `AccountDeletionService.ConfirmAsync`: *"Scheduled,
but irreversible execution remains disabled by configuration."*).

The published deletion page now tells players that deletion is carried out
and is permanent. Set
`AccountDeletion__ExecuteIrreversibleDeletion=true` in the production
environment and verify one end-to-end deletion on a test account before
submitting. Google Play's account-deletion requirement is about the erasure
actually happening, not about the request being recorded.

### B2. Production retention values are not committed anywhere

`deploy/ubuntu/mythstride-api.env.example` leaves these blank and the API
refuses to start in Production without them
(`Program.cs`, `AddOptions<AccountDeletionOptions>().ValidateOnStart()`):

- `AccountDeletion__GracePeriodDays`
- `AccountDeletion__PreserveSecurityAuditDays`
- `AccountDeletion__PreservePurchaseRecordsDays`

The non-production defaults are 30 / 180 / 1825 days, but that is a
development default, not an approved production decision, so **no number was
published on the site**. Decide the values, set them, and then tell us to add
the waiting period to the deletion page — Play expects the deletion resource
to state a timeframe.

### B3. The app labels every legal screen as a draft

`lib/features/legal/legal_document_screen.dart:47` and `:63` render
`legal.draft_label`, which reads **"RASCUNHO — NÃO APROVADO PARA PUBLICAÇÃO"**
/ **"DRAFT — NOT APPROVED FOR PUBLICATION"**, unconditionally — it is not even
gated on `LegalComplianceSettings.isDraft`. A reviewer opening Settings →
Legal sees that banner over documents the website now publishes as final.

This is in the app repository, outside this session's scope, so it was not
changed. It must be fixed before upload, together with B4.

### B4. The app's legal configuration is empty, so it computes `isDraft = true`

`lib/config/legal_compliance_config.dart` reads every legal value from
`--dart-define`. The rehearsal build script
(`scripts/build_android_rehearsal.ps1`) passes only
`MYTHSTRIDE_ADS_ENABLED` and `MYTHSTRIDE_API_BASE_URL`, so the shipped build
has no website URLs, no support e-mail, no privacy e-mail, no effective date,
and `policyVersion` defaults to the literal string `draft`.

The release build must define at least:

```
MYTHSTRIDE_WEBSITE_URL=https://playmythstride.com
MYTHSTRIDE_PRIVACY_URL=https://playmythstride.com/pt-BR/privacy/
MYTHSTRIDE_TERMS_URL=https://playmythstride.com/pt-BR/terms/
MYTHSTRIDE_DELETION_URL=https://playmythstride.com/pt-BR/delete-account/
MYTHSTRIDE_SUPPORT_URL=https://playmythstride.com/pt-BR/support/
MYTHSTRIDE_COMMUNITY_URL=https://playmythstride.com/pt-BR/community-guidelines/
MYTHSTRIDE_PURCHASES_POLICY_URL=https://playmythstride.com/pt-BR/purchases/
MYTHSTRIDE_AI_TRANSPARENCY_URL=https://playmythstride.com/pt-BR/ai-transparency/
MYTHSTRIDE_SUPPORT_EMAIL=contato@playmythstride.com
MYTHSTRIDE_PRIVACY_EMAIL=contato@playmythstride.com
MYTHSTRIDE_LEGAL_EFFECTIVE_DATE=2026-09-15
MYTHSTRIDE_POLICY_VERSION=2026-09-15
```

The same values belong in the backend's `LegalCompliance__*` production
environment (`SupportEmail`, `PrivacyEmail` and `PolicyVersion` are currently
empty / `draft` in `appsettings.Production.json`, and
`LegalEffectiveDate` still says `2026-08-21`). The API links these URLs from
account e-mails, so a stale value there reaches players directly.

### B5. Release builds fall back to Google's public AdMob **test** app ID

`android/app/build.gradle.kts` sets, for the release build type:

```kotlin
manifestPlaceholders["admobAppId"] = releaseAdmobAppId ?: testAdmobAppId
```

`testAdmobAppId` is `ca-app-pub-3940256099942544~3347511713`, Google's sample
ID. If `MYTHSTRIDE_ADMOB_APP_ID` / `key.properties` is not provided, a
production AAB ships with a test AdMob application ID in its manifest.

Decide one of:

- supply a real AdMob application ID for the verified account, or
- remove the `com.google.android.gms.ads.APPLICATION_ID` meta-data and the
  `google_mobile_ads` dependency from the release build while the ads feature
  stays off.

Either way the choice must match B6.

### B6. The Play "Ads" declaration must match the shipped binary

Established facts:

- `google_mobile_ads: ^8.0.0` **is** a dependency (`pubspec.yaml`) and the SDK
  is compiled into the binary.
- `AdService.enabled` is `bool.fromEnvironment('MYTHSTRIDE_ADS_ENABLED',
  defaultValue: kDebugMode)`, so in a release build without that define ads are
  **off**; `MobileAds.instance.initialize()` is never called and no ad is
  requested or shown (`lib/services/ad_service.dart`).
- The one existing release script passes `MYTHSTRIDE_ADS_ENABLED=false`.

The website now states exactly this: the SDK is present, the feature is off,
no ads are requested or displayed. Confirm the upload build is produced the
same way, then answer the Play "Contains ads" declaration accordingly. If ads
are ever enabled, the privacy policy, the third-party page and the Data safety
form must be updated *before* that release.

### B7. Developer identity for the store listing and the legal pages

The site publishes **MythStride Studio** as the publisher, which matches
`LegalComplianceOptions.DeveloperDisplayName` in the backend. No legal entity
name, CNPJ, registered address or country of establishment exists anywhere in
the three repositories, so none was invented and none was published.

Confirm:

- the legal entity that will hold the Google Play developer account
  (`MONETIZATION_DEFERRED_UNTIL_DUNS.md` records that D-U-N-S and the
  organization-type Play Console account are still outstanding);
- whether that entity's name / registration number / address must appear in
  the Privacy Policy and Terms for LGPD and consumer-law purposes. If yes,
  provide the exact wording and we will add an identification block to all
  three locales.

### B8. Confirm the crash-reporting decision for the release build

`sentry_flutter` is a dependency and `_initializeCrashReporting()` in
`lib/main.dart` only activates when `MYTHSTRIDE_SENTRY_DSN` is supplied at
build time (`sendDefaultPii = false`, no auto session tracking). The published
pages describe Sentry as a provider that *may* receive technical crash
reports, which is accurate either way.

Before submitting, decide whether the upload build carries a DSN, because the
Data safety answer for "Crash logs" changes with it. Record the decision next
to the build command.

---

## RECOMMENDED

### R1. No age gate inside the app

The site, the beta waitlist and the Terms all state 18+, and the waitlist form
requires an explicit age confirmation. The Android app itself has no age
screen. Play's target-audience and content-rating questionnaires must be
answered as 18+ consistently; consider an in-app confirmation at signup.

### R2. Publish the exact international-transfer position

Resend, Cloudflare, Google, Sentry, GitHub and Strava all operate
internationally, so the policy says processing may happen outside Brazil. The
specific processing regions and the transfer safeguard used (contractual
clauses, adequacy, etc.) could not be determined from the repositories and were
therefore not asserted. Provide them if legal review wants that level of
detail.

### R3. Retention beyond the two configured categories

Only security-audit and purchase retention are parameterised in code. Support
mailbox retention, beta-list retention and backup retention
(`deploy/ubuntu/backup/`) are operational decisions with no value in the
repository; the policy describes them qualitatively. Approve a retention
schedule if you want concrete periods published.

### R4. Rewarded-ad verification is client-trusted

`RewardedAdVerificationService` / `DailyChestService` accept the client's claim
that an ad was watched; there is no ad-network server-side verification. This
is a fraud-prevention gap rather than a privacy one, and it only matters once
ads are enabled (B6).

### R5. Apple Health code path

`lib/services/apple_health_service.dart` uses the `health` package but every
entry point returns `unsupported` unless `Platform.isIOS`, and the backend has
`AppleHealth:Enabled=false`. It was therefore **not** disclosed on the public
pages, which state instead that the Android app does not use Health Connect and
does not read other health apps. If an iOS release is ever published, the
policy needs an Apple Health section.

### R6. Garmin integration is inert

`Garmin:Enabled=false` and `ProgramApproved=false` in every settings file, with
no credentials. Not disclosed anywhere on the site. Revisit if the program is
approved.

### R7. `WEBSITE_LEGAL_PLACEHOLDERS.md` is now obsolete

That file describes a `MYTHSTRIDE_*` runtime-configuration model and
`src/config/product-status.ts`, neither of which exists in the site repository
any more. It was left untouched this session. Consider deleting it, or
replacing it with a pointer to this file, so nobody re-introduces the old
"Decisão do responsável pendente" fallbacks.

---

## Summary

| ID | Severity | One line |
|---|---|---|
| B1 | BLOCKER | Enable `ExecuteIrreversibleDeletion` and verify a real deletion |
| B2 | BLOCKER | Set and approve production retention values; then publish the waiting period |
| B3 | BLOCKER | Remove the unconditional "DRAFT / RASCUNHO" banner from the app's legal screens |
| B4 | BLOCKER | Supply the legal `--dart-define` values and the backend `LegalCompliance__*` values |
| B5 | BLOCKER | Provide a real AdMob app ID or drop the ads SDK from the release build |
| B6 | BLOCKER | Make the Play "Ads" declaration match the shipped binary |
| B7 | BLOCKER | Confirm the legal entity behind "MythStride Studio" and whether it must be published |
| B8 | BLOCKER | Decide whether the upload build ships a Sentry DSN |
| R1 | RECOMMENDED | No in-app age gate |
| R2 | RECOMMENDED | Publish concrete international-transfer detail |
| R3 | RECOMMENDED | Approve a full retention schedule |
| R4 | RECOMMENDED | Rewarded ads are client-trusted |
| R5 | RECOMMENDED | Apple Health path is iOS-only and undisclosed by design |
| R6 | RECOMMENDED | Garmin is inert |
| R7 | RECOMMENDED | Retire `WEBSITE_LEGAL_PLACEHOLDERS.md` |

**Owner decisions remaining: 8 blockers, 7 recommended.**
