# Free stack

Everything the project needs is free or included in an existing plan. No card
required for the database, hosting or CI.

| Need | Choice | Cost | Notes |
| --- | --- | --- | --- |
| Chat model | OpenCode Go | Included in the Go plan | Endpoint `https://opencode.ai/inference/go/openai/v1`, OpenAI-compatible |
| Default model | `deepseek-v4.1-flash` | Included in Go | Set `LLM_MODEL` to change |
| Zero-cost models | `beam-free`, `longcat-2.5-free`, `iceman-contributor-free` | Free while available | Good for demos and load tests |
| Database | Supabase free tier | Free | Postgres + pgvector + auth + storage |
| Embeddings | Supabase Edge Function `gte-small` | Free | 384 dimensions; no external embedding bill |
| Local embeddings (optional) | `fastembed` | Free | Runs on CPU, no API |
| Voice input | Browser Web Speech API / MediaRecorder | Free | On-device; no paid ASR |
| Web hosting | Vercel Hobby | Free | Next.js |
| API hosting | Local, or a free container host | Free | For the demo, local is fine |
| CI | GitHub Actions | Free for public repos | Lint, typecheck, build, tests |
| Repo | GitHub | Free | Public repository |

## OpenCode Go

- One provider only: OpenCode Go. Do not add OpenAI, Anthropic or other keys.
- Copy the key from <https://opencode.ai/console> into `.env` as
  `OPENCODE_GO_API_KEY`.
- The API sends `User-Agent: retenou-ai/0.1` and, when available, an
  `x-opencode-session` header, per the Go usage guidance.
- Free models are the default fallback if the Go allowance is exhausted.

## Supabase

1. Create a free project.
2. Run `supabase/migrations/0001_init.sql` in the SQL editor (or `supabase db push`).
3. Copy the project URL and keys into `.env`.
4. Embeddings: deploy the `gte-small` edge function and store 384-dimension
   vectors in `document_chunks.embedding`.

The scaffold runs without Supabase: `app/store.py` keeps synthetic data in
memory so the demo works offline.

## If something must be paid

Do not add it. Instead:

- Use a free OpenCode Go model.
- Use synthetic data.
- Run the API locally during the demo.
- Ask the Lab for a mentor who can provide a free sandbox.
