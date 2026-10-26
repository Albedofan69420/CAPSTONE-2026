import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";

import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
import { urlFotoPerfil } from "@/lib/foto-perfil";
import {
  DESCRIPCION_POR_DEFECTO,
  ESPECIALIDAD_POR_DEFECTO,
  nombreProfesional,
  obtenerProfesional,
  type Profesional,
} from "@/lib/profesionales";

const s = appStyles.professionalDetails;

export default function ProfessionalDetails() {
  const c = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [profesional, setProfesional] = useState<Profesional | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Si el profesional deja de estar aprobado, la base de datos no lo devuelve
    obtenerProfesional(id)
      .then(setProfesional)
      .catch((e) => console.log("Error al cargar el profesional:", e.message))
      .finally(() => setCargando(false));
  }, [id]);

  const datos = (
    [
      { label: "Edad", valor: profesional?.edad != null ? `${profesional.edad} años` : null, icono: "calendar-outline" },
      { label: "Género", valor: profesional?.genero, icono: "person-outline" },
      { label: "Región", valor: profesional?.region, icono: "map-outline" },
      { label: "Comuna", valor: profesional?.comuna, icono: "location-outline" },
    ] as const
  ).filter((d): d is typeof d & { valor: string } => !!d.valor);

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

      <ScrollView contentContainerStyle={s.scrollContent}>
        {cargando ? (
          <ActivityIndicator style={s.loading} color={c.accent} />
        ) : profesional ? (
          <View style={s.header}>
            <View
              style={[s.avatar, s.avatarClip, { backgroundColor: c.backgroundElement }]}
              accessibilityLabel="Foto del profesional"
            >
              {profesional.foto_path ? (
                <Image
                  source={{ uri: urlFotoPerfil(profesional.foto_path) ?? undefined }}
                  style={s.avatarImage}
                  contentFit="cover"
                />
              ) : (
                <Ionicons name="person" size={64} color={c.textSecondary} />
              )}
            </View>
            <Text style={[s.name, { color: c.text }]}>{nombreProfesional(profesional)}</Text>
            <Text style={[s.specialty, { color: c.textSecondary }]}>
              {profesional.especialidad || ESPECIALIDAD_POR_DEFECTO}
            </Text>

            {/* Placeholder: aún no existe un sistema de calificaciones */}
            <View style={s.stars} accessible accessibilityLabel="Sin calificaciones aún">
              {[1, 2, 3, 4, 5].map((n) => (
                <Ionicons key={n} name="star-outline" size={22} color={c.accent} />
              ))}
            </View>
            <Text style={[s.ratingText, { color: c.textSecondary }]}>Sin calificaciones aún</Text>

            {/* Solo se muestran los datos que el profesional completó */}
            {datos.length > 0 && (
              <View style={[s.info, { backgroundColor: c.backgroundElement }]}>
                {datos.map(({ label, valor, icono }) => (
                  <View key={label} style={s.infoRow}>
                    <Ionicons name={icono} size={18} color={c.accent} />
                    <Text style={[s.infoLabel, { color: c.textSecondary }]}>{label}</Text>
                    <Text style={[s.infoValue, { color: c.text }]}>{valor}</Text>
                  </View>
                ))}
              </View>
            )}

            <Text style={[s.description, datos.length > 0 && s.descriptionAfterInfo, { color: c.text }]}>
              {profesional.descripcion || DESCRIPCION_POR_DEFECTO}
            </Text>
          </View>
        ) : (
          <Text style={[s.notFound, { color: c.textSecondary }]}>
            No encontramos a este profesional.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
