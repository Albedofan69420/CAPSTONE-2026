import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";

import { appStyles } from "@/constants/app-styles";
import { useTheme } from "@/hooks/use-theme";
import { urlFotoPerfil } from "@/lib/foto-perfil";
import {
  escucharVinculaciones,
  obtenerMiProfesionalVinculado,
  type ProfesionalVinculado,
} from "@/lib/vinculaciones";

const s = appStyles.psicologoVinculado;

const nombreCompleto = (profesional: ProfesionalVinculado) =>
  [profesional.nombre, profesional.apellido].filter(Boolean).join(" ") || "Profesional de la salud";

const fechaTexto = (fecha: string) =>
  new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(fecha)
  );

export default function MiPsicologo() {
  const c = useTheme();
  const [profesional, setProfesional] = useState<ProfesionalVinculado | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    try {
      setProfesional(await obtenerMiProfesionalVinculado());
    } catch (error) {
      Alert.alert("No se pudo cargar tu psicólogo", (error as Error).message);
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(useCallback(() => void cargar(), [cargar]));
  useEffect(() => escucharVinculaciones(() => void cargar()), [cargar]);

  const ubicacion = profesional
    ? [profesional.comuna, profesional.region].filter(Boolean).join(", ")
    : "";

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <Text style={[s.title, { color: c.text }]}>Mi psicólogo</Text>

      {cargando ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={c.accent} />
        </View>
      ) : !profesional ? (
        <View style={s.center}>
          <View style={[s.emptyIcon, { backgroundColor: c.backgroundElement }]}>
            <Ionicons name="person-add-outline" size={38} color={c.accent} />
          </View>
          <Text style={[s.emptyTitle, { color: c.text }]}>Aún no tienes un psicólogo vinculado</Text>
          <Text style={[s.emptyText, { color: c.textSecondary }]}>
            Tu profesional debe enviarte un enlace o código de invitación para vincular las cuentas.
          </Text>
          <Pressable
            style={({ pressed }) => [s.primaryButton, { backgroundColor: c.accent }, pressed && { opacity: 0.8 }]}
            onPress={() => router.push("/invitation")}
            accessibilityRole="button"
          >
            <Ionicons name="link-outline" size={20} color={c.accentText} />
            <Text style={[s.primaryButtonText, { color: c.accentText }]}>Ingresar invitación</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          <View style={[s.profileCard, { backgroundColor: c.backgroundElement }]}>
            <View style={[s.avatar, { backgroundColor: c.backgroundSelected }]}>
              {profesional.foto_path ? (
                <Image
                  source={{ uri: urlFotoPerfil(profesional.foto_path) ?? undefined }}
                  style={s.avatarImage}
                  contentFit="cover"
                />
              ) : (
                <Ionicons name="person" size={55} color={c.textSecondary} />
              )}
            </View>
            <Text style={[s.name, { color: c.text }]}>{nombreCompleto(profesional)}</Text>
            <Text style={[s.specialty, { color: c.textSecondary }]}>
              {profesional.especialidad || "Profesional de la salud"}
            </Text>
            <View style={[s.activeBadge, { backgroundColor: `${c.accent}26` }]}>
              <View style={[s.activeDot, { backgroundColor: c.accent }]} />
              <Text style={[s.activeText, { color: c.accent }]}>Vinculación activa</Text>
            </View>
          </View>

          <View style={[s.infoCard, { backgroundColor: c.backgroundElement }]}>
            <View style={s.infoRow}>
              <Ionicons name="calendar-outline" size={20} color={c.accent} />
              <View style={s.infoContent}>
                <Text style={[s.infoLabel, { color: c.textSecondary }]}>Vinculado desde</Text>
                <Text style={[s.infoValue, { color: c.text }]}>{fechaTexto(profesional.vinculada_at)}</Text>
              </View>
            </View>
            {profesional.email && (
              <View style={s.infoRow}>
                <Ionicons name="mail-outline" size={20} color={c.accent} />
                <View style={s.infoContent}>
                  <Text style={[s.infoLabel, { color: c.textSecondary }]}>Correo electrónico</Text>
                  <Text style={[s.infoValue, { color: c.text }]}>{profesional.email}</Text>
                </View>
              </View>
            )}
            {!!ubicacion && (
              <View style={s.infoRow}>
                <Ionicons name="location-outline" size={20} color={c.accent} />
                <View style={s.infoContent}>
                  <Text style={[s.infoLabel, { color: c.textSecondary }]}>Ubicación</Text>
                  <Text style={[s.infoValue, { color: c.text }]}>{ubicacion}</Text>
                </View>
              </View>
            )}
          </View>

          <View style={s.section}>
            <Text style={[s.sectionTitle, { color: c.text }]}>Sobre el profesional</Text>
            <View style={[s.descriptionCard, { backgroundColor: c.backgroundElement }]}>
              <Text style={[s.description, { color: c.textSecondary }]}>
                {profesional.descripcion || "Este profesional aún no ha agregado una descripción."}
              </Text>
            </View>
          </View>

          <View style={[s.notice, { borderColor: c.border }]}>
            <Ionicons name="information-circle-outline" size={21} color={c.accent} />
            <Text style={[s.noticeText, { color: c.textSecondary }]}>
              Las citas y la información terapéutica se incorporarán en la siguiente etapa.
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
