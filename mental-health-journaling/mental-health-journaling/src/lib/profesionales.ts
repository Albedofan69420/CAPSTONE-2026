import { supabase } from "@/lib/supabase";

// Fila que devuelve public.profesionales_aprobados: solo profesionales verificados y solo datos públicos
export type Profesional = {
  user_id: string;
  nombre: string | null;
  apellido: string | null;
  especialidad: string | null;
  descripcion: string | null;
};

// Textos para los datos que el profesional aún no completa
export const ESPECIALIDAD_POR_DEFECTO = "Profesional de la salud";
export const DESCRIPCION_POR_DEFECTO = "Este profesional aún no ha agregado una descripción.";

export const nombreProfesional = (p: Pick<Profesional, "nombre" | "apellido">) =>
  [p.nombre, p.apellido].filter(Boolean).join(" ");

/** Profesionales aprobados por el administrador. */
export async function listarProfesionales() {
  const { data, error } = await supabase.rpc("profesionales_aprobados");
  if (error) throw error;
  return data as Profesional[];
}

// Límite de la descripción pública (también en la base de datos)
export const DESCRIPCION_MAX = 1000;

/** Descripción que el propio profesional escribió para su perfil público. */
export async function obtenerMiDescripcion(userId: string) {
  const { data, error } = await supabase
    .from("profesionales")
    .select("descripcion")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return (data?.descripcion as string | null) ?? "";
}

export async function actualizarMiDescripcion(userId: string, descripcion: string) {
  const { error } = await supabase
    .from("profesionales")
    .update({ descripcion: descripcion.trim() || null })
    .eq("user_id", userId);

  if (error) throw error;
}

/** Un profesional aprobado, o null si no existe o no está aprobado. */
export async function obtenerProfesional(userId: string) {
  const { data, error } = await supabase.rpc("profesionales_aprobados", { p_user_id: userId });
  if (error) throw error;
  return ((data as Profesional[])[0] ?? null) as Profesional | null;
}
