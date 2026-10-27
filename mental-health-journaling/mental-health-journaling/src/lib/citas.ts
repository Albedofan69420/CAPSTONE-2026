import { supabase } from "@/lib/supabase";

// Ver supabase/migrations/20261027000000_citas_chat.sql
export type EstadoCita = "pendiente" | "confirmada" | "rechazada" | "cancelada";
export type Modalidad = "presencial" | "online";

// Fila que devuelve public.mis_citas: la cita y los datos de la otra persona
export type Cita = {
  id: string;
  paciente_id: string;
  profesional_id: string;
  estado: EstadoCita;
  modalidad: Modalidad;
  fecha_propuesta: string | null;
  fecha_confirmada: string | null;
  created_at: string;
  updated_at: string;
  soy_profesional: boolean;
  otro_nombre: string | null;
  otro_apellido: string | null;
  // Solo viene cuando la otra persona es el profesional
  otro_foto_path: string | null;
  // Mensajes de la otra persona y del sistema que aún no se ven
  no_leidos: number;
};

// Fila que devuelve public.resumen_citas, para el menú inferior
export type ResumenCitas = {
  total_citas: number;
  no_leidos: number;
};

export type Mensaje = {
  id: number;
  cita_id: string;
  autor_id: string | null;
  tipo: "texto" | "sistema";
  texto: string;
  created_at: string;
};

// Mismo límite que la restricción largo_mensaje en la base de datos
export const MENSAJE_MAX = 300;

export const ESTADO_CITA_LABEL: Record<EstadoCita, string> = {
  pendiente: "Por coordinar",
  confirmada: "Confirmada",
  rechazada: "Rechazada",
  cancelada: "Cancelada",
};

export const MODALIDAD_LABEL: Record<Modalidad, string> = {
  presencial: "Presencial",
  online: "Online",
};

// Respuestas rápidas para que la conversación se mantenga en la coordinación de la cita
export const RESPUESTAS_RAPIDAS = {
  paciente: ["Me sirve ese horario", "¿Tienes otro horario?", "Prefiero en la tarde", "Prefiero online"],
  profesional: ["¿Qué días te acomodan?", "¿Prefieres mañana o tarde?", "Te propongo un horario"],
};

// Palabras que muestran los teléfonos de ayuda mientras se escribe. No bloquean el mensaje
const PALABRAS_RIESGO = [
  "suicid",
  "matarme",
  "quitarme la vida",
  "no quiero vivir",
  "no quiero seguir",
  "hacerme daño",
  "autolesion",
  "cortarme",
];

const normalizar = (texto: string) =>
  texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export const tieneRiesgo = (texto: string) => {
  const t = normalizar(texto);
  return PALABRAS_RIESGO.some((p) => t.includes(p));
};

export const nombreOtro = (cita: Pick<Cita, "otro_nombre" | "otro_apellido">) =>
  [cita.otro_nombre, cita.otro_apellido].filter(Boolean).join(" ") || "Usuario";

/** Fecha y hora en formato chileno: "jueves 30 de octubre, 18:00". */
export const fechaHoraTexto = (fecha: string) =>
  new Intl.DateTimeFormat("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(fecha));

/** Agrega los dos puntos mientras se escribe: 1830 -> 18:30 */
export const formatearHoraEscrita = (texto: string) => {
  const digitos = texto.replace(/\D/g, "").slice(0, 4);
  return digitos.length > 2 ? `${digitos.slice(0, 2)}:${digitos.slice(2)}` : digitos;
};

/** "DD/MM/AAAA" y "HH:MM" -> Date, o null si no es una fecha real en el futuro. */
export const textoAFechaHora = (fecha: string, hora: string) => {
  const f = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(fecha);
  const h = /^(\d{2}):(\d{2})$/.exec(hora);
  if (!f || !h) return null;

  const [dia, mes, anio] = [Number(f[1]), Number(f[2]), Number(f[3])];
  const [horas, minutos] = [Number(h[1]), Number(h[2])];
  if (horas > 23 || minutos > 59) return null;

  // Hora local del teléfono
  const resultado = new Date(anio, mes - 1, dia, horas, minutos);
  const esReal =
    resultado.getFullYear() === anio && resultado.getMonth() === mes - 1 && resultado.getDate() === dia;
  if (!esReal || resultado <= new Date()) return null;

  return resultado;
};

export async function listarMisCitas() {
  const { data, error } = await supabase.rpc("mis_citas");
  if (error) throw error;
  return data as Cita[];
}

/** Una cita propia, o null si no existe o no participa en ella. */
export async function obtenerCita(citaId: string) {
  const { data, error } = await supabase.rpc("mis_citas", { p_cita_id: citaId });
  if (error) throw error;
  return ((data as Cita[])[0] ?? null) as Cita | null;
}

/** Crea la solicitud y devuelve su id. El mensaje es opcional. */
export async function solicitarCita(profesionalId: string, modalidad: Modalidad, mensaje: string) {
  const { data, error } = await supabase.rpc("solicitar_cita", {
    p_profesional_id: profesionalId,
    p_modalidad: modalidad,
    p_mensaje: mensaje.trim(),
  });
  if (error) throw error;
  return data as string;
}

export async function proponerHorario(citaId: string, fecha: Date) {
  const { error } = await supabase.rpc("proponer_horario", {
    p_cita_id: citaId,
    p_fecha: fecha.toISOString(),
  });
  if (error) throw error;
}

export async function aceptarHorario(citaId: string) {
  const { error } = await supabase.rpc("aceptar_horario", { p_cita_id: citaId });
  if (error) throw error;
}

export async function rechazarCita(citaId: string) {
  const { error } = await supabase.rpc("rechazar_cita", { p_cita_id: citaId });
  if (error) throw error;
}

export async function cancelarCita(citaId: string) {
  const { error } = await supabase.rpc("cancelar_cita", { p_cita_id: citaId });
  if (error) throw error;
}

export async function listarMensajes(citaId: string) {
  const { data, error } = await supabase
    .from("mensajes_cita")
    .select("id, cita_id, autor_id, tipo, texto, created_at")
    .eq("cita_id", citaId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as Mensaje[];
}

export async function enviarMensaje(citaId: string, texto: string) {
  const { data, error } = await supabase
    .from("mensajes_cita")
    .insert({ cita_id: citaId, texto: texto.trim() })
    .select("id, cita_id, autor_id, tipo, texto, created_at")
    .single();

  if (error) throw error;
  return data as Mensaje;
}

/** Marca como leídos todos los mensajes de la cita para el usuario actual. */
export async function marcarCitaLeida(citaId: string) {
  const { error } = await supabase.rpc("marcar_cita_leida", { p_cita_id: citaId });
  if (error) throw error;
}

export async function obtenerResumenCitas() {
  const { data, error } = await supabase.rpc("resumen_citas");
  if (error) throw error;
  return ((data as ResumenCitas[])[0] ?? { total_citas: 0, no_leidos: 0 }) as ResumenCitas;
}

/**
 * Avisa cuando cambia algo en cualquiera de las citas del usuario: una cita nueva, un mensaje
 * nuevo o una lectura. Realtime solo entrega las filas que el usuario puede ver por RLS.
 */
export function escucharMisCitas(alCambiar: () => void) {
  const canal = supabase
    .channel("mis-citas")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "mensajes_cita" }, alCambiar)
    .on("postgres_changes", { event: "*", schema: "public", table: "citas" }, alCambiar)
    .subscribe();

  return () => {
    supabase.removeChannel(canal);
  };
}

/**
 * Escucha en vivo los mensajes nuevos y los cambios de estado de una cita.
 * Devuelve la función para dejar de escuchar.
 */
export function escucharCita(
  citaId: string,
  alRecibirMensaje: (mensaje: Mensaje) => void,
  alCambiarCita: () => void
) {
  const canal = supabase
    .channel(`cita-${citaId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "mensajes_cita", filter: `cita_id=eq.${citaId}` },
      (payload) => alRecibirMensaje(payload.new as Mensaje)
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "citas", filter: `id=eq.${citaId}` },
      () => alCambiarCita()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(canal);
  };
}
