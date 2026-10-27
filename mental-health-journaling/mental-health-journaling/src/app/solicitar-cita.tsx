import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { OptionSelector } from "@/components/option-selector";
import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
import { MENSAJE_MAX, solicitarCita, type Modalidad } from "@/lib/citas";

const s = appStyles.citas;

const MODALIDADES: { value: Modalidad; label: string; description: string }[] = [
  { value: "presencial", label: "Presencial", description: "En la consulta del profesional" },
  { value: "online", label: "Online", description: "Por videollamada" },
];

// Primer paso de la reserva: el usuario elige la modalidad y deja un mensaje opcional.
// La fecha y la hora se coordinan después en el chat (src/app/cita.tsx)
export default function SolicitarCita() {
  const c = useTheme();
  const { profesionalId, nombre } = useLocalSearchParams<{ profesionalId: string; nombre?: string }>();
  const [modalidad, setModalidad] = useState<Modalidad | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviar = async () => {
    if (!profesionalId || !modalidad) return;

    setEnviando(true);
    try {
      const citaId = await solicitarCita(profesionalId, modalidad, mensaje);
      // replace: al volver desde el chat se regresa al perfil del profesional, no al formulario
      router.replace({ pathname: "/cita", params: { id: citaId } });
    } catch (e) {
      Alert.alert("No se pudo enviar la solicitud", (e as Error).message);
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <View style={s.header}>
        <Pressable
          style={s.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={28} color={c.text} />
        </Pressable>
        <Text style={[s.title, { color: c.text }]}>Solicitar cita</Text>
      </View>

      <KeyboardAvoidingView
        style={s.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={[s.subtitle, { color: c.textSecondary }]}>
            {nombre ? `Envía una solicitud a ${nombre}. ` : "Envía una solicitud al profesional. "}
            Luego podrán coordinar el día y la hora por el chat de la cita.
          </Text>

          <View style={s.field}>
            <Text style={[s.label, { color: c.text }]}>Modalidad</Text>
            <OptionSelector options={MODALIDADES} value={modalidad} onChange={setModalidad} />
          </View>

          <View style={s.field}>
            <Text style={[s.label, { color: c.text }]}>Mensaje (opcional)</Text>
            <TextInput
              style={[s.textArea, { color: c.text, borderColor: c.border }]}
              value={mensaje}
              onChangeText={setMensaje}
              placeholder="Ej.: Me acomodan las tardes de lunes a jueves."
              placeholderTextColor={c.textSecondary}
              maxLength={MENSAJE_MAX}
              multiline
            />
            <Text style={[s.counter, { color: c.textSecondary }]}>
              {mensaje.length}/{MENSAJE_MAX}
            </Text>
          </View>

          <View style={[s.notice, { backgroundColor: c.backgroundElement }]}>
            <Ionicons name="information-circle-outline" size={18} color={c.accent} />
            <Text style={[s.noticeText, { color: c.textSecondary }]}>
              El chat de la cita es solo para coordinar la reserva. Si estás en crisis, llama al
              *4141 (línea de prevención del suicidio) o al 131 (SAMU).
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              s.button,
              { backgroundColor: c.accent },
              (!modalidad || enviando) && s.buttonDisabled,
              pressed && { opacity: 0.8 },
            ]}
            onPress={enviar}
            disabled={!modalidad || enviando}
            accessibilityRole="button"
          >
            <Text style={[s.buttonText, { color: c.accentText }]}>
              {enviando ? "Enviando..." : "Enviar solicitud"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
