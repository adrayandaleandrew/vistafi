create table budget_goals (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  category       text not null check (category in ('income', 'expense', 'savings')),
  target_amount  numeric(12,2) not null check (target_amount > 0),
  created_at     timestamptz default now(),
  unique(user_id, category)
);

alter table budget_goals enable row level security;

create policy "Users can manage their own goals"
  on budget_goals for all
  using (auth.uid() = user_id);

create index on budget_goals(user_id);
