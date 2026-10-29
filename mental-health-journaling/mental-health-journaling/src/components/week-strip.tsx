import { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/hooks/use-theme";

const DAY_LETTERS = ["L", "M", "X", "J", "V", "S", "D"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

// Semanas que se pueden recorrer deslizando, contadas desde la semana actual (unos 2 años)
const WEEKS_BEFORE = 104;
const WEEKS_AFTER = 104;

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
  /** Si se pasa, muestra a la derecha el ícono que abre el calendario ampliado */
  onExpand?: () => void;
};

/** Calendario de una semana. Se desliza a la izquierda o a la derecha para cambiar de semana. */
export function WeekStrip({ selectedDate, onSelectDate, markedDates = [], onExpand }: Props) {
  const c = useTheme();
  const listRef = useRef<FlatList<number>>(null);
  // Ancho de cada página: el de la pantalla menos los márgenes de la vista que lo contiene
  const [width, setWidth] = useState(0);
  const todayKey = aYMD(new Date());
  const selectedKey = aYMD(selectedDate);

  // La semana actual se calcula una sola vez: es el punto de referencia de la lista
  const [baseWeek] = useState(() => startOfWeek(new Date()));
  const weeks = useMemo(() => Array.from({ length: WEEKS_BEFORE + WEEKS_AFTER + 1 }, (_, i) => i), []);
  const weekStartOf = (index: number) => addDays(baseWeek, (index - WEEKS_BEFORE) * 7);
  const weekIndexOf = (date: Date) =>
    WEEKS_BEFORE + Math.round((startOfWeek(date).getTime() - baseWeek.getTime()) / (7 * 24 * 60 * 60 * 1000));

  const selectedIndex = Math.min(Math.max(weekIndexOf(selectedDate), 0), weeks.length - 1);
  const [visibleIndex, setVisibleIndex] = useState(selectedIndex);

  // Si el día se elige desde fuera (el calendario ampliado), se muestra su semana
  const [prevSelectedKey, setPrevSelectedKey] = useState(selectedKey);
  if (prevSelectedKey !== selectedKey) {
    setPrevSelectedKey(selectedKey);
    setVisibleIndex(selectedIndex);
  }

  useEffect(() => {
    if (width > 0) listRef.current?.scrollToIndex({ index: selectedIndex, animated: true });
    // Solo cuando cambia el día elegido: deslizar no debe devolver la lista a esa semana
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey]);

  // El título muestra el mes del jueves, que decide a qué mes pertenece la semana
  const middle = addDays(weekStartOf(visibleIndex), 3);

  const renderWeek = ({ item }: { item: number }) => {
    const start = weekStartOf(item);

    return (
      <View style={[styles.row, { width }]}>
        {Array.from({ length: 7 }, (_, i) => addDays(start, i)).map((day, index) => {
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
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.month, { color: c.text }]}>
          {MONTHS[middle.getMonth()]} {middle.getFullYear()}
        </Text>

        {/* Va encima del encabezado para que la fecha quede centrada */}
        {onExpand && (
          <Pressable
            style={[styles.expand, { backgroundColor: c.backgroundElement }]}
            onPress={onExpand}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Ver calendario completo"
          >
            <Ionicons name="calendar-outline" size={20} color={c.accent} />
          </Pressable>
        )}
      </View>

      <View style={styles.weeks} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {width > 0 && (
          <FlatList
            ref={listRef}
            data={weeks}
            keyExtractor={(item) => String(item)}
            renderItem={renderWeek}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={selectedIndex}
            getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
            onMomentumScrollEnd={(e) =>
              setVisibleIndex(Math.round(e.nativeEvent.contentOffset.x / width))
            }
            // Pocas semanas en memoria: solo se ve una a la vez
            initialNumToRender={1}
            windowSize={3}
            extraData={`${selectedKey}-${markedDates.join(",")}`}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  expand: {
    position: "absolute",
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  month: {
    fontSize: 18,
    fontWeight: "700",
  },
  // Alto de una semana (letra + círculo + marca), para reservar el espacio antes de medir el ancho
  weeks: {
    minHeight: 77,
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
