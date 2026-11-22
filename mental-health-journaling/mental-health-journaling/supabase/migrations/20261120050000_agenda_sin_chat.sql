-- Agenda directa de citas para pacientes vinculados, sin solicitudes ni chat.
-- Conserva las filas y mensajes anteriores como datos históricos, pero deja de exponer
-- las operaciones antiguas a las cuentas autenticadas.

revoke execute on function
  public.solicitar_cita(uuid, text, text),
  public.proponer_horario(uuid, timestamptz),
  public.aceptar_horario(uuid),
  public.rechazar_cita(uuid, text),
  public.cancelar_cita(uuid, text)
from authenticated;

drop policy if exists "participantes escriben mientras esta pendiente"
on public.mensajes_cita;

create function public.agendar_cita_paciente(
  p_paciente_id uuid,
  p_fecha timestamptz,
  p_modalidad text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_cita_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Debes iniciar sesión';
  end if;
  if p_fecha <= now() then
    raise exception 'La fecha debe estar en el futuro';
  end if;
  if p_modalidad not in ('presencial', 'online') then
    raise exception 'Selecciona una modalidad válida';
  end if;
  if not exists (
    select 1
    from public.vinculaciones_paciente_profesional as v
    where v.paciente_id = p_paciente_id
      and v.profesional_id = auth.uid()
      and v.estado = 'activa'
  ) then
    raise exception 'Este paciente no está vinculado contigo';
  end if;
  if exists (
    select 1
    from public.citas as c
    where c.estado = 'confirmada'
      and c.fecha_confirmada is not null
      and (c.profesional_id = auth.uid() or c.paciente_id = p_paciente_id)
      and c.fecha_confirmada < p_fecha + interval '60 minutes'
      and c.fecha_confirmada + interval '60 minutes' > p_fecha
  ) then
    raise exception 'El profesional o el paciente ya tiene una cita en ese horario';
  end if;

  insert into public.citas (
    paciente_id,
    profesional_id,
    estado,
    modalidad,
    fecha_confirmada
  ) values (
    p_paciente_id,
    auth.uid(),
    'confirmada',
    p_modalidad,
    p_fecha
  )
  returning id into v_cita_id;

  return v_cita_id;
end;
$$;

create function public.modificar_cita_agendada(
  p_cita_id uuid,
  p_fecha timestamptz,
  p_modalidad text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_paciente_id uuid;
begin
  if p_fecha <= now() then
    raise exception 'La fecha debe estar en el futuro';
  end if;
  if p_modalidad not in ('presencial', 'online') then
    raise exception 'Selecciona una modalidad válida';
  end if;

  select c.paciente_id into v_paciente_id
  from public.citas as c
  where c.id = p_cita_id
    and c.profesional_id = auth.uid()
    and c.estado = 'confirmada'
    and c.fecha_confirmada > now();

  if not found then
    raise exception 'Esta cita no puede modificarse';
  end if;
  if not exists (
    select 1
    from public.vinculaciones_paciente_profesional as v
    where v.paciente_id = v_paciente_id
      and v.profesional_id = auth.uid()
      and v.estado = 'activa'
  ) then
    raise exception 'El paciente ya no está vinculado contigo';
  end if;
  if exists (
    select 1
    from public.citas as c
    where c.id <> p_cita_id
      and c.estado = 'confirmada'
      and c.fecha_confirmada is not null
      and (c.profesional_id = auth.uid() or c.paciente_id = v_paciente_id)
      and c.fecha_confirmada < p_fecha + interval '60 minutes'
      and c.fecha_confirmada + interval '60 minutes' > p_fecha
  ) then
    raise exception 'El profesional o el paciente ya tiene una cita en ese horario';
  end if;

  update public.citas
  set
    fecha_confirmada = p_fecha,
    modalidad = p_modalidad,
    fecha_propuesta = null,
    motivo_cierre = null,
    updated_at = now()
  where id = p_cita_id;
end;
$$;

create function public.cancelar_cita_agendada(p_cita_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.citas
  set
    estado = 'cancelada',
    motivo_cierre = 'Cancelada por el profesional',
    updated_at = now()
  where id = p_cita_id
    and profesional_id = auth.uid()
    and estado = 'confirmada'
    and fecha_confirmada > now();

  if not found then
    raise exception 'Esta cita no puede cancelarse';
  end if;
end;
$$;

-- La forma de la respuesta mantiene compatibilidad con las tarjetas existentes,
-- agrega el motivo y deja los mensajes no leídos permanentemente en cero.
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
  no_leidos integer,
  motivo_cierre text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    c.id,
    c.paciente_id,
    c.profesional_id,
    c.estado,
    c.modalidad,
    c.fecha_propuesta,
    c.fecha_confirmada,
    c.created_at,
    c.updated_at,
    c.profesional_id = auth.uid(),
    u.raw_user_meta_data ->> 'nombre',
    u.raw_user_meta_data ->> 'apellido',
    case when c.paciente_id = auth.uid() then p.foto_path end,
    0,
    c.motivo_cierre
  from public.citas as c
  join auth.users as u
    on u.id = case when c.paciente_id = auth.uid() then c.profesional_id else c.paciente_id end
  left join public.profesionales as p on p.user_id = c.profesional_id
  where auth.uid() in (c.paciente_id, c.profesional_id)
    and c.estado in ('confirmada', 'cancelada')
    and (p_cita_id is null or c.id = p_cita_id)
  order by
    case when c.estado = 'confirmada' and c.fecha_confirmada >= now() then 0 else 1 end,
    case when c.estado = 'confirmada' and c.fecha_confirmada >= now() then c.fecha_confirmada end asc nulls last,
    coalesce(c.fecha_confirmada, c.updated_at) desc;
$$;

create or replace function public.resumen_citas()
returns table (total_citas integer, no_leidos integer)
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer, 0
  from public.citas as c
  where auth.uid() in (c.paciente_id, c.profesional_id)
    and c.estado in ('confirmada', 'cancelada');
$$;

revoke execute on function
  public.agendar_cita_paciente(uuid, timestamptz, text),
  public.modificar_cita_agendada(uuid, timestamptz, text),
  public.cancelar_cita_agendada(uuid),
  public.mis_citas(uuid)
from public, anon;

grant execute on function
  public.agendar_cita_paciente(uuid, timestamptz, text),
  public.modificar_cita_agendada(uuid, timestamptz, text),
  public.cancelar_cita_agendada(uuid),
  public.mis_citas(uuid)
to authenticated;

notify pgrst, 'reload schema';
