import { leerArchivoLocal } from "@/lib/archivos";
import { supabase } from "@/lib/supabase";

// Columnas de la tabla public.articulos (ver supabase/migrations)
export type Articulo = {
  id: string;
  titulo: string;
  autor: string;
  cuerpo: string;
  imagen_path: string | null;
  publicado: boolean;
  updated_at: string;
};

export type DatosArticulo = Pick<Articulo, "titulo" | "autor" | "cuerpo" | "imagen_path">;

const BUCKET = "articulos";
const COLUMNAS = "id, titulo, autor, cuerpo, imagen_path, publicado, updated_at";

/** URL pública de la imagen guardada en Storage. */
export const urlImagen = (path: string | null) =>
  path ? supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl : null;

/** Un artículo solo se puede publicar si tiene imagen, título, autor y cuerpo. */
export const estaCompleto = (a: DatosArticulo) =>
  !!a.imagen_path && !!a.titulo.trim() && !!a.autor.trim() && !!a.cuerpo.trim();

/** Artículos visibles para los usuarios comunes. */
export async function listarPublicados() {
  const { data, error } = await supabase
    .from("articulos")
    .select(COLUMNAS)
    .eq("publicado", true)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data as Articulo[];
}

/** Todos los artículos, publicados u ocultos. Las políticas RLS lo permiten solo al administrador. */
export async function listarTodos() {
  const { data, error } = await supabase
    .from("articulos")
    .select(COLUMNAS)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data as Articulo[];
}

export async function obtenerArticulo(id: string) {
  const { data, error } = await supabase
    .from("articulos")
    .select(COLUMNAS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as Articulo | null;
}

/** Crea un artículo (oculto por defecto) y devuelve su id. */
export async function crearArticulo(datos: DatosArticulo & { publicado: boolean }) {
  const { data, error } = await supabase.from("articulos").insert(datos).select("id").single();

  if (error) throw error;
  return data.id as string;
}

export async function actualizarArticulo(
  id: string,
  datos: Partial<DatosArticulo & { publicado: boolean }>
) {
  const { error } = await supabase.from("articulos").update(datos).eq("id", id);
  if (error) throw error;
}

export async function eliminarArticulo(articulo: Pick<Articulo, "id" | "imagen_path">) {
  const { error } = await supabase.from("articulos").delete().eq("id", articulo.id);
  if (error) throw error;
  await eliminarImagen(articulo.imagen_path);
}

/** Sube una imagen elegida con expo-image-picker y devuelve su ruta en el bucket. */
export async function subirImagen(uri: string, mimeType?: string | null) {
  const tipo = mimeType ?? "image/jpeg";
  const extension = tipo.split("/")[1] ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

  // Se sube como ArrayBuffer, leído con expo-file-system (ver src/lib/archivos.ts)
  const archivo = await leerArchivoLocal(uri);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, archivo, { contentType: tipo });

  if (error) throw error;
  return path;
}

/** Borra una imagen del bucket. Si falla, solo queda un archivo sin usar, así que no se interrumpe al usuario. */
export async function eliminarImagen(path: string | null) {
  if (!path) return;
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) console.log("No se pudo borrar la imagen:", error.message);
}
