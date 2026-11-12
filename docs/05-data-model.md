# Data model

Postgres/Supabase schema: `supabase/migrations/0002_backoffice.sql`.
In-memory equivalent: `apps/api/app/data/backoffice.py` and
`apps/api/app/services/documents.py`.

## Tables

### organisations
One row per tenant. The demo uses
`00000000-0000-0000-0000-000000000001`.

### documents
| Column | Type | Notes |
| --- | --- | --- |
| id | text PK | `doc-...` |
| org_id | uuid FK | tenant |
| filename | text | original name |
| doc_type | text | invoice / payslip / contract |
| language | text | en / fr |
| supplier | text | supplier, employee or parties |
| total | numeric(14,2) | total, net pay or contract value |
| currency | text | default MUR |
| status | text | needs_review / approved / exported |
| confidence | numeric(4,2) | 0–1 |
| reviewer | text | named human, required to approve |
| reviewed_at | timestamptz | |
| uploaded_at | timestamptz | |
| text_content | text | source text (pilot: storage pointer) |

### document_fields
`doc_id`, `key`, `label`, `value`, `confidence`, `page`, `corrected`.
Primary key `(doc_id, key)`.

### ledger_entries
`id`, `org_id`, `entry_date`, `month`, `supplier`, `category`, `amount`, `vat`,
`doc_id`. 100 synthetic rows ship in `supabase/seed/0002_ledger_100.sql`.

### readiness_assessments
Inputs plus `readiness_score`, `recommended_first`, `created_at`.

## Document state machine

```
needs_review --review--> approved --export--> exported
```

- `needs_review`: at least one required field missing or confidence < 0.9.
- `approved`: a named reviewer saved the fields. The reviewer and timestamp are
  immutable in the audit trail.
- `exported`: included in a CSV export.

## Invariants

1. No document leaves `needs_review` without a reviewer name.
2. Every extracted field has a confidence in `[0, 1]`.
3. A correction sets confidence to 1.0 and `corrected = true`.
4. The LLM may only fill fields the regex did not find.
5. Ledger amounts are positive; payroll has zero VAT.
6. Every answer states the period and the row count behind it.
7. Tenant isolation is enforced by RLS, not by the UI.

## Types and money

- Currency is MUR in the demo; the column exists so a pilot can add USD/EUR.
- Amounts are `numeric(14,2)`, never floats in Postgres.
- Dates are ISO; months are `YYYY-MM` for grouping.

## Indexes

- `ledger_entries (org_id, month)`
- `ledger_entries (org_id, supplier)`
- `documents (org_id)`, `document_fields (doc_id)`
