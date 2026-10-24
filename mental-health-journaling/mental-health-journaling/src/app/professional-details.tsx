import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
import { obtenerProfesional } from "@/lib/profesionales";

const s = appStyles.professionalDetails;

export default function ProfessionalDetails() {
  const c = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const profesional = id ? obtenerProfesional(id) : undefined;

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
        {profesional ? (
          <View style={s.header}>
            <View
              style={[s.avatar, { backgroundColor: c.backgroundElement }]}
              accessibilityLabel="Foto del profesional"
            >
              <Ionicons name="person" size={64} color={c.textSecondary} />
            </View>
            <Text style={[s.name, { color: c.text }]}>{profesional.nombre}</Text>
            <Text style={[s.specialty, { color: c.textSecondary }]}>
              {profesional.profesion}
            </Text>

            <View
              style={s.stars}
              accessible
              accessibilityLabel={`Calificación: ${profesional.calificacion} de 5 estrellas`}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <Ionicons
                  key={n}
                  name={n <= profesional.calificacion ? "star" : "star-outline"}
                  size={22}
                  color={c.accent}
                />
              ))}
            </View>

            <Text style={[s.description, { color: c.text }]}>{profesional.descripcion}</Text>
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
