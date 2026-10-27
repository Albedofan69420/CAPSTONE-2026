-- Mensajes por leer en el chat de las citas: cada participante guarda hasta cuándo leyó.
-- Requiere 20261027000000_citas_chat.sql

alter table public.citas
  add column leido_paciente_at timestamptz,
  add column leido_profesional_at timestamptz;

-- La app la llama al abrir el chat y al recibir un mensaje con el chat abierto.
-- No cambia updated_at, para no reordenar la lista de citas
create function public.marcar_cita_leida(p_cita_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.citas
  set
    leido_paciente_at = case when paciente_id = auth.uid() then now() else leido_paciente_at end,
    leido_profesional_at = case when profesional_id = auth.uid() then now() else leido_profesional_at end
  where id = p_cita_id and auth.uid() in (paciente_id, profesional_id);
$$;

-- Mensajes de una cita que el usuario aún no ve: los de la otra persona y los del sistema
create function public.no_leidos_cita(p_cita public.citas)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer
  from public.mensajes_cita m
  where m.cita_id = p_cita.id
    and m.autor_id is distinct from auth.uid()
    and m.created_at > coalesce(
      case when p_cita.paciente_id = auth.uid() then p_cita.leido_paciente_at else p_cita.leido_profesional_at end,
      '-infinity'
    );
$$;

revoke execute on function public.no_leidos_cita(public.citas) from public, anon, authenticated;

-- Se vuelve a crear mis_citas para agregar no_leidos (cambia lo que devuelve)
drop function public.mis_citas(uuid);

create function public.mis_citas(p_cita_id uuid default null)
returns table (
  id uuid,
  paciente_id uuid,
  profesional_id uuid,
  estado text,
  modalidad text,
  fecha_propuesta timestamptz,
  fecha_confirmada timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  soy_profesional boolean,
  otro_nombre text,
  otro_apellido text,
  otro_foto_path text,
  no_leidos integer
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    c.id, c.paciente_id, c.profesional_id, c.estado, c.modalidad,
    c.fecha_propuesta, c.fecha_confirmada, c.created_at, c.updated_at,
    c.profesional_id = auth.uid(),
    u.raw_user_meta_data ->> 'nombre',
    u.raw_user_meta_data ->> 'apellido',
    -- Solo el profesional tiene foto de perfil
    case when c.paciente_id = auth.uid() then p.foto_path end,
    public.no_leidos_cita(c)
  from public.citas c
  join auth.users u
    on u.id = case when c.paciente_id = auth.uid() then c.profesional_id else c.paciente_id end
  left join public.profesionales p on p.user_id = c.profesional_id
  where auth.uid() in (c.paciente_id, c.profesional_id)
    and (p_cita_id is null or c.id = p_cita_id)
  order by c.updated_at desc;
$$;

-- Para el menú inferior: si mostrar la pestaña Citas y el número del círculo rojo
create function public.resumen_citas()
returns table (total_citas integer, no_leidos integer)
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer, coalesce(sum(public.no_leidos_cita(c)), 0)::integer
  from public.citas c
  where auth.uid() in (c.paciente_id, c.profesional_id);
$$;

revoke execute on function
  public.marcar_cita_leida(uuid),
  public.mis_citas(uuid),
  public.resumen_citas()
from public, anon;

grant execute on function
  public.marcar_cita_leida(uuid),
  public.mis_citas(uuid),
  public.resumen_citas()
to authenticated;
