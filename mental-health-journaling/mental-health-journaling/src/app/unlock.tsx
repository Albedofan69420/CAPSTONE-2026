import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

import { PinInput } from "@/components/pin-input";
import { authStyles as s } from "@/constants/auth-styles";
import { useTheme } from "@/hooks/use-theme";
import { PIN_LENGTH, removePin, verifyPin } from "@/lib/pin";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";

const MAX_ATTEMPTS = 5;

export default function Desbloquear() {
  const c = useTheme();
  const { session, unlock } = useAuth();

  const [failures, setFailures] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  // Borra el PIN de este teléfono y cierra sesión: se vuelve a entrar con la contraseña
  const salirYBorrarPin = async () => {
    if (session) await removePin(session.user.id);
    await supabase.auth.signOut();
  };

  const handleChange = async (pin: string) => {
    if (pin.length < PIN_LENGTH || checking || !session) return;

    setChecking(true);
    const ok = await verifyPin(session.user.id, pin);

    if (ok) {
      unlock();
      return;
    }

    const total = failures + 1;

    if (total >= MAX_ATTEMPTS) {
      Alert.alert(
        "Demasiados intentos",
        "Por seguridad, inicia sesión de nuevo con tu contraseña."
      );
      await salirYBorrarPin();
      return;
    }

    setFailures(total);
    setError(`PIN incorrecto. Te quedan ${MAX_ATTEMPTS - total} intentos.`);
    setChecking(false);
  };

  const olvidePin = () => {
    Alert.alert(
      "¿Olvidaste tu PIN?",
      "Cerraremos tu sesión y tendrás que ingresar con tu contraseña para crear un PIN nuevo.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Continuar", style: "destructive", onPress: salirYBorrarPin },
      ]
    );
  };

  return (
    <View style={[s.container, { backgroundColor: c.background }]}>
      <View style={s.form}>
        <Text style={[s.title, { color: c.text }]}>Ingresa tu PIN</Text>
        <Text style={[s.subtitle, { color: c.textSecondary }]}>
          Para abrir la aplicación.
        </Text>

        {/* key reinicia los cuadros después de cada intento fallido */}
        <PinInput key={failures} onChange={handleChange} />

        {error && (
          <Text style={[s.error, { color: c.error }]} accessibilityRole="alert">
            {error}
          </Text>
        )}

        <View style={s.footer}>
          <Pressable onPress={olvidePin} accessibilityRole="button" hitSlop={8}>
            <Text style={{ color: c.accent, fontWeight: "600" }}>
              Olvidé mi PIN
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}