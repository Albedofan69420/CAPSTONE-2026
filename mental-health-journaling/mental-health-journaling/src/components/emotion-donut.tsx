import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

import { EMOTIONS, type EmotionId } from "@/components/journal/emotion-selector";
import { appStyles } from "@/constants/app-styles";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTheme } from "@/hooks/use-theme";

const s = appStyles.emotionDonut;

// Un color fijo por emoción (no por posición), validado para daltonismo en ambos modos.
// Algunos tonos claros tienen poco contraste con la tarjeta, por eso la leyenda siempre está visible.
const EMOTION_COLORS: Record<"light" | "dark", Record<EmotionId, string>> = {
  light: {
    feliz: "#2a78d6",
    bien: "#eb6834",
    neutral: "#1baf7a",
    triste: "#eda100",
    ansioso: "#e87ba4",
    enojado: "#008300",
    nervioso: "#6250d6",
  },
  dark: {
    feliz: "#3987e5",
    bien: "#d95926",
    neutral: "#199e70",
    triste: "#c98500",
    ansioso: "#d55181",
    enojado: "#008300",
    nervioso: "#9085e9",
  },
};

const SIZE = 200;
const STROKE = 26;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
// Separación entre segmentos, del color de la tarjeta
const GAP = 2;

type Props = {
  emociones: EmotionId[];
};

export function EmotionDonut({ emociones }: Props) {
  const c = useTheme();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const colores = EMOTION_COLORS[scheme];
  const [seleccion, setSeleccion] = useState<EmotionId | null>(null);

  const total = emociones.length;

  if (total === 0) {
    return (
      <View style={[s.card, { backgroundColor: c.backgroundElement }]}>
        <Text style={[s.empty, { color: c.textSecondary }]}>
          Aún no hay registros este mes. Cuando escribas en tu diario, aquí verás tus emociones.
        </Text>
      </View>
    );
  }

  // Segmentos en el orden fijo de EMOTIONS para que los colores vecinos sean siempre distinguibles
  const conteos = EMOTIONS.map((e) => ({
    ...e,
    cantidad: emociones.filter((id) => id === e.id).length,
  })).filter((e) => e.cantidad > 0);

  const ranking = [...conteos].sort((a, b) => b.cantidad - a.cantidad);
  const destacada = conteos.find((e) => e.id === seleccion) ?? ranking[0];

  const porcentaje = (cantidad: number) => Math.round((cantidad / total) * 100);

  const segmentos = conteos.map((e, i) => {
    const largo = (e.cantidad / total) * CIRCUMFERENCE;
    const previos = conteos.slice(0, i).reduce((suma, p) => suma + p.cantidad, 0);
    const inicio = (previos / total) * CIRCUMFERENCE;
    // Con una sola emoción el anillo queda completo, sin separación
    const visible = conteos.length > 1 ? Math.max(largo - GAP, 1) : largo;
    return { ...e, inicio, visible };
  });

  const alternar = (id: EmotionId) => setSeleccion((actual) => (actual === id ? null : id));

  return (
    <View style={[s.card, { backgroundColor: c.backgroundElement }]}>
      <View style={s.chart}>
        <Svg width={SIZE} height={SIZE}>
          <G rotation={-90} origin={`${SIZE / 2}, ${SIZE / 2}`}>
            {segmentos.map((seg) => (
              <Circle
                key={seg.id}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={colores[seg.id]}
                strokeWidth={STROKE}
                strokeDasharray={`${seg.visible} ${CIRCUMFERENCE}`}
                strokeDashoffset={-seg.inicio}
                opacity={destacada.id === seg.id || !seleccion ? 1 : 0.35}
                onPress={() => alternar(seg.id)}
              />
            ))}
          </G>
        </Svg>

        <View style={s.center} pointerEvents="none">
          <Text style={s.centerEmoji}>{destacada.emoji}</Text>
          <Text style={[s.centerValue, { color: c.text }]}>
            {porcentaje(destacada.cantidad)}%
          </Text>
          <Text style={[s.centerLabel, { color: c.textSecondary }]}>
            {seleccion ? destacada.label : `Más frecuente: ${destacada.label}`}
          </Text>
        </View>
      </View>

      <View style={s.legend}>
        {ranking.map((e) => {
          const activa = seleccion === e.id;
          return (
            <Pressable
              key={e.id}
              style={[s.legendRow, activa && { backgroundColor: c.backgroundSelected }]}
              onPress={() => alternar(e.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: activa }}
              accessibilityLabel={`${e.label}: ${e.cantidad} ${e.cantidad === 1 ? "día" : "días"}, ${porcentaje(e.cantidad)} por ciento`}
            >
              <View style={[s.swatch, { backgroundColor: colores[e.id] }]} />
              <Text style={[s.legendLabel, { color: c.text }]}>
                {e.emoji} {e.label}
              </Text>
              <Text style={[s.legendValue, { color: c.textSecondary }]}>
                {e.cantidad} {e.cantidad === 1 ? "día" : "días"} · {porcentaje(e.cantidad)}%
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
