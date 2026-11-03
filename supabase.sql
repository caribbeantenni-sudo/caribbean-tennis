-- =====================================================================
-- Caribbean Tennis · base de datos (pegar completo en Supabase → SQL Editor → Run)
-- Se puede correr más de una vez sin dañar datos.
-- =====================================================================

-- ¿Quién es organizador? (cuenta creada en Authentication → Users)
create or replace function public.es_organizador()
returns boolean language sql stable as $$
  select coalesce(lower(auth.jwt() ->> 'email'), '') = 'caribbean.tenni@gmail.com'
$$;
grant execute on function public.es_organizador() to anon, authenticated;

-- ---------- datos del circuito (resultados, jugadores, ediciones) ----------
create table if not exists public.kv (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.kv enable row level security;
revoke all on public.kv from anon, authenticated;
grant select on public.kv to anon, authenticated;
grant insert, update, delete on public.kv to authenticated;
drop policy if exists kv_leer on public.kv;
create policy kv_leer on public.kv for select to anon, authenticated using (true);
drop policy if exists kv_insertar on public.kv;
create policy kv_insertar on public.kv for insert to authenticated with check (public.es_organizador());
drop policy if exists kv_editar on public.kv;
create policy kv_editar on public.kv for update to authenticated using (public.es_organizador()) with check (public.es_organizador());
drop policy if exists kv_borrar on public.kv;
create policy kv_borrar on public.kv for delete to authenticated using (public.es_organizador());

-- ---------- configuración de inscripciones por edición ----------
create table if not exists public.inscripcion_config (
  edicion  int primary key,
  cupo     int not null default 48 check (cupo >= 0),
  abiertas boolean not null default true
);
insert into public.inscripcion_config (edicion, cupo, abiertas) values (3, 48, true)
  on conflict (edicion) do nothing;
alter table public.inscripcion_config enable row level security;
revoke all on public.inscripcion_config from anon, authenticated;
grant select on public.inscripcion_config to anon, authenticated;
grant insert, update on public.inscripcion_config to authenticated;
drop policy if exists cfg_leer on public.inscripcion_config;
create policy cfg_leer on public.inscripcion_config for select to anon, authenticated using (true);
drop policy if exists cfg_insertar on public.inscripcion_config;
create policy cfg_insertar on public.inscripcion_config for insert to authenticated with check (public.es_organizador());
drop policy if exists cfg_editar on public.inscripcion_config;
create policy cfg_editar on public.inscripcion_config for update to authenticated using (public.es_organizador()) with check (public.es_organizador());

-- ---------- inscripciones (datos privados: solo el organizador los lee) ----------
create table if not exists public.inscripciones (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  edicion    int not null default 3,
  nombre     text not null check (char_length(nombre) between 3 and 80),
  correo     text not null check (char_length(correo) <= 120 and correo ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  telefono   text not null check (telefono ~ '^[0-9+ ()-]{7,20}$'),
  edad       int  not null check (edad between 8 and 99),
  categoria  text not null check (categoria in ('3ra', '4ta')),
  pagado     boolean not null default false
);
create unique index if not exists inscripciones_un_correo_por_edicion
  on public.inscripciones (edicion, lower(correo));

alter table public.inscripciones enable row level security;
revoke all on public.inscripciones from anon, authenticated;
grant insert on public.inscripciones to anon, authenticated;
grant select, update, delete on public.inscripciones to authenticated;
drop policy if exists ins_inscribirse on public.inscripciones;
create policy ins_inscribirse on public.inscripciones for insert to anon, authenticated with check (true);
drop policy if exists ins_ver on public.inscripciones;
create policy ins_ver on public.inscripciones for select to authenticated using (public.es_organizador());
drop policy if exists ins_editar on public.inscripciones;
create policy ins_editar on public.inscripciones for update to authenticated using (public.es_organizador()) with check (public.es_organizador());
drop policy if exists ins_borrar on public.inscripciones;
create policy ins_borrar on public.inscripciones for delete to authenticated using (public.es_organizador());

-- Antes de guardar una inscripción: revisa que estén abiertas y que haya cupo.
create or replace function public.inscripcion_antes()
returns trigger language plpgsql security definer set search_path = public as $$
declare cfg record; n int;
begin
  if public.es_organizador() then return new; end if;
  new.pagado := false;
  new.created_at := now();
  select * into cfg from public.inscripcion_config where edicion = new.edicion;
  if cfg is null or not cfg.abiertas then raise exception 'inscripciones_cerradas'; end if;
  perform pg_advisory_xact_lock(hashtext('ins' || new.edicion || new.categoria));
  select count(*) into n from public.inscripciones where edicion = new.edicion and categoria = new.categoria;
  if n >= cfg.cupo then raise exception 'cupo_lleno'; end if;
  return new;
end $$;
drop trigger if exists inscripcion_antes on public.inscripciones;
create trigger inscripcion_antes before insert on public.inscripciones
  for each row execute function public.inscripcion_antes();

-- Para la página pública: solo dice si cada categoría está llena (no muestra cuántos van).
create or replace function public.categorias_llenas(ed int)
returns table (categoria text, llena boolean)
language sql stable security definer set search_path = public as $$
  select c.cat,
         (select count(*) from public.inscripciones i where i.edicion = ed and i.categoria = c.cat)
           >= coalesce((select cupo from public.inscripcion_config where edicion = ed), 48)
  from (values ('3ra'), ('4ta')) as c(cat)
$$;
revoke all on function public.categorias_llenas(int) from public;
grant execute on function public.categorias_llenas(int) to anon, authenticated;
revoke all on function public.inscripcion_antes() from public, anon, authenticated;
