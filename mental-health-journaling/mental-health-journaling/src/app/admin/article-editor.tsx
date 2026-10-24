import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
import {
  actualizarArticulo,
  crearArticulo,
  eliminarArticulo,
  eliminarImagen,
  obtenerArticulo,
  subirImagen,
  urlImagen,
} from "@/lib/articulos";

const s = appStyles.editorArticulo;

type ImagenLocal = { uri: string; mimeType?: string | null };

export default function EditorArticulo() {
  const c = useTheme();
  // Sin id se crea un artículo nuevo
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [cuerpo, setCuerpo] = useState("");
  const [imagenPath, setImagenPath] = useState<string | null>(null);
  const [imagenLocal, setImagenLocal] = useState<ImagenLocal | null>(null);
  const [publicado, setPublicado] = useState(false);
  const [cargando, setCargando] = useState(!!id);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!id) return;

    obtenerArticulo(id)
      .then((articulo) => {
        if (!articulo) {
          Alert.alert("Artículo no encontrado", "Puede que haya sido eliminado.");
          router.back();
          return;
        }
        setTitulo(articulo.titulo);
        setAutor(articulo.autor);
        setCuerpo(articulo.cuerpo);
        setImagenPath(articulo.imagen_path);
        setPublicado(articulo.publicado);
      })
      .catch((e) => Alert.alert("No se pudo cargar el artículo", e.message))
      .finally(() => setCargando(false));
  }, [id]);

  const vistaPrevia = imagenLocal?.uri ?? urlImagen(imagenPath);

  const faltantes = [
    !vistaPrevia && "imagen",
    !titulo.trim() && "título",
    !autor.trim() && "autor",
    !cuerpo.trim() && "cuerpo",
  ].filter(Boolean) as string[];

  const elegirImagen = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (resultado.canceled) return;
    const asset = resultado.assets[0];
    setImagenLocal({ uri: asset.uri, mimeType: asset.mimeType });
  };

  /** Guarda los datos. `publicar` cambia la visibilidad; si se omite, se mantiene la actual. */
  const guardar = async (publicar?: boolean) => {
    const destino = publicar ?? publicado;

    if (destino && faltantes.length > 0) {
      Alert.alert(
        "Faltan datos para publicar",
        `Completa: ${faltantes.join(", ")}. También puedes guardarlo oculto como borrador.`
      );
      return;
    }

    setGuardando(true);
    let nuevaRuta: string | null = null;

    try {
      if (imagenLocal) nuevaRuta = await subirImagen(imagenLocal.uri, imagenLocal.mimeType);

      const datos = {
        titulo: titulo.trim(),
        autor: autor.trim(),
        cuerpo: cuerpo.trim(),
        imagen_path: nuevaRuta ?? imagenPath,
        publicado: destino,
      };

      if (id) {
        await actualizarArticulo(id, datos);
      } else {
        await crearArticulo(datos);
      }

      // La imagen anterior ya no se usa
      if (nuevaRuta) await eliminarImagen(imagenPath);
    } catch (e) {
      // Si la imagen se subió pero el artículo no se guardó, se borra para no dejarla huérfana
      if (nuevaRuta) await eliminarImagen(nuevaRuta);
      Alert.alert("No se pudo guardar", (e as Error).message);
      setGuardando(false);
      return;
    }

    setGuardando(false);
    const mensaje =
      publicar === true
        ? "El artículo ya es visible para los usuarios."
        : publicar === false
          ? "El artículo ya no es visible para los usuarios."
          : "Los cambios se guardaron correctamente.";
    Alert.alert(publicar === true ? "Artículo publicado" : "Artículo guardado", mensaje);
    router.back();
  };

  const eliminar = () => {
    if (!id) return;

    Alert.alert("Eliminar artículo", "Esta acción no se puede deshacer.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          setGuardando(true);
          try {
            await eliminarArticulo({ id, imagen_path: imagenPath });
          } catch (e) {
            Alert.alert("No se pudo eliminar", (e as Error).message);
            setGuardando(false);
            return;
          }
          router.back();
        },
      },
    ]);
  };

  if (cargando) {
    return (
      <SafeAreaView style={[s.container, s.centered, { backgroundColor: c.background }]}>
        <ActivityIndicator color={c.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <View style={s.topBar}>
        <Pressable
          style={s.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={28} color={c.text} />
        </Pressable>
        <Text style={[s.topBarTitle, { color: c.text }]}>
          {id ? "Editar artículo" : "Nuevo artículo"}
        </Text>
        <View style={s.backButton} />
      </View>

      <KeyboardAvoidingView
        style={s.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={[s.status, { backgroundColor: c.backgroundElement }]}>
            <Ionicons
              name={publicado ? "eye-outline" : "eye-off-outline"}
              size={18}
              color={c.textSecondary}
            />
            <Text style={[s.statusText, { color: c.textSecondary }]}>
              {publicado
                ? "Publicado: los usuarios pueden verlo."
                : "Oculto: los usuarios no pueden verlo."}
            </Text>
          </View>

          <View style={s.field}>
            <Text style={[s.label, { color: c.text }]}>Imagen</Text>
            <Pressable
              style={[s.imagePicker, { backgroundColor: c.backgroundElement, borderColor: c.border }]}
              onPress={elegirImagen}
              accessibilityRole="button"
              accessibilityLabel={vistaPrevia ? "Cambiar imagen" : "Elegir imagen"}
            >
              {vistaPrevia ? (
                <Image source={{ uri: vistaPrevia }} style={s.imagePreview} contentFit="cover" />
              ) : (
                <View style={s.imagePlaceholder}>
                  <Ionicons name="image-outline" size={36} color={c.textSecondary} />
                  <Text style={[s.imageHint, { color: c.textSecondary }]}>Toca para elegir una imagen</Text>
                </View>
              )}
            </Pressable>
            {vistaPrevia && (
              <Text style={[s.imageHint, { color: c.textSecondary }]}>Toca la imagen para cambiarla</Text>
            )}
          </View>

          <View style={s.field}>
            <Text style={[s.label, { color: c.text }]}>Título</Text>
            <TextInput
              style={[s.input, { color: c.text, borderColor: c.border }]}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Título del artículo"
              placeholderTextColor={c.textSecondary}
            />
          </View>

          <View style={s.field}>
            <Text style={[s.label, { color: c.text }]}>Autor</Text>
            <TextInput
              style={[s.input, { color: c.text, borderColor: c.border }]}
              value={autor}
              onChangeText={setAutor}
              placeholder="Nombre del autor"
              placeholderTextColor={c.textSecondary}
              autoCapitalize="words"
            />
          </View>

          <View style={s.field}>
            <Text style={[s.label, { color: c.text }]}>Cuerpo</Text>
            <TextInput
              style={[s.input, s.textArea, { color: c.text, borderColor: c.border }]}
              value={cuerpo}
              onChangeText={setCuerpo}
              placeholder="Escribe el contenido del artículo..."
              placeholderTextColor={c.textSecondary}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={s.actions}>
            <Pressable
              style={[s.button, { backgroundColor: c.accent }, guardando && s.buttonDisabled]}
              onPress={() => guardar(!publicado)}
              disabled={guardando}
              accessibilityRole="button"
            >
              <Text style={[s.buttonText, { color: c.accentText }]}>
                {guardando ? "Guardando..." : publicado ? "Guardar y ocultar" : "Guardar y publicar"}
              </Text>
            </Pressable>

            <Pressable
              style={[s.button, s.buttonOutline, { borderColor: c.accent }, guardando && s.buttonDisabled]}
              onPress={() => guardar()}
              disabled={guardando}
              accessibilityRole="button"
            >
              <Text style={[s.buttonText, { color: c.accent }]}>
                {publicado ? "Guardar cambios" : "Guardar como borrador"}
              </Text>
            </Pressable>

            {id && (
              <Pressable
                style={[s.deleteButton, guardando && s.buttonDisabled]}
                onPress={eliminar}
                disabled={guardando}
                accessibilityRole="button"
              >
                <Ionicons name="trash-outline" size={18} color={c.error} />
                <Text style={[s.deleteText, { color: c.error }]}>Eliminar artículo</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
