
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/hooks/use-theme";

export const EMOTIONS = [
  { id: "feliz", emoji: "😄", label: "Feliz" },
  { id: "bien", emoji: "🙂", label: "Bien" },
  { id: "neutral", emoji: "😐", label: "Neutral" },
  { id: "triste", emoji: "😢", label: "Triste" },
  { id: "ansioso", emoji: "😰", label: "Ansioso" },
  { id: "enojado", emoji: "😠", label: "Enojado" },
  { id: "nervioso", emoji: "😬", label: "Nervioso" },
] as const;

export type EmotionId = (typeof EMOTIONS)[number]["id"];

type Props = {
  value: EmotionId | null;
  onChange: (emotion: EmotionId) => void;
};

export function EmotionSelector({ value, onChange }: Props) {
  const c = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: c.text }]}>
        ¿Cómo me siento hoy?
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {EMOTIONS.map((emotion) => {
          const selected = value === emotion.id;

          return (
            <Pressable
              key={emotion.id}
              onPress={() => onChange(emotion.id)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={emotion.label}
              style={[
                styles.option,
                {
                  backgroundColor: selected
                    ? c.backgroundSelected
                    : c.background,
                  borderColor: selected ? c.accent : c.border,
                },
              ]}
            >
              <Text style={styles.emoji}>{emotion.emoji}</Text>
              <Text style={[styles.label, { color: c.text }]}>
                {emotion.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  row: {
    gap: 8,
    paddingVertical: 5,
  },
  option: {
    width: 72,
    height: 78,
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  emoji: {
    fontSize: 26,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
  },
});
