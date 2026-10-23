import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AuthProvider, { useAuth } from "@/providers/AuthProvider";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { session, loading, hasPin, locked } = useAuth();

  //Espera para ver si hay una sesión y un pin creado
  if (loading || (session && hasPin === null)) return null;

  const needsPin = !!session && hasPin === false;
  const isLocked = !!session && hasPin === true && locked;
  const isReady = !!session && hasPin === true && !locked;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={needsPin}>
        <Stack.Screen name="create-pin" />
      </Stack.Protected>

      <Stack.Protected guard={isLocked}>
        <Stack.Screen name="unlock" />
      </Stack.Protected>

      <Stack.Protected guard={isReady}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="journal" />
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