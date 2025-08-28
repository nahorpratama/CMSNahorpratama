-- Create table for PPh21 Calculation Master Data
create table if not exists public.pph21_calculation (
  employeeid text primary key,
  name text not null,
  gender text,
  occupation text,
  alamat text,
  npwp text,
  marital_status text,
  kategori_ter text,
  salary numeric,
  bpjs_tk_company numeric,
  bpjs_kesehatan_company numeric,
  bpjs_tk_personal numeric,
  bpjs_kesehatan_personal numeric,
  tunjangan_lapangan numeric,
  tunjangan_kendaraan numeric,
  tunjangan_transportasi numeric,
  tunjangan_kehadiran_ho numeric,
  tunjangan_kehadiran_proyek numeric,
  lain_lain numeric,
  kasbon numeric,
  absen numeric,
  take_home numeric,
  tunjangan_pph21 numeric,
  objek_pajak text,
  tarif_ter numeric,
  pph_masa numeric,
  pph21_npwp numeric,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS
alter table public.pph21_calculation enable row level security;

-- Policies: select + modify for authenticated (adjust to org policy)
do $$ begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'pph21_calculation'
      and policyname = 'pph21_calculation_select_auth'
  ) then
    create policy pph21_calculation_select_auth on public.pph21_calculation
      for select to authenticated using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'pph21_calculation'
      and policyname = 'pph21_calculation_modify_auth'
  ) then
    create policy pph21_calculation_modify_auth on public.pph21_calculation
      for all to authenticated using (true) with check (true);
  end if;
end $$;

-- Update trigger for updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_pph21_calculation_updated_at on public.pph21_calculation;
create trigger set_pph21_calculation_updated_at
before update on public.pph21_calculation
for each row execute function public.set_updated_at();

