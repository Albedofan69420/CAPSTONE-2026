import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { nombrePaciente } from "@/components/patient-card";
import { appStyles } from "@/constants/app-styles";
import { useTheme } from "@/hooks/use-theme";
import {
  finalizarVinculacionPaciente,
  obtenerPacienteVinculado,
  type PacienteVinculado,
} from "@/lib/vinculaciones";

const s = appStyles.patientDetails;

const fechaTexto = (fecha: string) =>
  new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(fecha)
  );

const proximasSecciones = [
  { icono: "calendar-outline" as const, titulo: "Citas", detalle: "Horas agendadas con el paciente" },
  { icono: "analytics-outline" as const, titulo: "Dashboard emocional", detalle: "Emociones registradas por el paciente" },
  { icono: "journal-outline" as const, titulo: "Registros compartidos", detalle: "Entradas que el paciente autorice" },
];

export default function DetallePaciente() {
  const c = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [paciente, setPaciente] = useState<PacienteVinculado | null>(null);
  const [cargando, setCargando] = useState(true);
  const [finalizando, setFinalizando] = useState(false);

  const cargar = useCallback(async () => {
    if (!id) {
      setCargando(false);
      return;
    }
    try {
      setPaciente(await obtenerPacienteVinculado(id));
    } catch (error) {
      Alert.alert("No se pudo cargar el paciente", (error as Error).message);
    } finally {
      setCargando(false);
    }
  }, [id]);

  useFocusEffect(useCallback(() => void cargar(), [cargar]));

  const confirmarFinalizacion = () => {
    if (!paciente || finalizando) return;
    Alert.alert(
      "Finalizar vinculación",
      "El paciente pasará al historial. Sus registros no se eliminarán, pero dejará de estar vinculado contigo.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Finalizar",
          style: "destructive",
          onPress: async () => {
            setFinalizando(true);
            try {
              await finalizarVinculacionPaciente(paciente.id);
              await cargar();
            } catch (error) {
              Alert.alert("No se pudo finalizar", (error as Error).message);
            } finally {
              setFinalizando(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <View style={s.header}>
        <Pressable style={s.headerButton} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Volver">
          <Ionicons name="chevron-back" size={28} color={c.text} />
        </Pressable>
        <Text style={[s.headerTitle, { color: c.text }]}>Paciente</Text>
        <View style={s.headerButton} />
      </View>

      {cargando ? (
        <View style={s.center}><ActivityIndicator size="large" color={c.accent} /></View>
      ) : !paciente ? (
        <View style={s.center}>
          <Ionicons name="person-remove-outline" size={48} color={c.textSecondary} />
          <Text style={[s.notFound, { color: c.textSecondary }]}>No se encontró este vínculo.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          <View style={s.profile}>
            <View style={[s.avatar, { backgroundColor: c.backgroundElement }]}>
              <Ionicons name="person" size={50} color={c.textSecondary} />
            </View>
            <Text style={[s.name, { color: c.text }]}>{nombrePaciente(paciente)}</Text>
            <Text style={[s.email, { color: c.textSecondary }]}>{paciente.email}</Text>
            <View style={[s.status, { backgroundColor: `${c.accent}26` }]}>
              <Text style={[s.statusText, { color: c.accent }]}>
                {paciente.estado === "activa" ? "Vínculo activo" : "Vínculo finalizado"}
              </Text>
            </View>
          </View>

          <View style={[s.infoCard, { backgroundColor: c.backgroundElement }]}>
            <Text style={[s.infoLabel, { color: c.textSecondary }]}>Vinculado desde</Text>
            <Text style={[s.infoValue, { color: c.text }]}>{fechaTexto(paciente.vinculada_at)}</Text>
            {paciente.finalizada_at && (
              <>
                <View style={[s.separator, { backgroundColor: c.border }]} />
                <Text style={[s.infoLabel, { color: c.textSecondary }]}>Finalizado el</Text>
                <Text style={[s.infoValue, { color: c.text }]}>{fechaTexto(paciente.finalizada_at)}</Text>
              </>
            )}
          </View>

          <Text style={[s.sectionTitle, { color: c.text }]}>Información terapéutica</Text>
          <View style={s.features}>
            {proximasSecciones.map((seccion) => {
              const disponible = seccion.titulo === "Citas" || paciente.estado === "activa";
              const abrir = () => {
                const params = { patientId: paciente.paciente_id, name: nombrePaciente(paciente) };
                if (seccion.titulo === "Citas") {
                  router.push({ pathname: "/professional/patient-appointments", params });
                } else if (seccion.titulo === "Dashboard emocional") {
                  router.push({ pathname: "/professional/patient-dashboard", params });
                } else {
                  router.push({ pathname: "/professional/patient-shared-journals", params });
                }
              };
              return (
              <Pressable
                key={seccion.titulo}
                style={({ pressed }) => [s.featureCard, { backgroundColor: c.backgroundElement }, pressed && disponible && { opacity: 0.8 }]}
                disabled={!disponible}
                onPress={abrir}
                accessibilityRole={disponible ? "button" : undefined}
              >
                <View style={[s.featureIcon, { backgroundColor: `${c.accent}1F` }]}>
                  <Ionicons name={seccion.icono} size={22} color={c.accent} />
                </View>
                <View style={s.featureInfo}>
                  <Text style={[s.featureTitle, { color: c.text }]}>{seccion.titulo}</Text>
                  <Text style={[s.featureDetail, { color: c.textSecondary }]}>{seccion.detalle}</Text>
                </View>
                {disponible ? (
                  <Ionicons name="chevron-forward" size={20} color={c.textSecondary} />
                ) : (
                  <Text style={[s.soon, { color: c.textSecondary }]}>Sin acceso</Text>
                )}
              </Pressable>
              );
            })}
          </View>

          {paciente.estado === "activa" && (
            <Pressable
              style={({ pressed }) => [s.endButton, { borderColor: c.error }, pressed && { opacity: 0.7 }, finalizando && s.disabled]}
              onPress={confirmarFinalizacion}
              disabled={finalizando}
              accessibilityRole="button"
            >
              {finalizando ? <ActivityIndicator color={c.error} /> : (
                <Text style={[s.endButtonText, { color: c.error }]}>Finalizar vinculación</Text>
              )}
            </Pressable>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
