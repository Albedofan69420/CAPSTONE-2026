import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { PinInput } from "@/components/pin-input";
import { authStyles as s } from "@/constants/auth-styles";
import { useTheme } from "@/hooks/use-theme";
import { PIN_LENGTH, savePin } from "@/lib/pin";
import { useAuth } from "@/providers/AuthProvider";

export default function CrearPin() {
  const c = useTheme();
  const { session, pinCreated } = useAuth();

  const [step, setStep] = useState<"crear" | "confirmar">("crear");
  const [firstPin, setFirstPin] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleNext = async () => {
    if (pin.length < PIN_LENGTH) {
      setError(`Ingresa los ${PIN_LENGTH} dígitos de tu PIN.`);
      return;
    }

    if (step === "crear") {
      setFirstPin(pin);
      setPin("");
      setError(null);
      setStep("confirmar");
      return;
    }

    if (pin !== firstPin) {
      setError("Los PIN no coinciden. Inténtalo de nuevo.");
      setFirstPin("");
      setPin("");
      setStep("crear");
      return;
    }

    if (!session) return;

    setSaving(true);
    await savePin(session.user.id, pin);
    // Con el PIN guardado, el layout lleva al usuario a las pestañas
    pinCreated();
  };

  return (
    <View style={[s.container, { backgroundColor: c.background }]}>
      <View style={s.form}>
        <Text style={[s.title, { color: c.text }]}>
          {step === "crear" ? "Crea tu PIN" : "Confirma tu PIN"}
        </Text>
        <Text style={[s.subtitle, { color: c.textSecondary }]}>
          {step === "crear"
            ? "Lo usarás cada vez que abras la aplicación."
            : "Ingresa el mismo PIN otra vez."}
        </Text>

        {/* key reinicia los cuadros al cambiar de paso */}
        <PinInput key={step} onChange={setPin} />

        {error && (
          <Text style={[s.error, { color: c.error }]} accessibilityRole="alert">
            {error}
          </Text>
        )}

        <Pressable
          style={({ pressed }) => [
            s.button,
            { backgroundColor: c.accent },
            (pressed || saving) && { opacity: 0.8 },
          ]}
          onPress={handleNext}
          disabled={saving}
          accessibilityRole="button"
        >
          {saving ? (
            <ActivityIndicator color={c.accentText} />
          ) : (
            <Text style={[s.buttonText, { color: c.accentText }]}>
              {step === "crear" ? "Siguiente" : "Guardar PIN"}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}