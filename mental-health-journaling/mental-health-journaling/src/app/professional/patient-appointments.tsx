import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, SectionList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { CitaCard } from "@/components/cita-card";
import { appStyles } from "@/constants/app-styles";
import { useTheme } from "@/hooks/use-theme";
import { listarMisCitas, type Cita } from "@/lib/citas";
import { useCitas } from "@/providers/CitasProvider";

const s = appStyles.patientAppointments;

export default function CitasPaciente() {
  const c = useTheme();
  const { patientId, name } = useLocalSearchParams<{ patientId?: string; name?: string }>();
  const { version } = useCitas();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    if (!patientId) {
      setCargando(false);
      return;
    }
    try {
      setCitas((await listarMisCitas()).filter((cita) => cita.paciente_id === patientId));
    } catch (error) {
      Alert.alert("No se pudieron cargar las citas", (error as Error).message);
    } finally {
      setCargando(false);
    }
  }, [patientId]);

  useFocusEffect(
    useCallback(() => {
      void version;
      void cargar();
    }, [version, cargar])
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
      <View style={s.header}>
        <Pressable style={s.headerButton} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Volver">
          <Ionicons name="chevron-back" size={28} color={c.text} />
        </Pressable>
        <View style={s.headerInfo}>
          <Text style={[s.headerTitle, { color: c.text }]}>Citas</Text>
          {!!name && <Text style={[s.headerSubtitle, { color: c.textSecondary }]} numberOfLines={1}>{name}</Text>}
        </View>
        <View style={s.headerButton} />
      </View>

      <Pressable
        style={({ pressed }) => [s.addButton, { backgroundColor: c.accent }, pressed && { opacity: 0.8 }]}
        onPress={() => router.push({ pathname: "/professional/appointment-editor", params: { patientId, name } })}
        disabled={!patientId}
        accessibilityRole="button"
      >
        <Ionicons name="calendar-outline" size={20} color={c.accentText} />
        <Text style={[s.addButtonText, { color: c.accentText }]}>Agendar cita</Text>
      </Pressable>

      {cargando ? (
        <View style={s.center}><ActivityIndicator size="large" color={c.accent} /></View>
      ) : secciones.length === 0 ? (
        <View style={s.center}>
          <Ionicons name="calendar-clear-outline" size={48} color={c.textSecondary} />
          <Text style={[s.emptyTitle, { color: c.text }]}>Sin citas registradas</Text>
          <Text style={[s.emptyText, { color: c.textSecondary }]}>Agenda la primera hora para este paciente.</Text>
        </View>
      ) : (
        <SectionList
          sections={secciones}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CitaCard cita={item} />}
          renderSectionHeader={({ section }) => <Text style={[s.sectionTitle, { color: c.text }]}>{section.title}</Text>}
          contentContainerStyle={s.list}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
