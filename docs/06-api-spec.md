# API spec

Base URL: `http://localhost:8010` (the web app reads
`NEXT_PUBLIC_API_URL`). Product routes are under `/api/v1`. Generated schema:
`api-spec/openapi.json`. Interactive docs: `/docs`.

## Meta

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/` | Service info |
| GET | `/health` | Health check |

## Documents

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/v1/documents` | List documents (summaries) |
| POST | `/api/v1/documents` | Extract a document from text |
| GET | `/api/v1/documents/{id}` | Full document with fields |
| POST | `/api/v1/documents/{id}/review` | Correct fields and approve |
| GET | `/api/v1/documents/export` | CSV export with audit columns |

### Create

```json
POST /api/v1/documents
{
  "filename": "facture_island_packaging_2026-09.pdf",
  "doc_type": "invoice",
  "language": "fr",
  "text": "FACTURE\nFournisseur: Island Packaging Ltd\nNumero de facture: INV-2026-014\nDate: 12/09/2026\nDevise: MUR\nSous-total: 42,500.00\nTVA (15%): 6,375.00\nTotal: 48,875.00\n"
}
```

Response (abridged):

```json
{
  "id": "doc-1a2b3c4d",
  "doc_type": "invoice",
  "language": "fr",
  "supplier": "Island Packaging Ltd",
  "total": 48875.0,
  "currency": "MUR",
  "status": "needs_review",
  "confidence": 0.96,
  "fields": [
    { "key": "supplier", "label": "Supplier", "value": "Island Packaging Ltd", "confidence": 0.96, "corrected": false },
    { "key": "total", "label": "Total", "value": "48,875.00", "confidence": 0.96, "corrected": false }
  ]
}
```

### Review

```json
POST /api/v1/documents/doc-1a2b3c4d/review
{
  "reviewer": "d.ramgoolam",
  "fields": [{ "key": "total", "value": "48,875.00" }]
}
```

Approval sets `status = approved`, `confidence = 1.0` for corrected fields and
stores the reviewer. A missing document returns `404`.

### Export

```json
GET /api/v1/documents/export
{
  "filename": "lekont_documents.csv",
  "rows": 6,
  "csv": "document_id,filename,type,supplier_or_employee,total,currency,status,confidence,reviewer\n..."
}
```

## Insights

### Ask

```json
POST /api/v1/insights/ask
{ "question": "Who are my top 5 suppliers by spend?" }
```

```json
{
  "intent": "suppliers",
  "answer": "Island Packaging Ltd is your largest supplier at MUR 101,000...",
  "calculation": "SUM(amount) GROUP BY supplier ORDER BY amount DESC LIMIT 5; payroll excluded",
  "columns": [
    { "key": "supplier", "label": "Supplier" },
    { "key": "amount", "label": "Spend (MUR)" }
  ],
  "rows": [{ "supplier": "Island Packaging Ltd", "amount": 101000.0 }],
  "chart": { "type": "bar", "x": "supplier", "y": "amount" },
  "confidence": 0.92,
  "caveats": ["Based on the synthetic ledger.", "Payroll is excluded."],
  "suggested": ["How has my monthly spend changed?"]
}
```

Supported intents: `suppliers`, `monthly`, `vat`, `categories`, `payroll`,
`largest`, `month`, `automation`, `unknown`. Unknown questions return guidance,
never a guessed number.

### Readiness

```json
POST /api/v1/insights/readiness
{
  "sector": "Distribution",
  "employees": 12,
  "monthly_invoices": 45,
  "monthly_payslips": 6,
  "admin_hours": 22,
  "tools": ["excel", "whatsapp"],
  "pain_points": ["invoices", "reporting"]
}
```

```json
{
  "readiness_score": 63,
  "band": "Ready for a first automation",
  "recommended_first": "Invoice capture",
  "summary": "Readiness 63/100 ...",
  "scores": [{ "process": "Invoice capture", "score": 80, "effort": "low", "impact": "high", "reason": "45 invoices/month and a named pain." }],
  "next_steps": ["Collect 20 recent invoices, in French and English.", "..."]
}
```

## WhatsApp

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/v1/whatsapp/webhook` | Meta verification handshake |
| POST | `/api/v1/whatsapp/webhook` | Receive a Cloud API event and reply |
| POST | `/api/v1/whatsapp/simulate` | Local simulator, same engine |
| GET | `/api/v1/whatsapp/messages` | Conversation log |
| POST | `/api/v1/whatsapp/reset` | Clear the demo conversation |

```json
POST /api/v1/whatsapp/simulate
{ "from_number": "23050000000", "text": "sold 3 bags at 250", "kind": "text" }
```

```json
{
  "reply": "Recorded: 3 × bags at MUR 250 = MUR 750.\nSales today: MUR 2,030.",
  "intent": "sale",
  "messages": ["..."],
  "data": { "sale": { "item": "bags", "qty": 3, "unit_price": 250, "total": 750 } }
}
```

Supported intents: greeting, help, sale, stock, stock_add, invoice, report,
alert, notebook, notebook_post, insight, unknown. `unknown` returns the menu,
never a guess.

## Dashboard

`GET /api/v1/dashboard/summary` returns document counts, current-month spend and
VAT, readiness score, top supplier and the monthly series used by the chart.

## Approvals

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/v1/approvals?status_filter=pending` | Review queue |
| GET | `/api/v1/approvals/{id}` | One request |
| POST | `/api/v1/approvals/{id}/approve` | Apply the action and notify |
| POST | `/api/v1/approvals/{id}/reject` | Discard the action and notify |

See `11-human-in-the-loop.md` for the policy and state machine.

## Conventions

- Errors: `{"detail": "..."}` with standard status codes.
- Auth: none in the demo; a pilot uses Supabase JWT in `Authorization: Bearer`.
- Database: loads from Postgres when `DATABASE_URL` is set, otherwise synthetic.
- Lists are sorted deterministically.
