import { supabase } from "@/lib/supabase";

export type DiaSemana = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type DisponibilidadDia = {
  dia_semana: DiaSemana;
  hora_inicio: string;
  hora_fin: string;
};

export const DIAS_SEMANA: { id: DiaSemana; nombre: string; corto: string }[] = [
  { id: 1, nombre: "Lunes", corto: "Lun" },
  { id: 2, nombre: "Martes", corto: "Mar" },
  { id: 3, nombre: "Miércoles", corto: "Mié" },
  { id: 4, nombre: "Jueves", corto: "Jue" },
  { id: 5, nombre: "Viernes", corto: "Vie" },
  { id: 6, nombre: "Sábado", corto: "Sáb" },
  { id: 7, nombre: "Domingo", corto: "Dom" },
];

const normalizarHora = (hora: string) => hora.slice(0, 5);

export async function obtenerMiDisponibilidad() {
  const { data, error } = await supabase.rpc("mi_disponibilidad_profesional");
  if (error) throw error;
  return ((data ?? []) as DisponibilidadDia[]).map((dia) => ({
    ...dia,
    hora_inicio: normalizarHora(dia.hora_inicio),
    hora_fin: normalizarHora(dia.hora_fin),
  }));
}

export async function guardarMiDisponibilidad(dias: DisponibilidadDia[]) {
  const { error } = await supabase.rpc("guardar_disponibilidad_profesional", {
    p_dias: dias,
  });
  if (error) throw error;
}

export const minutosHora = (hora: string) => {
  const partes = /^(\d{2}):(\d{2})$/.exec(hora);
  if (!partes) return null;
  const horas = Number(partes[1]);
  const minutos = Number(partes[2]);
  if (horas > 23 || minutos > 59) return null;
  return horas * 60 + minutos;
};
