# Data model

Implementation: `supabase/migrations/0001_init.sql`. Local development uses an
in-memory store with the same shapes (`apps/api/app/store.py`).

## Entities

| Entity | Purpose | Key fields |
| --- | --- | --- |
| `organizations` | Tenant | name, sector |
| `sites` | Factory or site | organization_id, name |
| `roles` | Job roles | code, name, headcount |
| `profiles` | Users (extends `auth.users`) | organization_id, role |
| `knowledge_sources` | Uploaded knowledge | kind, sector, language, status |
| `document_chunks` | Retrieval unit | source_id, content, embedding |
| `sops` | Work instruction header | status, current_version, approved_by |
| `sop_versions` | Immutable published versions | sop_id, version, title |
| `sop_translations` | One per language | sop_version_id, language, title |
| `sop_steps` | Ordered steps | step_order, text, risk |
| `review_log` | Approval trail | decision, reviewer, comment |
| `conversations` / `messages` | Q&A history | language, covered, citations |
| `knowledge_gaps` | Unanswered questions | normalized question, count, status |
| `skills` / `role_skills` | Skill requirements | required_level 1-4 |
| `audit_log` | Writes | actor, action, entity, detail |

## SOP state machine

```
draft --generate--> generated --submit--> in_review --approve--> published
                                                            \--> rejected (back to draft)
published --archive--> archived
```

Rules:

- Only `published` content is retrievable by operators.
- `approve` increments `current_version` and sets `approved_by` / `approved_at`.
- Published versions are immutable. A correction creates a new version.
- A translation can exist only under a version, never on the header.

## Invariants

1. No operator-facing answer without a `published` version.
2. Every covered answer carries at least one citation (sop id, version, step).
3. Every gap is deduplicated by `(organization_id, normalised_question)`.
4. Every approval is attributable to a person.
5. Role skill levels are 1-4 and never attached to an individual's score in the
   MVP.

## Retrieval

- Chunk size: 600-900 characters with 100-character overlap.
- Embedding: 384 dimensions (`gte-small`, Supabase Edge Function, free).
- Index: HNSW with cosine distance.
- Filter: `organization_id` always; `sops.status = 'published'` always.

## Why no attrition data

Area 8's predictive half needs individual HR records. That raises fairness and
privacy risk, the evidence is medium, and it is not needed to demonstrate the
capability loop. Gaps come from questions, not from people's files.
