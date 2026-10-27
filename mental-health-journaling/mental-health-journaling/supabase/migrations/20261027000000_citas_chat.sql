-- Citas entre usuario (paciente) y profesional, con un chat limitado a coordinar la reserva.
--
-- Flujo:
--   1. El paciente crea una solicitud (solicitar_cita) -> estado 'pendiente', el chat queda abierto.
--   2. El profesional propone un horario (proponer_horario). Puede proponer otro las veces que quiera.
--   3. El paciente acepta el horario (aceptar_horario) -> 'confirmada' y el chat se cierra.
--   En cualquier momento: el profesional puede rechazar y cualquiera de los dos puede cancelar.
--
-- Todos los cambios de estado pasan por funciones: la app no puede modificar la tabla directamente,
-- así nadie puede saltarse un paso (por ejemplo, confirmar una cita sin horario).

create table public.citas (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references auth.users (id) on delete cascade,
  profesional_id uuid not null references auth.users (id) on delete cascade,
  estado text not null default 'pendiente'
    constraint estado_cita_valido check (estado in ('pendiente', 'confirmada', 'rechazada', 'cancelada')),
  modalidad text not null
    constraint modalidad_valida check (modalidad in ('presencial', 'online')),
  -- Último horario propuesto por el profesional; al aceptarlo pasa a ser el de la cita
  fecha_propuesta timestamptz,
  fecha_confirmada timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint paciente_distinto check (paciente_id <> profesional_id)
);

-- Una sola solicitud abierta por paciente y profesional
create unique index citas_una_pendiente on public.citas (paciente_id, profesional_id)
  where estado = 'pendiente';
create index citas_paciente on public.citas (paciente_id);
create index citas_profesional on public.citas (profesional_id);

create table public.mensajes_cita (
  id bigint generated always as identity primary key,
  cita_id uuid not null references public.citas (id) on delete cascade,
  -- null en los mensajes del sistema ("Se propuso el horario...")
  autor_id uuid references auth.users (id) on delete set null default auth.uid(),
  tipo text not null default 'texto'
    constraint tipo_mensaje_valido check (tipo in ('texto', 'sistema')),
  -- Mensajes cortos: el chat solo sirve para coordinar la cita
  texto text not null
    constraint largo_mensaje check (char_length(btrim(texto)) between 1 and 300),
  created_at timestamptz not null default now()
);

create index mensajes_cita_cita on public.mensajes_cita (cita_id, created_at);

-- ---------------------------------------------------------------------------
-- Seguridad (RLS)
-- ---------------------------------------------------------------------------

alter table public.citas enable row level security;
alter table public.mensajes_cita enable row level security;

-- Solo los dos participantes ven la cita. Sin políticas de insert/update/delete: se usan las funciones
create policy "participantes ven la cita" on public.citas
  for select to authenticated
  using (auth.uid() in (paciente_id, profesional_id));

create policy "participantes ven los mensajes" on public.mensajes_cita
  for select to authenticated
  using (exists (
    select 1 from public.citas c
    where c.id = cita_id and auth.uid() in (c.paciente_id, c.profesional_id)
  ));

-- Se puede escribir solo mientras la solicitud está pendiente: al confirmar, rechazar o cancelar,
-- el chat queda en solo lectura
create policy "participantes escriben mientras esta pendiente" on public.mensajes_cita
  for insert to authenticated
  with check (
    autor_id = auth.uid()
    and tipo = 'texto'
    and exists (
      select 1 from public.citas c
      where c.id = cita_id
        and c.estado = 'pendiente'
        and auth.uid() in (c.paciente_id, c.profesional_id)
    )
  );

-- Límite de mensajes por solicitud, para que el chat no se use como canal de conversación
create function public.limitar_mensajes_cita()
returns trigger
language plpgsql
as $$
begin
  if new.tipo = 'texto'
     and (select count(*) from public.mensajes_cita where cita_id = new.cita_id and tipo = 'texto') >= 60 then
    raise exception 'Se alcanzó el límite de mensajes de esta solicitud';
  end if;
  return new;
end;
$$;

create trigger limitar_mensajes_cita
  before insert on public.mensajes_cita
  for each row execute function public.limitar_mensajes_cita();

-- ---------------------------------------------------------------------------
-- Funciones que usa la app (src/lib/citas.ts)
-- ---------------------------------------------------------------------------

-- Mensaje automático que deja registro de cada cambio en el hilo
create function public.mensaje_sistema_cita(p_cita_id uuid, p_texto text)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.mensajes_cita (cita_id, autor_id, tipo, texto)
  values (p_cita_id, null, 'sistema', p_texto);
$$;

revoke execute on function public.mensaje_sistema_cita(uuid, text) from public, anon, authenticated;

-- Fecha legible en hora de Chile para los mensajes del sistema
create function public.fecha_cita_texto(p_fecha timestamptz)
returns text
language sql
stable
set search_path = ''
as $$
  select to_char(p_fecha at time zone 'America/Santiago', 'DD/MM/YYYY "a las" HH24:MI');
$$;

create function public.solicitar_cita(p_profesional_id uuid, p_modalidad text, p_mensaje text)
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

  -- Solo se puede pedir hora a profesionales verificados por el administrador
  if not exists (
    select 1 from public.profesionales
    where user_id = p_profesional_id and estado = 'aprobado'
  ) then
    raise exception 'Este profesional no está disponible';
  end if;

  if exists (
    select 1 from public.citas
    where paciente_id = auth.uid() and profesional_id = p_profesional_id and estado = 'pendiente'
  ) then
    raise exception 'Ya tienes una solicitud abierta con este profesional';
  end if;

  insert into public.citas (paciente_id, profesional_id, modalidad)
  values (auth.uid(), p_profesional_id, p_modalidad)
  returning id into v_cita_id;

  perform public.mensaje_sistema_cita(
    v_cita_id,
    'Solicitud de cita ' || case p_modalidad when 'online' then 'online' else 'presencial' end || ' creada.'
  );

  if nullif(btrim(p_mensaje), '') is not null then
    insert into public.mensajes_cita (cita_id, autor_id, texto)
    values (v_cita_id, auth.uid(), btrim(p_mensaje));
  end if;

  return v_cita_id;
end;
$$;

create function public.proponer_horario(p_cita_id uuid, p_fecha timestamptz)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_fecha <= now() then
    raise exception 'El horario debe ser en el futuro';
  end if;

  update public.citas
  set fecha_propuesta = p_fecha, updated_at = now()
  where id = p_cita_id and profesional_id = auth.uid() and estado = 'pendiente';

  if not found then
    raise exception 'No puedes proponer un horario para esta solicitud';
  end if;

  perform public.mensaje_sistema_cita(
    p_cita_id, 'El profesional propuso el ' || public.fecha_cita_texto(p_fecha) || '.'
  );
end;
$$;

create function public.aceptar_horario(p_cita_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_fecha timestamptz;
begin
  update public.citas
  set estado = 'confirmada', fecha_confirmada = fecha_propuesta, updated_at = now()
  where id = p_cita_id
    and paciente_id = auth.uid()
    and estado = 'pendiente'
    and fecha_propuesta > now()
  returning fecha_confirmada into v_fecha;

  if not found then
    raise exception 'No hay un horario vigente para aceptar';
  end if;

  perform public.mensaje_sistema_cita(
    p_cita_id, 'Cita confirmada para el ' || public.fecha_cita_texto(v_fecha) || '.'
  );
end;
$$;

create function public.rechazar_cita(p_cita_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.citas
  set estado = 'rechazada', updated_at = now()
  where id = p_cita_id and profesional_id = auth.uid() and estado = 'pendiente';

  if not found then
    raise exception 'No puedes rechazar esta solicitud';
  end if;

  perform public.mensaje_sistema_cita(p_cita_id, 'El profesional rechazó la solicitud.');
end;
$$;

create function public.cancelar_cita(p_cita_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_quien text;
begin
  update public.citas
  set estado = 'cancelada', updated_at = now()
  where id = p_cita_id
    and auth.uid() in (paciente_id, profesional_id)
    and estado in ('pendiente', 'confirmada')
  returning case when paciente_id = auth.uid() then 'El paciente' else 'El profesional' end into v_quien;

  if not found then
    raise exception 'No puedes cancelar esta cita';
  end if;

  perform public.mensaje_sistema_cita(p_cita_id, v_quien || ' canceló la cita.');
end;
$$;

-- Citas del usuario con el nombre de la otra persona. Los nombres están en auth.users, que la app
-- no puede leer, por eso se entregan desde aquí y solo para las citas propias
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
  otro_foto_path text
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
    case when c.paciente_id = auth.uid() then p.foto_path end
  from public.citas c
  join auth.users u
    on u.id = case when c.paciente_id = auth.uid() then c.profesional_id else c.paciente_id end
  left join public.profesionales p on p.user_id = c.profesional_id
  where auth.uid() in (c.paciente_id, c.profesional_id)
    and (p_cita_id is null or c.id = p_cita_id)
  order by c.updated_at desc;
$$;

revoke execute on function
  public.solicitar_cita(uuid, text, text),
  public.proponer_horario(uuid, timestamptz),
  public.aceptar_horario(uuid),
  public.rechazar_cita(uuid),
  public.cancelar_cita(uuid),
  public.mis_citas(uuid)
from public, anon;

grant execute on function
  public.solicitar_cita(uuid, text, text),
  public.proponer_horario(uuid, timestamptz),
  public.aceptar_horario(uuid),
  public.rechazar_cita(uuid),
  public.cancelar_cita(uuid),
  public.mis_citas(uuid)
to authenticated;

-- Mensajes y cambios de estado en vivo (Realtime respeta las políticas de select de arriba)
alter publication supabase_realtime add table public.mensajes_cita, public.citas;
