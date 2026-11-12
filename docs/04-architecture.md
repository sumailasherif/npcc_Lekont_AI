# Architecture

## Shape

```
                +-------------------------------+
                |  Next.js 16 (apps/web)        |
                |  Overview / Documents / Ask / |
                |  Readiness                     |
                +---------------+---------------+
                                | HTTPS JSON
                +---------------v---------------+
                |  FastAPI (apps/api)           |
                |  documents · insights · dash  |
                +------+----------------+-------+
                       |                |
          OpenCode Go  |                | psycopg
          (optional)   |                | (optional)
                       v                v
                +-------------+  +----------------------+
                | deepseek    |  | Supabase Postgres    |
                | extraction  |  | documents · fields · |
                | fallback    |  | ledger · readiness   |
                +-------------+  +----------------------+
```

## Document flow

1. `POST /api/v1/documents` with the document text (the demo accepts text; a
   pilot adds PDF/OCR upload to storage).
2. `extraction.extract` runs regex for the expected fields, then calls the LLM
   **only for missing fields**, with a JSON-only prompt.
3. Each field gets a confidence; missing required fields lower the document
   confidence and keep it in `needs_review`.
4. A named reviewer edits fields in `POST /documents/{id}/review`; the document
   becomes `approved` and the reviewer is stored.
5. `GET /documents/export` returns CSV with the document id, party, total,
   status, confidence and reviewer.

## Insight flow

`POST /insights/ask` maps the question to a fixed intent, computes the aggregate
over the ledger, and returns:

- a natural-language answer,
- the rows and columns,
- a chart hint,
- the calculation string,
- caveats and suggested follow-ups.

There is **no free-form SQL generation** in the demo. That is a deliberate trust
choice: a wrong number presented confidently is the risk the brief names.

## Readiness flow

`POST /insights/readiness` takes six inputs (sector, employees, invoice and
payslip volume, admin hours, tools, pain points) and returns a readiness score,
six process scores with effort/impact, a recommended first process, and three
next steps. The rules are explicit and explainable.

## WhatsApp chatbot flow

```
WhatsApp (Meta) --webhook--> FastAPI --+
Simulator (web) --/simulate----------+
                                      +--> whatsapp.handle()
                                            -> documents.create_document() (invoice draft)
                                            -> insights.ask() (ledger question)
                                            -> in-memory or Postgres state
```

- Deterministic intents; no free-form SQL.
- Notebook photos produce a preview and wait for `post`.
- Postgres tables: `whatsapp_messages`, `stock_items`, `sales`.
- If credentials are missing, the simulator still exercises the same engine.

## Data

- Default: in-memory synthetic data (`app/data/backoffice.py`).
- With `DATABASE_URL`: `app/db/postgres.py` loads documents, fields and the
  100-row ledger; writes are best-effort.
- `supabase/migrations/0002_backoffice.sql` defines the schema and RLS.

## Trust boundaries

- The LLM only sees the document text, never the whole database.
- Extraction is additive: the LLM fills missing fields and cannot overwrite a
  regex match.
- No export without a reviewer.
- Only synthetic data is committed; real data stays in `data/raw/` or Supabase.
- Every answer exposes its inputs and its limits.

## Stack

| Layer | Choice | Cost |
| --- | --- | --- |
| Web | Next.js 16, TypeScript, Tailwind 4 | Free (Vercel Hobby) |
| API | FastAPI, Pydantic | Free |
| Model | OpenCode Go, `deepseek-v4.1-flash` | Included in Go plan |
| Database | Supabase Postgres | Free tier |
| CI | GitHub Actions | Free for public repos |

See `09-free-stack.md`.
