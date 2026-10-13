import { useState } from "react";
import { Link, router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { OptionSelector } from "@/components/option-selector";
import { useTheme } from "@/hooks/use-theme";
import { useSignup, TipoUsuario } from "@/providers/SignupProvider";

export default function Signup() {
  const c = useTheme();
  const { data, updateData } = useSignup();
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (!data.tipoUsuario) {
      setError("Elige un tipo de cuenta para continuar.");
      return;
    }

    setError(null);
    router.push("/signup/signup-info");

    if (data.tipoUsuario === "profesional") {
    router.push("/(auth)/signup/singup-professional");
  }

  };

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={styles.form}>
        <Text style={[styles.title, { color: c.text }]}>Registrate</Text>
        <Text style={[styles.subtitle, { color: c.textSecondary }]}>
          Selecciona el tipo de uso que le darás a la aplicación.
        </Text>

        <OptionSelector<TipoUsuario>
          options={[
            { value: "personal", label: "Uso Personal", description: "Busco usar las funciones de la app" },
            { value: "profesional", label: "Uso Profesional", description: "Busco ofrecer mis servicios" },
          ]}
          value={data.tipoUsuario}
          onChange={(tipo) => {
            updateData({ tipoUsuario: tipo });
            setError(null);
          }}
        />

        {error && (
          <Text style={[styles.error, { color: c.error }]} accessibilityRole="alert">
            {error}
          </Text>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: c.accent },
            pressed && { opacity: 0.8 },
          ]}
          onPress={handleNext}
          accessibilityRole="button"
        >
          <Text style={[styles.buttonText, { color: c.accentText }]}>
            Siguiente
          </Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={{ color: c.textSecondary }}>¿Ya tienes una cuenta? </Text>
          <Link href="/signin" style={{ color: c.accent, fontWeight: "600" }}>
            Inicia sesión
          </Link>
        </View>
      </View>
    </View>
  );
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