import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { appStyles } from "@/constants/app-styles";
import { useTheme } from "@/hooks/use-theme";
import {
  cancelarCitaAgendada,
  DURACION_CITA_MINUTOS,
  fechaHoraTexto,
  MODALIDAD_LABEL,
  nombreOtro,
  obtenerCita,
  type Cita,
} from "@/lib/citas";
import { useCitas } from "@/providers/CitasProvider";

const s = appStyles.appointmentDetails;

const estadoVisual = (cita: Cita) => {
  if (cita.estado === "cancelada") return "Cancelada";
  if (cita.fecha_confirmada && new Date(cita.fecha_confirmada) < new Date()) return "Realizada";
  return "Próxima";
};

export default function DetalleCita() {
  const c = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { version } = useCitas();
  const [cita, setCita] = useState<Cita | null>(null);
  const [cargando, setCargando] = useState(true);
  const [cancelando, setCancelando] = useState(false);

  const cargar = useCallback(async () => {
    if (!id) {
      setCargando(false);
      return;
    }
    try {
      setCita(await obtenerCita(id));
    } catch (error) {
      Alert.alert("No se pudo cargar la cita", (error as Error).message);
    } finally {
      setCargando(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void version;
      void cargar();
    }, [version, cargar])
  );

  const puedeAdministrar =
    !!cita?.soy_profesional &&
    cita.estado === "confirmada" &&
    !!cita.fecha_confirmada &&
    new Date(cita.fecha_confirmada) > new Date();

  const confirmarCancelacion = () => {
    if (!cita || cancelando) return;
    Alert.alert(
      "Cancelar cita",
      "La cita pasará al historial del profesional y del paciente.",
      [
        { text: "Volver", style: "cancel" },
        {
          text: "Cancelar cita",
          style: "destructive",
          onPress: async () => {
            setCancelando(true);
            try {
              await cancelarCitaAgendada(cita.id);
              await cargar();
            } catch (error) {
              Alert.alert("No se pudo cancelar", (error as Error).message);
            } finally {
              setCancelando(false);
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
        <Text style={[s.headerTitle, { color: c.text }]}>Detalle de la cita</Text>
        <View style={s.headerButton} />
      </View>

      {cargando ? (
        <View style={s.center}><ActivityIndicator size="large" color={c.accent} /></View>
      ) : !cita || !cita.fecha_confirmada ? (
        <View style={s.center}>
          <Ionicons name="calendar-clear-outline" size={48} color={c.textSecondary} />
          <Text style={[s.emptyText, { color: c.textSecondary }]}>No encontramos esta cita.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          <View style={s.hero}>
            <View style={[s.heroIcon, { backgroundColor: `${c.accent}1F` }]}>
              <Ionicons name="calendar-outline" size={38} color={c.accent} />
            </View>
            <Text style={[s.personName, { color: c.text }]}>{nombreOtro(cita)}</Text>
            <View style={[s.status, { backgroundColor: cita.estado === "cancelada" ? c.backgroundSelected : `${c.accent}26` }]}>
              <Text style={[s.statusText, { color: cita.estado === "cancelada" ? c.textSecondary : c.accent }]}>{estadoVisual(cita)}</Text>
            </View>
          </View>

          <View style={[s.card, { backgroundColor: c.backgroundElement }]}>
            <View style={s.row}>
              <Ionicons name="calendar-number-outline" size={22} color={c.accent} />
              <View style={s.rowInfo}>
                <Text style={[s.label, { color: c.textSecondary }]}>Fecha y hora</Text>
                <Text style={[s.value, { color: c.text }]}>{fechaHoraTexto(cita.fecha_confirmada)}</Text>
              </View>
            </View>
            <View style={s.row}>
              <Ionicons name={cita.modalidad === "online" ? "videocam-outline" : "location-outline"} size={22} color={c.accent} />
              <View style={s.rowInfo}>
                <Text style={[s.label, { color: c.textSecondary }]}>Modalidad</Text>
                <Text style={[s.value, { color: c.text }]}>{MODALIDAD_LABEL[cita.modalidad]}</Text>
              </View>
            </View>
            <View style={s.row}>
              <Ionicons name="time-outline" size={22} color={c.accent} />
              <View style={s.rowInfo}>
                <Text style={[s.label, { color: c.textSecondary }]}>Duración</Text>
                <Text style={[s.value, { color: c.text }]}>{DURACION_CITA_MINUTOS} minutos</Text>
              </View>
            </View>
          </View>

          {cita.motivo_cierre && (
            <View style={[s.notice, { backgroundColor: c.backgroundElement }]}>
              <Ionicons name="information-circle-outline" size={20} color={c.textSecondary} />
              <Text style={[s.noticeText, { color: c.textSecondary }]}>{cita.motivo_cierre}</Text>
            </View>
          )}

          {puedeAdministrar && (
            <View style={s.actions}>
              <Pressable
                style={({ pressed }) => [s.primaryButton, { backgroundColor: c.accent }, pressed && { opacity: 0.8 }]}
                onPress={() => router.push({
                  pathname: "/professional/appointment-editor",
                  params: { citaId: cita.id, patientId: cita.paciente_id, name: nombreOtro(cita) },
                })}
                accessibilityRole="button"
              >
                <Ionicons name="create-outline" size={20} color={c.accentText} />
                <Text style={[s.primaryButtonText, { color: c.accentText }]}>Modificar cita</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [s.cancelButton, { borderColor: c.error }, pressed && { opacity: 0.7 }]}
                onPress={confirmarCancelacion}
                disabled={cancelando}
                accessibilityRole="button"
              >
                {cancelando ? <ActivityIndicator color={c.error} /> : <Text style={[s.cancelButtonText, { color: c.error }]}>Cancelar cita</Text>}
              </Pressable>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
