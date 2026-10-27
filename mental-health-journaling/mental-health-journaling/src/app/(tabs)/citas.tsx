import { useCallback, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

import { CitaCard } from "@/components/cita-card";
import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
import { listarMisCitas, type Cita } from "@/lib/citas";
import { useCitas } from "@/providers/CitasProvider";

// Mismo diseño que la pestaña Pacientes del profesional
const s = appStyles.professionalTabs;

// Pestaña Citas del usuario común: solo aparece cuando tiene al menos una solicitud ((tabs)/_layout.tsx)
export default function Citas() {
  const c = useTheme();
  const { version } = useCitas();
  const [citas, setCitas] = useState<Cita[]>([]);

  const recargar = useCallback(() => {
    listarMisCitas()
      .then(setCitas)
      .catch((e) => console.log("Error al cargar las citas:", e.message));
  }, []);

  // Al entrar a la pestaña y cada vez que llega un mensaje o cambia una cita
  useFocusEffect(recargar);
  useEffect(recargar, [version, recargar]);

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <Text style={[s.title, { color: c.text }]}>Citas</Text>

      <FlatList
        data={citas}
        keyExtractor={(cita) => cita.id}
        renderItem={({ item }) => <CitaCard cita={item} />}
        contentContainerStyle={s.listContent}
        ListEmptyComponent={
          <View style={s.emptyState}>
            <Ionicons name="chatbubbles-outline" size={48} color={c.textSecondary} />
            <Text style={[s.emptyText, { color: c.textSecondary }]}>
              Aún no tienes citas. Puedes solicitar una desde el perfil de un profesional.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
