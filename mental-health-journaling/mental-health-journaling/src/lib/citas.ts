import { supabase } from "@/lib/supabase";

export type EstadoCita = "confirmada" | "cancelada";
export type Modalidad = "presencial" | "online";

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
  otro_foto_path: string | null;
  no_leidos: number;
  motivo_cierre: string | null;
};

export type ResumenCitas = {
  total_citas: number;
  no_leidos: number;
};

export const DURACION_CITA_MINUTOS = 60;

export const MODALIDAD_LABEL: Record<Modalidad, string> = {
  presencial: "Presencial",
  online: "Online",
};

export const nombreOtro = (cita: Pick<Cita, "otro_nombre" | "otro_apellido">) =>
  [cita.otro_nombre, cita.otro_apellido].filter(Boolean).join(" ") || "Usuario";

export const fechaHoraTexto = (fecha: string) =>
  new Intl.DateTimeFormat("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(fecha));

export const horaAmPm = (fecha: Date) => {
  const horas = fecha.getHours();
  const minutos = String(fecha.getMinutes()).padStart(2, "0");
  return `${horas % 12 || 12}:${minutos} ${horas < 12 ? "AM" : "PM"}`;
};

export const rangoHorario = (inicio: string) => {
  const desde = new Date(inicio);
  const hasta = new Date(desde.getTime() + DURACION_CITA_MINUTOS * 60 * 1000);
  return `De ${horaAmPm(desde)} hasta ${horaAmPm(hasta)}`;
};

export const formatearHoraEscrita = (texto: string) => {
  const digitos = texto.replace(/\D/g, "").slice(0, 4);
  return digitos.length > 2 ? `${digitos.slice(0, 2)}:${digitos.slice(2)}` : digitos;
};

export const textoAFechaHora = (fecha: string, hora: string) => {
  const f = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(fecha);
  const h = /^(\d{2}):(\d{2})$/.exec(hora);
  if (!f || !h) return null;

  const [dia, mes, anio] = [Number(f[1]), Number(f[2]), Number(f[3])];
  const [horas, minutos] = [Number(h[1]), Number(h[2])];
  if (horas > 23 || minutos > 59) return null;

  const resultado = new Date(anio, mes - 1, dia, horas, minutos);
  const esReal =
    resultado.getFullYear() === anio &&
    resultado.getMonth() === mes - 1 &&
    resultado.getDate() === dia;
  if (!esReal || resultado <= new Date()) return null;
  return resultado;
};

export async function listarMisCitas() {
  const { data, error } = await supabase.rpc("mis_citas");
  if (error) throw error;
  return (data ?? []) as Cita[];
}

export async function obtenerCita(citaId: string) {
  const { data, error } = await supabase.rpc("mis_citas", { p_cita_id: citaId });
  if (error) throw error;
  return ((data ?? []) as Cita[])[0] ?? null;
}

export async function agendarCitaPaciente(
  pacienteId: string,
  fecha: Date,
  modalidad: Modalidad
) {
  const { data, error } = await supabase.rpc("agendar_cita_paciente", {
    p_paciente_id: pacienteId,
    p_fecha: fecha.toISOString(),
    p_modalidad: modalidad,
  });
  if (error) throw error;
  return data as string;
}

export async function modificarCitaAgendada(
  citaId: string,
  fecha: Date,
  modalidad: Modalidad
) {
  const { error } = await supabase.rpc("modificar_cita_agendada", {
    p_cita_id: citaId,
    p_fecha: fecha.toISOString(),
    p_modalidad: modalidad,
  });
  if (error) throw error;
}

export async function cancelarCitaAgendada(citaId: string) {
  const { error } = await supabase.rpc("cancelar_cita_agendada", { p_cita_id: citaId });
  if (error) throw error;
}

export async function obtenerResumenCitas() {
  const { data, error } = await supabase.rpc("resumen_citas");
  if (error) throw error;
  return ((data ?? []) as ResumenCitas[])[0] ?? { total_citas: 0, no_leidos: 0 };
}

export function escucharMisCitas(alCambiar: () => void) {
  const canal = supabase
    .channel(`mis-citas-${Date.now()}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "citas" }, alCambiar)
    .subscribe();

  return () => {
    void supabase.removeChannel(canal);
  };
}
