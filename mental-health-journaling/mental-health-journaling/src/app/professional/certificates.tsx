import { ComponentProps, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { authStyles as s } from "@/constants/auth-styles";
import { appStyles } from "@/constants/app-styles";
import { useTheme } from "@/hooks/use-theme";
import {
  CERTIFICADOS,
  COLUMNA,
  mensajePlazo,
  obtenerEstadoProfesional,
  subirCertificado,
  type Estado,
  type EstadoProfesional,
  type TipoCertificado,
} from "@/lib/certificados";
import { useAuth } from "@/providers/AuthProvider";

const cs = appStyles.certificados;

// Mismo límite que el bucket "certificados" en Supabase
const MAX_BYTES = 10 * 1024 * 1024;

const ICONO_ESTADO: Record<Estado, ComponentProps<typeof Ionicons>["name"]> = {
  pendiente_documentos: "time-outline",
  en_revision: "hourglass-outline",
  aprobado: "checkmark-circle-outline",
  rechazado: "close-circle-outline",
};

function mensajeEstado(estado: EstadoProfesional) {
  switch (estado.estado) {
    case "pendiente_documentos":
      return mensajePlazo(estado.created_at);
    case "en_revision":
      return "Recibimos tus certificados y están en revisión. Si reemplazas alguno, volverá a revisión.";
    case "aprobado":
      return "Tus certificados fueron aprobados. Si reemplazas alguno, volverá a revisión.";
    case "rechazado":
      return `Tus certificados fueron rechazados${estado.motivo_rechazo ? `: ${estado.motivo_rechazo}` : "."} Sube nuevamente los documentos para que los revisemos.`;
  }
}

/**
 * Se usa en dos momentos:
 * - Registro (sin PIN): paso obligatorio antes de crear el PIN, con "Continuar" y "Subir más tarde".
 * - Perfil (con PIN): desde la tarjeta "Certificados", con un botón para volver.
 */
export default function CertificadosProfesional() {
  const c = useTheme();
  const { session, hasPin, finishCertificatesStep } = useAuth();
  const enRegistro = hasPin === false;

  const [estado, setEstado] = useState<EstadoProfesional | null>(null);
  const [subiendo, setSubiendo] = useState<TipoCertificado | null>(null);
  // Nombre del archivo elegido en esta sesión, solo para mostrarlo
  const [nombres, setNombres] = useState<Partial<Record<TipoCertificado, string>>>({});

  useEffect(() => {
    if (!session) return;
    obtenerEstadoProfesional(session.user.id)
      .then(setEstado)
      .catch((e) => console.log("Error al cargar el estado del profesional:", e.message));
  }, [session]);

  const subido = (tipo: TipoCertificado) => !!estado?.[COLUMNA[tipo]];
  const ambosSubidos = CERTIFICADOS.every(({ tipo }) => subido(tipo));

  const elegirPdf = async (tipo: TipoCertificado) => {
    if (!session || !estado) return;

    const resultado = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      // En Android la copia queda en una carpeta que expo-file-system no puede leer en Expo Go,
      // así que se usa directamente la URI content:// del archivo. En iOS sí se necesita la copia.
      copyToCacheDirectory: Platform.OS !== "android",
    });
    if (resultado.canceled) return;

    const archivo = resultado.assets[0];

    // El selector ya filtra por PDF, pero algunos gestores de archivos permiten elegir otros formatos
    const esPdf =
      archivo.mimeType === "application/pdf" || archivo.name.toLowerCase().endsWith(".pdf");
    if (!esPdf) {
      Alert.alert("Formato no válido", "Solo se aceptan archivos PDF.");
      return;
    }
    if (archivo.size && archivo.size > MAX_BYTES) {
      Alert.alert("Archivo muy grande", "El PDF no puede pesar más de 10 MB.");
      return;
    }

    setSubiendo(tipo);
    try {
      await subirCertificado(session.user.id, tipo, archivo.uri, estado[COLUMNA[tipo]]);
      // Se vuelve a leer porque la base de datos puede haber cambiado el estado (por ejemplo, a revisión)
      setEstado(await obtenerEstadoProfesional(session.user.id));
      setNombres((prev) => ({ ...prev, [tipo]: archivo.name }));
    } catch (e) {
      Alert.alert("No se pudo subir el certificado", (e as Error).message);
    } finally {
      setSubiendo(null);
    }
  };

  const contenido = (
    <View style={s.form}>
      {enRegistro && <Text style={[s.title, { color: c.text }]}>Sube tus certificados</Text>}
      <Text style={[s.subtitle, { color: c.textSecondary }]}>Solo se aceptan archivos PDF.</Text>

      {estado && (
        <View style={[cs.notice, { backgroundColor: c.backgroundElement }]}>
          <Ionicons name={ICONO_ESTADO[estado.estado]} size={20} color={c.textSecondary} />
          <Text style={[cs.noticeText, { color: c.text }]}>{mensajeEstado(estado)}</Text>
        </View>
      )}

      {CERTIFICADOS.map(({ tipo, titulo }) => {
        const listo = subido(tipo);
        const cargando = subiendo === tipo;

        return (
          <View key={tipo} style={[cs.card, { backgroundColor: c.backgroundElement, borderColor: c.border }]}>
            <View style={cs.cardHeader}>
              <Ionicons
                name={listo ? "checkmark-circle" : "document-text-outline"}
                size={26}
                color={listo ? c.accent : c.textSecondary}
              />
              <View style={cs.cardInfo}>
                <Text style={[cs.cardTitle, { color: c.text }]}>{titulo}</Text>
                <Text style={[cs.cardStatus, { color: c.textSecondary }]} numberOfLines={1}>
                  {listo ? nombres[tipo] ?? "Certificado subido" : "Sin subir"}
                </Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                cs.pickButton,
                { borderColor: c.accent },
                (pressed || cargando) && { opacity: 0.7 },
              ]}
              onPress={() => elegirPdf(tipo)}
              disabled={!!subiendo || !estado}
              accessibilityRole="button"
              accessibilityLabel={`${listo ? "Reemplazar" : "Subir"} ${titulo}`}
            >
              {cargando ? (
                <ActivityIndicator color={c.accent} />
              ) : (
                <Text style={[cs.pickButtonText, { color: c.accent }]}>
                  {listo ? "Reemplazar PDF" : "Elegir PDF"}
                </Text>
              )}
            </Pressable>
          </View>
        );
      })}

      {enRegistro && (
        <>
          <Pressable
            style={({ pressed }) => [
              s.button,
              { backgroundColor: c.accent },
              (!ambosSubidos || pressed) && { opacity: ambosSubidos ? 0.8 : 0.5 },
            ]}
            onPress={finishCertificatesStep}
            disabled={!ambosSubidos || !!subiendo}
            accessibilityRole="button"
          >
            <Text style={[s.buttonText, { color: c.accentText }]}>Continuar</Text>
          </Pressable>

          {!ambosSubidos && (
            <View style={s.footer}>
              <Pressable
                onPress={finishCertificatesStep}
                disabled={!!subiendo}
                accessibilityRole="button"
                hitSlop={8}
              >
                <Text style={{ color: c.accent, fontWeight: "600" }}>
                  Subir certificados más tarde
                </Text>
              </Pressable>
            </View>
          )}
        </>
      )}
    </View>
  );

  if (enRegistro) {
    return (
      <ScrollView style={{ backgroundColor: c.background }} contentContainerStyle={s.scrollContainer}>
        {contenido}
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={[cs.screen, { backgroundColor: c.background }]}>
      <View style={cs.topBar}>
        <Pressable
          style={cs.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={28} color={c.text} />
        </Pressable>
        <Text style={[cs.topBarTitle, { color: c.text }]}>Certificados</Text>
        <View style={cs.backButton} />
      </View>
      <ScrollView contentContainerStyle={cs.scrollContent}>{contenido}</ScrollView>
    </SafeAreaView>
  );
}
