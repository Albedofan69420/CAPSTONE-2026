import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
import { urlFotoPerfil } from "@/lib/foto-perfil";
import {
  ESPECIALIDAD_POR_DEFECTO,
  listarProfesionales,
  nombreProfesional,
  type Profesional,
} from "@/lib/profesionales";

const s = appStyles.profesionales;

export default function Profesionales() {
  const c = useTheme();
  const params = useLocalSearchParams<{
    region?: string;
    comuna?: string;
    tipoAtencion?: string;
    especialidad?: string;
  }>();
  const [busqueda, setBusqueda] = useState("");
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [cargando, setCargando] = useState(true);

  // Solo llegan los profesionales con sus dos certificados aprobados (lo filtra la base de datos)
  useFocusEffect(
    useCallback(() => {
      listarProfesionales()
        .then(setProfesionales)
        .catch((e) => console.log("Error al cargar los profesionales:", e.message))
        .finally(() => setCargando(false));
    }, [])
  );

  const filtrosActivos = [params.region, params.comuna, params.tipoAtencion, params.especialidad].filter(Boolean).length;
  const filtrados = profesionales.filter((p) => {
    const coincideBusqueda = `${nombreProfesional(p)} ${p.especialidad ?? ""}`
      .toLowerCase()
      .includes(busqueda.trim().toLowerCase());
    const coincideRegion = !params.region || p.region === params.region;
    const coincideComuna = !params.comuna || p.comuna === params.comuna;
    const coincideEspecialidad = !params.especialidad || p.especialidad === params.especialidad;

    return coincideBusqueda && coincideRegion && coincideComuna && coincideEspecialidad;
  });

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <Text style={[s.title, { color: c.text }]}>Profesionales</Text>

      <View style={s.searchRow}>
        <View style={[s.searchBar, { backgroundColor: c.backgroundElement }]}>
          <Ionicons name="search" size={20} color={c.textSecondary} />
          <TextInput
            style={[s.searchInput, { color: c.text }]}
            placeholder="Buscar profesional"
            placeholderTextColor={c.textSecondary}
            value={busqueda}
            onChangeText={setBusqueda}
            returnKeyType="search"
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            s.filterButton,
            { backgroundColor: c.accent },
            pressed && { opacity: 0.8 },
          ]}
          onPress={() =>
            router.push({
              pathname: "/filters",
              params: {
                ...(params.region ? { region: params.region } : {}),
                ...(params.comuna ? { comuna: params.comuna } : {}),
                ...(params.tipoAtencion ? { tipoAtencion: params.tipoAtencion } : {}),
                ...(params.especialidad ? { especialidad: params.especialidad } : {}),
              },
            })
          }
          accessibilityRole="button"
          accessibilityLabel={filtrosActivos ? `Filtrar, ${filtrosActivos} filtros activos` : "Filtrar"}
        >
          <Ionicons name="options-outline" size={22} color={c.accentText} />
          {filtrosActivos > 0 && <View style={[s.filterBadge, { backgroundColor: c.error }]} />}
        </Pressable>
      </View>

      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.user_id}
        contentContainerStyle={s.list}
        ListEmptyComponent={
          cargando ? (
            <ActivityIndicator color={c.accent} />
          ) : (
            <Text style={[s.emptyText, { color: c.textSecondary }]}>
              {busqueda.trim() || filtrosActivos
                ? "No encontramos profesionales con esos criterios."
                : "Aún no hay profesionales disponibles."}
            </Text>
          )
        }
        renderItem={({ item }) => {
          const nombre = nombreProfesional(item);
          const especialidad = item.especialidad || ESPECIALIDAD_POR_DEFECTO;
          return (
            <Pressable
              style={({ pressed }) => [
                s.card,
                { backgroundColor: c.backgroundElement },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() =>
                router.push({ pathname: "/professional-details", params: { id: item.user_id } })
              }
              accessibilityRole="button"
              accessibilityLabel={`Ver perfil de ${nombre}, ${especialidad}`}
            >
              {item.foto_path ? (
                <Image
                  source={{ uri: urlFotoPerfil(item.foto_path) ?? undefined }}
                  style={s.photo}
                  contentFit="cover"
                />
              ) : (
                <View style={[s.photo, s.photoPlaceholder, { backgroundColor: c.backgroundSelected }]}>
                  <Ionicons name="person" size={32} color={c.textSecondary} />
                </View>
              )}
              <View style={s.cardInfo}>
                <Text style={[s.name, { color: c.text }]}>{nombre}</Text>
                <Text style={[s.profession, { color: c.textSecondary }]}>{especialidad}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={c.textSecondary} />
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}
