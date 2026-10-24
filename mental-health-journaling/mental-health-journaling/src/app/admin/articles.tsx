import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";

import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
import { listarTodos, urlImagen, type Articulo } from "@/lib/articulos";

const s = appStyles.admin;

export default function GestionarArticulos() {
  const c = useTheme();
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [cargando, setCargando] = useState(true);

  // Se recarga al volver del editor
  useFocusEffect(
    useCallback(() => {
      listarTodos()
        .then(setArticulos)
        .catch((e) => console.log("Error al cargar los artículos:", e.message))
        .finally(() => setCargando(false));
    }, [])
  );

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
        <Text style={[s.topBarTitle, { color: c.text }]}>Artículos de interés</Text>
        <View style={s.backButton} />
      </View>

      <FlatList
        data={articulos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.scrollContent}
        ListHeaderComponent={
          <Pressable
            style={({ pressed }) => [
              s.button,
              s.newButton,
              { backgroundColor: c.accent },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/admin/article-editor")}
            accessibilityRole="button"
          >
            <Text style={[s.buttonText, { color: c.accentText }]}>+ Nuevo artículo</Text>
          </Pressable>
        }
        ListEmptyComponent={
          cargando ? (
            <ActivityIndicator color={c.accent} />
          ) : (
            <Text style={[s.emptyText, { color: c.textSecondary }]}>
              Aún no hay artículos. Crea el primero.
            </Text>
          )
        }
        ItemSeparatorComponent={() => <View style={s.separator} />}
        renderItem={({ item }) => {
          const imagen = urlImagen(item.imagen_path);
          return (
            <Pressable
              style={({ pressed }) => [
                s.card,
                { backgroundColor: c.backgroundElement },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() =>
                router.push({ pathname: "/admin/article-editor", params: { id: item.id } })
              }
              accessibilityRole="button"
              accessibilityLabel={`${item.titulo || "Sin título"}, ${item.publicado ? "publicado" : "oculto"}`}
            >
              {imagen ? (
                <Image source={{ uri: imagen }} style={s.thumbnail} contentFit="cover" />
              ) : (
                <View style={[s.thumbnail, s.thumbnailEmpty, { backgroundColor: c.backgroundSelected }]}>
                  <Ionicons name="image-outline" size={22} color={c.textSecondary} />
                </View>
              )}

              <View style={s.cardInfo}>
                <Text style={[s.cardTitle, { color: c.text }]} numberOfLines={2}>
                  {item.titulo || "Sin título"}
                </Text>
                <View style={s.badgeRow}>
                  <Ionicons
                    name={item.publicado ? "eye-outline" : "eye-off-outline"}
                    size={14}
                    color={c.textSecondary}
                  />
                  <Text style={[s.cardSubtitle, { color: c.textSecondary }]}>
                    {item.publicado ? "Publicado" : "Oculto"}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={c.textSecondary} />
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}
