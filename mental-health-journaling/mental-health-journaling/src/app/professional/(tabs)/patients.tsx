import { useCallback, useEffect, useState } from "react";
import { SectionList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

import { CitaCard } from "@/components/cita-card";
import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
import { listarMisCitas, type Cita } from "@/lib/citas";
import { useCitas } from "@/providers/CitasProvider";

const s = appStyles.professionalTabs;

// Solicitudes por coordinar, citas confirmadas y el historial del profesional
export default function Pacientes() {
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

  const secciones = [
    { title: "Solicitudes por coordinar", data: citas.filter((x) => x.estado === "pendiente") },
    { title: "Citas confirmadas", data: citas.filter((x) => x.estado === "confirmada") },
    {
      title: "Historial",
      data: citas.filter((x) => x.estado === "rechazada" || x.estado === "cancelada"),
    },
  ].filter((seccion) => seccion.data.length > 0);

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <Text style={[s.title, { color: c.text }]}>Pacientes</Text>

      {secciones.length === 0 ? (
        <View style={s.emptyState}>
          <Ionicons name="people-outline" size={48} color={c.textSecondary} />
          <Text style={[s.emptyText, { color: c.textSecondary }]}>
            Aún no tienes solicitudes de cita.
          </Text>
        </View>
      ) : (
        <SectionList
          sections={secciones}
          keyExtractor={(cita) => cita.id}
          renderItem={({ item }) => <CitaCard cita={item} />}
          renderSectionHeader={({ section }) => (
            <Text style={[s.sectionLabel, { color: c.text }]}>{section.title}</Text>
          )}
          contentContainerStyle={s.listContent}
          stickySectionHeadersEnabled={false}
        />
      )}
    </SafeAreaView>
  );
}
