import { useRef, useState } from "react";
import { Link, router } from "expo-router";
import { ActivityIndicator, KeyboardAvoidingView, NativeSyntheticEvent, Platform, Pressable, StyleSheet, Text, TextInput, TextInputKeyPressEventData, View,} from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { authStyles as s } from "@/constants/auth-styles";

const DIGITS = 4;

export default function Signup() {
    const c = useTheme();

    const inputs = useRef<(TextInput | null)[]>([]);
    const [digits, setDigits] = useState<string[]>(Array(DIGITS).fill(""));
    const [focused, setFocused] = useState<number | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignUp = () => {
      router.replace("/");
    };

    const handleChange = (index: number, text: string) => {
      const digit = text.replace(/\D/g, "").slice(-1);

      setDigits((prev) => {
        const next = [...prev];
        next[index] = digit;
        return next;
      });

      if (digit && index < DIGITS - 1) {
        inputs.current[index + 1]?.focus();
      }
    };

    const handleKeyPress = (
      index: number,
      e: NativeSyntheticEvent<TextInputKeyPressEventData>
    ) => {
      // Con el cuadro vacío, borrar regresa al anterior
      if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    };

    return (
        <KeyboardAvoidingView
              style={[s.container, { backgroundColor: c.background }]}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <View style={s.form}>
                <Text style={[s.title, { color: c.text }]}>Registrate</Text>
                <Text style={[s.subtitle, { color: c.textSecondary }]}>
                  Crea una clave de seguridad para acceder a la aplicación.
                </Text>

                <View style={s.field}>
                  <Text style={[s.label, { color: c.text }]}>Contraseña</Text>
                  <View style={s.row}>
                    {digits.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(el) => {
                          inputs.current[index] = el;
                        }}
                        style={[
                          s.box,
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
                        selectTextOnFocus
                        textAlign="center"
                        returnKeyType={index === DIGITS - 1 ? "done" : "next"}
                        onSubmitEditing={index === DIGITS - 1 ? handleSignUp : undefined}
                        accessibilityLabel={`Dígito ${index + 1} de ${DIGITS}`}
                      />
                    ))}
                  </View>
                </View>

                {error && (
                  <Text style={[s.error, { color: c.error }]} accessibilityRole="alert">
                    {error}
                  </Text>
                )}

                <Pressable
                  style={({ pressed }) => [
                    s.button,
                    { backgroundColor: c.accent },
                    (pressed || loading) && { opacity: 0.8 },
                  ]}
                  onPress={handleSignUp}
                  disabled={loading}
                  accessibilityRole="button"
                >
                  {loading ? (
                    <ActivityIndicator color={c.accentText} />
                  ) : (
                    <Text style={[s.buttonText, { color: c.accentText }]}>
                      Registrarse
                    </Text>
                  )}
                </Pressable>

              </View>
            </KeyboardAvoidingView>
    )
}