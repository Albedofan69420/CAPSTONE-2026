import { ComponentProps } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";

const s = appStyles.privacidad;

type Opcion = {
  titulo: string;
  descripcion: string;
  icono: ComponentProps<typeof Ionicons>["name"];
  ruta: "/change-password" | "/change-pin";
};

const ACCESO: Opcion[] = [
  {
    titulo: "Cambiar contraseña",
    descripcion: "Actualiza la contraseña con la que inicias sesión.",
    icono: "key-outline",
    ruta: "/change-password",
  },
  {
    titulo: "PIN de la aplicación",
    descripcion: "Cambia el código que protege la app en este dispositivo.",
    icono: "lock-closed-outline",
    ruta: "/change-pin",
  },
];

function AccesoCuenta() {
  const c = useTheme();

  return (
    <View style={s.section}>
      <Text style={[s.sectionTitle, { color: c.text }]}>Acceso a tu cuenta</Text>
      <View style={s.list}>
        {ACCESO.map((opcion) => (
          <Pressable
            key={opcion.ruta}
            style={[s.card, { backgroundColor: c.backgroundElement }]}
            onPress={() => router.push(opcion.ruta)}
            accessibilityRole="button"
          >
            <View style={[s.icon, { backgroundColor: `${c.accent}1F` }]}>
              <Ionicons name={opcion.icono} size={22} color={c.accent} />
            </View>
            <View style={s.cardInfo}>
              <Text style={[s.cardTitle, { color: c.text }]}>{opcion.titulo}</Text>
              <Text style={[s.cardDescription, { color: c.textSecondary }]}>{opcion.descripcion}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={c.textSecondary} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function PrivacidadSeguridad() {
  const c = useTheme();

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <View style={s.header}>
        <Pressable
          style={s.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={28} color={c.text} />
        </Pressable>
        <Text style={[s.title, { color: c.text }]}>Privacidad y seguridad</Text>
        <View style={s.backSpace} />
      </View>

      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <AccesoCuenta />
      </ScrollView>
    </SafeAreaView>
  );
}
