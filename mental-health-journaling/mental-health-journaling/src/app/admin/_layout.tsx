import { Stack } from "expo-router";

// Vistas exclusivas del administrador. El layout raíz solo las muestra si la cuenta tiene rol "admin".
export default function AdminLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
