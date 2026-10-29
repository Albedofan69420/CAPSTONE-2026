import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { aYMD } from "@/components/week-strip";
import { useTheme } from "@/hooks/use-theme";
import { MODALIDAD_LABEL, nombreOtro, rangoHorario, type Cita } from "@/lib/citas";

const WEEKDAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

type Props = {
  date: Date;
  /** Citas del profesional: aquí se filtran las confirmadas de este día */
  citas: Cita[];
  onOpenCita: (cita: Cita) => void;
};

/** Panel inferior del calendario ampliado del profesional: citas agendadas del día elegido. */
export function DayAppointments({ date, citas, onOpenCita }: Props) {
  const c = useTheme();
  const key = aYMD(date);

  const delDia = citas
    .filter((cita) => cita.estado === "confirmada" && cita.fecha_confirmada)
    .filter((cita) => aYMD(new Date(cita.fecha_confirmada!)) === key)
    .sort((a, b) => a.fecha_confirmada!.localeCompare(b.fecha_confirmada!));

  // "Jueves 05 de Junio"
  const title = `${WEEKDAYS[date.getDay()]} ${String(date.getDate()).padStart(2, "0")} de ${MONTHS[date.getMonth()]}`;

  return (
    <View style={[styles.panel, { backgroundColor: c.background, borderColor: c.border }]}>
      <View style={[styles.header, { borderBottomColor: c.border }]}>
        <Text style={[styles.title, { color: c.text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: c.textSecondary }]}>Citas agendadas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {delDia.length === 0 ? (
          <Text style={[styles.empty, { color: c.textSecondary }]}>No tienes citas este día.</Text>
        ) : (
          delDia.map((cita) => (
            <Pressable
              key={cita.id}
              style={({ pressed }) => [
                styles.item,
                { borderBottomColor: c.border },
                pressed && { opacity: 0.6 },
              ]}
              onPress={() => onOpenCita(cita)}
              accessibilityRole="button"
              accessibilityLabel={`${nombreOtro(cita)}, ${rangoHorario(cita.fecha_confirmada!)}`}
            >
              <View style={styles.itemInfo}>
                <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>
                  {nombreOtro(cita)}
                </Text>
                <Text style={[styles.time, { color: c.textSecondary }]}>
                  {rangoHorario(cita.fecha_confirmada!)} · {MODALIDAD_LABEL[cita.modalidad]}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={c.textSecondary} />
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Ocupa la parte inferior del calendario, con las esquinas superiores redondeadas
  panel: {
    height: "38%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  header: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 12,
    gap: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
  },
  list: {
    paddingBottom: 24,
  },
  empty: {
    fontSize: 14,
    textAlign: "center",
    paddingTop: 24,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
  },
  time: {
    fontSize: 14,
  },
});
