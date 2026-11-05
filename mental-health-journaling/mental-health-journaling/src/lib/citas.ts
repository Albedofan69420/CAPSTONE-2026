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

// Las citas solo guardan la hora de inicio: el término se calcula con esta duración
export const DURACION_CITA_MINUTOS = 60;

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

/** Hora en formato de 12 horas: "3:30 PM". */
export const horaAmPm = (fecha: Date) => {
  const horas = fecha.getHours();
  const minutos = String(fecha.getMinutes()).padStart(2, "0");
  return `${horas % 12 || 12}:${minutos} ${horas < 12 ? "AM" : "PM"}`;
};

/** "De 3:30 PM hasta 4:30 PM", usando la duración estándar de una cita. */
export const rangoHorario = (inicio: string) => {
  const desde = new Date(inicio);
  const hasta = new Date(desde.getTime() + DURACION_CITA_MINUTOS * 60 * 1000);
  return `De ${horaAmPm(desde)} hasta ${horaAmPm(hasta)}`;
};

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

// ---------------------------------------------------------------------------
// Un solo chat por usuario y profesional: cada cita guarda sus propios mensajes y estado, y la app
// junta todas las citas de la misma pareja en una conversación
// ---------------------------------------------------------------------------

const clavePareja = (cita: Pick<Cita, "paciente_id" | "profesional_id">) =>
  `${cita.paciente_id}:${cita.profesional_id}`;

export const mismaPareja = (
  a: Pick<Cita, "paciente_id" | "profesional_id">,
  b: Pick<Cita, "paciente_id" | "profesional_id">
) => clavePareja(a) === clavePareja(b);

/**
 * La cita que manda en el chat: la solicitud pendiente, si no la próxima confirmada y si no
 * la más reciente.
 */
export function citaVigente(citas: Cita[]) {
  const porCreacion = [...citas].sort((a, b) => b.created_at.localeCompare(a.created_at));
  const ahora = new Date();

  return (
    porCreacion.find((c) => c.estado === "pendiente") ??
    porCreacion
      .filter((c) => c.estado === "confirmada" && c.fecha_confirmada && new Date(c.fecha_confirmada) > ahora)
      .sort((a, b) => a.fecha_confirmada!.localeCompare(b.fecha_confirmada!))[0] ??
    porCreacion[0] ??
    null
  );
}

/**
 * Una tarjeta por persona para las listas de chats: la cita vigente de cada pareja, con los mensajes
 * por leer de todas sus citas. Se ordenan por la última actividad.
 */
export function agruparPorPersona(citas: Cita[]) {
  const grupos = new Map<string, Cita[]>();
  for (const cita of citas) {
    const clave = clavePareja(cita);
    grupos.set(clave, [...(grupos.get(clave) ?? []), cita]);
  }

  return [...grupos.values()]
    .map((grupo) => ({
      cita: { ...citaVigente(grupo)!, no_leidos: grupo.reduce((total, c) => total + c.no_leidos, 0) },
      ultimaActividad: grupo.reduce((max, c) => (c.updated_at > max ? c.updated_at : max), ""),
    }))
    .sort((a, b) => b.ultimaActividad.localeCompare(a.ultimaActividad))
    .map((g) => g.cita);
}

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

// El motivo es obligatorio: queda en la cita y como mensaje del sistema en el chat
export async function rechazarCita(citaId: string, motivo: string) {
  const { error } = await supabase.rpc("rechazar_cita", { p_cita_id: citaId, p_motivo: motivo.trim() });
  if (error) throw error;
}

export async function cancelarCita(citaId: string, motivo: string) {
  const { error } = await supabase.rpc("cancelar_cita", { p_cita_id: citaId, p_motivo: motivo.trim() });
  if (error) throw error;
}

/** Mensajes de varias citas (todas las de una pareja), del más antiguo al más nuevo. */
export async function listarMensajes(citaIds: string[]) {
  if (citaIds.length === 0) return [];

  const { data, error } = await supabase
    .from("mensajes_cita")
    .select("id, cita_id, autor_id, tipo, texto, created_at")
    .in("cita_id", citaIds)
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
 * Escucha en vivo los mensajes nuevos y los cambios de estado de las citas de una pareja
 * (usuario y profesional), que se muestran como un solo chat.
 * Devuelve la función para dejar de escuchar.
 */
export function escucharConversacion(
  pareja: Pick<Cita, "paciente_id" | "profesional_id">,
  alRecibirMensaje: (mensaje: Mensaje) => void,
  alCambiarCitas: () => void
) {
  const canal = supabase
    .channel(`conversacion-${clavePareja(pareja)}`)
    // Sin filtro: las citas de la pareja pueden ser nuevas. RLS ya limita a los mensajes propios y
    // el chat descarta los de otras conversaciones
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "mensajes_cita" },
      (payload) => alRecibirMensaje(payload.new as Mensaje)
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "citas", filter: `paciente_id=eq.${pareja.paciente_id}` },
      (payload) => {
        const fila = payload.new as Partial<Cita>;
        if (fila.profesional_id === pareja.profesional_id) alCambiarCitas();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(canal);
  };
}
