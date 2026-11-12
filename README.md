# Lekont

**Your SME back office, in plain language.** Built for the **NPCC National AI
Startups Lab**.

Lekont reads invoices, payslips and contracts in **French and English**, extracts
the fields with a confidence score, and keeps a named human in the loop before
anything is exported. Once the data is clean, it answers plain-language
questions about the numbers — with the calculation shown — and scores six
back-office processes to recommend **what to automate first**.

This combines two opportunity areas from the NPCC research brief:

- **#5 Document and back-office automation** — evidence strong (S1, S3, S4, S5).
- **#7 Business intelligence and automation readiness for SMEs** — evidence
  medium (S1, S2, S4).

The combination is deliberate: #5 produces the clean dataset that #7 needs, so
the SME does not start with an empty spreadsheet.

> **Status:** working demo. Synthetic data by default; Postgres/Supabase is
> wired and loads automatically when `DATABASE_URL` is set. Nothing is exported
> until a reviewer approves it.

## What it does

```
upload -> extract -> human review -> approved data -> ask -> readiness -> act
```

1. **Extract** — invoices, payslips and contracts are parsed with regex first
   and the LLM only for missing fields. Every field has a confidence.
2. **Review** — low-confidence fields are highlighted; a named reviewer edits
   and approves. The export keeps the audit trail.
3. **Ask** — questions like *"Who are my top 5 suppliers?"* return an answer,
   the rows, a chart, the calculation, and what the answer does not cover.
4. **Readiness** — six processes (invoice capture, payroll, reporting, filing,
   supplier reconciliation, stock) are scored on effort and impact, with a
   recommended first process and next steps.

## Why this use case

The HRDC reports behind the brief describe Mauritian SMEs that cannot tell when
automation is appropriate (`11%` "unclear when to use automation"), that see new
technology as "not relevant" (`62%`), and that carry a skills gap among current
staff (`55%`). Meanwhile BPO and finance employers are shifting away from routine
task execution toward BI, RPA, ERP and document handling (S4, S5). Lekont sells
time saved and errors avoided, not "AI".

See `docs/01-use-case-choice.md` and `docs/02-evidence-map.md`.

## Repository layout

```
.
├── apps/
│   ├── api/                  FastAPI service (Python 3.11+)
│   └── web/                  Next.js 16, TypeScript, Tailwind 4
├── api-spec/                 Generated OpenAPI spec
├── data/
│   ├── samples/              Synthetic documents + ledger_100.csv
│   └── raw/                  Real data, git-ignored
├── docs/                     PRD, evidence, data model, API, UI, plan
├── supabase/
│   ├── migrations/           Postgres + RLS schema
│   └── seed/                 Documents + 100 ledger rows
├── .env.example
└── package.json              npm workspace root
```

## Quickstart

### 1. Environment

```powershell
Copy-Item .env.example .env
```

Only `OPENCODE_GO_API_KEY` is needed to call a model. The app works without it.

### 2. API

```powershell
cd apps/api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements-dev.txt
uvicorn app.main:app --reload --port 8010
```

- Health: <http://127.0.0.1:8010/health>
- Docs: <http://127.0.0.1:8010/docs>

### 3. Web

```powershell
npm install
npm run dev
```

Open <http://localhost:3000>. `apps/web/.env.local` points at
`http://localhost:8010`.

### 4. Supabase / Postgres (optional but recommended)

1. Create a Supabase project (free tier).
2. Run `supabase/migrations/0002_backoffice.sql` in the SQL editor.
3. Run `supabase/seed/0001_documents.sql` then `supabase/seed/0002_ledger_100.sql`.
4. Put the connection string in `.env` as `DATABASE_URL=postgresql://...`.
5. Restart the API. It loads documents and the 100-row ledger from Postgres;
   without `DATABASE_URL` it falls back to the in-memory demo.

More detail: `supabase/README.md`.

### 5. Checks

```powershell
# API, from apps/api with the venv active
ruff check .
pytest

# Web, from the repository root
npm run lint
npm run typecheck
npm run build
```

### 6. Regenerate the seed

```powershell
cd apps/api
python -m app.scripts.generate_seed
```

Writes `data/samples/ledger_100.csv`, `supabase/seed/0001_documents.sql` and
`supabase/seed/0002_ledger_100.sql`.

## API overview

| Area | Endpoints |
| --- | --- |
| Meta | `GET /`, `GET /health` |
| Documents | `GET`, `POST /documents`; `GET /documents/{id}` |
| Review | `POST /documents/{id}/review` |
| Export | `GET /documents/export` |
| Insights | `POST /insights/ask`, `POST /insights/readiness` |
| Dashboard | `GET /dashboard/summary` |

## Design

The interface follows the Holistics pattern: a persistent workspace sidebar, a
dashboard canvas, KPI cards, an AI answer surface with the calculation visible,
and a data table you can trace. Colours and motion are ours: indigo/violet,
soft off-white, animated counters, chart draw-in and staggered cards.

## Data policy

- Only synthetic data is committed.
- Documents are invented; no real person, invoice or company is represented.
- Real data belongs in `data/raw/` (git-ignored) or Supabase with RLS.
- Personal data is in scope for payslips, so the pilot follows the Data
  Protection Act 2017: minimisation, access control, named reviewer, deletion.

## Success metrics

| Metric | Target |
| --- | --- |
| Fields extracted without correction | > 85% |
| Documents approved same day | > 80% |
| Questions answered from the ledger | > 90% |
| Answers with a visible calculation | 100% |
| Unsafe export without reviewer | 0 |

## License

No license. All rights reserved.
