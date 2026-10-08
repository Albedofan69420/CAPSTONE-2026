import { Stack } from 'expo-router';
import SignupProvider from "@/providers/SignupProvider";

export default function SignupLayout() {
  return (
    <SignupProvider>
        <Stack screenOptions={{ headerShown: true, title: 'Crear cuenta' }}>
        <Stack.Screen name="index" options={{ title: 'Tipo de usuario' }} />
        <Stack.Screen name="perfil" options={{ title: 'Paso 2' }} />
        </Stack>
    </SignupProvider>
  );
}