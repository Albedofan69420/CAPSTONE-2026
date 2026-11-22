import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { OptionSelector } from "@/components/option-selector";
import { appStyles } from "@/constants/app-styles";
import { useTheme } from "@/hooks/use-theme";
import {
  agendarCitaPaciente,
  formatearHoraEscrita,
  modificarCitaAgendada,
  obtenerCita,
  textoAFechaHora,
  type Modalidad,
} from "@/lib/citas";

const s = appStyles.appointmentEditor;

const MODALIDADES = [
  { value: "presencial" as const, label: "Presencial", description: "En la consulta del profesional" },
  { value: "online" as const, label: "Online", description: "Atención mediante videollamada" },
];

const formatearFecha = (texto: string) => {
  const digitos = texto.replace(/\D/g, "").slice(0, 8);
  return [digitos.slice(0, 2), digitos.slice(2, 4), digitos.slice(4)].filter(Boolean).join("/");
};

const fechaInicial = (fecha: Date) =>
  `${String(fecha.getDate()).padStart(2, "0")}/${String(fecha.getMonth() + 1).padStart(2, "0")}/${fecha.getFullYear()}`;

const horaInicial = (fecha: Date) =>
  `${String(fecha.getHours()).padStart(2, "0")}:${String(fecha.getMinutes()).padStart(2, "0")}`;

export default function EditorCita() {
  const c = useTheme();
  const { patientId, name, citaId } = useLocalSearchParams<{ patientId?: string; name?: string; citaId?: string }>();
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [modalidad, setModalidad] = useState<Modalidad | null>(null);
  const [cargando, setCargando] = useState(!!citaId);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!citaId) return;
    obtenerCita(citaId)
      .then((cita) => {
        if (!cita?.fecha_confirmada) throw new Error("No se encontró la cita.");
        const inicio = new Date(cita.fecha_confirmada);
        setFecha(fechaInicial(inicio));
        setHora(horaInicial(inicio));
        setModalidad(cita.modalidad);
      })
      .catch((error) => Alert.alert("No se pudo cargar la cita", (error as Error).message))
      .finally(() => setCargando(false));
  }, [citaId]);

  const guardar = async () => {
    const inicio = textoAFechaHora(fecha, hora);
    if (!inicio) {
      Alert.alert("Fecha u hora inválida", "Ingresa una fecha futura usando DD/MM/AAAA y una hora usando HH:MM.");
      return;
    }
    if (!modalidad) {
      Alert.alert("Selecciona una modalidad");
      return;
    }
    if (!citaId && !patientId) return;

    setGuardando(true);
    try {
      if (citaId) await modificarCitaAgendada(citaId, inicio, modalidad);
      else await agendarCitaPaciente(patientId!, inicio, modalidad);
      router.back();
    } catch (error) {
      Alert.alert("No se pudo guardar la cita", (error as Error).message);
      setGuardando(false);
    }
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <View style={s.header}>
        <Pressable style={s.headerButton} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Volver">
          <Ionicons name="chevron-back" size={28} color={c.text} />
        </Pressable>
        <Text style={[s.headerTitle, { color: c.text }]}>{citaId ? "Modificar cita" : "Agendar cita"}</Text>
        <View style={s.headerButton} />
      </View>

      {cargando ? (
        <View style={s.center}><ActivityIndicator size="large" color={c.accent} /></View>
      ) : (
        <KeyboardAvoidingView style={s.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
            {!!name && <Text style={[s.patientName, { color: c.text }]}>Paciente: {name}</Text>}

            <View style={s.dateRow}>
              <View style={s.dateField}>
                <Text style={[s.label, { color: c.text }]}>Fecha</Text>
                <TextInput
                  style={[s.input, { color: c.text, borderColor: c.border }]}
                  value={fecha}
                  onChangeText={(valor) => setFecha(formatearFecha(valor))}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor={c.textSecondary}
                  keyboardType="number-pad"
                  maxLength={10}
                />
              </View>
              <View style={s.timeField}>
                <Text style={[s.label, { color: c.text }]}>Hora</Text>
                <TextInput
                  style={[s.input, { color: c.text, borderColor: c.border }]}
                  value={hora}
                  onChangeText={(valor) => setHora(formatearHoraEscrita(valor))}
                  placeholder="HH:MM"
                  placeholderTextColor={c.textSecondary}
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>
            </View>

            <View style={s.field}>
              <Text style={[s.label, { color: c.text }]}>Modalidad</Text>
              <OptionSelector options={MODALIDADES} value={modalidad} onChange={setModalidad} />
            </View>

            <View style={[s.notice, { backgroundColor: c.backgroundElement }]}>
              <Ionicons name="time-outline" size={20} color={c.accent} />
              <Text style={[s.noticeText, { color: c.textSecondary }]}>La cita tendrá una duración de 60 minutos y aparecerá automáticamente en la cuenta del paciente.</Text>
            </View>

            <Pressable
              style={({ pressed }) => [s.saveButton, { backgroundColor: c.accent }, guardando && s.disabled, pressed && { opacity: 0.8 }]}
              onPress={guardar}
              disabled={guardando}
              accessibilityRole="button"
            >
              {guardando ? <ActivityIndicator color={c.accentText} /> : (
                <Text style={[s.saveButtonText, { color: c.accentText }]}>{citaId ? "Guardar cambios" : "Confirmar cita"}</Text>
              )}
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
