-- Create table for PPh21 Monthly Summary
create table if not exists public.pph21_monthly_summary (
  employeeid text primary key,
  npwp text,
  nama text not null,
  kode_objek_pajak text,
  ptkp text,
  penghasilan_bruto numeric,
  tarif numeric,
  pph21 numeric,
  keterangan text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Row Level Security
alter table public.pph21_monthly_summary enable row level security;

-- Allow read for authenticated roles (adjust to your org policy)
do $$ begin
  if not exists (
    select 1 from pg_policies where polname = 'pph21_monthly_summary_select_auth'
  ) then
    create policy pph21_monthly_summary_select_auth on public.pph21_monthly_summary
      for select to authenticated using (true);
  end if;
end $$;

-- Allow insert/update/delete for finance role (assuming JWT claim or custom setup)
-- If you use Supabase's built-in 'role' in profiles, you may instead manage via Edge Functions
-- Here we keep it permissive for authenticated for demo; tighten as needed.
do $$ begin
  if not exists (
    select 1 from pg_policies where polname = 'pph21_monthly_summary_modify_auth'
  ) then
    create policy pph21_monthly_summary_modify_auth on public.pph21_monthly_summary
      for all to authenticated using (true) with check (true);
  end if;
end $$;

-- Update trigger to maintain updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_pph21_monthly_summary_updated_at on public.pph21_monthly_summary;
create trigger set_pph21_monthly_summary_updated_at
before update on public.pph21_monthly_summary
for each row execute function public.set_updated_at();

