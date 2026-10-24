import { Stack } from "expo-router";

import { useAuth } from "@/providers/AuthProvider";

// Vistas exclusivas del profesional. El layout raíz solo entra aquí si la cuenta es profesional
// y está subiendo sus certificados o ya creó su PIN.
export default function ProfessionalLayout() {
  const { hasPin } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Sin PIN todavía: paso de certificados del registro */}
      <Stack.Protected guard={hasPin === false}>
        <Stack.Screen name="certificates" />
      </Stack.Protected>

      {/* Con PIN: inicio del profesional */}
      <Stack.Protected guard={hasPin === true}>
        <Stack.Screen name="index" />
      </Stack.Protected>
    </Stack>
  );
}
