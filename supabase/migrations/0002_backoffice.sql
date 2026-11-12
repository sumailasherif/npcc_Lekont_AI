-- Lekont back office: documents, extracted fields, ledger, readiness.
-- Run in Supabase SQL editor or `supabase db push`.

create extension if not exists "pgcrypto";

create table if not exists organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

insert into organisations (id, name)
values ('00000000-0000-0000-0000-000000000001', 'Lekont Demo SME')
on conflict (id) do nothing;

create table if not exists documents (
  id text primary key,
  org_id uuid not null references organisations(id) on delete cascade,
  filename text not null,
  doc_type text not null check (doc_type in ('invoice', 'payslip', 'contract')),
  language text not null default 'en' check (language in ('en', 'fr')),
  supplier text,
  total numeric(14, 2),
  currency text not null default 'MUR',
  status text not null default 'needs_review'
    check (status in ('needs_review', 'approved', 'exported')),
  confidence numeric(4, 2) not null default 0,
  reviewer text,
  reviewed_at timestamptz,
  uploaded_at timestamptz not null default now(),
  text_content text not null
);

create table if not exists document_fields (
  doc_id text not null references documents(id) on delete cascade,
  key text not null,
  label text not null,
  value text not null,
  confidence numeric(4, 2) not null default 0,
  page integer not null default 1,
  corrected boolean not null default false,
  primary key (doc_id, key)
);

create table if not exists ledger_entries (
  id bigserial primary key,
  org_id uuid not null references organisations(id) on delete cascade,
  entry_date date not null,
  month text not null,
  supplier text not null,
  category text not null,
  amount numeric(14, 2) not null,
  vat numeric(14, 2) not null default 0,
  doc_id text references documents(id) on delete set null
);

create index if not exists ledger_entries_month_idx on ledger_entries (org_id, month);
create index if not exists ledger_entries_supplier_idx on ledger_entries (org_id, supplier);

create table if not exists readiness_assessments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organisations(id) on delete cascade,
  sector text not null,
  employees integer not null,
  monthly_invoices integer not null,
  monthly_payslips integer not null,
  admin_hours integer not null,
  tools jsonb not null default '[]'::jsonb,
  pain_points jsonb not null default '[]'::jsonb,
  readiness_score integer not null,
  recommended_first text not null,
  created_at timestamptz not null default now()
);

alter table organisations enable row level security;
alter table documents enable row level security;
alter table document_fields enable row level security;
alter table ledger_entries enable row level security;
alter table readiness_assessments enable row level security;

-- Demo policy: one tenant. Replace with auth.uid() / org membership before a pilot.
drop policy if exists demo_org_read on documents;
create policy demo_org_read on documents for select
  using (org_id = '00000000-0000-0000-0000-000000000001');

drop policy if exists demo_org_write on documents;
create policy demo_org_write on documents for all
  using (org_id = '00000000-0000-0000-0000-000000000001')
  with check (org_id = '00000000-0000-0000-0000-000000000001');

drop policy if exists demo_org_read on document_fields;
create policy demo_org_read on document_fields for select
  using (exists (
    select 1 from documents d
    where d.id = document_fields.doc_id
      and d.org_id = '00000000-0000-0000-0000-000000000001'
  ));

drop policy if exists demo_org_read on ledger_entries;
create policy demo_org_read on ledger_entries for select
  using (org_id = '00000000-0000-0000-0000-000000000001');

drop policy if exists demo_org_write on ledger_entries;
create policy demo_org_write on ledger_entries for all
  using (org_id = '00000000-0000-0000-0000-000000000001')
  with check (org_id = '00000000-0000-0000-0000-000000000001');

drop policy if exists demo_org_read on readiness_assessments;
create policy demo_org_read on readiness_assessments for select
  using (org_id = '00000000-0000-0000-0000-000000000001');

drop policy if exists demo_org_write on readiness_assessments;
create policy demo_org_write on readiness_assessments for all
  using (org_id = '00000000-0000-0000-0000-000000000001')
  with check (org_id = '00000000-0000-0000-0000-000000000001');
