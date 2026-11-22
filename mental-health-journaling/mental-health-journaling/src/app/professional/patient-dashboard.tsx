import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { EmotionDonut } from "@/components/emotion-donut";
import { EMOTIONS, type EmotionId } from "@/components/journal/emotion-selector";
import { appStyles } from "@/constants/app-styles";
import { useTheme } from "@/hooks/use-theme";
import { obtenerEmocionesPacienteVinculado, type RegistroEmocionalProfesional } from "@/lib/diario";

const s = appStyles.patientDashboard;

const fechaTexto = (fecha: string) =>
  new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${fecha}T12:00:00`)
  );

const detalleEmocion = (id: EmotionId) => EMOTIONS.find((emocion) => emocion.id === id)!;

export default function DashboardPaciente() {
  const c = useTheme();
  const { patientId, name } = useLocalSearchParams<{ patientId?: string; name?: string }>();
  const [registros, setRegistros] = useState<RegistroEmocionalProfesional[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    if (!patientId) {
      setCargando(false);
      return;
    }
    try {
      setRegistros(await obtenerEmocionesPacienteVinculado(patientId));
    } catch (error) {
      Alert.alert("No se pudo cargar el dashboard", (error as Error).message);
    } finally {
      setCargando(false);
    }
  }, [patientId]);

  useFocusEffect(useCallback(() => void cargar(), [cargar]));

  const frecuente = useMemo(() => {
    if (registros.length === 0) return null;
    return EMOTIONS.map((emocion) => ({
      emocion,
      cantidad: registros.filter((registro) => registro.emocion === emocion.id).length,
    })).sort((a, b) => b.cantidad - a.cantidad)[0];
  }, [registros]);

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <View style={s.header}>
        <Pressable style={s.headerButton} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Volver">
          <Ionicons name="chevron-back" size={28} color={c.text} />
        </Pressable>
        <View style={s.headerInfo}>
          <Text style={[s.headerTitle, { color: c.text }]}>Dashboard emocional</Text>
          {!!name && <Text style={[s.headerSubtitle, { color: c.textSecondary }]} numberOfLines={1}>{name}</Text>}
        </View>
        <View style={s.headerButton} />
      </View>

      {cargando ? (
        <View style={s.center}><ActivityIndicator size="large" color={c.accent} /></View>
      ) : (
        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          <View style={s.stats}>
            <View style={[s.statCard, { backgroundColor: c.backgroundElement }]}>
              <Text style={[s.statValue, { color: c.text }]}>{registros.length}</Text>
              <Text style={[s.statLabel, { color: c.textSecondary }]}>Check-ins</Text>
            </View>
            <View style={[s.statCard, { backgroundColor: c.backgroundElement }]}>
              <Text style={s.statEmoji}>{frecuente?.emocion.emoji ?? "—"}</Text>
              <Text style={[s.statLabel, { color: c.textSecondary }]}>Más frecuente</Text>
            </View>
          </View>

          <View style={s.section}>
            <Text style={[s.sectionTitle, { color: c.text }]}>Distribución emocional</Text>
            <EmotionDonut
              emociones={registros.map((registro) => registro.emocion)}
              emptyText="El paciente aún no registra emociones."
            />
          </View>

          <View style={s.section}>
            <Text style={[s.sectionTitle, { color: c.text }]}>Detalle reciente</Text>
            {registros.length === 0 ? (
              <Text style={[s.emptyText, { color: c.textSecondary }]}>No hay check-ins para mostrar.</Text>
            ) : (
              <View style={s.timeline}>
                {registros.slice(0, 30).map((registro) => {
                  const emocion = detalleEmocion(registro.emocion);
                  return (
                    <View key={registro.fecha} style={[s.timelineRow, { backgroundColor: c.backgroundElement }]}>
                      <Text style={s.timelineEmoji}>{emocion.emoji}</Text>
                      <View style={s.timelineInfo}>
                        <Text style={[s.timelineEmotion, { color: c.text }]}>{emocion.label}</Text>
                        <Text style={[s.timelineDate, { color: c.textSecondary }]}>{fechaTexto(registro.fecha)}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
