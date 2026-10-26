import { leerArchivoLocal } from "@/lib/archivos";
import { supabase } from "@/lib/supabase";

const BUCKET = "fotos-perfil";

/** URL pública de la foto, o null si no tiene. */
export const urlFotoPerfil = (path: string | null | undefined) =>
  path ? supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl : null;

/** Ruta de la foto del propio profesional. */
export async function obtenerMiFoto(userId: string) {
  const { data, error } = await supabase
    .from("profesionales")
    .select("foto_path")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return (data?.foto_path as string | null) ?? null;
}

/**
 * Sube la foto elegida con expo-image-picker, la guarda en el perfil y borra la anterior.
 * Cada subida usa un nombre nuevo para que la app no muestre la foto vieja desde la caché.
 */
export async function subirFotoPerfil(
  userId: string,
  uri: string,
  mimeType: string | null | undefined,
  anterior: string | null
) {
  const tipo = mimeType ?? "image/jpeg";
  const extension = tipo.split("/")[1] ?? "jpg";
  // La primera carpeta debe ser el id del usuario: así lo exigen las políticas de Storage
  const path = `${userId}/foto-${Date.now()}.${extension}`;
  const archivo = await leerArchivoLocal(uri);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, archivo, { contentType: tipo });
  if (uploadError) throw uploadError;

  const { error } = await supabase
    .from("profesionales")
    .update({ foto_path: path })
    .eq("user_id", userId);

  if (error) {
    await supabase.storage.from(BUCKET).remove([path]);
    throw error;
  }

  if (anterior) {
    const { error: removeError } = await supabase.storage.from(BUCKET).remove([anterior]);
    if (removeError) console.log("No se pudo borrar la foto anterior:", removeError.message);
  }

  return path;
}
