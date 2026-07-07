-- FlexSlot V2 — historique des recommandations
-- Exécuter sur le même projet Supabase que GreenOps (après migration 004).

create table if not exists public.flexslot_recommendation_snapshots (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  trigger_type text not null default 'view'
    check (trigger_type in ('view', 'slot_created')),
  primary_action text
    check (
      primary_action is null
      or primary_action in ('consume', 'flex', 'defer')
    ),
  primary_label text,
  primary_score numeric,
  window_start timestamptz,
  window_end timestamptz,
  avg_carbon_gco2_kwh numeric,
  avg_renewable_pct numeric,
  plan jsonb not null,
  greenops_slot_id uuid references public.flex_slots (id) on delete set null
);

create index if not exists flexslot_rec_snapshots_created_at_idx
  on public.flexslot_recommendation_snapshots (created_at desc);

create index if not exists flexslot_rec_snapshots_window_start_idx
  on public.flexslot_recommendation_snapshots (window_start desc);

alter table public.flexslot_recommendation_snapshots enable row level security;

comment on table public.flexslot_recommendation_snapshots is
  'Historique FlexSlot — snapshots de recommandations GridPulse (écriture service role uniquement).';
