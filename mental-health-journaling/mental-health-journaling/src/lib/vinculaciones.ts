import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type InvitacionCreada = {
  invitacion_id: string;
  token: string;
  codigo: string;
  expira_at: string;
};

export type CredencialInvitacion = {
  token?: string;
  codigo?: string;
};

export type VistaInvitacion = {
  profesional_id: string;
  nombre: string | null;
  apellido: string | null;
  expira_at: string;
};

export type PacienteVinculado = {
  id: string;
  paciente_id: string;
  estado: "activa" | "finalizada";
  vinculada_at: string;
  finalizada_at: string | null;
  nombre: string | null;
  apellido: string | null;
  email: string;
};

export type ProfesionalVinculado = {
  vinculacion_id: string;
  profesional_id: string;
  vinculada_at: string;
  nombre: string | null;
  apellido: string | null;
  email: string | null;
  especialidad: string | null;
  descripcion: string | null;
  foto_path: string | null;
  edad: number | null;
  genero: string | null;
  region: string | null;
  comuna: string | null;
};

const INVITACION_PENDIENTE_KEY = "invitacion_paciente_pendiente";

/** Crea una invitación de uso único, válida durante 12 horas. */
export async function crearInvitacionPaciente() {
  const { data, error } = await supabase.rpc("crear_invitacion_paciente");
  if (error) throw error;

  const invitacion = (data as InvitacionCreada[] | null)?.[0];
  if (!invitacion) throw new Error("No se pudo crear la invitación.");
  return invitacion;
}

/** Cancela una invitación pendiente creada por el profesional actual. */
export async function cancelarInvitacionPaciente(invitacionId: string) {
  const { error } = await supabase.rpc("cancelar_invitacion_paciente", {
    p_invitacion_id: invitacionId,
  });
  if (error) throw error;
}

/** Datos mínimos para que el paciente confirme a qué profesional se vinculará. */
export async function verInvitacionPaciente(credencial: CredencialInvitacion) {
  const { data, error } = await supabase.rpc("ver_invitacion_paciente", {
    p_token: credencial.token ?? null,
    p_codigo: credencial.codigo ?? null,
  });
  if (error) throw error;

  const vista = (data as VistaInvitacion[] | null)?.[0];
  if (!vista) throw new Error("La invitación no existe, venció o ya fue utilizada.");
  return vista;
}

/** Crea la vinculación después de la confirmación explícita del paciente. */
export async function aceptarInvitacionPaciente(credencial: CredencialInvitacion) {
  const { data, error } = await supabase.rpc("aceptar_invitacion_paciente", {
    p_token: credencial.token ?? null,
    p_codigo: credencial.codigo ?? null,
  });
  if (error) throw error;
  return data as string;
}

export async function guardarInvitacionPendiente(credencial: CredencialInvitacion) {
  await AsyncStorage.setItem(INVITACION_PENDIENTE_KEY, JSON.stringify(credencial));
}

export async function leerInvitacionPendiente() {
  const raw = await AsyncStorage.getItem(INVITACION_PENDIENTE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CredencialInvitacion;
  } catch {
    await AsyncStorage.removeItem(INVITACION_PENDIENTE_KEY);
    return null;
  }
}

export async function limpiarInvitacionPendiente() {
  await AsyncStorage.removeItem(INVITACION_PENDIENTE_KEY);
}

/** Enlace que abrirá la futura pantalla de aceptación dentro de la app instalada. */
export const enlaceInvitacion = (token: string) =>
  `mentalhealthjournaling://invitation?token=${encodeURIComponent(token)}`;

/** Lista los vínculos activos y el historial del profesional autenticado. */
export async function listarMisPacientes() {
  const { data, error } = await supabase.rpc("mis_pacientes_vinculados");
  if (error) throw error;
  return (data ?? []) as PacienteVinculado[];
}

/** Obtiene un vínculo propio por su identificador. */
export async function obtenerPacienteVinculado(vinculacionId: string) {
  const { data, error } = await supabase.rpc("mis_pacientes_vinculados", {
    p_vinculacion_id: vinculacionId,
  });
  if (error) throw error;
  return ((data ?? []) as PacienteVinculado[])[0] ?? null;
}

/** Finaliza el vínculo activo sin borrar su historial. */
export async function finalizarVinculacionPaciente(vinculacionId: string) {
  const { error } = await supabase.rpc("finalizar_vinculacion_paciente", {
    p_vinculacion_id: vinculacionId,
  });
  if (error) throw error;
}

/** Devuelve únicamente el psicólogo del vínculo activo del paciente actual. */
export async function obtenerMiProfesionalVinculado() {
  const { data, error } = await supabase.rpc("mi_profesional_vinculado");
  if (error) throw error;
  return ((data ?? []) as ProfesionalVinculado[])[0] ?? null;
}

/** Escucha aceptaciones y finalizaciones para refrescar la lista visible. */
export function escucharVinculaciones(alCambiar: () => void) {
  const canal = supabase
    .channel(`vinculaciones-profesional-${Date.now()}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "vinculaciones_paciente_profesional",
      },
      alCambiar
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(canal);
  };
}

