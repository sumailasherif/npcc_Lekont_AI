# Use-case choice — #5 + #7

## Decision

Build **Lekont**: document and back-office automation (#5) as the intake engine,
and SME business intelligence plus automation readiness (#7) as the delivery
layer.

## Why this pair

- **#5 has strong evidence** (S1, S3, S4, S5) and a concrete buyer: accountants,
  finance teams and BPO desks drowning in invoices, payslips and contracts.
- **#7 has medium evidence** (S1, S2, S4) but the brief flags the real problem:
  SMEs "struggle to assess their automation needs" and many see technology as
  "not relevant".
- Alone, #7 starts with no clean data. Alone, #5 stops at a CSV. Together, the
  documents produce the dataset, and the dataset produces the answer to "what
  next?".

## Fit with the brief's design requirements

| Requirement | How Lekont meets it |
| --- | --- |
| Works for existing staff | Plain forms, no SQL, no new specialist role |
| Phased and modular | Extract → review → export → ask → readiness |
| Shows value quickly | First invoice extracted in seconds; first answer in one question |
| Explains itself | Every answer shows the calculation and caveats |
| Human in charge | Named reviewer before export; no auto-posting |
| Fits existing tools | CSV out; Excel/Supabase in; FR/EN documents |
| Respects data protection | Synthetic demo, RLS, minimisation, deletion |

## Why not the other areas

| Area | Why not now |
| --- | --- |
| #1 Predictive maintenance | Strong evidence, but needs factory access and sensor/history data a student team cannot guarantee. |
| #9 Multilingual work instructions | Strong evidence, but the buyer is a training officer and the value is harder to prove in six weeks. |
| #4 Compliance/traceability | High value, but regulated and needs domain validation before a demo. |
| #8 Skills/retention analytics | Sensitive HR data and fairness risk; weaker evidence than #5. |

## Positioning

> **Lekont** — the account, in plain language. Capture the paperwork, keep a
> human in the loop, and know what to automate next.

Primary segment: SMEs of 5–50 staff, plus the accountants and BPO desks that
serve them. Sector-agnostic; the demo ledger is a distributor because the pain
(invoices, suppliers, VAT, payroll) is universal.
