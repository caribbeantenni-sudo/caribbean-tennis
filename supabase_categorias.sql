-- =====================================================================
-- Caribbean Tennis · 3ra Edición: categorías 4ta mujeres y 4ta hombres
-- Pegar completo en Supabase → SQL Editor → Run. Se puede correr más de una vez.
-- =====================================================================

-- Permitir las nuevas categorías (se dejan las viejas para no dañar inscripciones anteriores)
alter table public.inscripciones drop constraint if exists inscripciones_categoria_check;
alter table public.inscripciones add constraint inscripciones_categoria_check
  check (categoria in ('4ta-mujeres', '4ta-hombres', '3ra', '4ta'));

-- La página pública solo pregunta si cada categoría está llena
create or replace function public.categorias_llenas(ed int)
returns table (categoria text, llena boolean)
language sql stable security definer set search_path = public as $$
  select c.cat,
         (select count(*) from public.inscripciones i where i.edicion = ed and i.categoria = c.cat)
           >= coalesce((select cupo from public.inscripcion_config where edicion = ed), 48)
  from (values ('4ta-mujeres'), ('4ta-hombres')) as c(cat)
$$;
revoke all on function public.categorias_llenas(int) from public;
grant execute on function public.categorias_llenas(int) to anon, authenticated;
