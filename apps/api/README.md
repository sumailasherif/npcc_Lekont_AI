# @retenou/api

FastAPI service for Retenou AI.

## Local run

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements-dev.txt
uvicorn app.main:app --reload
```

Interactive docs: http://127.0.0.1:8000/docs

## Tests

```powershell
pytest
ruff check .
```

## OpenAPI

```powershell
python -m app.scripts.export_openapi
```

Writes `api-spec/openapi.json` at the repository root.
