# Product screenshot requirements

No current legacy screenshot is approved for public rendering. Captures must
come from a controlled, non-personal beta fixture account and must show
achievable values with all debug banners disabled.

Global capture rules:

- capture PT-BR, English and Spanish after copy freeze;
- use a seeded `website_capture` fixture account with no real user data;
- anonymize names, email, location, routes, friend identifiers and device IDs;
- record masters at 1440×3120 Android portrait or the native watch resolution;
- export website variants at 720×1560 WebP, quality 78–82, under 150 KB where
  visual quality allows;
- preserve masters outside `public/`;
- include explicit width, height, responsive sizes, localized alt text and the
  registry status badge;
- never show impossible metrics, fake prices, personal GPS traces or debug UI.

| Capture | Required state and fixture | Caption purpose | Status badge | Final files |
| --- | --- | --- | --- | --- |
| Dashboard | Returning level-appropriate fixture; normal streak; one active boss; no personal avatar | Explain the run-to-RPG overview | Run tracking: validation | `dashboard-pt-BR.webp`, `dashboard-en.webp`, `dashboard-es.webp` |
| Active run | Safe simulated route with plausible pace/distance and permission state approved for publicity | Show activity recording, not a performance promise | Run tracking: validation | `active-run-pt-BR.webp`, `active-run-en.webp`, `active-run-es.webp` |
| Run result | Completed eligible fixture run; realistic totals; no map coordinates | Explain validation and progression conversion | Run tracking: validation | `run-result-pt-BR.webp`, `run-result-en.webp`, `run-result-es.webp` |
| Inventory | Owned items only; no shop tab or purchase price; balanced fixture loadout | Show earned equipment and loot | Inventory: beta | `inventory-pt-BR.webp`, `inventory-en.webp`, `inventory-es.webp` |
| Shop | Future-state fixture clearly marked non-purchasable; no real price, checkout or store badge | Explain future virtual-currency vision | Diamond purchases: future | `shop-future-pt-BR.webp`, `shop-future-en.webp`, `shop-future-es.webp` |
| Events | Active beta fixture event with approved dates and rules; no real participant names | Explain event participation | Events: beta | `events-pt-BR.webp`, `events-en.webp`, `events-es.webp` |
| Friends | Synthetic invitation list and fixture avatars | Explain invitations and privacy-safe connection | Friends: beta | `friends-pt-BR.webp`, `friends-en.webp`, `friends-es.webp` |
| Groups | Synthetic small group with owner/member roles and neutral name/image | Explain governance | Groups: beta | `groups-pt-BR.webp`, `groups-en.webp`, `groups-es.webp` |
| Weekly ranking | Synthetic members, plausible distances and no real profile data | Explain shared weekly cadence | Weekly ranking: beta | `weekly-ranking-pt-BR.webp`, `weekly-ranking-en.webp`, `weekly-ranking-es.webp` |
| Notifications | Only synthetic product notifications; no device or personal message content | Explain beta feedback and progression updates | Use the feature status represented by each notice | `notifications-pt-BR.webp`, `notifications-en.webp`, `notifications-es.webp` |
| Aethron | Calm, supportive approved message; generated-content and non-medical disclosure visible | Explain narrative companion limits | Aethron: validation | `aethron-pt-BR.webp`, `aethron-en.webp`, `aethron-es.webp` |
| Wear OS | Paired Android fixture; native Galaxy Watch master; plausible tracking state | Explain paired, non-standalone validation | Wear OS: validation | `wear-os-pt-BR.webp`, `wear-os-en.webp`, `wear-os-es.webp` |
| Founder reward | Eligible synthetic founder fixture; reward details approved; no scarcity or value promise | Explain identity reward | Founder Sword: validation | `founder-reward-pt-BR.webp`, `founder-reward-en.webp`, `founder-reward-es.webp` |

The website placeholder gallery must remain until every referenced capture has
product approval in all three locales.
