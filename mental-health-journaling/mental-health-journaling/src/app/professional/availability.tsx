import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Switch, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { appStyles } from "@/constants/app-styles";
import { useTheme } from "@/hooks/use-theme";
import { formatearHoraEscrita } from "@/lib/citas";
import {
  DIAS_SEMANA,
  guardarMiDisponibilidad,
  minutosHora,
  obtenerMiDisponibilidad,
  type DiaSemana,
  type DisponibilidadDia,
} from "@/lib/disponibilidad";

const s = appStyles.availability;

type DiaFormulario = {
  dia_semana: DiaSemana;
  activo: boolean;
  hora_inicio: string;
  hora_fin: string;
};

const semanaInicial = (): DiaFormulario[] =>
  DIAS_SEMANA.map((dia) => ({
    dia_semana: dia.id,
    activo: false,
    hora_inicio: "09:00",
    hora_fin: "18:00",
  }));

export default function DisponibilidadProfesional() {
  const c = useTheme();
  const [semana, setSemana] = useState<DiaFormulario[]>(semanaInicial);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    obtenerMiDisponibilidad()
      .then((dias) => {
        setSemana((actual) =>
          actual.map((dia) => {
            const guardado = dias.find((item) => item.dia_semana === dia.dia_semana);
            return guardado
              ? { ...dia, activo: true, hora_inicio: guardado.hora_inicio, hora_fin: guardado.hora_fin }
              : dia;
          })
        );
      })
      .catch((error) => Alert.alert("No se pudo cargar la disponibilidad", (error as Error).message))
      .finally(() => setCargando(false));
  }, []);

  const actualizar = (diaSemana: DiaSemana, cambios: Partial<DiaFormulario>) => {
    setSemana((actual) =>
      actual.map((dia) => (dia.dia_semana === diaSemana ? { ...dia, ...cambios } : dia))
    );
  };

  const guardar = async () => {
    const activos = semana.filter((dia) => dia.activo);
    if (activos.length === 0) {
      Alert.alert("Selecciona un día", "Debes configurar al menos un día laboral.");
      return;
    }

    for (const dia of activos) {
      const inicio = minutosHora(dia.hora_inicio);
      const fin = minutosHora(dia.hora_fin);
      if (inicio === null || fin === null) {
        Alert.alert("Horario inválido", "Usa el formato HH:MM en todos los días activos.");
        return;
      }
      if (fin - inicio < 60) {
        const nombre = DIAS_SEMANA.find((item) => item.id === dia.dia_semana)?.nombre;
        Alert.alert("Horario demasiado corto", `${nombre} debe tener al menos 60 minutos disponibles.`);
        return;
      }
    }

    const disponibilidad: DisponibilidadDia[] = activos.map((dia) => ({
      dia_semana: dia.dia_semana,
      hora_inicio: dia.hora_inicio,
      hora_fin: dia.hora_fin,
    }));

    setGuardando(true);
    try {
      await guardarMiDisponibilidad(disponibilidad);
      Alert.alert("Disponibilidad guardada", "La agenda solo permitirá citas dentro de estos horarios.", [
        { text: "Aceptar", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("No se pudo guardar", (error as Error).message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <View style={s.header}>
        <Pressable style={s.headerButton} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Volver">
          <Ionicons name="chevron-back" size={28} color={c.text} />
        </Pressable>
        <Text style={[s.headerTitle, { color: c.text }]}>Disponibilidad laboral</Text>
        <View style={s.headerButton} />
      </View>

      {cargando ? (
        <View style={s.center}><ActivityIndicator size="large" color={c.accent} /></View>
      ) : (
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={[s.notice, { backgroundColor: c.backgroundElement }]}>
            <Ionicons name="information-circle-outline" size={21} color={c.accent} />
            <Text style={[s.noticeText, { color: c.textSecondary }]}>
              Define tu semana habitual. Cada cita dura 60 minutos y debe comenzar y terminar dentro del horario indicado.
            </Text>
          </View>

          <View style={s.days}>
            {semana.map((dia) => {
              const nombre = DIAS_SEMANA.find((item) => item.id === dia.dia_semana)!.nombre;
              return (
                <View key={dia.dia_semana} style={[s.dayCard, { backgroundColor: c.backgroundElement }]}>
                  <View style={s.dayHeader}>
                    <Text style={[s.dayName, { color: c.text }]}>{nombre}</Text>
                    <Switch
                      value={dia.activo}
                      onValueChange={(activo) => actualizar(dia.dia_semana, { activo })}
                      trackColor={{ false: c.border, true: c.accent }}
                      thumbColor={c.accentText}
                      ios_backgroundColor={c.border}
                      accessibilityLabel={`${nombre} laboral`}
                    />
                  </View>

                  {dia.activo ? (
                    <View style={s.hoursRow}>
                      <View style={s.hourField}>
                        <Text style={[s.label, { color: c.textSecondary }]}>Desde</Text>
                        <TextInput
                          style={[s.input, { color: c.text, borderColor: c.border }]}
                          value={dia.hora_inicio}
                          onChangeText={(valor) => actualizar(dia.dia_semana, { hora_inicio: formatearHoraEscrita(valor) })}
                          placeholder="09:00"
                          placeholderTextColor={c.textSecondary}
                          keyboardType="number-pad"
                          maxLength={5}
                        />
                      </View>
                      <Ionicons name="arrow-forward" size={18} color={c.textSecondary} style={s.arrow} />
                      <View style={s.hourField}>
                        <Text style={[s.label, { color: c.textSecondary }]}>Hasta</Text>
                        <TextInput
                          style={[s.input, { color: c.text, borderColor: c.border }]}
                          value={dia.hora_fin}
                          onChangeText={(valor) => actualizar(dia.dia_semana, { hora_fin: formatearHoraEscrita(valor) })}
                          placeholder="18:00"
                          placeholderTextColor={c.textSecondary}
                          keyboardType="number-pad"
                          maxLength={5}
                        />
                      </View>
                    </View>
                  ) : (
                    <Text style={[s.notWorking, { color: c.textSecondary }]}>No trabajas este día</Text>
                  )}
                </View>
              );
            })}
          </View>

          <Pressable
            style={({ pressed }) => [s.saveButton, { backgroundColor: c.accent }, guardando && s.disabled, pressed && { opacity: 0.8 }]}
            onPress={guardar}
            disabled={guardando}
            accessibilityRole="button"
          >
            {guardando ? <ActivityIndicator color={c.accentText} /> : (
              <Text style={[s.saveButtonText, { color: c.accentText }]}>Guardar disponibilidad</Text>
            )}
          </Pressable>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
