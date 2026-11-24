-- Disponibilidad semanal del profesional. Los horarios se interpretan en America/Santiago.

create table public.disponibilidad_profesional (
  profesional_id uuid not null references auth.users (id) on delete cascade,
  dia_semana smallint not null check (dia_semana between 1 and 7),
  hora_inicio time not null,
  hora_fin time not null,
  updated_at timestamptz not null default now(),
  primary key (profesional_id, dia_semana),
  constraint disponibilidad_horario_valido check (
    hora_fin > hora_inicio and hora_fin - hora_inicio >= interval '60 minutes'
  )
);

alter table public.disponibilidad_profesional enable row level security;

-- La app usa funciones para leer y reemplazar toda la semana de forma atómica.
create function public.mi_disponibilidad_profesional()
returns table (
  dia_semana smallint,
  hora_inicio time,
  hora_fin time
)
language sql
stable
security definer
set search_path = ''
as $$
  select d.dia_semana, d.hora_inicio, d.hora_fin
  from public.disponibilidad_profesional as d
  where d.profesional_id = auth.uid()
  order by d.dia_semana;
$$;

create function public.guardar_disponibilidad_profesional(p_dias jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_dia jsonb;
  v_numero smallint;
  v_inicio time;
  v_fin time;
begin
  if auth.uid() is null then
    raise exception 'Debes iniciar sesión';
  end if;
  if not exists (
    select 1 from public.profesionales as p where p.user_id = auth.uid()
  ) then
    raise exception 'Esta configuración es solo para profesionales';
  end if;
  if p_dias is null or jsonb_typeof(p_dias) <> 'array' then
    raise exception 'La disponibilidad enviada no es válida';
  end if;

  delete from public.disponibilidad_profesional
  where profesional_id = auth.uid();

  for v_dia in select value from jsonb_array_elements(p_dias)
  loop
    begin
      v_numero := (v_dia ->> 'dia_semana')::smallint;
      v_inicio := (v_dia ->> 'hora_inicio')::time;
      v_fin := (v_dia ->> 'hora_fin')::time;
    exception when others then
      raise exception 'Uno de los días tiene un horario inválido';
    end;

    if v_numero not between 1 and 7 then
      raise exception 'El día laboral no es válido';
    end if;
    if v_fin <= v_inicio or v_fin - v_inicio < interval '60 minutes' then
      raise exception 'Cada día laboral debe tener al menos 60 minutos disponibles';
    end if;

    insert into public.disponibilidad_profesional (
      profesional_id, dia_semana, hora_inicio, hora_fin
    ) values (
      auth.uid(), v_numero, v_inicio, v_fin
    );
  end loop;
exception
  when unique_violation then
    raise exception 'No puedes repetir un día laboral';
end;
$$;

-- Función interna usada por la agenda. Incluye la hora completa de término de la cita.
create function public.profesional_disponible_en(
  p_profesional_id uuid,
  p_fecha timestamptz
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.disponibilidad_profesional as d
    cross join lateral (
      select p_fecha at time zone 'America/Santiago' as fecha_local
    ) as f
    where d.profesional_id = p_profesional_id
      and d.dia_semana = extract(isodow from f.fecha_local)::smallint
      and f.fecha_local >= f.fecha_local::date + d.hora_inicio
      and f.fecha_local + interval '60 minutes' <= f.fecha_local::date + d.hora_fin
  );
$$;

revoke execute on function public.profesional_disponible_en(uuid, timestamptz)
from public, anon, authenticated;

-- Se reemplazan las operaciones de agenda para aplicar la disponibilidad en el servidor.
create or replace function public.agendar_cita_paciente(
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
  if not public.profesional_disponible_en(auth.uid(), p_fecha) then
    raise exception 'La fecha está fuera de tu disponibilidad laboral';
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
    paciente_id, profesional_id, estado, modalidad, fecha_confirmada
  ) values (
    p_paciente_id, auth.uid(), 'confirmada', p_modalidad, p_fecha
  ) returning id into v_cita_id;

  return v_cita_id;
end;
$$;

create or replace function public.modificar_cita_agendada(
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
  if not public.profesional_disponible_en(auth.uid(), p_fecha) then
    raise exception 'La fecha está fuera de tu disponibilidad laboral';
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
  set fecha_confirmada = p_fecha,
      modalidad = p_modalidad,
      fecha_propuesta = null,
      motivo_cierre = null,
      updated_at = now()
  where id = p_cita_id;
end;
$$;

revoke execute on function
  public.mi_disponibilidad_profesional(),
  public.guardar_disponibilidad_profesional(jsonb)
from public, anon;

grant execute on function
  public.mi_disponibilidad_profesional(),
  public.guardar_disponibilidad_profesional(jsonb)
to authenticated;

notify pgrst, 'reload schema';
