# Architecture

## Shape

```
             +---------------------------+
             |  Next.js 16 (apps/web)    |
             |  Discover / Ask / Review  |
             +------------+--------------+
                          | HTTPS (JSON)
             +------------v--------------+
             |  FastAPI (apps/api)       |
             |  query, sops, gaps, skills|
             +------+-------------+------+
                    |             |
        OpenCode Go |             | Supabase (free)
        chat models |             | Postgres + pgvector
                    v             v
             +-----------+  +------------------+
             | LLM       |  | sources, chunks, |
             | deepseek  |  | sops, gaps, logs |
             +-----------+  +------------------+
```

## Request flow for a question

1. Operator asks in EN, FR or Kreol; the web app posts to `POST /api/v1/query`.
2. The API embeds the question (Supabase Edge `gte-small`, free) or falls back to
   keyword retrieval in local development.
3. It retrieves the top chunks, restricted to **published** SOP versions for the
   organisation.
4. OpenCode Go generates an answer **only from the retrieved passages**, with a
   strict system prompt and a refusal path.
5. The API validates that every claim maps to a cited step; if not, it refuses.
6. If nothing matches, it writes a `knowledge_gaps` row and returns `covered =
   false`.
7. The web app renders the answer with citations, or the gap acknowledgement.

## Why the answer is a card, not a chat bubble

Delphi's product is a conversational digital mind. That is the right pattern for
discovery and authoring. It is the wrong pattern for a shop floor, where an
operator needs a stable, versioned, auditable instruction. So:

- **Chat** is the supervisor and authoring interface.
- **The published artifact** is an immutable SOP card, in three languages.
- The operator-facing surface can answer follow-ups, but every answer is
  constrained to the approved card.

## What we borrow from Delphi

| Delphi | Retenou |
| --- | --- |
| `Knowledge` sources (web, files, audio) | SOPs, manuals, fault codes, expert voice notes |
| Digital Mind per person | Digital Trainer per line/role/machine |
| `Audience` | Operators by role, line, shift, language |
| `Conversations` | Operator questions, text and voice |
| Conversation analytics | Unanswered questions become a skills-gap report |
| One shareable link | One link per line/role |

## What we deliberately do not copy

- Consumer expert discovery and matching.
- Celebrity clones and persona mimicry.
- Automatic publication.
- Pinecone/Workflow-scale infrastructure; Supabase and a single FastAPI service
  are enough for the challenge.

## Stack

| Layer | Choice | Cost |
| --- | --- | --- |
| Web | Next.js 16, TypeScript, Tailwind 4 | Free (Vercel Hobby) |
| API | FastAPI, Pydantic | Free (local or free host) |
| Models | OpenCode Go, `deepseek-v4.1-flash` | Included in Go plan; free models available |
| Database | Supabase Postgres + pgvector | Free tier |
| Embeddings | Supabase Edge Function `gte-small`, or local `fastembed` | Free |
| Voice input | Browser Web Speech API / MediaRecorder | Free, on device |
| CI | GitHub Actions | Free for public repos |

## Trust boundaries

- The model never sees more than the retrieved passages for the tenant.
- Row-level security is enabled before a pilot; the scaffold documents the
  policies in the migration.
- Every publish writes `review_log`; every write can write `audit_log`.
- Only synthetic data is committed to the repository.
