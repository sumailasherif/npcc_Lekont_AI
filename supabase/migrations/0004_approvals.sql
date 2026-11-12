-- Human-in-the-loop approvals for WhatsApp actions.

create table if not exists approvals (
  id text primary key,
  org_id uuid not null references organisations(id) on delete cascade,
  kind text not null check (kind in ('invoice', 'notebook', 'sale')),
  summary text not null,
  amount numeric(14, 2) not null default 0,
  currency text not null default 'MUR',
  requested_by text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  reviewer text,
  comment text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create index if not exists approvals_org_status_idx
  on approvals (org_id, status, created_at desc);

alter table approvals enable row level security;

drop policy if exists demo_org_all on approvals;
create policy demo_org_all on approvals for all
  using (org_id = '00000000-0000-0000-0000-000000000001')
  with check (org_id = '00000000-0000-0000-0000-000000000001');
