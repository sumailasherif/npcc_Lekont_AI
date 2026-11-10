-- Retenou AI - initial schema for Supabase (free tier).
-- Postgres + pgvector. Run with `supabase db push` or paste into the SQL editor.

create extension if not exists "vector";
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tenancy and people
-- ---------------------------------------------------------------------------

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sector text not null check (sector in ('textile', 'food', 'light_engineering')),
  created_at timestamptz not null default now()
);

create table if not exists sites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  code text not null,
  name text not null,
  headcount int not null default 0,
  unique (organization_id, code)
);

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  organization_id uuid references organizations (id) on delete set null,
  full_name text,
  role text not null default 'operator' check (role in ('operator', 'supervisor', 'admin')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Knowledge
-- ---------------------------------------------------------------------------

create table if not exists knowledge_sources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  title text not null,
  kind text not null check (kind in ('pdf', 'docx', 'audio', 'video', 'url', 'text')),
  sector text not null check (sector in ('textile', 'food', 'light_engineering')),
  language text not null default 'en',
  storage_path text,
  status text not null default 'uploaded' check (status in ('uploaded', 'ingesting', 'ready', 'failed')),
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists document_chunks (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references knowledge_sources (id) on delete cascade,
  organization_id uuid not null references organizations (id) on delete cascade,
  chunk_index int not null,
  content text not null,
  -- gte-small (Supabase Edge Function) produces 384 dimensions.
  embedding vector(384),
  created_at timestamptz not null default now(),
  unique (source_id, chunk_index)
);

create index if not exists document_chunks_embedding_idx
  on document_chunks using hnsw (embedding vector_cosine_ops);

-- ---------------------------------------------------------------------------
-- Work instructions
-- ---------------------------------------------------------------------------

create table if not exists sops (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  role_id uuid references roles (id) on delete set null,
  machine_id text,
  status text not null default 'draft'
    check (status in ('draft', 'generated', 'in_review', 'approved', 'published', 'archived')),
  current_version int not null default 0,
  approved_by uuid references profiles (id),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sop_versions (
  id uuid primary key default gen_random_uuid(),
  sop_id uuid not null references sops (id) on delete cascade,
  version int not null,
  title_en text not null,
  created_at timestamptz not null default now(),
  unique (sop_id, version)
);

create table if not exists sop_translations (
  id uuid primary key default gen_random_uuid(),
  sop_version_id uuid not null references sop_versions (id) on delete cascade,
  language text not null check (language in ('en', 'fr', 'cr')),
  title text not null,
  unique (sop_version_id, language)
);

create table if not exists sop_steps (
  id uuid primary key default gen_random_uuid(),
  sop_translation_id uuid not null references sop_translations (id) on delete cascade,
  step_order int not null,
  text text not null,
  risk text not null default 'low' check (risk in ('low', 'medium', 'high')),
  unique (sop_translation_id, step_order)
);

create table if not exists review_log (
  id uuid primary key default gen_random_uuid(),
  sop_id uuid not null references sops (id) on delete cascade,
  version int not null,
  reviewer_id uuid references profiles (id),
  decision text not null check (decision in ('submitted', 'approved', 'rejected')),
  comment text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Conversations, gaps, skills, audit
-- ---------------------------------------------------------------------------

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  user_id uuid references profiles (id),
  role_id uuid references roles (id),
  language text not null default 'en' check (language in ('en', 'fr', 'cr')),
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations (id) on delete cascade,
  sender text not null check (sender in ('operator', 'assistant')),
  content text not null,
  covered boolean,
  confidence numeric(3, 2),
  citations jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists knowledge_gaps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  question text not null,
  normalised_question text not null,
  language text not null default 'en' check (language in ('en', 'fr', 'cr')),
  role_id uuid references roles (id),
  count int not null default 1,
  status text not null default 'open' check (status in ('open', 'promoted', 'dismissed')),
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  unique (organization_id, normalised_question)
);

create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  unique (organization_id, name)
);

create table if not exists role_skills (
  role_id uuid not null references roles (id) on delete cascade,
  skill_id uuid not null references skills (id) on delete cascade,
  required_level int not null check (required_level between 1 and 4),
  primary key (role_id, skill_id)
);

create table if not exists audit_log (
  id bigint generated always as identity primary key,
  organization_id uuid references organizations (id) on delete cascade,
  actor_id uuid references profiles (id),
  action text not null,
  entity text not null,
  entity_id text,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Retrieval
-- ---------------------------------------------------------------------------

create or replace function match_chunks(
  query_embedding vector(384),
  match_organization uuid,
  match_count int default 5
)
returns table (
  chunk_id uuid,
  source_id uuid,
  content text,
  similarity float
)
language sql stable
as $$
  select
    dc.id as chunk_id,
    dc.source_id,
    dc.content,
    1 - (dc.embedding <=> query_embedding) as similarity
  from document_chunks dc
  where dc.organization_id = match_organization
    and dc.embedding is not null
  order by dc.embedding <=> query_embedding
  limit match_count;
$$;

-- ---------------------------------------------------------------------------
-- Row level security (enable before a pilot)
-- ---------------------------------------------------------------------------

-- alter table sops enable row level security;
-- create policy "members read own org" on sops for select
--   using (organization_id = (select organization_id from profiles where id = auth.uid()));
-- Add equivalent policies for every tenant table before exposing the API.
