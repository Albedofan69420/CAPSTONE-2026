import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";

import { authStyles as s } from "@/constants/auth-styles";
import { appStyles } from "@/constants/app-styles";
import { useTheme } from "@/hooks/use-theme";
import {
  fechaLimite,
  obtenerEstadoProfesional,
  subirCertificado,
  type EstadoProfesional,
  type TipoCertificado,
} from "@/lib/certificados";
import { useAuth } from "@/providers/AuthProvider";

const cs = appStyles.certificados;

// Mismo límite que el bucket "certificados" en Supabase
const MAX_BYTES = 10 * 1024 * 1024;

const CERTIFICADOS: { tipo: TipoCertificado; titulo: string }[] = [
  { tipo: "prestador", titulo: "Certificado de Prestador Individual de Salud" },
  { tipo: "inhabilidad", titulo: "Certificado de inhabilitación para trabajar con menores" },
];

const formatoFecha = (fecha: Date) =>
  new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long" }).format(fecha);

export default function CertificadosProfesional() {
  const c = useTheme();
  const { session, finishCertificatesStep } = useAuth();

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

  const subido = (tipo: TipoCertificado) =>
    !!(tipo === "prestador" ? estado?.cert_prestador_path : estado?.cert_inhabilidad_path);
  const ambosSubidos = CERTIFICADOS.every(({ tipo }) => subido(tipo));

  const elegirPdf = async (tipo: TipoCertificado) => {
    if (!session) return;

    const resultado = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
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
      const path = await subirCertificado(session.user.id, tipo, archivo.uri);
      setEstado((prev) =>
        prev
          ? { ...prev, [tipo === "prestador" ? "cert_prestador_path" : "cert_inhabilidad_path"]: path }
          : prev
      );
      setNombres((prev) => ({ ...prev, [tipo]: archivo.name }));
    } catch (e) {
      Alert.alert("No se pudo subir el certificado", (e as Error).message);
    } finally {
      setSubiendo(null);
    }
  };

  const limite = estado ? fechaLimite(estado.created_at) : null;

  return (
    <ScrollView
      style={{ backgroundColor: c.background }}
      contentContainerStyle={s.scrollContainer}
    >
      <View style={s.form}>
        <Text style={[s.title, { color: c.text }]}>Sube tus certificados</Text>
        <Text style={[s.subtitle, { color: c.textSecondary }]}>
          Si no subes tus certificados en un plazo de 7 días, tu cuenta será eliminada
          {limite ? ` (hasta el ${formatoFecha(limite)})` : ""}. Solo se aceptan archivos PDF.
        </Text>

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
      </View>
    </ScrollView>
  );
}
