import { useRef, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

import { useTheme } from "@/hooks/use-theme";
import { authStyles as s } from "@/constants/auth-styles";

export default function ProfesionalScreen() {
  const c = useTheme();

  const registroRef = useRef<TextInput>(null);
  const [run, setRun] = useState("");
  const [registro, setRegistro] = useState("");
  const [error, setError] = useState<string | null>(null);

  function continuar() {
    if (!run.trim() || !registro.trim()) {
      setError("Ingresa tu RUN y número de registro profesional.");
      return;
    }

    setError(null);

    // Guardaremos los datos y avanzaremos
    // al siguiente paso del registro.
    router.push("/(auth)/signup/signup-info");
  }

  return (
    <ScrollView
      style={{ backgroundColor: c.background }}
      contentContainerStyle={s.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={s.form}>
        <Text style={[s.title, { color: c.text }]}>
          Confirmación de identidad
        </Text>

        <Text style={[s.subtitle, { color: c.textSecondary }]}>
          Verificaremos tu identidad en el sistema
        </Text>

        <View style={s.field}>
          <Text style={[s.label, { color: c.text }]}>RUN</Text>
          <TextInput
            style={[
              s.input,
              { backgroundColor: c.backgroundElement, borderColor: c.border, color: c.text },
            ]}
            placeholder="Ej.: 12.345.678-9"
            placeholderTextColor={c.textSecondary}
            value={run}
            onChangeText={setRun}
            autoCapitalize="characters"
            returnKeyType="next"
            onSubmitEditing={() => registroRef.current?.focus()}
          />
        </View>

        <View style={s.field}>
          <Text style={[s.label, { color: c.text }]}>
            Número de registro profesional
          </Text>
          <TextInput
            ref={registroRef}
            style={[
              s.input,
              { backgroundColor: c.backgroundElement, borderColor: c.border, color: c.text },
            ]}
            placeholder="Ingresa tu registro"
            placeholderTextColor={c.textSecondary}
            value={registro}
            onChangeText={setRegistro}
            returnKeyType="done"
            onSubmitEditing={continuar}
          />
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
            pressed && { opacity: 0.8 },
          ]}
          onPress={continuar}
          accessibilityRole="button"
        >
          <Text style={[s.buttonText, { color: c.accentText }]}>
            Siguiente
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}