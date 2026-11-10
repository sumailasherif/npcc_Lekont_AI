# API spec

Base URL: `http://localhost:8000` (the running demo uses `8010`; set
`NEXT_PUBLIC_API_URL` in `apps/web/.env.local`). All product routes are under
`/api/v1`. Generated schema: `api-spec/openapi.json`. Interactive docs: `/docs`.

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
  "source_answer": "1. Press the red stop button...",
  "language": "en",
  "confidence": 0.92,
  "citations": [
    { "sop_id": "sop-txt-001", "version": 1, "step": 1, "quote": "Press the red stop button..." }
  ],
  "gap_id": null,
  "translation_engine": "identity",
  "review_required": false,
  "disclaimer": "Answer generated from approved work instructions..."
}
```

`source_answer` is always English. FR and Kreol are produced at request time and
`translation_engine` is one of `identity`, `llm`, `memory` or `glossary`.
`review_required` is true whenever a human should check the translation before
it reaches the shop floor.

When nothing matches: `covered=false`, `citations=[]`, and `gap_id` is set.

## Live translation

`POST /api/v1/translate`

```json
{
  "text": "Press the red stop button and wait until the machine is fully still.",
  "target_language": "cr",
  "source_language": "en"
}
```

```json
{
  "source_text": "Press the red stop button...",
  "translated_text": "Tap lor bouton are rouz la ek atann ki lamin la are nety.",
  "source_language": "en",
  "target_language": "cr",
  "engine": "llm",
  "review_required": true,
  "confidence": 0.78
}
```

Engines are tried in order: `llm` (OpenCode Go / `deepseek-v4.1-flash`),
`memory` (curated EN/FR/Kreol pairs from approved SOPs, instant and offline) and
`glossary` (word-level fallback, always flagged for review). Results are cached
in-process so switching language in the UI is immediate after the first call.

## Experts (Delphi-style minds)

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/v1/experts` | List minds; filter with `?category=` and `?q=` |
| GET | `/api/v1/experts/{id}` | Profile, knowledge cards and sample questions |
| POST | `/api/v1/experts/{id}/chat` | Grounded conversation with one mind |

```json
POST /api/v1/experts/textile-ops-veteran/chat
{
  "message": "How do I clear a thread jam on an overlock machine?",
  "language": "fr",
  "history": []
}
```

```json
{
  "answer": "Voici la procedure...",
  "source_answer": "Here is the procedure...",
  "language": "fr",
  "citations": [
    { "card_id": "apparel-jam", "title": "Clearing an overlock thread jam", "source": "Synthetic SOP pack, textile", "year": 2026 }
  ],
  "confidence": 0.86,
  "engine": "llm",
  "review_required": false,
  "suggested": ["How do I train a new operator who speaks only Kreol?"],
  "disclaimer": "Composite practitioner profile created for the NPCC challenge..."
}
```

`engine` is `llm`, `knowledge` (assembled directly from cards, offline) or
`scope` (the question is outside the mind's material). Public-record profiles
are not authored or endorsed by the named person; composite profiles are
fictional and labelled as such.

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
