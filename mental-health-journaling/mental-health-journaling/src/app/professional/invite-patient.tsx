import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Share, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { appStyles } from "@/constants/app-styles";
import { useTheme } from "@/hooks/use-theme";
import {
  cancelarInvitacionPaciente,
  crearInvitacionPaciente,
  enlaceInvitacion,
  type InvitacionCreada,
} from "@/lib/vinculaciones";

const s = appStyles.invitarPaciente;

const fechaExpiracion = (fecha: string) =>
  new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(fecha));

export default function InvitarPaciente() {
  const c = useTheme();
  const [invitacion, setInvitacion] = useState<InvitacionCreada | null>(null);
  const [generando, setGenerando] = useState(false);
  const [cancelando, setCancelando] = useState(false);

  const generar = async () => {
    if (generando) return;
    setGenerando(true);
    try {
      setInvitacion(await crearInvitacionPaciente());
    } catch (e) {
      Alert.alert("No se pudo crear la invitación", (e as Error).message);
    } finally {
      setGenerando(false);
    }
  };

  const compartir = async () => {
    if (!invitacion) return;
    const enlace = enlaceInvitacion(invitacion.token);
    try {
      await Share.share({
        title: "Invitación para vincularte con tu psicólogo",
        message:
          "Te invito a vincularte conmigo en Mental Health Journaling.\n\n" +
          `Código: ${invitacion.codigo}\n` +
          `Enlace: ${enlace}\n\n` +
          `La invitación vence el ${fechaExpiracion(invitacion.expira_at)}.`,
        url: enlace,
      });
    } catch {
      Alert.alert("No se pudo compartir", "Inténtalo nuevamente.");
    }
  };

  const confirmarCancelacion = () => {
    if (!invitacion || cancelando) return;
    Alert.alert(
      "Cancelar invitación",
      "El enlace y el código dejarán de funcionar.",
      [
        { text: "Volver", style: "cancel" },
        {
          text: "Cancelar invitación",
          style: "destructive",
          onPress: async () => {
            setCancelando(true);
            try {
              await cancelarInvitacionPaciente(invitacion.invitacion_id);
              setInvitacion(null);
            } catch (e) {
              Alert.alert("No se pudo cancelar", (e as Error).message);
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
        <Pressable
          style={s.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={28} color={c.text} />
        </Pressable>
        <Text style={[s.headerTitle, { color: c.text }]}>Invitar paciente</Text>
        <View style={s.backButton} />
      </View>

      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={s.intro}>
          <View style={[s.heroIcon, { backgroundColor: `${c.accent}1F` }]}>
            <Ionicons name="person-add-outline" size={34} color={c.accent} />
          </View>
          <Text style={[s.title, { color: c.text }]}>Vincula a un paciente</Text>
          <Text style={[s.subtitle, { color: c.textSecondary }]}>
            Genera una invitación privada y compártela con la persona con quien iniciarás el proceso terapéutico.
          </Text>
        </View>

        {!invitacion ? (
          <>
            <View style={[s.infoCard, { backgroundColor: c.backgroundElement }]}>
              <View style={s.infoRow}>
                <Ionicons name="time-outline" size={20} color={c.accent} />
                <Text style={[s.infoText, { color: c.text }]}>La invitación dura 12 horas.</Text>
              </View>
              <View style={s.infoRow}>
                <Ionicons name="shield-checkmark-outline" size={20} color={c.accent} />
                <Text style={[s.infoText, { color: c.text }]}>Solo puede utilizarse una vez.</Text>
              </View>
              <View style={s.infoRow}>
                <Ionicons name="people-outline" size={20} color={c.accent} />
                <Text style={[s.infoText, { color: c.text }]}>El paciente debe aceptar la vinculación.</Text>
              </View>
            </View>

            <Pressable
              style={[s.primaryButton, { backgroundColor: c.accent }, generando && s.disabled]}
              onPress={generar}
              disabled={generando}
              accessibilityRole="button"
            >
              {generando ? (
                <ActivityIndicator color={c.accentText} />
              ) : (
                <>
                  <Ionicons name="link-outline" size={20} color={c.accentText} />
                  <Text style={[s.primaryButtonText, { color: c.accentText }]}>Generar invitación</Text>
                </>
              )}
            </Pressable>
          </>
        ) : (
          <View style={s.result}>
            <View style={[s.successCard, { backgroundColor: c.backgroundElement, borderColor: c.accent }]}>
              <Ionicons name="checkmark-circle" size={28} color={c.accent} />
              <View style={s.successInfo}>
                <Text style={[s.successTitle, { color: c.text }]}>Invitación creada</Text>
                <Text style={[s.successText, { color: c.textSecondary }]}>
                  Vence el {fechaExpiracion(invitacion.expira_at)}
                </Text>
              </View>
            </View>

            <View style={s.codeSection}>
              <Text style={[s.label, { color: c.text }]}>Código de invitación</Text>
              <View style={[s.codeCard, { backgroundColor: c.backgroundElement, borderColor: c.border }]}>
                <Text selectable style={[s.code, { color: c.text }]}>{invitacion.codigo}</Text>
              </View>
              <Text style={[s.hint, { color: c.textSecondary }]}>
                Compártelo ahora. Por seguridad no podremos volver a mostrarlo después de salir.
              </Text>
            </View>

            <Pressable
              style={[s.primaryButton, { backgroundColor: c.accent }]}
              onPress={compartir}
              accessibilityRole="button"
            >
              <Ionicons name="share-outline" size={20} color={c.accentText} />
              <Text style={[s.primaryButtonText, { color: c.accentText }]}>Compartir invitación</Text>
            </Pressable>

            <Pressable
              style={[s.secondaryButton, { borderColor: c.border }, cancelando && s.disabled]}
              onPress={confirmarCancelacion}
              disabled={cancelando}
              accessibilityRole="button"
            >
              <Text style={[s.secondaryButtonText, { color: c.error }]}>Cancelar invitación</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

