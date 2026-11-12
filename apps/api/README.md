# @lekont/api

FastAPI service for **Lekont**: document extraction, human review, CSV export,
plain-language analytics and an automation-readiness diagnostic.

## Local run

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements-dev.txt
uvicorn app.main:app --reload --port 8010
```

Interactive docs: <http://127.0.0.1:8010/docs>

## Data

- Default: synthetic in-memory data (`app/data/backoffice.py`).
- With `DATABASE_URL`: loads documents, fields and the 100-row ledger from
  Supabase/Postgres (`app/db/postgres.py`).
- Seed files: `supabase/seed/0001_documents.sql`,
  `supabase/seed/0002_ledger_100.sql`.

## Endpoints

| Area | Endpoints |
| --- | --- |
| Meta | `GET /`, `GET /health` |
| Documents | `GET`, `POST /api/v1/documents`; `GET /api/v1/documents/{id}` |
| Review | `POST /api/v1/documents/{id}/review` |
| Export | `GET /api/v1/documents/export` |
| Insights | `POST /api/v1/insights/ask`, `POST /api/v1/insights/readiness` |
| Dashboard | `GET /api/v1/dashboard/summary` |

## Tests

```powershell
pytest
ruff check .
```

## Regenerate the demo data

```powershell
python -m app.scripts.generate_seed
```

Writes `data/samples/ledger_100.csv` and the two Supabase seed files.
