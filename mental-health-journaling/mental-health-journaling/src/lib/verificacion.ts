import { BUCKET_CERTIFICADOS, type Estado } from "@/lib/certificados";
import { supabase } from "@/lib/supabase";

// Fila que devuelve la función public.solicitudes_profesionales (solo para el administrador)
export type Solicitud = {
  user_id: string;
  nombre: string | null;
  apellido: string | null;
  email: string;
  run: string;
  estado: Exclude<Estado, "pendiente_documentos">;
  cert_prestador_path: string | null;
  cert_inhabilidad_path: string | null;
  motivo_rechazo: string | null;
  updated_at: string;
};

export async function listarSolicitudes(estado: Solicitud["estado"]) {
  const { data, error } = await supabase.rpc("solicitudes_profesionales", { p_estado: estado });
  if (error) throw error;
  return data as Solicitud[];
}

export async function obtenerSolicitud(userId: string) {
  const { data, error } = await supabase.rpc("solicitudes_profesionales", { p_user_id: userId });
  if (error) throw error;
  return ((data as Solicitud[])[0] ?? null) as Solicitud | null;
}

export async function revisarSolicitud(userId: string, aprobado: boolean, motivo?: string) {
  const { error } = await supabase.rpc("revisar_profesional", {
    p_user_id: userId,
    p_aprobado: aprobado,
    p_motivo: motivo ?? null,
  });
  if (error) throw error;
}

/** URL temporal (10 minutos) para abrir un certificado del bucket privado. */
export async function urlCertificado(path: string) {
  const { data, error } = await supabase.storage
    .from(BUCKET_CERTIFICADOS)
    .createSignedUrl(path, 60 * 10);
  if (error) throw error;
  return data.signedUrl;
}

export const nombreCompleto = (s: Pick<Solicitud, "nombre" | "apellido" | "email">) =>
  [s.nombre, s.apellido].filter(Boolean).join(" ") || s.email;
