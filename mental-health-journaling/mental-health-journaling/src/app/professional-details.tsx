import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
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
              style={[s.avatar, { backgroundColor: c.backgroundElement }]}
              accessibilityLabel="Foto del profesional"
            >
              <Ionicons name="person" size={64} color={c.textSecondary} />
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

            <Text style={[s.description, { color: c.text }]}>
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
