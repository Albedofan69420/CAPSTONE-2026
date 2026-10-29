import { useMemo, type ReactNode } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { aYMD } from "@/components/week-strip";
import { useTheme } from "@/hooks/use-theme";

const DAY_LETTERS = ["L", "M", "X", "J", "V", "S", "D"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

// Meses que se pueden recorrer, contados desde el mes actual
const MONTHS_BEFORE = 12;
const MONTHS_AFTER = 12;

// Alturas fijas para que la lista pueda abrir directamente en el mes seleccionado
const MONTH_TITLE_HEIGHT = 52;
const WEEK_ROW_HEIGHT = 50;
const MONTH_BOTTOM_SPACE = 12;

type Month = {
  key: string;
  year: number;
  month: number;
  /** Casillas vacías antes del día 1 (la semana empieza el lunes) */
  offset: number;
  days: number;
  rows: number;
};

const buildMonth = (year: number, month: number): Month => {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  return { key: `${year}-${month}`, year, month, offset, days, rows: Math.ceil((offset + days) / 7) };
};

const monthHeight = (m: Month) => MONTH_TITLE_HEIGHT + m.rows * WEEK_ROW_HEIGHT + MONTH_BOTTOM_SPACE;

type Props = {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date;
  /** Al tocar un día se elige. Sin `dayDetail`, además se cierra el calendario */
  onSelectDate: (date: Date) => void;
  /** Días que muestran una marca (registros del diario o citas confirmadas) */
  markedDates?: string[];
  /** Panel inferior con información del día elegido (las citas del profesional) */
  dayDetail?: ReactNode;
};

/** Calendario ampliado por meses, que se abre desde el ícono del calendario semanal. */
export function CalendarModal({
  visible,
  onClose,
  selectedDate,
  onSelectDate,
  markedDates = [],
  dayDetail,
}: Props) {
  const c = useTheme();
  const todayKey = aYMD(new Date());
  const selectedKey = aYMD(selectedDate);
  const marked = useMemo(() => new Set(markedDates), [markedDates]);

  const months = useMemo(() => {
    const today = new Date();
    return Array.from({ length: MONTHS_BEFORE + MONTHS_AFTER + 1 }, (_, i) => {
      const first = new Date(today.getFullYear(), today.getMonth() - MONTHS_BEFORE + i, 1);
      return buildMonth(first.getFullYear(), first.getMonth());
    });
  }, []);

  // Posición de cada mes en la lista
  const offsets = useMemo(() => {
    let y = 0;
    return months.map((m) => {
      const start = y;
      y += monthHeight(m);
      return start;
    });
  }, [months]);

  const initialIndex = Math.max(
    0,
    months.findIndex((m) => m.year === selectedDate.getFullYear() && m.month === selectedDate.getMonth())
  );

  const title = `${selectedDate.getDate()} de ${MONTHS[selectedDate.getMonth()]}`;

  const renderMonth = ({ item }: { item: Month }) => {
    const cells = [
      ...Array.from({ length: item.offset }, () => null),
      ...Array.from({ length: item.days }, (_, i) => new Date(item.year, item.month, i + 1)),
    ];

    return (
      <View style={{ height: monthHeight(item) }}>
        <Text style={[styles.monthTitle, { color: c.text, borderTopColor: c.border }]}>
          {MONTHS[item.month]} {item.year}
        </Text>
        <View style={styles.grid}>
          {cells.map((day, index) => {
            if (!day) return <View key={`vacio-${index}`} style={styles.cell} />;

            const key = aYMD(day);
            const selected = key === selectedKey;
            const isToday = key === todayKey;

            return (
              <Pressable
                key={key}
                style={styles.cell}
                onPress={() => {
                  onSelectDate(day);
                  // Con panel inferior se queda abierto para mostrar la información del día
                  if (!dayDetail) onClose();
                }}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`${day.getDate()} de ${MONTHS[day.getMonth()]}${marked.has(key) ? ", con registro" : ""}`}
              >
                <View
                  style={[
                    styles.circle,
                    { backgroundColor: selected ? c.accent : c.backgroundElement },
                    !selected && isToday && { borderColor: c.accent, borderWidth: 1.5 },
                  ]}
                >
                  <Text style={[styles.number, { color: selected ? c.accentText : c.text }]}>
                    {day.getDate()}
                  </Text>
                </View>
                <View style={[styles.dot, { backgroundColor: marked.has(key) ? c.text : "transparent" }]} />
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      {/* El Modal se muestra fuera del árbol de la app: necesita su propio SafeAreaProvider */}
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
          <View style={styles.header}>
            <Pressable
              style={styles.headerButton}
              onPress={onClose}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Cerrar calendario"
            >
              <Ionicons name="close" size={26} color={c.text} />
            </Pressable>
            <Text style={[styles.title, { color: c.text }]}>{title}</Text>
            <View style={styles.headerButton} />
          </View>

          <View style={[styles.letters, { borderBottomColor: c.border }]}>
            {DAY_LETTERS.map((letter) => (
              <View key={letter} style={styles.cell}>
                <View style={[styles.letterCircle, { backgroundColor: c.backgroundElement }]}>
                  <Text style={[styles.letter, { color: c.textSecondary }]}>{letter}</Text>
                </View>
              </View>
            ))}
          </View>

          <FlatList
            data={months}
            keyExtractor={(m) => m.key}
            renderItem={renderMonth}
            initialScrollIndex={initialIndex}
            getItemLayout={(_, index) => ({
              length: monthHeight(months[index]),
              offset: offsets[index],
              index,
            })}
            // Se vuelve a dibujar cuando cambian el día elegido o las marcas
            extraData={`${selectedKey}-${markedDates.length}`}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {dayDetail}
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
  },
  letters: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  letterCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  letter: {
    fontSize: 12,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 32,
  },
  // La línea superior separa un mes del anterior
  monthTitle: {
    borderTopWidth: StyleSheet.hairlineWidth,
    height: MONTH_TITLE_HEIGHT,
    lineHeight: MONTH_TITLE_HEIGHT,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  // 7 columnas: 100 / 7
  cell: {
    width: "14.2857%",
    height: WEEK_ROW_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  number: {
    fontSize: 14,
    fontWeight: "600",
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
});
