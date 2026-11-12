# Human in the loop

Lekont is designed so the assistant does the routine work and a named human keeps
the judgment. The reviewer is normally the **Head of Finance** (or a supervisor
in a smaller business).

## Roles

| Role | Can do | Cannot do |
| --- | --- | --- |
| Owner / operator | Chat, record sales, draft invoices, ask questions | Send an invoice, post a large notebook, record a large sale |
| Head of Finance | Approve or reject requests, add a comment | Change the source document silently |
| Auditor | Read the document, approval and reviewer | Approve on someone else's behalf |

## What needs approval

| Action | Rule | Why |
| --- | --- | --- |
| Invoice draft | **Every invoice** | Money leaves the business; a person must own it |
| Notebook posting | Total ≥ **MUR 1,000** | OCR can misread handwriting |
| Sale | Total ≥ **MUR 5,000** | Protects against a mistyped quantity or price |
| Export | A reviewer must have approved the document | Audit trail |

Below the thresholds, the operator can act directly; the action is still logged.

## Flow

```
Owner (WhatsApp)                     Head of Finance (dashboard / WhatsApp)
      |                                          |
      | "invoice Ramesh 2500"                    |
      |----------------------------------------->|
      |  bot creates invoice draft (needs_review)|
      |  bot creates approval req-8f21 (pending) |
      |  "Sent to the Head of Finance"           |
      |                                          |
      |                        opens Approvals   |
      |                        reviews amount,   |
      |                        document, comment |
      |                        [Approve]         |
      |<-----------------------------------------|
      |  "Approved by A. Runghen. PDF ready."    |
      |  document status = approved              |
```

## State machine

```
pending --approve--> approved --> action applied --> requester notified
pending --reject---> rejected --> nothing applied --> requester notified
```

An approval can only be decided once. A second decision returns `409`.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/v1/approvals` | List, optionally `?status_filter=pending` |
| GET | `/api/v1/approvals/{id}` | One request |
| POST | `/api/v1/approvals/{id}/approve` | `{reviewer, comment}` |
| POST | `/api/v1/approvals/{id}/reject` | `{reviewer, comment}` |

```json
POST /api/v1/approvals/req-8f21/approve
{ "reviewer": "A. Runghen (Head of Finance)", "comment": "Checked the PO" }
```

```json
{
  "id": "req-8f21",
  "kind": "invoice",
  "summary": "Invoice for Ramesh",
  "amount": 2500.0,
  "status": "approved",
  "reviewer": "A. Runghen (Head of Finance)",
  "decided_at": "2026-11-12T09:42:00Z"
}
```

## What approval changes

- **Invoice** → the document moves to `approved` with the reviewer recorded.
- **Notebook** → the reviewed lines are posted as sales.
- **Sale** → the held sale is recorded.
- A WhatsApp message is logged to the requester, so the loop closes where it
  started.

## Audit trail

Every approval stores: id, kind, summary, amount, requested_by, status,
reviewer, comment, created_at, decided_at, payload. The document stores its own
reviewer and reviewed_at. Together they answer "who approved this, when, and on
what basis".

## Design rules

- The bot never says "approved" before the approval exists.
- Rejection is a first-class outcome, not an error.
- The reviewer sees the amount and the source document before deciding.
- The requester is told either way.
- No approval, no export.

## Metrics

| Metric | Target |
| --- | --- |
| Approvals decided within one business day | > 90% |
| Actions applied without an approval | 0 above threshold |
| Rejections with a comment | 100% |
