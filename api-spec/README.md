# API specification

`openapi.json` is generated from the FastAPI app. Do not edit it by hand.

```powershell
cd apps/api
.\.venv\Scripts\Activate.ps1
python -m app.scripts.export_openapi
```

The script writes `api-spec/openapi.json` at the repository root. Commit the
result whenever a route or schema changes, so reviewers can diff the API without
running the service.
