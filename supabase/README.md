# Supabase / Postgres setup

Lekont runs on synthetic in-memory data out of the box. Point it at Supabase and
it loads documents and the ledger from Postgres instead.

## 1. Create the schema

In the Supabase SQL editor, run:

1. `migrations/0002_backoffice.sql`

The legacy `migrations/0001_init.sql` is kept for history; the back-office
migration is the one this product uses.

## 2. Load the demo data

Run, in order:

1. `seed/0001_documents.sql` — 6 synthetic documents and their fields
2. `seed/0002_ledger_100.sql` — exactly 100 synthetic ledger entries

Both are safe to re-run (`on conflict do nothing`).

## 3. Connect the API

Copy the connection string from **Project Settings → Database → Connection
string** (use the pooler for serverless, session mode for local scripts):

```env
DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
```

Restart the API. It loads Postgres at import; if the connection or tables are
missing it falls back to the in-memory demo and logs a warning.

## 4. Tenancy and RLS

The demo uses one tenant:

```
00000000-0000-0000-0000-000000000001
```

RLS is enabled on every table with policies restricted to that organisation.
Before a pilot, replace the demo policies with membership checks
(`auth.uid()` → `organisation_members`) and add per-tenant storage buckets.

## 5. Verify

```sql
select count(*) from ledger_entries;   -- 100
select count(*) from documents;        -- 6
select status, count(*) from documents group by status;
```

## 6. Reset the demo

```sql
truncate table document_fields, ledger_entries, documents, readiness_assessments cascade;
```

Then re-run the two seed files.
