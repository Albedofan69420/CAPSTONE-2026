import { useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { appStyles } from "@/constants/app-styles";
import { authStyles as form } from "@/constants/auth-styles";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/lib/supabase";

const s = appStyles.privacidad;

export default function CambiarContrasena() {
  const c = useTheme();
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guardar = async () => {
    if (guardando) return;
    if (!actual) {
      setError("Ingresa tu contraseña actual.");
      return;
    }
    if (nueva.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (nueva === actual) {
      setError("Elige una contraseña distinta de la actual.");
      return;
    }
    if (nueva !== confirmacion) {
      setError("La confirmación no coincide con la nueva contraseña.");
      return;
    }

    setError(null);
    setGuardando(true);
    try {
      const { error: authError } = await supabase.auth.updateUser({
        current_password: actual,
        password: nueva,
      });
      if (authError) {
        const mensajes: Record<string, string> = {
          invalid_credentials: "La contraseña actual es incorrecta.",
          same_password: "Elige una contraseña distinta de la actual.",
          weak_password: "La nueva contraseña no cumple los requisitos de seguridad. Prueba con una más larga y variada.",
          over_request_rate_limit: "Espera unos minutos antes de volver a intentarlo.",
          reauthentication_needed: "Vuelve a iniciar sesión antes de cambiar tu contraseña.",
        };
        setError(mensajes[authError.code ?? ""] ?? "No se pudo cambiar la contraseña. Inténtalo de nuevo.");
        return;
      }

      setActual("");
      setNueva("");
      setConfirmacion("");
      Alert.alert("Contraseña actualizada", "Ya puedes iniciar sesión con tu nueva contraseña.", [
        { text: "Aceptar", onPress: () => router.back() },
      ]);
    } catch {
      setError("No se pudo cambiar la contraseña. Inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  const campos = [
    { etiqueta: "Contraseña actual", valor: actual, cambiar: setActual, autocomplete: "current-password" },
    { etiqueta: "Nueva contraseña", valor: nueva, cambiar: setNueva, autocomplete: "new-password" },
    { etiqueta: "Confirmar nueva contraseña", valor: confirmacion, cambiar: setConfirmacion, autocomplete: "new-password" },
  ] as const;

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <KeyboardAvoidingView style={s.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={s.header}>
          <Pressable style={s.backButton} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Volver">
            <Ionicons name="chevron-back" size={28} color={c.text} />
          </Pressable>
          <Text style={[s.title, { color: c.text }]}>Cambiar contraseña</Text>
          <View style={s.backSpace} />
        </View>

        <ScrollView contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={form.form}>
            {campos.map(({ etiqueta, valor, cambiar, autocomplete }) => (
              <View key={etiqueta} style={form.field}>
                <Text style={[form.label, { color: c.text }]}>{etiqueta}</Text>
                <TextInput
                  style={[form.input, { backgroundColor: c.backgroundElement, borderColor: c.border, color: c.text }]}
                  value={valor}
                  onChangeText={cambiar}
                  accessibilityLabel={etiqueta}
                  autoComplete={autocomplete}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  editable={!guardando}
                />
              </View>
            ))}

            {error && <Text style={[form.error, { color: c.error }]} accessibilityRole="alert">{error}</Text>}
            <Pressable
              style={[form.button, { backgroundColor: c.accent }]}
              onPress={guardar}
              disabled={guardando}
              accessibilityRole="button"
              accessibilityLabel="Guardar contraseña"
              accessibilityState={{ disabled: guardando, busy: guardando }}
            >
              {guardando ? (
                <ActivityIndicator color={c.accentText} />
              ) : (
                <Text style={[form.buttonText, { color: c.accentText }]}>Guardar contraseña</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
