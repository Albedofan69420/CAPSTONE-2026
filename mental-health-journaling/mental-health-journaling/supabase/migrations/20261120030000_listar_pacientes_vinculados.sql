-- Vista segura para que el profesional consulte sus pacientes vinculados.
-- Los datos de auth.users nunca se exponen directamente al cliente.

create or replace function public.mis_pacientes_vinculados(
  p_vinculacion_id uuid default null
)
returns table (
  id uuid,
  paciente_id uuid,
  estado text,
  vinculada_at timestamptz,
  finalizada_at timestamptz,
  nombre text,
  apellido text,
  email text
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Debes iniciar sesión';
  end if;

  return query
  select
    v.id,
    v.paciente_id,
    v.estado,
    v.vinculada_at,
    v.finalizada_at,
    u.raw_user_meta_data ->> 'nombre',
    u.raw_user_meta_data ->> 'apellido',
    u.email::text
  from public.vinculaciones_paciente_profesional as v
  join auth.users as u on u.id = v.paciente_id
  where v.profesional_id = auth.uid()
    and (p_vinculacion_id is null or v.id = p_vinculacion_id)
  order by
    case when v.estado = 'activa' then 0 else 1 end,
    v.vinculada_at desc;
end;
$$;

revoke execute on function public.mis_pacientes_vinculados(uuid)
from public, anon;

grant execute on function public.mis_pacientes_vinculados(uuid)
to authenticated;

-- La suscripción Realtime solo notifica cambios de filas que las políticas RLS
-- permiten ver al usuario autenticado.
do $$
begin
  if not exists (
    select 1
    from pg_catalog.pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'vinculaciones_paciente_profesional'
  ) then
    alter publication supabase_realtime
      add table public.vinculaciones_paciente_profesional;
  end if;
end;
$$;

comment on function public.mis_pacientes_vinculados(uuid) is
  'Devuelve únicamente los pacientes vinculados al profesional autenticado.';

notify pgrst, 'reload schema';
