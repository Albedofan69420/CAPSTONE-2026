import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { EMOTIONS } from "@/components/journal/emotion-selector";
import { appStyles } from "@/constants/app-styles";
import { useTheme } from "@/hooks/use-theme";
import { obtenerDiariosCompartidos, type RegistroCompartidoProfesional } from "@/lib/diario";

const s = appStyles.sharedJournals;

const CAMPOS: { key: keyof RegistroCompartidoProfesional; label: string }[] = [
  { key: "motivo", label: "¿Por qué se siente así?" },
  { key: "cosas_buenas", label: "Cosas buenas del día" },
  { key: "cosas_malas", label: "Cosas malas del día" },
  { key: "objetivo_cumplido", label: "Objetivo cumplido" },
  { key: "areas_mejora", label: "Aspectos que desea trabajar" },
  { key: "plan_accion", label: "Plan de acción" },
];

const fechaTexto = (fecha: string) =>
  new Intl.DateTimeFormat("es-CL", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${fecha}T12:00:00`)
  );

export default function DiariosCompartidos() {
  const c = useTheme();
  const { patientId, name } = useLocalSearchParams<{ patientId?: string; name?: string }>();
  const [registros, setRegistros] = useState<RegistroCompartidoProfesional[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    if (!patientId) {
      setCargando(false);
      return;
    }
    try {
      setRegistros(await obtenerDiariosCompartidos(patientId));
    } catch (error) {
      Alert.alert("No se pudieron cargar los registros", (error as Error).message);
    } finally {
      setCargando(false);
    }
  }, [patientId]);

  useFocusEffect(useCallback(() => void cargar(), [cargar]));

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <View style={s.header}>
        <Pressable style={s.headerButton} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Volver">
          <Ionicons name="chevron-back" size={28} color={c.text} />
        </Pressable>
        <View style={s.headerInfo}>
          <Text style={[s.headerTitle, { color: c.text }]}>Registros compartidos</Text>
          {!!name && <Text style={[s.headerSubtitle, { color: c.textSecondary }]} numberOfLines={1}>{name}</Text>}
        </View>
        <View style={s.headerButton} />
      </View>

      {cargando ? (
        <View style={s.center}><ActivityIndicator size="large" color={c.accent} /></View>
      ) : registros.length === 0 ? (
        <View style={s.center}>
          <Ionicons name="lock-closed-outline" size={48} color={c.textSecondary} />
          <Text style={[s.emptyTitle, { color: c.text }]}>Sin registros autorizados</Text>
          <Text style={[s.emptyText, { color: c.textSecondary }]}>El paciente todavía no ha compartido el contenido de su diario.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          {registros.map((registro) => {
            const emocion = EMOTIONS.find((item) => item.id === registro.emocion);
            const campos = CAMPOS.filter((campo) => String(registro[campo.key] ?? "").trim());
            return (
              <View key={registro.fecha} style={[s.card, { backgroundColor: c.backgroundElement }]}>
                <View style={s.cardHeader}>
                  <Text style={s.emoji}>{emocion?.emoji ?? "•"}</Text>
                  <View style={s.cardHeaderInfo}>
                    <Text style={[s.date, { color: c.text }]}>{fechaTexto(registro.fecha)}</Text>
                    <Text style={[s.emotion, { color: c.textSecondary }]}>{emocion?.label ?? registro.emocion}</Text>
                  </View>
                </View>
                {campos.length === 0 ? (
                  <Text style={[s.emptyRecord, { color: c.textSecondary }]}>El paciente compartió el registro, pero no escribió contenido.</Text>
                ) : (
                  <View style={s.fields}>
                    {campos.map((campo) => (
                      <View key={campo.key} style={s.field}>
                        <Text style={[s.fieldLabel, { color: c.textSecondary }]}>{campo.label}</Text>
                        <Text style={[s.fieldText, { color: c.text }]}>{String(registro[campo.key])}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
