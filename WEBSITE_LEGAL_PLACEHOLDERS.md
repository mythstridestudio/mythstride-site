# Legal and operational decisions still required

Runtime fallbacks display “Decisão do responsável pendente” or “Owner decision
pending”. They never invent a value. Configure approved values through the
server/build environment only after owner and legal review.

| Configuration field | Required owner decision |
| --- | --- |
| `MYTHSTRIDE_LEGAL_ENTITY_NAME` | Confirm the legal entity responsible for the product and site. |
| `MYTHSTRIDE_CNPJ` | Confirm the applicable registration identifier and publication format. |
| `MYTHSTRIDE_BUSINESS_ADDRESS` | Confirm whether and how the business address must be disclosed. |
| `MYTHSTRIDE_SUPPORT_EMAIL` | Create, secure, staff and approve the official support channel. |
| `MYTHSTRIDE_PRIVACY_EMAIL` | Create, secure, staff and approve the privacy-rights channel. |
| `MYTHSTRIDE_PRIVACY_CONTACT` | Identify the responsible privacy contact or approved wording. |
| `MYTHSTRIDE_LEGAL_EFFECTIVE_DATE` | Set only after the final documents are approved. |
| `MYTHSTRIDE_ACCOUNT_DELETION_PERIOD` | Approve an achievable deletion timeline aligned with backend behavior. |
| `MYTHSTRIDE_DATA_RETENTION_SCHEDULE` | Approve retention by data category, purpose and legal basis. |
| `MYTHSTRIDE_MINIMUM_AGE` | Decide age eligibility, guardian rules and regional handling. |
| `MYTHSTRIDE_AI_PROVIDER_STATEMENT` | Approve the actual AI provider, processing scope and relevant locations. |
| `MYTHSTRIDE_AI_DATA_TRAINING_STATEMENT` | Confirm whether user context is used for model training and under what controls. |
| `MYTHSTRIDE_PURCHASE_RETENTION_POLICY` | Define billing-record retention, refunds, disputes and legal obligations before monetization. |
| `MYTHSTRIDE_DIAMOND_DELETION_POLICY` | Define the effect of account deletion on virtual currency and items. |

## Additional policy decisions

- Legal bases and disclosures for every processing purpose.
- Data-subject request verification and response workflow.
- Reporting, blocking, moderation evidence, restrictions and appeals.
- Anti-cheat review and false-positive handling.
- Aethron feedback/reporting and sensitive health-context controls.
- Strava authorization, disconnect and deletion behavior.
- Future platform billing, pending transactions and duplicate-delivery
  protection.
- Refund, chargeback, expiry and random-reward probability rules.
- Support hours, ownership, escalation and response expectations.
- Final translations and legal equivalence between PT-BR and English.

Draft pages remain `noindex,nofollow` until these decisions, legal review and
owner approval are complete.
