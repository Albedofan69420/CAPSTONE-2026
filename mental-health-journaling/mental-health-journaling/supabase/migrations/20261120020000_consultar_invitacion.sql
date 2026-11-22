-- Permite que un paciente autenticado vea quién lo invitó antes de aceptar.
-- No expone el correo, certificados ni otros datos privados del profesional.

create or replace function public.ver_invitacion_paciente(
  p_token text default null,
  p_codigo text default null
)
returns table (
  profesional_id uuid,
  nombre text,
  apellido text,
  expira_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_token text := nullif(btrim(p_token), '');
  v_codigo text := nullif(upper(btrim(p_codigo)), '');
begin
  if auth.uid() is null then
    raise exception 'Debes iniciar sesión';
  end if;

  if v_token is null and v_codigo is null then
    raise exception 'Ingresa un enlace o código de invitación';
  end if;

  if exists (
    select 1
    from public.vinculaciones_paciente_profesional v
    where v.paciente_id = auth.uid() and v.estado = 'activa'
  ) then
    raise exception 'Este paciente ya está vinculado con otro psicólogo';
  end if;

  update public.invitaciones_paciente as i
  set estado = 'expirada', updated_at = now()
  where i.estado = 'pendiente' and i.expira_at <= now();

  return query
  select
    i.profesional_id,
    u.raw_user_meta_data ->> 'nombre',
    u.raw_user_meta_data ->> 'apellido',
    i.expira_at
  from public.invitaciones_paciente i
  join auth.users u on u.id = i.profesional_id
  where i.estado = 'pendiente'
    and i.expira_at > now()
    and (
      (v_token is not null and i.token_hash = public.hash_invitacion(v_token))
      or
      (v_codigo is not null and i.codigo_hash = public.hash_invitacion(v_codigo))
    );

  if not found then
    raise exception 'La invitación no existe, venció o ya fue utilizada';
  end if;
end;
$$;

revoke execute on function public.ver_invitacion_paciente(text, text)
from public, anon;

grant execute on function public.ver_invitacion_paciente(text, text)
to authenticated;

notify pgrst, 'reload schema';

