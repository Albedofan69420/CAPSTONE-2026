import { useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { PIN_LENGTH } from "@/lib/pin";

type Props = {
  length?: number;
  /**Regresa el pin escrito. Está completo cuando el largo sea = a length */
  onChange: (pin: string) => void;
  autoFocus?: boolean;
};

export function PinInput({ length = PIN_LENGTH, onChange, autoFocus = true }: Props) {
  const c = useTheme();
  const inputs = useRef<(TextInput | null)[]>([]);
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const [focused, setFocused] = useState<number | null>(null);

  const update = (next: string[]) => {
    setDigits(next);
    onChange(next.join(""));
  };

  const handleChange = (index: number, text: string) => {
    // Solo números; si ya había uno, conserva el último que se escribió
    const digit = text.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    update(next);

    if (digit && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    index: number,
    e: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    // Con el cuadro vacío, borrar regresa al anterior y lo limpia
    if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = "";
      update(next);
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={(el) => {
            inputs.current[index] = el;
          }}
          style={[
            styles.box,
            {
              backgroundColor: c.backgroundElement,
              borderColor: focused === index ? c.accent : c.border,
              color: c.text,
            },
          ]}
          value={digit}
          onChangeText={(text) => handleChange(index, text)}
          onKeyPress={(e) => handleKeyPress(index, e)}
          onFocus={() => setFocused(index)}
          onBlur={() => setFocused(null)}
          keyboardType="number-pad"
          secureTextEntry
          autoComplete="off"
          autoFocus={autoFocus && index === 0}
          selectTextOnFocus
          textAlign="center"
          accessibilityLabel={`Dígito ${index + 1} de ${length}`}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  box: {
    flex: 1,
    maxWidth: 76,
    aspectRatio: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    fontSize: 26,
    fontWeight: "700",
  },
});