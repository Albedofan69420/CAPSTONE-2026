import { useState } from "react";
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { PinInput } from "@/components/pin-input";
import { appStyles } from "@/constants/app-styles";
import { authStyles as form } from "@/constants/auth-styles";
import { useTheme } from "@/hooks/use-theme";
import { PIN_LENGTH, savePin, verifyPin } from "@/lib/pin";
import { useAuth } from "@/providers/AuthProvider";

const s = appStyles.privacidad;

export default function CambiarPin() {
  const c = useTheme();
  const { session } = useAuth();
  const [actual, setActual] = useState("");
  const [nuevo, setNuevo] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [completado, setCompletado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guardar = async () => {
    if (!session || guardando || completado) return;
    if ([actual, nuevo, confirmacion].some((pin) => pin.length !== PIN_LENGTH)) {
      setError(`Completa los ${PIN_LENGTH} dígitos de cada PIN.`);
      return;
    }
    if (nuevo === actual) {
      setError("Elige un PIN distinto del actual.");
      return;
    }
    if (nuevo !== confirmacion) {
      setError("La confirmación no coincide con el nuevo PIN.");
      return;
    }

    setError(null);
    setGuardando(true);
    const userId = session.user.id;
    try {
      if (!(await verifyPin(userId, actual))) {
        setError("El PIN actual es incorrecto.");
        return;
      }

      await savePin(userId, nuevo);
      setActual("");
      setNuevo("");
      setConfirmacion("");
      Keyboard.dismiss();
      setCompletado(true);
    } catch {
      setError("No se pudo guardar el nuevo PIN. Inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  const campos = [
    { etiqueta: "PIN actual", cambiar: setActual },
    { etiqueta: "Nuevo PIN", cambiar: setNuevo },
    { etiqueta: "Confirmar nuevo PIN", cambiar: setConfirmacion },
  ];

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <KeyboardAvoidingView style={s.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={s.header}>
          <Pressable style={s.backButton} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Volver">
            <Ionicons name="chevron-back" size={28} color={c.text} />
          </Pressable>
          <Text style={[s.title, { color: c.text }]}>Cambiar PIN</Text>
          <View style={s.backSpace} />
        </View>

        <ScrollView contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={form.form}>
            {completado ? (
              <Text style={[form.subtitle, { color: c.text }]} accessibilityRole="alert">
                PIN actualizado. Usa el nuevo PIN la próxima vez que desbloquees la app en este dispositivo.
              </Text>
            ) : (
              campos.map(({ etiqueta, cambiar }) => (
                <View key={etiqueta} style={form.field}>
                  <Text style={[form.label, { color: c.text }]}>{etiqueta}</Text>
                  <PinInput onChange={cambiar} autoFocus={false} accessibilityLabel={etiqueta} />
                </View>
              ))
            )}

            {error && <Text style={[form.error, { color: c.error }]} accessibilityRole="alert">{error}</Text>}
            <Pressable
              style={[form.button, { backgroundColor: c.accent }]}
              onPress={completado ? () => router.back() : guardar}
              disabled={guardando}
              accessibilityRole="button"
              accessibilityLabel={completado ? "Listo" : "Guardar PIN"}
              accessibilityState={{ disabled: guardando, busy: guardando }}
            >
              {guardando ? (
                <ActivityIndicator color={c.accentText} />
              ) : (
                <Text style={[form.buttonText, { color: c.accentText }]}>{completado ? "Listo" : "Guardar PIN"}</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
