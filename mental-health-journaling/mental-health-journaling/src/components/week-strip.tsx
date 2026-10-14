import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";

const DAY_LETTERS = ["L", "M", "X", "J", "V", "S", "D"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

//Fecha local en formato YYYY-MM-DD para evitar desfase
export const aYMD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

//Empieza la semana el lunes
const startOfWeek = (d: Date) => addDays(d, -((d.getDay() + 6) % 7));

type Props = {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  /** Días con un registro muestran una marca */
  markedDates?: string[];
};

export function WeekStrip({ selectedDate, onSelectDate, markedDates = [] }: Props) {
  const c = useTheme();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(selectedDate));

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const middle = days[3];
  const todayKey = aYMD(new Date());
  const selectedKey = aYMD(selectedDate);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => setWeekStart(addDays(weekStart, -7))}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Semana anterior"
        >
          <Text style={[styles.arrow, { color: c.accent }]}>‹</Text>
        </Pressable>

        <Text style={[styles.month, { color: c.text }]}>
          {MONTHS[middle.getMonth()]} {middle.getFullYear()}
        </Text>

        <Pressable
          onPress={() => setWeekStart(addDays(weekStart, 7))}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Semana siguiente"
        >
          <Text style={[styles.arrow, { color: c.accent }]}>›</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        {days.map((day, index) => {
          const key = aYMD(day);
          const selected = key === selectedKey;
          const isToday = key === todayKey;
          const marked = markedDates.includes(key);

          return (
            <Pressable
              key={key}
              style={styles.day}
              onPress={() => onSelectDate(day)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${day.getDate()} de ${MONTHS[day.getMonth()]}`}
            >
              <Text style={[styles.letter, { color: c.textSecondary }]}>
                {DAY_LETTERS[index]}
              </Text>

              <View
                style={[
                  styles.circle,
                  selected && { backgroundColor: c.accent },
                  !selected && isToday && { borderColor: c.accent, borderWidth: 1.5 },
                ]}
              >
                <Text
                  style={[
                    styles.number,
                    { color: selected ? c.accentText : c.text },
                  ]}
                >
                  {day.getDate()}
                </Text>
              </View>

              <View
                style={[
                  styles.dot,
                  { backgroundColor: marked ? c.accent : "transparent" },
                ]}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  arrow: {
    fontSize: 32,
    lineHeight: 34,
    fontWeight: "600",
  },
  month: {
    fontSize: 18,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  day: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  letter: {
    fontSize: 13,
    fontWeight: "600",
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  number: {
    fontSize: 16,
    fontWeight: "600",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});