-- Motivo obligatorio al rechazar o cancelar una cita. Queda guardado en la cita y como mensaje
-- del sistema en el chat, para que la otra persona lo vea.
-- Requiere 20261027000000_citas_chat.sql

alter table public.citas
  add column motivo_cierre text
    constraint largo_motivo_cierre check (char_length(motivo_cierre) <= 300);

-- El mensaje del sistema lleva el motivo (hasta 300) más un texto como "El profesional rechazó la
-- solicitud. Motivo: ", así que puede pasar de 300. Los mensajes del chat siguen limitados a 300
alter table public.mensajes_cita
  drop constraint largo_mensaje,
  add constraint largo_mensaje check (
    char_length(btrim(texto)) between 1 and (case when tipo = 'sistema' then 500 else 300 end)
  );

-- Cambian los parámetros: se reemplazan las versiones sin motivo
drop function public.rechazar_cita(uuid);
drop function public.cancelar_cita(uuid);

create function public.rechazar_cita(p_cita_id uuid, p_motivo text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_motivo text := btrim(coalesce(p_motivo, ''));
begin
  if char_length(v_motivo) = 0 then
    raise exception 'Escribe el motivo del rechazo';
  end if;
  if char_length(v_motivo) > 300 then
    raise exception 'El motivo puede tener hasta 300 caracteres';
  end if;

  update public.citas
  set estado = 'rechazada', motivo_cierre = v_motivo, updated_at = now()
  where id = p_cita_id and profesional_id = auth.uid() and estado = 'pendiente';

  if not found then
    raise exception 'No puedes rechazar esta solicitud';
  end if;

  perform public.mensaje_sistema_cita(
    p_cita_id, 'El profesional rechazó la solicitud. Motivo: ' || v_motivo
  );
end;
$$;

create function public.cancelar_cita(p_cita_id uuid, p_motivo text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_motivo text := btrim(coalesce(p_motivo, ''));
  v_quien text;
begin
  if char_length(v_motivo) = 0 then
    raise exception 'Escribe el motivo de la cancelación';
  end if;
  if char_length(v_motivo) > 300 then
    raise exception 'El motivo puede tener hasta 300 caracteres';
  end if;

  update public.citas
  set estado = 'cancelada', motivo_cierre = v_motivo, updated_at = now()
  where id = p_cita_id
    and auth.uid() in (paciente_id, profesional_id)
    and estado in ('pendiente', 'confirmada')
  returning case when paciente_id = auth.uid() then 'El paciente' else 'El profesional' end into v_quien;

  if not found then
    raise exception 'No puedes cancelar esta cita';
  end if;

  perform public.mensaje_sistema_cita(p_cita_id, v_quien || ' canceló la cita. Motivo: ' || v_motivo);
end;
$$;

revoke execute on function
  public.rechazar_cita(uuid, text),
  public.cancelar_cita(uuid, text)
from public, anon;

grant execute on function
  public.rechazar_cita(uuid, text),
  public.cancelar_cita(uuid, text)
to authenticated;
