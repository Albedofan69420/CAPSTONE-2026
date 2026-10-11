import { Stack } from 'expo-router';
import SignupProvider from "@/providers/SignupProvider";

export default function SignupLayout() {
  return (
    <SignupProvider>
        <Stack screenOptions={{ headerShown: false, title: 'Crear cuenta' }}>
        <Stack.Screen name="index" options={{ title: 'Selección de tipo de usuario' }} />
        <Stack.Screen name="signup-info" options={{ title: 'Registro de información personal' }} />
        <Stack.Screen name="signup-pin" options={{ title: 'Registro de clave secreta' }} />
        </Stack>
    </SignupProvider>
  );
}