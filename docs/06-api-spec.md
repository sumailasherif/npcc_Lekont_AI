# API spec

Base URL: `http://localhost:8000`. All product routes are under `/api/v1`.
Generated schema: `api-spec/openapi.json`. Interactive docs: `/docs`.

## Meta

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/` | Service info |
| GET | `/health` | Health check |

## Sources

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/v1/sources` | List knowledge sources |
| POST | `/api/v1/sources` | Register a source |
| DELETE | `/api/v1/sources/{id}` | Remove a source |

```json
POST /api/v1/sources
{
  "title": "Overlock jam procedure",
  "kind": "pdf",
  "sector": "textile",
  "language": "en",
  "notes": "Synthetic demo document"
}
```

## Query

`POST /api/v1/query`

```json
{
  "question": "How do I clear a thread jam on the overlock machine?",
  "language": "en",
  "role_id": "senior_operator"
}
```

Response:

```json
{
  "covered": true,
  "answer": "1. Press the red stop button...\n2. Lift the presser foot...",
  "language": "en",
  "confidence": 0.92,
  "citations": [
    { "sop_id": "sop-txt-001", "version": 1, "step": 1, "quote": "Press the red stop button..." }
  ],
  "gap_id": null,
  "disclaimer": "Answer generated from approved work instructions..."
}
```

When nothing matches: `covered=false`, `citations=[]`, and `gap_id` is set.

## SOPs

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/v1/sops` | List SOPs |
| POST | `/api/v1/sops` | Create a draft |
| GET | `/api/v1/sops/{id}` | Read a SOP with translations |
| POST | `/api/v1/sops/{id}/generate` | Generate a draft from a source |
| POST | `/api/v1/sops/{id}/translate` | Add languages |
| POST | `/api/v1/sops/{id}/submit` | Move to review |
| POST | `/api/v1/sops/{id}/approve` | Publish a new version |

```json
POST /api/v1/sops/{id}/approve
{ "reviewer": "a.supervisor", "comment": "Checked against line 3" }
```

## Gaps

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/v1/gaps` | Open gaps, highest count first |
| POST | `/api/v1/gaps/{id}/promote` | Turn a gap into an SOP draft |

## Skills

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/v1/skills/roles` | Roles with skill requirements |
| GET | `/api/v1/skills/roles/{id}` | One role |

## Analytics

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/v1/analytics/summary` | Covered rate, gaps, SOP counts |

## Conventions

- Errors use FastAPI's `{"detail": "..."}` shape with standard status codes.
- Auth in production: Supabase JWT in `Authorization: Bearer <token>`.
  The scaffold reads an optional `X-Demo-User` header.
- All list responses are sorted deterministically so the UI and tests are stable.
