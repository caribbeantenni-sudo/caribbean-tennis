-- =====================================================================
-- Caribbean Tennis · resultados en vivo (Supabase Realtime)
-- Pegar en Supabase → SQL Editor → Run. Se puede correr más de una vez.
-- =====================================================================
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'kv'
  ) then
    alter publication supabase_realtime add table public.kv;
  end if;
end $$;
