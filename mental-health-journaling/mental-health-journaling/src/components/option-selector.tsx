import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";

export type Option<T extends string> = {
  value: T;
  label: string;
  description?: string;
};

type Props<T extends string> = {
  options: Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
};

export function OptionSelector<T extends string>({
  options,
  value,
  onChange,
}: Props<T>) {
  const c = useTheme();

  return (
    <View style={styles.group} accessibilityRole="radiogroup">
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            style={[
              styles.option,
              {
                backgroundColor: selected
                  ? c.backgroundSelected
                  : c.backgroundElement,
                borderColor: selected ? c.accent : c.border,
              },
            ]}
          >
            <View
              style={[
                styles.radio,
                { borderColor: selected ? c.accent : c.textSecondary },
              ]}
            >
              {selected && (
                <View style={[styles.dot, { backgroundColor: c.accent }]} />
              )}
            </View>

            <View style={styles.texts}>
              <Text style={[styles.label, { color: c.text }]}>
                {option.label}
              </Text>
              {option.description && (
                <Text style={[styles.description, { color: c.textSecondary }]}>
                  {option.description}
                </Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderWidth: 1.5,
    borderRadius: 12,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
  },
});