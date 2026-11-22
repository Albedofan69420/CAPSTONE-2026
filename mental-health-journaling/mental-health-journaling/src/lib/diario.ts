import type { EmotionId } from "@/components/journal/emotion-selector";
import { supabase } from "@/lib/supabase";

// Columnas de la tabla public.diario (ver supabase/migrations)
export type RegistroDiario = {
  fecha: string; // YYYY-MM-DD
  emocion: EmotionId;
  motivo: string;
  cosas_buenas: string;
  cosas_malas: string;
  objetivo_cumplido: string;
  areas_mejora: string;
  plan_accion: string;
  compartir_con_profesional: boolean;
};

export type RegistroEmocionalProfesional = Pick<RegistroDiario, "fecha" | "emocion">;
export type RegistroCompartidoProfesional = Omit<RegistroDiario, "compartir_con_profesional">;

/** Fecha (YYYY-MM-DD) y emoción de todos los registros del usuario. */
export async function obtenerResumenRegistros(userId: string) {
  const { data, error } = await supabase
    .from("diario")
    .select("fecha, emocion")
    .eq("user_id", userId);

  if (error) throw error;
  return data as Pick<RegistroDiario, "fecha" | "emocion">[];
}

/** Registro del usuario para una fecha, o null si aún no existe. */
export async function obtenerRegistro(userId: string, fecha: string) {
  const { data, error } = await supabase
    .from("diario")
    .select("fecha, emocion, motivo, cosas_buenas, cosas_malas, objetivo_cumplido, areas_mejora, plan_accion, compartir_con_profesional")
    .eq("user_id", userId)
    .eq("fecha", fecha)
    .maybeSingle();

  if (error) throw error;
  return data as RegistroDiario | null;
}

/** Crea el registro del día o lo reemplaza si ya existía. */
export async function guardarRegistro(userId: string, registro: RegistroDiario) {
  const { error } = await supabase
    .from("diario")
    .upsert({ ...registro, user_id: userId }, { onConflict: "user_id,fecha" });

  if (error) throw error;
}

/** Solo fecha y emoción; nunca incluye texto privado del paciente. */
export async function obtenerEmocionesPacienteVinculado(pacienteId: string) {
  const { data, error } = await supabase.rpc("emociones_paciente_vinculado", {
    p_paciente_id: pacienteId,
  });
  if (error) throw error;
  return (data ?? []) as RegistroEmocionalProfesional[];
}

/** Registros cuyo texto fue autorizado explícitamente por el paciente. */
export async function obtenerDiariosCompartidos(pacienteId: string) {
  const { data, error } = await supabase.rpc("diarios_compartidos_paciente", {
    p_paciente_id: pacienteId,
  });
  if (error) throw error;
  return (data ?? []) as RegistroCompartidoProfesional[];
}
