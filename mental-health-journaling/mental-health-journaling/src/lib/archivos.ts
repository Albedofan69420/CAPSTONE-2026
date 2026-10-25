import { File } from "expo-file-system";

/**
 * Lee un archivo local (de expo-image-picker o expo-document-picker) para subirlo a Supabase Storage.
 * Se usa expo-file-system en vez de fetch(uri): en Expo SDK 57 el fetch global es expo/fetch, y leer
 * archivos locales con él puede devolver un archivo vacío sin dar error.
 */
export async function leerArchivoLocal(uri: string) {
  const archivo = new File(uri);

  if (!archivo.exists) {
    throw new Error("No se encontró el archivo seleccionado. Vuelve a elegirlo.");
  }

  const contenido = await archivo.arrayBuffer();

  // Evita subir archivos vacíos, que Storage acepta pero no se pueden ver
  if (contenido.byteLength === 0) {
    throw new Error("El archivo seleccionado está vacío o no se pudo leer. Vuelve a elegirlo.");
  }

  return contenido;
}
