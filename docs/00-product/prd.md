# PRD — Lekont

## Problem

Mauritian SMEs run the back office on a mix of paper, Excel, WhatsApp and an
accounting package. Invoices and payslips arrive in French and English; the same
data is retyped two or three times; and the owner cannot answer basic questions
("who costs me the most?", "how much VAT did I pay?") without asking the
accountant. When they consider automation, they do not know where to start.

Evidence: HRDC S1 (2021), S2 (2022), S4 (2026), S5 (2026). See
`02-evidence-map.md`.

## Users

| User | Job to be done |
| --- | --- |
| SME owner / manager | "Tell me where my money goes and what to automate first." |
| Accountant / bookkeeper | "Get clean, reviewed data without retyping every invoice." |
| Operations admin | "File invoices, payslips and contracts so I can find them at audit." |
| BPO / finance team lead | "Handle client documents in FR/EN with a human check." |

## Scope

**In**
- Invoice, payslip and contract extraction in French and English.
- Per-field confidence and a named human review before export.
- CSV export and a full audit trail.
- Plain-language analytics over the ledger: suppliers, monthly spend, VAT,
  categories, payroll, largest outflows.
- Automation-readiness diagnostic across six processes.

**Out (for now)**
- Direct posting to ERP/accounting software (export only).
- Attrition prediction, HR records, health data.
- Kreol document translation (FR/EN only; Kreol is spoken, not written here).
- Multi-entity consolidation and tax filing.

## User stories

1. As an accountant, I upload an invoice and see every field with a confidence,
   so I only check the uncertain ones.
2. As an accountant, I cannot export until I approve as a named user.
3. As an owner, I ask "who are my top 5 suppliers?" and get a number, a table, a
   chart, and the calculation behind it.
4. As an owner, I answer six questions and get a recommended first automation
   with next steps.
5. As an auditor, I can trace an exported row to the document, reviewer and date.

## Success metrics

| Metric | Target |
| --- | --- |
| Fields extracted without correction | > 85% |
| Documents approved same day | > 80% |
| Answers with a visible calculation | 100% |
| Unsafe export without reviewer | 0 |
| Time to answer an owner question | < 10 seconds |

## Risks

- **Confidently wrong numbers** → deterministic intents, visible calculation,
  caveats, and no free-form SQL in the demo.
- **Personal data in payslips** → synthetic demo data, RLS, minimisation,
  named reviewer, deletion on request (DPA 2017).
- **Thin data** → the ledger ships with 100 rows; the app states the period and
  the row count behind every answer.
