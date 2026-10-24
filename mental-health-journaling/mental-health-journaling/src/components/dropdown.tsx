import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { appStyles } from "@/constants/app-styles";
import { useTheme } from "@/hooks/use-theme";

const s = appStyles.dropdown;

type Props = {
  label: string;
  placeholder: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
};

/** Campo con título que despliega su lista de opciones debajo al presionarlo. */
export function Dropdown({ label, placeholder, options, value, onChange, disabled = false }: Props) {
  const c = useTheme();
  const [open, setOpen] = useState(false);

  const elegir = (opcion: string) => {
    // Tocar la opción ya elegida la quita
    onChange(opcion === value ? null : opcion);
    setOpen(false);
  };

  return (
    <View style={s.container}>
      <Text style={[s.label, { color: c.text }]}>{label}</Text>

      <Pressable
        style={[
          s.field,
          { backgroundColor: c.backgroundElement, borderColor: open ? c.accent : c.border },
          disabled && { opacity: 0.5 },
        ]}
        onPress={() => setOpen(!open)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value ?? placeholder}`}
        accessibilityState={{ expanded: open, disabled }}
      >
        <Text style={[s.value, { color: value ? c.text : c.textSecondary }]} numberOfLines={1}>
          {value ?? placeholder}
        </Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={20} color={c.textSecondary} />
      </Pressable>

      {open && (
        <View style={[s.options, { backgroundColor: c.backgroundElement, borderColor: c.border }]}>
          {options.map((opcion) => {
            const elegida = opcion === value;
            return (
              <Pressable
                key={opcion}
                style={({ pressed }) => [
                  s.option,
                  (elegida || pressed) && { backgroundColor: c.backgroundSelected },
                ]}
                onPress={() => elegir(opcion)}
                accessibilityRole="button"
                accessibilityState={{ selected: elegida }}
              >
                <Text style={[s.optionText, { color: c.text }]}>{opcion}</Text>
                {elegida && <Ionicons name="checkmark" size={18} color={c.accent} />}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
