import { supabase } from "@/lib/supabase";

export type TipoCertificado = "prestador" | "inhabilidad";

export type EstadoProfesional = {
  estado: "pendiente_documentos" | "en_revision" | "aprobado" | "rechazado";
  cert_prestador_path: string | null;
  cert_inhabilidad_path: string | null;
  created_at: string;
};

const BUCKET = "certificados";
const DIAS_PLAZO = 7;

// Columna de public.profesionales donde se guarda cada certificado
const COLUMNA: Record<TipoCertificado, keyof EstadoProfesional> = {
  prestador: "cert_prestador_path",
  inhabilidad: "cert_inhabilidad_path",
};

/** Fila del profesional (la crea un trigger al registrarse). */
export async function obtenerEstadoProfesional(userId: string) {
  const { data, error } = await supabase
    .from("profesionales")
    .select("estado, cert_prestador_path, cert_inhabilidad_path, created_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data as EstadoProfesional | null;
}

/** Fecha en que se elimina la cuenta si no se suben los certificados. */
export function fechaLimite(createdAt: string) {
  const fecha = new Date(createdAt);
  fecha.setDate(fecha.getDate() + DIAS_PLAZO);
  return fecha;
}

/** Sube el PDF al bucket privado y guarda su ruta. Si ya existía, lo reemplaza. */
export async function subirCertificado(userId: string, tipo: TipoCertificado, uri: string) {
  // La primera carpeta debe ser el id del usuario: así lo exigen las políticas de Storage
  const path = `${userId}/${tipo}.pdf`;
  const archivo = await fetch(uri).then((res) => res.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, archivo, { contentType: "application/pdf", upsert: true });
  if (uploadError) throw uploadError;

  const { error } = await supabase
    .from("profesionales")
    .update({ [COLUMNA[tipo]]: path })
    .eq("user_id", userId);
  if (error) throw error;

  return path;
}
