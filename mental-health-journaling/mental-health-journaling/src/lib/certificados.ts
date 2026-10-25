import { supabase } from "@/lib/supabase";

export type TipoCertificado = "prestador" | "inhabilidad";

export type Estado = "pendiente_documentos" | "en_revision" | "aprobado" | "rechazado";

export type EstadoProfesional = {
  estado: Estado;
  cert_prestador_path: string | null;
  cert_inhabilidad_path: string | null;
  motivo_rechazo: string | null;
  created_at: string;
};

export const BUCKET_CERTIFICADOS = "certificados";
const DIAS_PLAZO = 7;

export const CERTIFICADOS: { tipo: TipoCertificado; titulo: string }[] = [
  { tipo: "prestador", titulo: "Certificado de Prestador Individual de Salud" },
  { tipo: "inhabilidad", titulo: "Certificado de inhabilitación para trabajar con menores" },
];

// Columna de public.profesionales donde se guarda cada certificado
export const COLUMNA: Record<TipoCertificado, "cert_prestador_path" | "cert_inhabilidad_path"> = {
  prestador: "cert_prestador_path",
  inhabilidad: "cert_inhabilidad_path",
};

/** Fila del profesional (la crea un trigger al registrarse). */
export async function obtenerEstadoProfesional(userId: string) {
  const { data, error } = await supabase
    .from("profesionales")
    .select("estado, cert_prestador_path, cert_inhabilidad_path, motivo_rechazo, created_at")
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

/** Recordatorio del plazo, igual en la pantalla de certificados y en el inicio del profesional. */
export function mensajePlazo(createdAt: string) {
  const fecha = new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long" }).format(
    fechaLimite(createdAt)
  );
  return `Si no subes tus certificados en un plazo de ${DIAS_PLAZO} días, tu cuenta será eliminada (hasta el ${fecha}).`;
}

/**
 * Sube el PDF al bucket privado y guarda su ruta. Cada subida usa un nombre nuevo para que
 * la base de datos detecte el cambio y la solicitud vuelva a revisión; el archivo anterior se borra.
 */
export async function subirCertificado(
  userId: string,
  tipo: TipoCertificado,
  uri: string,
  anterior: string | null
) {
  // La primera carpeta debe ser el id del usuario: así lo exigen las políticas de Storage
  const path = `${userId}/${tipo}-${Date.now()}.pdf`;
  const archivo = await fetch(uri).then((res) => res.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_CERTIFICADOS)
    .upload(path, archivo, { contentType: "application/pdf" });
  if (uploadError) throw uploadError;

  const { error } = await supabase
    .from("profesionales")
    .update({ [COLUMNA[tipo]]: path })
    .eq("user_id", userId);

  if (error) {
    await supabase.storage.from(BUCKET_CERTIFICADOS).remove([path]);
    throw error;
  }

  if (anterior) {
    const { error: removeError } = await supabase.storage.from(BUCKET_CERTIFICADOS).remove([anterior]);
    if (removeError) console.log("No se pudo borrar el certificado anterior:", removeError.message);
  }

  return path;
}
