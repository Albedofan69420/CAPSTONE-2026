import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, SectionList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

import { CitaCard } from "@/components/cita-card";
import { appStyles } from "@/constants/app-styles";
import { useTheme } from "@/hooks/use-theme";
import { listarMisCitas, type Cita } from "@/lib/citas";
import { useCitas } from "@/providers/CitasProvider";

const s = appStyles.professionalTabs;

export default function Citas() {
  const c = useTheme();
  const { version } = useCitas();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);

  const recargar = useCallback(async () => {
    try {
      setCitas(await listarMisCitas());
    } catch (error) {
      Alert.alert("No se pudieron cargar las citas", (error as Error).message);
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void version;
      void recargar();
    }, [version, recargar])
  );

  const secciones = useMemo(() => {
    const ahora = new Date().getTime();
    const proximas = citas.filter(
      (cita) => cita.estado === "confirmada" && !!cita.fecha_confirmada && new Date(cita.fecha_confirmada).getTime() >= ahora
    );
    const historial = citas.filter((cita) => !proximas.includes(cita));
    return [
      { title: "Próximas citas", data: proximas },
      { title: "Historial", data: historial },
    ].filter((seccion) => seccion.data.length > 0);
  }, [citas]);

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <Text style={[s.title, { color: c.text }]}>Mis citas</Text>
      {cargando ? (
        <View style={s.emptyState}><ActivityIndicator size="large" color={c.accent} /></View>
      ) : secciones.length === 0 ? (
        <View style={s.emptyState}>
          <Ionicons name="calendar-clear-outline" size={48} color={c.textSecondary} />
          <Text style={[s.emptyTitle, { color: c.text }]}>Aún no tienes citas</Text>
          <Text style={[s.emptyText, { color: c.textSecondary }]}>Tu psicólogo podrá agendar una hora desde tu ficha de paciente.</Text>
        </View>
      ) : (
        <SectionList
          sections={secciones}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CitaCard cita={item} />}
          renderSectionHeader={({ section }) => <Text style={[s.sectionLabel, { color: c.text }]}>{section.title}</Text>}
          contentContainerStyle={s.listContent}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
