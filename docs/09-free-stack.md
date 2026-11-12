# Free stack

Everything in the demo can run at zero cost.

| Need | Choice | Limit / cost |
| --- | --- | --- |
| Web hosting | Vercel Hobby | Free for personal projects |
| API hosting | Local or Render free | Free tier sleeps; fine for demo |
| Database | Supabase Postgres | 500 MB, 2 projects free |
| Auth (pilot) | Supabase Auth | Free tier |
| Model | OpenCode Go, `deepseek-v4.1-flash` | Included in the Go plan |
| Free model fallback | `beam-free`, `longcat-2.5-free` | Free while available |
| CI | GitHub Actions | Free for public repos |
| Charts | Hand-rolled SVG | No dependency |
| Styling | Tailwind CSS 4 | Free |

## Why this stack

- **Supabase** gives Postgres, RLS and auth in one free project, so the pilot does
  not need separate infrastructure.
- **FastAPI** keeps extraction and aggregation server-side; the browser never
  sees the database or the key.
- **OpenCode Go** is OpenAI-compatible, so the same client works with any
  provider by changing `OPENCODE_GO_BASE_URL`.
- **No chart library**: the area chart, bars and sparklines are small SVG
  components. Less JavaScript, full control of motion.

## Cost model (per 1,000 documents)

| Item | Estimate |
| --- | --- |
| LLM extraction (only missing fields, ~700 tokens) | ~MUR 40–80 |
| Postgres storage | negligible |
| Hosting | free tier |
| **Total** | **< MUR 0.10 per document** |

## Environment

```env
OPENCODE_GO_API_KEY=
OPENCODE_GO_BASE_URL=https://opencode.ai/inference/go/openai/v1
LLM_MODEL=deepseek-v4.1-flash
DATABASE_URL=postgresql://...
```

Without the key, extraction falls back to regex and the app still runs. Without
`DATABASE_URL`, it uses the in-memory demo.

## Guardrails

- The LLM never sees more than the document text being extracted.
- No free-form SQL is executed.
- Requests time out at 60 seconds; failures fall back to regex.
- Only synthetic data is committed.
