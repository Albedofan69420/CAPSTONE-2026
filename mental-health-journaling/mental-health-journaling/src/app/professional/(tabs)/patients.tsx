import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, SectionList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";

import { PatientCard } from "@/components/patient-card";
import { appStyles } from "@/constants/app-styles";
import { useTheme } from "@/hooks/use-theme";
import {
  escucharVinculaciones,
  listarMisPacientes,
  type PacienteVinculado,
} from "@/lib/vinculaciones";

const s = appStyles.professionalTabs;

export default function Pacientes() {
  const c = useTheme();
  const [pacientes, setPacientes] = useState<PacienteVinculado[]>([]);
  const [cargando, setCargando] = useState(true);

  const recargar = useCallback(async () => {
    try {
      setPacientes(await listarMisPacientes());
    } catch (error) {
      Alert.alert("No se pudieron cargar los pacientes", (error as Error).message);
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(useCallback(() => void recargar(), [recargar]));
  useEffect(() => escucharVinculaciones(() => void recargar()), [recargar]);

  const secciones = useMemo(
    () =>
      [
        { title: "Pacientes activos", data: pacientes.filter((p) => p.estado === "activa") },
        { title: "Historial", data: pacientes.filter((p) => p.estado === "finalizada") },
      ].filter((seccion) => seccion.data.length > 0),
    [pacientes]
  );

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <View style={s.patientsHeader}>
        <Text style={[s.title, { color: c.text }]}>Mis pacientes</Text>
        <Pressable
          style={({ pressed }) => [s.inviteButton, { backgroundColor: c.accent }, pressed && { opacity: 0.8 }]}
          onPress={() => router.push("/professional/invite-patient")}
          accessibilityRole="button"
          accessibilityLabel="Invitar paciente"
        >
          <Ionicons name="person-add-outline" size={18} color={c.accentText} />
          <Text style={[s.inviteButtonText, { color: c.accentText }]}>Invitar</Text>
        </Pressable>
      </View>

      {cargando ? (
        <View style={s.emptyState}><ActivityIndicator size="large" color={c.accent} /></View>
      ) : secciones.length === 0 ? (
        <View style={s.emptyState}>
          <Ionicons name="people-outline" size={48} color={c.textSecondary} />
          <Text style={[s.emptyTitle, { color: c.text }]}>Aún no tienes pacientes</Text>
          <Text style={[s.emptyText, { color: c.textSecondary }]}>Genera una invitación para vincular al primer paciente.</Text>
        </View>
      ) : (
        <SectionList
          sections={secciones}
          keyExtractor={(paciente) => paciente.id}
          renderItem={({ item }) => <PatientCard paciente={item} />}
          renderSectionHeader={({ section }) => (
            <Text style={[s.sectionLabel, { color: c.text }]}>{section.title}</Text>
          )}
          contentContainerStyle={s.listContent}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
