-- Create table for PPh Unifikasi Master Data
create table if not exists public.pph_unifikasi (
  employeeid text primary key,
  npwp text,
  nama text not null,
  nomor_bp text,
  tanggal date,
  jenis_pajak text,
  kode_objek_pajak text,
  dpp numeric,
  tarif numeric,
  pph numeric,
  kap_kjs text,
  objek_pajak text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS
alter table public.pph_unifikasi enable row level security;

-- Policies: select + modify for authenticated (adjust to org policy)
do $$ begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'pph_unifikasi'
      and policyname = 'pph_unifikasi_select_auth'
  ) then
    create policy pph_unifikasi_select_auth on public.pph_unifikasi
      for select to authenticated using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'pph_unifikasi'
      and policyname = 'pph_unifikasi_modify_auth'
  ) then
    create policy pph_unifikasi_modify_auth on public.pph_unifikasi
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

drop trigger if exists set_pph_unifikasi_updated_at on public.pph_unifikasi;
create trigger set_pph_unifikasi_updated_at
before update on public.pph_unifikasi
for each row execute function public.set_updated_at();

