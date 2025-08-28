-- Create table for Withholding Tax Slip Master Data
create table if not exists public.withholding_tax_slip (
  employeeid text primary key,
  npwp text,
  nama text not null,
  nomor_faktur text,
  tanggal_faktur date,
  masa_ppn text,
  tahun_ppn text,
  status_faktur text,
  dpp numeric,
  ppn numeric,
  ppnbm numeric,
  keterangan text,
  pph_persen numeric,
  bukti_potong text,
  no_bukti_potong text,
  nilai_bukti_potong numeric,
  masa_pajak text,
  tahun_pajak text,
  keterangan_bukti_potong text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS
alter table public.withholding_tax_slip enable row level security;

-- Policies: select + modify for authenticated (adjust to org policy)
do $$ begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'withholding_tax_slip'
      and policyname = 'withholding_tax_slip_select_auth'
  ) then
    create policy withholding_tax_slip_select_auth on public.withholding_tax_slip
      for select to authenticated using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'withholding_tax_slip'
      and policyname = 'withholding_tax_slip_modify_auth'
  ) then
    create policy withholding_tax_slip_modify_auth on public.withholding_tax_slip
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

drop trigger if exists set_withholding_tax_slip_updated_at on public.withholding_tax_slip;
create trigger set_withholding_tax_slip_updated_at
before update on public.withholding_tax_slip
for each row execute function public.set_updated_at();

