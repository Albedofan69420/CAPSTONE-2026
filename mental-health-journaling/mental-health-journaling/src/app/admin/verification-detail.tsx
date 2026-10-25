import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { openBrowserAsync } from "expo-web-browser";

import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
import { CERTIFICADOS, COLUMNA } from "@/lib/certificados";
import { formatearRun } from "@/lib/run";
import {
  nombreCompleto,
  obtenerSolicitud,
  revisarSolicitud,
  urlCertificado,
  type Solicitud,
} from "@/lib/verificacion";

const s = appStyles.verificacion;

const ESTADO_LABEL: Record<Solicitud["estado"], string> = {
  en_revision: "En revisión",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
};

export default function DetalleVerificacion() {
  const c = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [cargando, setCargando] = useState(true);
  const [abriendo, setAbriendo] = useState<string | null>(null);
  const [rechazando, setRechazando] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!id) return;
    obtenerSolicitud(id)
      .then(setSolicitud)
      .catch((e) => Alert.alert("No se pudo cargar la solicitud", e.message))
      .finally(() => setCargando(false));
  }, [id]);

  const verPdf = async (path: string) => {
    setAbriendo(path);
    try {
      // El bucket es privado: se genera una URL temporal para abrir el PDF
      await openBrowserAsync(await urlCertificado(path));
    } catch (e) {
      Alert.alert("No se pudo abrir el certificado", (e as Error).message);
    } finally {
      setAbriendo(null);
    }
  };

  const revisar = async (aprobado: boolean) => {
    if (!solicitud) return;
    setGuardando(true);
    try {
      await revisarSolicitud(solicitud.user_id, aprobado, motivo);
    } catch (e) {
      Alert.alert("No se pudo guardar la revisión", (e as Error).message);
      setGuardando(false);
      return;
    }
    Alert.alert(
      aprobado ? "Profesional aprobado" : "Certificados rechazados",
      aprobado
        ? "El profesional quedó verificado."
        : "El profesional verá el motivo y podrá subir sus certificados nuevamente."
    );
    router.back();
  };

  const confirmarAprobacion = () =>
    Alert.alert("Aprobar certificados", "¿Confirmas que los certificados son válidos?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Aprobar", onPress: () => revisar(true) },
    ]);

  const confirmarRechazo = () => {
    if (!motivo.trim()) {
      Alert.alert("Motivo requerido", "Explica al profesional por qué se rechazan sus certificados.");
      return;
    }
    Alert.alert("Rechazar certificados", "El profesional tendrá que subirlos de nuevo.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Rechazar", style: "destructive", onPress: () => revisar(false) },
    ]);
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <View style={s.topBar}>
        <Pressable
          style={s.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={28} color={c.text} />
        </Pressable>
        <Text style={[s.topBarTitle, { color: c.text }]}>Solicitud</Text>
        <View style={s.backButton} />
      </View>

      {cargando ? (
        <ActivityIndicator style={s.loading} color={c.accent} />
      ) : !solicitud ? (
        <Text style={[s.emptyText, { color: c.textSecondary }]}>
          Esta solicitud ya no existe.
        </Text>
      ) : (
        <KeyboardAvoidingView
          style={s.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={[s.section, { backgroundColor: c.backgroundElement }]}>
              <Text style={[s.name, { color: c.text }]}>{nombreCompleto(solicitud)}</Text>
              <View style={s.row}>
                <Text style={[s.rowLabel, { color: c.textSecondary }]}>RUN</Text>
                <Text style={[s.rowValue, { color: c.text }]}>{formatearRun(solicitud.run)}</Text>
              </View>
              <View style={s.row}>
                <Text style={[s.rowLabel, { color: c.textSecondary }]}>Correo</Text>
                <Text style={[s.rowValue, { color: c.text }]}>{solicitud.email}</Text>
              </View>
              <View style={s.row}>
                <Text style={[s.rowLabel, { color: c.textSecondary }]}>Estado</Text>
                <Text style={[s.rowValue, { color: c.text }]}>{ESTADO_LABEL[solicitud.estado]}</Text>
              </View>
              {solicitud.estado === "rechazado" && solicitud.motivo_rechazo && (
                <View style={s.row}>
                  <Text style={[s.rowLabel, { color: c.textSecondary }]}>Motivo</Text>
                  <Text style={[s.rowValue, { color: c.text }]}>{solicitud.motivo_rechazo}</Text>
                </View>
              )}
            </View>

            <Text style={[s.sectionTitle, { color: c.text }]}>Certificados</Text>

            {CERTIFICADOS.map(({ tipo, titulo }) => {
              const path = solicitud[COLUMNA[tipo]];
              return (
                <Pressable
                  key={tipo}
                  style={({ pressed }) => [
                    s.document,
                    { backgroundColor: c.backgroundElement },
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={() => path && verPdf(path)}
                  disabled={!path || !!abriendo}
                  accessibilityRole="button"
                  accessibilityLabel={`Ver ${titulo}`}
                >
                  <Ionicons name="document-text-outline" size={26} color={c.accent} />
                  <Text style={[s.documentTitle, { color: c.text }]}>{titulo}</Text>
                  {abriendo === path ? (
                    <ActivityIndicator color={c.accent} />
                  ) : (
                    <Text style={[s.documentAction, { color: c.accent }]}>
                      {path ? "Ver PDF" : "Sin subir"}
                    </Text>
                  )}
                </Pressable>
              );
            })}

            {solicitud.estado === "en_revision" && (
              <View style={s.actions}>
                {rechazando && (
                  <View style={s.field}>
                    <Text style={[s.label, { color: c.text }]}>Motivo del rechazo</Text>
                    <TextInput
                      style={[s.input, { color: c.text, borderColor: c.border }]}
                      value={motivo}
                      onChangeText={setMotivo}
                      placeholder="Ej.: el certificado está vencido o no se puede leer"
                      placeholderTextColor={c.textSecondary}
                      multiline
                      textAlignVertical="top"
                      autoFocus
                    />
                  </View>
                )}

                {!rechazando && (
                  <Pressable
                    style={[s.button, { backgroundColor: c.accent }, guardando && s.disabled]}
                    onPress={confirmarAprobacion}
                    disabled={guardando}
                    accessibilityRole="button"
                  >
                    <Text style={[s.buttonText, { color: c.accentText }]}>Aprobar</Text>
                  </Pressable>
                )}

                <Pressable
                  style={[s.button, s.buttonOutline, { borderColor: c.error }, guardando && s.disabled]}
                  onPress={rechazando ? confirmarRechazo : () => setRechazando(true)}
                  disabled={guardando}
                  accessibilityRole="button"
                >
                  <Text style={[s.buttonText, { color: c.error }]}>
                    {rechazando ? "Confirmar rechazo" : "Rechazar"}
                  </Text>
                </Pressable>

                {rechazando && (
                  <Pressable
                    style={s.cancel}
                    onPress={() => {
                      setRechazando(false);
                      setMotivo("");
                    }}
                    accessibilityRole="button"
                  >
                    <Text style={{ color: c.textSecondary, fontWeight: "600" }}>Cancelar</Text>
                  </Pressable>
                )}
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
