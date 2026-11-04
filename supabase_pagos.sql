-- =====================================================================
-- Caribbean Tennis · pagos en línea con Wompi
-- Pegar completo en Supabase → SQL Editor → Run (después de supabase.sql).
-- Se puede correr más de una vez.
-- =====================================================================

alter table public.inscripciones add column if not exists referencia  text;
alter table public.inscripciones add column if not exists pago_estado text;
alter table public.inscripciones add column if not exists pago_id     text;
alter table public.inscripciones add column if not exists pago_metodo text;
alter table public.inscripciones add column if not exists pagado_at   timestamptz;

create unique index if not exists inscripciones_referencia_unica
  on public.inscripciones (referencia) where referencia is not null;

alter table public.inscripciones drop constraint if exists inscripciones_referencia_formato;
alter table public.inscripciones add constraint inscripciones_referencia_formato
  check (referencia is null or referencia ~ '^CT[0-9]-[0-9a-f]{20}$');

-- Quien se inscribe desde la página nunca puede marcarse como pagado:
-- eso solo lo hace Wompi (a través del servidor) o el organizador.
create or replace function public.inscripcion_antes()
returns trigger language plpgsql security definer set search_path = public as $$
declare cfg record; n int;
begin
  if public.es_organizador() then return new; end if;
  new.pagado := false;
  new.pago_estado := null;
  new.pago_id := null;
  new.pago_metodo := null;
  new.pagado_at := null;
  new.created_at := now();
  select * into cfg from public.inscripcion_config where edicion = new.edicion;
  if cfg is null or not cfg.abiertas then raise exception 'inscripciones_cerradas'; end if;
  perform pg_advisory_xact_lock(hashtext('ins' || new.edicion || new.categoria));
  select count(*) into n from public.inscripciones where edicion = new.edicion and categoria = new.categoria;
  if n >= cfg.cupo then raise exception 'cupo_lleno'; end if;
  return new;
end $$;
revoke all on function public.inscripcion_antes() from public, anon, authenticated;
