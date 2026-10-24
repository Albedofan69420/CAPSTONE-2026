import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
import { obtenerArticulo, urlImagen, type Articulo } from "@/lib/articulos";

const s = appStyles.articulo;

export default function VerArticulo() {
  const c = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [articulo, setArticulo] = useState<Articulo | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Las políticas RLS solo devuelven el artículo si está publicado
    obtenerArticulo(id)
      .then(setArticulo)
      .catch((e) => console.log("Error al cargar el artículo:", e.message))
      .finally(() => setCargando(false));
  }, [id]);

  const imagen = urlImagen(articulo?.imagen_path ?? null);

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
      </View>

      {cargando ? (
        <ActivityIndicator style={s.loading} color={c.accent} />
      ) : !articulo ? (
        <Text style={[s.notFound, { color: c.textSecondary }]}>
          Este artículo ya no está disponible.
        </Text>
      ) : (
        <ScrollView contentContainerStyle={s.scrollContent}>
          {imagen && <Image source={{ uri: imagen }} style={s.image} contentFit="cover" />}
          <Text style={[s.title, { color: c.text }]}>{articulo.titulo}</Text>
          <Text style={[s.author, { color: c.textSecondary }]}>Por {articulo.autor}</Text>
          <Text style={[s.body, { color: c.text }]}>{articulo.cuerpo}</Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
