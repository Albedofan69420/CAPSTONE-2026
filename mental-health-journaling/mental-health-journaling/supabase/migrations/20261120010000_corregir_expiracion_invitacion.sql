-- Corrige la ambigüedad entre la columna invitaciones_paciente.expira_at y el
-- parámetro de salida expira_at de crear_invitacion_paciente().

create or replace function public.crear_invitacion_paciente()
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

  update public.invitaciones_paciente as i
  set estado = 'expirada', updated_at = now()
  where i.profesional_id = auth.uid()
    and i.estado = 'pendiente'
    and i.expira_at <= now();

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

revoke execute on function public.crear_invitacion_paciente()
from public, anon;

grant execute on function public.crear_invitacion_paciente()
to authenticated;

notify pgrst, 'reload schema';
