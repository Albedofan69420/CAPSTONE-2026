import { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";

import { WeekStrip } from "@/components/week-strip";
import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
import { mensajePlazo, obtenerEstadoProfesional, type EstadoProfesional } from "@/lib/certificados";
import { useAuth } from "@/providers/AuthProvider";

const s = appStyles.professionalTabs;

// Inicio provisorio del profesional
export default function InicioProfesional() {
  const c = useTheme();
  const { session } = useAuth();
  const [estado, setEstado] = useState<EstadoProfesional | null>(null);
  const [fecha, setFecha] = useState(new Date());

  // Se recarga al volver, por ejemplo después de subir los certificados desde Perfil
  useFocusEffect(
    useCallback(() => {
      if (!session) return;
      obtenerEstadoProfesional(session.user.id)
        .then(setEstado)
        .catch((e) => console.log("Error al cargar el estado del profesional:", e.message));
    }, [session])
  );

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      {/* Mismo calendario que el usuario común, sin marcas del diario */}
      <WeekStrip selectedDate={fecha} onSelectDate={setFecha} />

      {/* Solo mientras no haya enviado sus dos certificados a revisión */}
      {estado?.estado === "pendiente_documentos" && (
        <Pressable
          style={({ pressed }) => [
            s.reminder,
            { backgroundColor: c.backgroundElement, borderColor: c.accent },
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => router.push("/professional/certificates")}
          accessibilityRole="button"
          accessibilityLabel={`Sube tus certificados. ${mensajePlazo(estado.created_at)}`}
        >
          <Ionicons name="time-outline" size={22} color={c.accent} />
          <View style={s.reminderInfo}>
            <Text style={[s.reminderTitle, { color: c.text }]}>Sube tus certificados</Text>
            <Text style={[s.reminderText, { color: c.textSecondary }]}>
              {mensajePlazo(estado.created_at)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={c.textSecondary} />
        </Pressable>
      )}
    </SafeAreaView>
  );
}
