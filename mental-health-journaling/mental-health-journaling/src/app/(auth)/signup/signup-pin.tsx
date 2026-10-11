import { useRef, useState } from "react";
import { Link, router } from "expo-router";
import { ActivityIndicator, KeyboardAvoidingView, NativeSyntheticEvent, Platform, Pressable, StyleSheet, Text, TextInput, TextInputKeyPressEventData, View,} from "react-native";

import { useTheme } from "@/hooks/use-theme";

const DIGITS = 4;

export default function Signup() {
    const c = useTheme();

    const inputs = useRef<(TextInput | null)[]>([]);
    const [digits, setDigits] = useState<string[]>(Array(DIGITS).fill(""));
    const [focused, setFocused] = useState<number | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignUp = () => {
      router.push("/signup/signup-pin");
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
              style={[styles.container, { backgroundColor: c.background }]}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <View style={styles.form}>
                <Text style={[styles.title, { color: c.text }]}>Registrate</Text>
                <Text style={[styles.subtitle, { color: c.textSecondary }]}>
                  Crea una clave de seguridad para acceder a la aplicación.
                </Text>

                <View style={styles.field}>
                  <Text style={[styles.label, { color: c.text }]}>Contraseña</Text>
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
                  <Text style={[styles.error, { color: c.error }]} accessibilityRole="alert">
                    {error}
                  </Text>
                )}

                <Pressable
                  style={({ pressed }) => [
                    styles.button,
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
                    <Text style={[styles.buttonText, { color: c.accentText }]}>
                      Registrarse
                    </Text>
                  )}
                </Pressable>

              </View>
            </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  form: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    gap: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
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
  error: {
    fontSize: 14,
  },
  button: {
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
});