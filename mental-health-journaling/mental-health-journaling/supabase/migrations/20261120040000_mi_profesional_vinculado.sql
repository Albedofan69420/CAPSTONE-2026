-- Datos del único profesional vinculado actualmente al paciente autenticado.
-- La función evita exponer auth.users o permitir consultar vínculos ajenos.

create or replace function public.mi_profesional_vinculado()
returns table (
  vinculacion_id uuid,
  profesional_id uuid,
  vinculada_at timestamptz,
  nombre text,
  apellido text,
  email text,
  especialidad text,
  descripcion text,
  foto_path text,
  edad integer,
  genero text,
  region text,
  comuna text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    v.id,
    v.profesional_id,
    v.vinculada_at,
    u.raw_user_meta_data ->> 'nombre',
    u.raw_user_meta_data ->> 'apellido',
    u.email::text,
    p.especialidad,
    p.descripcion,
    p.foto_path,
    case
      when p.fecha_nacimiento is null then null
      else date_part('year', age(current_date, p.fecha_nacimiento))::integer
    end,
    p.genero,
    p.region,
    p.comuna
  from public.vinculaciones_paciente_profesional as v
  join auth.users as u on u.id = v.profesional_id
  join public.profesionales as p on p.user_id = v.profesional_id
  where v.paciente_id = auth.uid()
    and v.estado = 'activa'
  order by v.vinculada_at desc
  limit 1;
$$;

revoke execute on function public.mi_profesional_vinculado()
from public, anon;

grant execute on function public.mi_profesional_vinculado()
to authenticated;

comment on function public.mi_profesional_vinculado() is
  'Devuelve el profesional del vínculo activo del paciente autenticado.';

notify pgrst, 'reload schema';
