# Project plan and risk register

## Milestones

| ID | Milestone | Output | Exit criteria |
| --- | --- | --- | --- |
| M0 | Scaffold | Monorepo, docs, synthetic packs, CI | `npm run build`, `pytest` and CI pass |
| M1 | Interviews | 5-8 anonymised interview notes, revised problem statement | At least two supervisors confirm the repeated-question problem |
| M2 | Retrieval | Supabase schema, ingestion, chunk search | 20-question eval set, covered answers cite the right step |
| M3 | Authoring | Voice capture, draft generation, translation, approval | A supervisor can take a voice note to a published 3-language card |
| M4 | Operator flow | Mobile-first ask surface, gap logging | An operator can ask in Kreol and either get a cited answer or a clear refusal |
| M5 | Demo hardening | Seeded 3 sector packs, scripted demo, eval report | 10-minute demo runs end to end twice without manual fixes |

## Workstreams and owners

| Workstream | Owner | Support |
| --- | --- | --- |
| Product and evidence | Sherif | interviews, PRD |
| API and retrieval | TBD | FastAPI, Supabase |
| Web and design | TBD | Next.js, Delphi-style UI |
| Data packs | TBD | textile, food, light engineering |
| Demo and pitch | TBD | script, metrics |

## Risk register

| # | Risk | L | I | Mitigation | Owner |
| --- | --- | --- | --- | --- | --- |
| R1 | Wrong or unsafe instruction reaches an operator | M | H | Approval gate, versioning, citations, refusal path, high-risk steps flagged | Product |
| R2 | Kreol translation is poor or inconsistent | H | M | Supervisor edit, site glossary, low-confidence flag, human review | Data |
| R3 | No factory access for interviews or pilot | M | H | Synthetic packs, alumni/HRDC introductions, two interviews minimum | Product |
| R4 | Sensitive company data leaks | L | H | Synthetic data only in the repo, Supabase RLS, no raw data in git | API |
| R5 | Model provider outage or cost | M | M | OpenCode Go fallback model, free model option, timeout and refusal | API |
| R6 | Scope creep (attrition, IoT, HRIS) | H | M | Out-of-scope list is binding; changes need a written decision | Product |
| R7 | Demo fails live | M | H | Seeded data, local fallback, recorded backup, run twice | Demo |
| R8 | Judge sees a generic chatbot | M | H | Lead with the approval gate, citations, gaps and multilingual evidence | Pitch |
| R9 | Low operator adoption | M | M | Phone-first, three languages, supervisor sign-off, no new hardware | Product |
| R10 | Unclear data ownership blocks pilot | M | M | Written data agreement, per-tenant isolation, deletion on request | Product |

L = likelihood, I = impact.

## Responsible-AI checklist

- [ ] Human approval before any instruction is published.
- [ ] Every answer cites an approved version.
- [ ] Explicit refusal when the knowledge base does not cover the question.
- [ ] No individual performance scoring.
- [ ] Only synthetic data in the repository.
- [ ] Tenant isolation and row-level security before a pilot.
- [ ] Audit trail for submissions and approvals.
- [ ] Clear disclaimer shown with every answer.

## Weekly cadence

- Monday: evidence and interviews.
- Wednesday: build and eval run.
- Friday: demo rehearsal and decision log.
