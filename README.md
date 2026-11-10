# Retenou AI

Multilingual shop-floor capability for Mauritian manufacturing, built for the
**NPCC National AI Startups Lab**.

Retenou AI captures an expert's know-how once, publishes supervisor-approved work
instructions in **English, French and Kreol**, and turns the questions operators
cannot answer into a live skills-gap map. The interface follows the Delphi
pattern: a discover surface, a knowledge surface, conversations and a profile,
with answers grounded in approved sources.

On top of the line assistant, the app ships a **Delphi-style library of minds**:
global industry thinkers (Goldratt, Deming, Ohno, Hau Lee, Andrew Ng) and
Mauritian industry voices (Arnaud Lagesse / IBL, Jean-Pierre Dalais / CIEL,
Hector Espitalier-Noël / ENL, plus composite textile and food practitioners).
Each mind has curated knowledge cards, citations and sample questions. FR and
Kreol are translated **live at request time** with the LLM, a curated
translation memory, or a glossary fallback, and every machine translation is
flagged for review.

> **Status:** working scaffold. The API serves synthetic data from an in-memory
> store; Supabase + pgvector and the OpenCode Go client are wired for the next
> milestone. Nothing is published without a named supervisor. Public-record
> expert profiles are built from public material and are not endorsed by the
> named people; composite profiles are fictional and labelled.

## The problem

Mauritian manufacturers are adopting technology faster than they can build the
people who run it. The HRDC reports behind the NPCC brief describe the same
pattern in textile, food and light engineering: a weak middle layer of
supervisors, technicians and maintenance staff; expert know-how that leaves with
the expert; and expatriate operators who do not read the instruction that exists
on paper.

## How it works

```
capture -> ground -> draft -> translate -> approve -> ask -> gaps -> capture
```

1. **Capture** - a supervisor records a 10-minute voice note or uploads an
   existing SOP and fault-code list.
2. **Ground** - sources are chunked and embedded so every answer cites the
   approved paragraph it came from.
3. **Draft and translate** - the draft is generated in English, French and
   Kreol, then edited by the supervisor.
4. **Approve** - nothing reaches an operator until a named supervisor signs off;
   published versions are immutable.
5. **Learn** - questions the knowledge base cannot answer become skills gaps,
   not confident guesses.

## Repository layout

```
.
├── apps/
│   ├── api/                  FastAPI service (Python 3.11+)
│   └── web/                  Next.js 16, TypeScript, Tailwind 4
├── api-spec/                 Generated OpenAPI spec
├── data/
│   ├── samples/              Synthetic packs: textile, food, light engineering
│   └── raw/                  Real data, git-ignored
├── docs/                     PRD, evidence, data model, API, UI, plan
├── supabase/migrations/      Postgres + pgvector schema (free tier)
├── .env.example
└── package.json              npm workspace root
```

## Quickstart

### 1. Environment

```powershell
Copy-Item .env.example .env    # macOS/Linux: cp .env.example .env
```

Only `OPENCODE_GO_API_KEY` is needed to call a model. Get a key from
<https://opencode.ai/console>. Supabase is optional for local work.

### 2. API

```powershell
cd apps/api
python -m venv .venv
.\.venv\Scripts\Activate.ps1    # macOS/Linux: source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload
```

- Health: <http://127.0.0.1:8000/health>
- Docs: <http://127.0.0.1:8000/docs>

If port 8000 is already taken on your machine, run the API on 8010 and set
`NEXT_PUBLIC_API_URL=http://localhost:8010` in `apps/web/.env.local`:

```powershell
uvicorn app.main:app --reload --port 8010
```

### 3. Web

In a second terminal, from the repository root:

```powershell
npm install
npm run dev
```

Open <http://localhost:3000>.

### 4. Checks

```powershell
# API, from apps/api with the venv active
ruff check .
pytest

# Web, from the repository root
npm run lint
npm run typecheck
npm run build
```

### 5. OpenAPI

```powershell
cd apps/api
python -m app.scripts.export_openapi
```

## Stack (free or already included)

| Need | Choice | Cost |
| --- | --- | --- |
| Chat model | OpenCode Go, `deepseek-v4.1-flash` | Included in the Go plan |
| Free model option | `beam-free`, `longcat-2.5-free` | Free while available |
| Database | Supabase Postgres + pgvector | Free tier |
| Embeddings | Supabase Edge `gte-small` | Free |
| Voice input | Browser Web Speech API | Free, on device |
| Web hosting | Vercel Hobby | Free |
| CI | GitHub Actions | Free for public repos |

See `docs/09-free-stack.md`. No other API keys are required.

## API overview

All product routes live under `/api/v1`.

| Area | Endpoints |
| --- | --- |
| Meta | `GET /`, `GET /health` |
| Sources | `GET`, `POST /sources`; `DELETE /sources/{id}` |
| Query | `POST /query` |
| SOPs | `GET`, `POST /sops`; `GET /sops/{id}` |
| Lifecycle | `POST /sops/{id}/generate`, `/translate`, `/submit`, `/approve` |
| Gaps | `GET /gaps`; `POST /gaps/{id}/promote` |
| Skills | `GET /skills/roles`, `/skills/roles/{id}` |
| Analytics | `GET /analytics/summary` |
| Experts | `GET /experts`, `/experts/{id}`; `POST /experts/{id}/chat` |
| Translation | `POST /translate` (EN → FR / Kreol, cached) |

## Expert minds

| Mind | Base | Sector focus |
| --- | --- | --- |
| Arnaud Lagesse | IBL Group (public record) | Conglomerate, logistics, regional expansion |
| Jean-Pierre Dalais | CIEL Group (public record) | Diversification, textile, healthcare |
| Hector Espitalier-Noël | ENL Group (public record) | Sugar transition, property, food quality |
| Textile Operations Veteran | Composite | Overlock faults, changeovers, multilingual training |
| Food Quality Lead | Composite | HACCP, batch records, traceability |
| Eliyahu M. Goldratt | Theory of Constraints | Bottlenecks and throughput |
| W. Edwards Deming | Deming Institute | Variation and quality systems |
| Taiichi Ohno | Toyota Production System | Waste, standard work, kaizen |
| Hau L. Lee | Stanford GSB | Supply chains, bullwhip effect |
| Andrew Ng | DeepLearning.AI | Applied AI adoption |

Public-record profiles are built only from public material and are not authored
or endorsed by the person. Claim a mind to correct or remove it.

## Documentation

| File | Contents |
| --- | --- |
| `docs/00-product/prd.md` | Product requirements |
| `docs/00-product/personas-and-jtbd.md` | Users and jobs to be done |
| `docs/00-product/metrics.md` | Product, safety and business metrics |
| `docs/01-use-case-choice.md` | Why area 9 + part of area 8 |
| `docs/02-evidence-map.md` | HRDC findings mapped to features |
| `docs/03-interview-guide.md` | Stage 1 interview guide |
| `docs/04-architecture.md` | Architecture and Delphi mapping |
| `docs/05-data-model.md` | Entities, states and invariants |
| `docs/06-api-spec.md` | Endpoint reference |
| `docs/07-ui-wireframes.md` | Screens and states |
| `docs/08-project-plan-and-risks.md` | Milestones and risk register |
| `docs/09-free-stack.md` | Free-tier architecture |

## Success metrics

| Metric | Target |
| --- | --- |
| Questions answered from approved content | > 80% |
| Unsafe or uncited answers | 0 |
| Supervisor coaching hours saved per week | to measure in interviews |
| Languages per published instruction | EN / FR / Kreol |

## Data policy

Only synthetic sample data is committed. Raw company data belongs in
`data/raw/`, which is git-ignored. Real data stays in Supabase with access
control, and is deleted on request.

## License

No license. All rights reserved.
