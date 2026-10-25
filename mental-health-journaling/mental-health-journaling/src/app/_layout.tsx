import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AuthProvider, { useAuth } from "@/providers/AuthProvider";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { session, loading, hasPin, locked, certificatesStepDone } = useAuth();

  //Espera para ver si hay una sesión y un pin creado
  if (loading || (session && hasPin === null)) return null;

  // El rol viene de app_metadata, que solo se puede cambiar desde Supabase (ver migraciones)
  const isAdmin = session?.user.app_metadata.rol === "admin";
  // El tipo se elige al registrarse. Solo cambia qué vistas se muestran: lo que un profesional
  // puede hacer frente a los usuarios depende de su verificación en public.profesionales
  const isProfessional = !isAdmin && session?.user.user_metadata.tipo_usuario === "profesional";

  // Antes de crear el PIN, el profesional pasa por la pantalla de certificados
  const needsCertificates =
    !!session && hasPin === false && isProfessional && !certificatesStepDone;
  const needsPin = !!session && hasPin === false && !needsCertificates;
  const isLocked = !!session && hasPin === true && locked;
  const isReady = !!session && hasPin === true && !locked;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      {/* Vistas del profesional: certificados (antes del PIN) e inicio (después del PIN).
          professional/_layout.tsx decide cuál de las dos mostrar */}
      <Stack.Protected guard={needsCertificates || (isReady && isProfessional)}>
        <Stack.Screen name="professional" />
      </Stack.Protected>

      <Stack.Protected guard={needsPin}>
        <Stack.Screen name="create-pin" />
      </Stack.Protected>

      <Stack.Protected guard={isLocked}>
        <Stack.Screen name="unlock" />
      </Stack.Protected>

      <Stack.Protected guard={isReady && !isAdmin && !isProfessional}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="professional-details" />
        <Stack.Screen name="article" />
        <Stack.Screen name="filters" options={{ presentation: "modal" }} />
      </Stack.Protected>

      {/* Compartida por el usuario común y el profesional (que además edita su descripción).
          Va después de las pestañas para que nunca sea la pantalla inicial */}
      <Stack.Protected guard={isReady && !isAdmin}>
        <Stack.Screen name="personal-data" />
      </Stack.Protected>

      <Stack.Protected guard={isReady && isAdmin}>
        <Stack.Screen name="admin" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AnimatedSplashOverlay />
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}