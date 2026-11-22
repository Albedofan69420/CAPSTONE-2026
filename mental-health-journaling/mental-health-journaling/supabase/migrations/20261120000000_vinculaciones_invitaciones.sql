-- Etapa 1 del nuevo flujo terapéutico: relación paciente-profesional e invitaciones.
--
-- Esta migración es aditiva: todavía no modifica citas, chat, diario ni navegación.
-- Reglas implementadas:
--   * un paciente puede tener un solo profesional activo;
--   * solo un profesional aprobado puede crear invitaciones;
--   * cada invitación dura 12 horas y puede aceptarse una sola vez;
--   * solo el profesional puede finalizar una vinculación;
--   * las vinculaciones finalizadas se conservan como historial.

-- Supabase instala sus extensiones en este esquema. Se usa para no guardar enlaces
-- ni códigos de invitación en texto legible.
create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- Invitaciones
-- ---------------------------------------------------------------------------

create table public.invitaciones_paciente (
  id uuid primary key default gen_random_uuid(),
  profesional_id uuid not null references auth.users (id) on delete cascade,
  -- El enlace y el código son credenciales temporales. Solo se guardan sus hashes.
  token_hash text not null unique,
  codigo_hash text not null unique,
  estado text not null default 'pendiente'
    constraint estado_invitacion_valido
    check (estado in ('pendiente', 'aceptada', 'cancelada', 'expirada')),
  -- Si una cuenta se elimina, la invitación aceptada queda anonimizada como parte del historial.
  paciente_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  expira_at timestamptz not null default (now() + interval '12 hours'),
  aceptada_at timestamptz,
  cancelada_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint invitacion_aceptada_completa check (
    estado <> 'aceptada' or aceptada_at is not null
  ),
  constraint invitacion_profesional_distinto check (
    paciente_id is null or paciente_id <> profesional_id
  )
);

create index invitaciones_paciente_profesional
  on public.invitaciones_paciente (profesional_id, created_at desc);

create index invitaciones_paciente_pendientes
  on public.invitaciones_paciente (expira_at)
  where estado = 'pendiente';

-- ---------------------------------------------------------------------------
-- Vinculaciones
-- ---------------------------------------------------------------------------

create table public.vinculaciones_paciente_profesional (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references auth.users (id) on delete cascade,
  profesional_id uuid not null references auth.users (id) on delete cascade,
  invitacion_id uuid not null unique references public.invitaciones_paciente (id) on delete cascade,
  estado text not null default 'activa'
    constraint estado_vinculacion_valido check (estado in ('activa', 'finalizada')),
  vinculada_at timestamptz not null default now(),
  finalizada_at timestamptz,
  finalizada_por uuid references auth.users (id),
  updated_at timestamptz not null default now(),
  constraint vinculacion_personas_distintas check (paciente_id <> profesional_id),
  constraint vinculacion_finalizada_completa check (
    (estado = 'activa' and finalizada_at is null and finalizada_por is null)
    or
    (estado = 'finalizada' and finalizada_at is not null and finalizada_por = profesional_id)
  )
);

-- Esta es la regla central: puede existir historial, pero solo una relación activa por paciente.
create unique index vinculacion_un_profesional_activo_por_paciente
  on public.vinculaciones_paciente_profesional (paciente_id)
  where estado = 'activa';

create index vinculaciones_profesional_activas
  on public.vinculaciones_paciente_profesional (profesional_id, vinculada_at desc)
  where estado = 'activa';

create index vinculaciones_paciente_historial
  on public.vinculaciones_paciente_profesional (paciente_id, vinculada_at desc);

-- ---------------------------------------------------------------------------
-- Seguridad
-- ---------------------------------------------------------------------------

alter table public.invitaciones_paciente enable row level security;
alter table public.vinculaciones_paciente_profesional enable row level security;

-- El profesional puede consultar el estado de sus invitaciones, pero no escribir directamente.
create policy "profesional ve sus invitaciones"
on public.invitaciones_paciente
for select to authenticated
using (profesional_id = auth.uid());

-- Cada participante puede consultar su relación. Todas las escrituras pasan por funciones.
create policy "participantes ven sus vinculaciones"
on public.vinculaciones_paciente_profesional
for select to authenticated
using (auth.uid() in (paciente_id, profesional_id));

grant select on public.invitaciones_paciente to authenticated;
grant select on public.vinculaciones_paciente_profesional to authenticated;

-- ---------------------------------------------------------------------------
-- Utilidad interna: hash SHA-256 de enlaces y códigos
-- ---------------------------------------------------------------------------

create function public.hash_invitacion(p_valor text)
returns text
language sql
immutable
strict
set search_path = ''
as $$
  select pg_catalog.encode(
    extensions.digest(pg_catalog.convert_to(p_valor, 'UTF8'), 'sha256'),
    'hex'
  );
$$;

revoke execute on function public.hash_invitacion(text)
from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Crear una invitación (solo profesionales aprobados)
-- ---------------------------------------------------------------------------

create function public.crear_invitacion_paciente()
returns table (
  invitacion_id uuid,
  token text,
  codigo text,
  expira_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_token text;
  v_codigo text;
  v_expira_at timestamptz := now() + interval '12 hours';
begin
  if auth.uid() is null then
    raise exception 'Debes iniciar sesión';
  end if;

  if not exists (
    select 1
    from public.profesionales p
    where p.user_id = auth.uid() and p.estado = 'aprobado'
  ) then
    raise exception 'Solo un profesional aprobado puede invitar pacientes';
  end if;

  -- No se necesita un proceso programado: al crear una invitación se cierran las anteriores vencidas.
  update public.invitaciones_paciente as i
  set estado = 'expirada', updated_at = now()
  where i.profesional_id = auth.uid()
    and i.estado = 'pendiente'
    and i.expira_at <= now();

  -- La probabilidad de colisión es mínima; el bucle también la resuelve si llegara a ocurrir.
  loop
    v_token := replace(gen_random_uuid()::text, '-', '')
      || replace(gen_random_uuid()::text, '-', '');
    v_codigo := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    v_id := gen_random_uuid();

    begin
      insert into public.invitaciones_paciente (
        id, profesional_id, token_hash, codigo_hash, expira_at
      ) values (
        v_id,
        auth.uid(),
        public.hash_invitacion(v_token),
        public.hash_invitacion(v_codigo),
        v_expira_at
      );
      exit;
    exception when unique_violation then
      -- Genera credenciales nuevas y vuelve a intentar.
    end;
  end loop;

  return query select v_id, v_token, v_codigo, v_expira_at;
end;
$$;

-- ---------------------------------------------------------------------------
-- Aceptar mediante enlace o código
-- ---------------------------------------------------------------------------

create function public.aceptar_invitacion_paciente(
  p_token text default null,
  p_codigo text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_invitacion public.invitaciones_paciente%rowtype;
  v_vinculacion_id uuid;
  v_token text := nullif(btrim(p_token), '');
  v_codigo text := nullif(upper(btrim(p_codigo)), '');
begin
  if auth.uid() is null then
    raise exception 'Debes iniciar sesión';
  end if;

  if v_token is null and v_codigo is null then
    raise exception 'Ingresa un enlace o código de invitación';
  end if;

  -- No se confía en user_metadata porque el propio usuario puede modificarlo.
  -- La fila profesional y el rol de administración son datos controlados por el servidor.
  if exists (
    select 1 from public.profesionales p where p.user_id = auth.uid()
  ) or coalesce((
    select u.raw_app_meta_data ->> 'rol'
    from auth.users u
    where u.id = auth.uid()
  ), '') = 'admin' then
    raise exception 'Esta invitación es solo para cuentas de uso personal';
  end if;

  if exists (
    select 1
    from public.vinculaciones_paciente_profesional v
    where v.paciente_id = auth.uid() and v.estado = 'activa'
  ) then
    raise exception 'Este paciente ya está vinculado con otro psicólogo';
  end if;

  -- Actualiza el estado antes de buscar para entregar un resultado consistente.
  update public.invitaciones_paciente
  set estado = 'expirada', updated_at = now()
  where estado = 'pendiente' and expira_at <= now();

  select i.* into v_invitacion
  from public.invitaciones_paciente i
  where i.estado = 'pendiente'
    and i.expira_at > now()
    and (
      (v_token is not null and i.token_hash = public.hash_invitacion(v_token))
      or
      (v_codigo is not null and i.codigo_hash = public.hash_invitacion(v_codigo))
    )
  for update;

  if not found then
    raise exception 'La invitación no existe, venció o ya fue utilizada';
  end if;

  if v_invitacion.profesional_id = auth.uid() then
    raise exception 'No puedes aceptar tu propia invitación';
  end if;

  insert into public.vinculaciones_paciente_profesional (
    paciente_id, profesional_id, invitacion_id
  ) values (
    auth.uid(), v_invitacion.profesional_id, v_invitacion.id
  )
  returning id into v_vinculacion_id;

  update public.invitaciones_paciente
  set
    estado = 'aceptada',
    paciente_id = auth.uid(),
    aceptada_at = now(),
    updated_at = now()
  where id = v_invitacion.id;

  return v_vinculacion_id;
exception
  when unique_violation then
    raise exception 'Este paciente ya está vinculado con otro psicólogo';
end;
$$;

-- ---------------------------------------------------------------------------
-- Cancelar invitación y finalizar vinculación
-- ---------------------------------------------------------------------------

create function public.cancelar_invitacion_paciente(p_invitacion_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.invitaciones_paciente
  set estado = 'cancelada', cancelada_at = now(), updated_at = now()
  where id = p_invitacion_id
    and profesional_id = auth.uid()
    and estado = 'pendiente';

  if not found then
    raise exception 'No puedes cancelar esta invitación';
  end if;
end;
$$;

create function public.finalizar_vinculacion_paciente(p_vinculacion_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.vinculaciones_paciente_profesional
  set
    estado = 'finalizada',
    finalizada_at = now(),
    finalizada_por = auth.uid(),
    updated_at = now()
  where id = p_vinculacion_id
    and profesional_id = auth.uid()
    and estado = 'activa';

  if not found then
    raise exception 'No puedes finalizar esta vinculación';
  end if;
end;
$$;

revoke execute on function
  public.crear_invitacion_paciente(),
  public.aceptar_invitacion_paciente(text, text),
  public.cancelar_invitacion_paciente(uuid),
  public.finalizar_vinculacion_paciente(uuid)
from public, anon;

grant execute on function
  public.crear_invitacion_paciente(),
  public.aceptar_invitacion_paciente(text, text),
  public.cancelar_invitacion_paciente(uuid),
  public.finalizar_vinculacion_paciente(uuid)
to authenticated;

comment on table public.invitaciones_paciente is
  'Invitaciones de uso único creadas por profesionales aprobados; duran 12 horas.';

comment on table public.vinculaciones_paciente_profesional is
  'Historial de relaciones terapéuticas. Solo una puede estar activa por paciente.';
