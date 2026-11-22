-- Consentimiento por registro y acceso terapéutico separado:
--   * la emoción siempre alimenta el dashboard mientras exista vínculo activo;
--   * el contenido escrito solo se entrega cuando el paciente lo autoriza.

alter table public.diario
  add column if not exists compartir_con_profesional boolean not null default false;

-- La interfaz ya exige emoción. La base de datos también la hace obligatoria para
-- que ningún cliente alternativo pueda guardar un check-in incompleto.
update public.diario
set emocion = 'neutral'
where emocion is null or btrim(emocion::text) = '';

alter table public.diario
  alter column emocion set not null;

create or replace function public.emociones_paciente_vinculado(p_paciente_id uuid)
returns table (
  fecha date,
  emocion text
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Debes iniciar sesión';
  end if;
  if not exists (
    select 1
    from public.vinculaciones_paciente_profesional as v
    where v.paciente_id = p_paciente_id
      and v.profesional_id = auth.uid()
      and v.estado = 'activa'
  ) then
    raise exception 'No tienes un vínculo activo con este paciente';
  end if;

  return query
  select d.fecha::date, d.emocion::text
  from public.diario as d
  where d.user_id = p_paciente_id
  order by d.fecha desc;
end;
$$;

create or replace function public.diarios_compartidos_paciente(p_paciente_id uuid)
returns table (
  fecha date,
  emocion text,
  motivo text,
  cosas_buenas text,
  cosas_malas text,
  objetivo_cumplido text,
  areas_mejora text,
  plan_accion text
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Debes iniciar sesión';
  end if;
  if not exists (
    select 1
    from public.vinculaciones_paciente_profesional as v
    where v.paciente_id = p_paciente_id
      and v.profesional_id = auth.uid()
      and v.estado = 'activa'
  ) then
    raise exception 'No tienes un vínculo activo con este paciente';
  end if;

  return query
  select
    d.fecha::date,
    d.emocion::text,
    coalesce(d.motivo, '')::text,
    coalesce(d.cosas_buenas, '')::text,
    coalesce(d.cosas_malas, '')::text,
    coalesce(d.objetivo_cumplido, '')::text,
    coalesce(d.areas_mejora, '')::text,
    coalesce(d.plan_accion, '')::text
  from public.diario as d
  where d.user_id = p_paciente_id
    and d.compartir_con_profesional = true
  order by d.fecha desc;
end;
$$;

revoke execute on function
  public.emociones_paciente_vinculado(uuid),
  public.diarios_compartidos_paciente(uuid)
from public, anon;

grant execute on function
  public.emociones_paciente_vinculado(uuid),
  public.diarios_compartidos_paciente(uuid)
to authenticated;

comment on column public.diario.compartir_con_profesional is
  'Consentimiento revocable para compartir el texto del registro con el profesional vinculado.';

notify pgrst, 'reload schema';
