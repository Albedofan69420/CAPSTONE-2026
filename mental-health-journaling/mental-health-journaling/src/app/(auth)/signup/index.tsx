import { useState } from "react";
import { Link, router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { OptionSelector } from "@/components/option-selector";
import { useTheme } from "@/hooks/use-theme";
import { useSignup, TipoUsuario } from "@/providers/SignupProvider";
import { authStyles as s } from "@/constants/auth-styles";

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
    router.push("/(auth)/signup/signup-professional");
  }

  };

  return (
    <View style={[s.container, { backgroundColor: c.background }]}>
      <View style={s.form}>
        <Text style={[s.title, { color: c.text }]}>Registrate</Text>
        <Text style={[s.subtitle, { color: c.textSecondary }]}>
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
          <Text style={[s.error, { color: c.error }]} accessibilityRole="alert">
            {error}
          </Text>
        )}

        <Pressable
          style={({ pressed }) => [
            s.button,
            { backgroundColor: c.accent },
            pressed && { opacity: 0.8 },
          ]}
          onPress={handleNext}
          accessibilityRole="button"
        >
          <Text style={[s.buttonText, { color: c.accentText }]}>
            Siguiente
          </Text>
        </Pressable>

        <View style={s.footer}>
          <Text style={{ color: c.textSecondary }}>¿Ya tienes una cuenta? </Text>
          <Link href="/signin" style={{ color: c.accent, fontWeight: "600" }}>
            Inicia sesión
          </Link>
        </View>
      </View>
    </View>
  );
}