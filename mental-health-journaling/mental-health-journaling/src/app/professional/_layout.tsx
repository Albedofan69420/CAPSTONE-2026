import { Stack } from "expo-router";

import { useAuth } from "@/providers/AuthProvider";

// Vistas exclusivas del profesional. El layout raíz solo entra aquí si la cuenta es profesional
// y está subiendo sus certificados o ya creó su PIN.
export default function ProfessionalLayout() {
  const { session, hasPin } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Con PIN: pestañas del profesional (Inicio, Pacientes y Perfil).
          Va primero para que sea la pantalla inicial cuando está disponible.
          Al cerrar sesión va directo al login, sin pasar por certificados */}
      <Stack.Protected guard={hasPin === true} redirectTo={session ? undefined : "/signin"}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      {/* Sin PIN es el paso de certificados del registro; con PIN se abre desde Perfil */}
      <Stack.Screen name="certificates" />
    </Stack>
  );
}
