import { supabase } from "@/lib/supabase";

// Fila que devuelve public.profesionales_aprobados: solo profesionales verificados y solo datos públicos
export type Profesional = {
  user_id: string;
  nombre: string | null;
  apellido: string | null;
  especialidad: string | null;
  descripcion: string | null;
  // Ruta en el bucket "fotos-perfil" (ver src/lib/foto-perfil.ts)
  foto_path: string | null;
  // Calculada en la base de datos: la fecha de nacimiento nunca llega a los usuarios comunes
  edad: number | null;
  genero: string | null;
  region: string | null;
  comuna: string | null;
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

// Mismas opciones que la restricción genero_valido en la base de datos
export const GENEROS = ["Femenino", "Masculino", "Otro", "Prefiero no decir"];

// Datos personales del profesional (columnas de su propia fila en public.profesionales)
export type DatosProfesional = {
  fecha_nacimiento: string | null; // YYYY-MM-DD
  genero: string | null;
  region: string | null;
  comuna: string | null;
};

export async function obtenerMisDatos(userId: string) {
  const { data, error } = await supabase
    .from("profesionales")
    .select("fecha_nacimiento, genero, region, comuna")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return (data ?? { fecha_nacimiento: null, genero: null, region: null, comuna: null }) as DatosProfesional;
}

export async function actualizarMisDatos(userId: string, datos: DatosProfesional) {
  const { error } = await supabase.from("profesionales").update(datos).eq("user_id", userId);
  if (error) throw error;
}

/** "YYYY-MM-DD" -> "DD/MM/AAAA" */
export const fechaATexto = (fecha: string | null) => {
  if (!fecha) return "";
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
};

/** Agrega las barras mientras se escribe: 01011990 -> 01/01/1990 */
export const formatearFechaEscrita = (texto: string) => {
  const digitos = texto.replace(/\D/g, "").slice(0, 8);
  return [digitos.slice(0, 2), digitos.slice(2, 4), digitos.slice(4)].filter(Boolean).join("/");
};

/** "DD/MM/AAAA" -> "YYYY-MM-DD", o null si no es una fecha real, futura o anterior a 1900. */
export const textoAFecha = (texto: string) => {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  if (!partes) return null;

  const [, dia, mes, anio] = partes.map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  const esReal =
    fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && fecha.getDate() === dia;
  if (!esReal || anio < 1900 || fecha > new Date()) return null;

  return `${partes[3]}-${partes[2]}-${partes[1]}`;
};

/** Edad en años a partir de "YYYY-MM-DD". */
export const calcularEdad = (fecha: string) => {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const hoy = new Date();
  const yaCumplio =
    hoy.getMonth() + 1 > mes || (hoy.getMonth() + 1 === mes && hoy.getDate() >= dia);
  return hoy.getFullYear() - anio - (yaCumplio ? 0 : 1);
};

/** Un profesional aprobado, o null si no existe o no está aprobado. */
export async function obtenerProfesional(userId: string) {
  const { data, error } = await supabase.rpc("profesionales_aprobados", { p_user_id: userId });
  if (error) throw error;
  return ((data as Profesional[])[0] ?? null) as Profesional | null;
}
