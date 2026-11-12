-- WhatsApp channel: conversation log, stock and sales captured by chat.

create table if not exists whatsapp_messages (
  id text primary key,
  org_id uuid not null references organisations(id) on delete cascade,
  direction text not null check (direction in ('in', 'out')),
  from_number text not null,
  body text not null,
  intent text not null default 'text',
  created_at timestamptz not null default now()
);

create index if not exists whatsapp_messages_org_idx
  on whatsapp_messages (org_id, created_at desc);

create table if not exists stock_items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organisations(id) on delete cascade,
  name text not null,
  quantity numeric(12, 2) not null default 0,
  unit text not null default 'unit',
  unit_price numeric(12, 2) not null default 0,
  reorder_level numeric(12, 2) not null default 5,
  updated_at timestamptz not null default now(),
  unique (org_id, name)
);

create table if not exists sales (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organisations(id) on delete cascade,
  item text not null,
  quantity numeric(12, 2) not null,
  unit_price numeric(12, 2) not null,
  total numeric(14, 2) not null,
  channel text not null default 'whatsapp',
  sold_at timestamptz not null default now()
);

create index if not exists sales_org_date_idx on sales (org_id, sold_at desc);

alter table whatsapp_messages enable row level security;
alter table stock_items enable row level security;
alter table sales enable row level security;

drop policy if exists demo_org_all on whatsapp_messages;
create policy demo_org_all on whatsapp_messages for all
  using (org_id = '00000000-0000-0000-0000-000000000001')
  with check (org_id = '00000000-0000-0000-0000-000000000001');

drop policy if exists demo_org_all on stock_items;
create policy demo_org_all on stock_items for all
  using (org_id = '00000000-0000-0000-0000-000000000001')
  with check (org_id = '00000000-0000-0000-0000-000000000001');

drop policy if exists demo_org_all on sales;
create policy demo_org_all on sales for all
  using (org_id = '00000000-0000-0000-0000-000000000001')
  with check (org_id = '00000000-0000-0000-0000-000000000001');

insert into stock_items (org_id, name, quantity, unit, unit_price, reorder_level)
values
  ('00000000-0000-0000-0000-000000000001', 'Copier paper', 12, 'ream', 250, 5),
  ('00000000-0000-0000-0000-000000000001', 'Coffee 1kg', 4, 'bag', 780, 6),
  ('00000000-0000-0000-0000-000000000001', 'Packaging tape', 3, 'roll', 95, 10),
  ('00000000-0000-0000-0000-000000000001', 'Printer ink', 2, 'cartridge', 1450, 4),
  ('00000000-0000-0000-0000-000000000001', 'A4 envelopes', 40, 'unit', 3, 20)
on conflict (org_id, name) do nothing;
