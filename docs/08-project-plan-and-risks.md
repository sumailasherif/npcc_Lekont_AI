# Project plan and risks

## Milestones

| Milestone | Deliverable | Exit criteria |
| --- | --- | --- |
| M0 — Scaffold | Monorepo, API, web shell, CI | `lint`, `typecheck`, `build`, `pytest` pass |
| M1 — Documents | Extraction, confidence, review, CSV | 6 demo documents, review flow, export |
| M2 — Postgres | Supabase schema, RLS, 100-row seed | `select count(*)` = 100; API loads from DB |
| M3 — Insights | Ask intents, calculation, chart, table | 6 supported questions; unknown refused |
| M4 — Readiness | Six-process diagnostic | Score, recommendation, next steps |
| M5 — Demo | Holistics-style UI, motion, story | 5-minute walkthrough without notes |

## Demo script (5 minutes)

1. **Overview** — six documents, two need review, spend this month.
2. **Documents** — open the French invoice; show fields and confidence; correct
   one field; approve as a named reviewer; export CSV.
3. **Ask AI** — "top 5 suppliers", then "monthly spend"; show the calculation.
4. **Ask AI** — a question outside the intents; show the refusal.
5. **Readiness** — run the check; read the recommended first process and why.
6. **Postgres** — show the same data in Supabase; 100 ledger rows.

## Risks

| Risk | Likelihood | Impact | Mitigation | Owner |
| --- | --- | --- | --- | --- |
| Confidently wrong number | Medium | High | Fixed intents, calculation shown, caveats, no free SQL | API |
| Personal data in payslips | Medium | High | Synthetic demo, RLS, minimisation, named reviewer, deletion | Product |
| Extraction misses FR fields | Medium | Medium | Bilingual regex, LLM fill, confidence, review queue | API |
| Supabase unavailable in demo | Low | Medium | In-memory fallback, local seed CSV | API |
| Scope creep to ERP posting | Medium | Medium | Export only; posting is out of scope | Product |
| Judges see a generic BI tool | Medium | Medium | Lead with document intake + human review, not charts | Demo |
| LLM cost or latency | Low | Low | Optional key; regex-first; 60s timeout | API |
| Real factory/SME access | Medium | High | 8–10 interviews; synthetic data works without access | Research |
| WhatsApp/Meta policy change | Medium | Medium | Simulator is the primary demo; webhook is thin | API |
| Bot posts wrong sale from a photo | Medium | High | Preview + explicit “post”; no auto-post | Product |
| Chat logs contain personal data | Medium | High | Synthetic demo, tenant id, retention and deletion in pilot | Product |

## Responsible AI checklist

- [x] Human approves before export.
- [x] Confidence shown per field.
- [x] Answers show inputs and caveats.
- [x] Unknown questions refused.
- [x] Synthetic data in the repo; no real PII.
- [x] RLS and tenant isolation documented.
- [x] No automated decisions about people (payroll is data entry only).
- [ ] Pilot: DPIA, retention policy, deletion workflow.

## Next two weeks

1. Run 8 interviews with owners and accountants (guide in `03`).
2. Add PDF upload + OCR behind a storage bucket.
3. Add the three most-requested questions from interviews.
4. Measure correction rate on 20 real (consented, anonymised) documents.
5. Prepare the 5-minute demo and the evidence one-pager.
