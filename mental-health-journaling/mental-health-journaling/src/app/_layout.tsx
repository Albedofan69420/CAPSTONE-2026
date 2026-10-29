import { DarkTheme, DefaultTheme, ThemeProvider, Stack, type Href } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AuthProvider, { useAuth } from "@/providers/AuthProvider";
import CitasProvider from "@/providers/CitasProvider";

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

  // Pantalla a la que se llega cuando la actual deja de estar permitida (iniciar o cerrar sesión,
  // bloquear la app, crear el PIN...). Desde Expo Router 58 hay que indicarla: por defecto el router
  // elige la primera permitida por orden alfabético (al profesional lo mandaba a "cita") y, sin
  // sesión, al grupo (auth), que no tiene index ("Unmatched Route")
  const destino: Href = !session
    ? "/signin"
    : needsCertificates
      ? "/professional/certificates"
      : needsPin
        ? "/create-pin"
        : isLocked
          ? "/unlock"
          : isAdmin
            ? "/admin"
            : isProfessional
              ? "/professional"
              : "/";

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!session} redirectTo={destino}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      {/* Vistas del profesional: certificados (antes del PIN) e inicio (después del PIN).
          professional/_layout.tsx decide cuál de las dos mostrar */}
      <Stack.Protected guard={needsCertificates || (isReady && isProfessional)} redirectTo={destino}>
        <Stack.Screen name="professional" />
      </Stack.Protected>

      <Stack.Protected guard={needsPin} redirectTo={destino}>
        <Stack.Screen name="create-pin" />
      </Stack.Protected>

      <Stack.Protected guard={isLocked} redirectTo={destino}>
        <Stack.Screen name="unlock" />
      </Stack.Protected>

      <Stack.Protected guard={isReady && !isAdmin && !isProfessional} redirectTo={destino}>
        <Stack.Screen name="(tabs)" />
        {/* Fuera de (tabs): desde Expo Router 58, abrir una pestaña oculta (href: null)
            redirige a la pestaña inicial */}
        <Stack.Screen name="journal" />
        <Stack.Screen name="professional-details" />
        <Stack.Screen name="article" />
        <Stack.Screen name="filters" options={{ presentation: "modal" }} />
        <Stack.Screen name="solicitar-cita" />
      </Stack.Protected>

      {/* Compartidas por el usuario común y el profesional (que además edita su descripción).
          La pantalla inicial de cada cuenta la define "destino", no el orden de esta lista */}
      <Stack.Protected guard={isReady && !isAdmin} redirectTo={destino}>
        <Stack.Screen name="personal-data" />
        {/* Chat de la reserva: el profesional llega desde Pacientes y el usuario desde Citas */}
        <Stack.Screen name="cita" />
      </Stack.Protected>

      <Stack.Protected guard={isReady && isAdmin} redirectTo={destino}>
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
        {/* Mensajes por leer y citas del usuario, para el menú inferior */}
        <CitasProvider>
          <AnimatedSplashOverlay />
          <RootNavigator />
        </CitasProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}