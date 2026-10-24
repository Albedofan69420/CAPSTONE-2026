import { ComponentProps } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";

import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";

const s = appStyles.perfil;

type Ajuste = {
  id: string;
  titulo: string;
  descripcion: string;
  icono: ComponentProps<typeof Ionicons>["name"];
  /** Pantalla a la que lleva la tarjeta; si falta, aún no está disponible */
  ruta?: Href;
};

const AJUSTES: Ajuste[] = [
  {
    id: "datos",
    titulo: "Datos personales",
    descripcion: "Nombre y correo electrónico",
    icono: "person-circle-outline",
    ruta: "/personal-data",
  },
  {
    id: "notificaciones",
    titulo: "Notificaciones",
    descripcion: "Recordatorios para escribir en tu diario",
    icono: "notifications-outline",
  },
  {
    id: "privacidad",
    titulo: "Privacidad y seguridad",
    descripcion: "Contraseña y bloqueo de la app",
    icono: "lock-closed-outline",
  },
];

export default function Perfil() {
  const c = useTheme();
  const { session } = useAuth();

  // nombre y apellido se guardan en los metadatos al registrarse (signup-info.tsx)
  const metadata = session?.user.user_metadata ?? {};
  const nombre =
    [metadata.nombre, metadata.apellido].filter(Boolean).join(" ") ||
    session?.user.email ||
    "";

  // Al cerrar sesión, AuthProvider recibe SIGNED_OUT y el layout raíz vuelve a (auth)
  const cerrarSesion = () => {
    Alert.alert("Cerrar sesión", "¿Seguro que quieres cerrar tu sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) Alert.alert("No se pudo cerrar sesión", error.message);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={s.scrollContent}>
        <View style={s.header}>
          <View
            style={[s.avatar, { backgroundColor: c.backgroundElement }]}
            accessibilityLabel="Foto de perfil"
          >
            <Ionicons name="person" size={64} color={c.textSecondary} />
          </View>
          <Text style={[s.name, { color: c.text }]}>{nombre}</Text>
        </View>

        <Text style={[s.sectionTitle, { color: c.text }]}>Ajustes de la cuenta</Text>

        <View style={s.list}>
          {AJUSTES.map((ajuste) => (
            <Pressable
              key={ajuste.id}
              style={({ pressed }) => [
                s.card,
                { backgroundColor: c.backgroundElement },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => {
                if (ajuste.ruta) {
                  router.push(ajuste.ruta);
                } else {
                  Alert.alert(ajuste.titulo, "Esta opción estará disponible pronto.");
                }
              }}
              accessibilityRole="button"
            >
              <Ionicons name={ajuste.icono} size={26} color={c.accent} />
              <View style={s.cardInfo}>
                <Text style={[s.cardTitle, { color: c.text }]}>{ajuste.titulo}</Text>
                <Text style={[s.cardSubtitle, { color: c.textSecondary }]}>
                  {ajuste.descripcion}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={c.textSecondary} />
            </Pressable>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            s.button,
            { backgroundColor: c.accent },
            pressed && { opacity: 0.8 },
          ]}
          onPress={cerrarSesion}
          accessibilityRole="button"
        >
          <Text style={[s.buttonText, { color: c.accentText }]}>Cerrar sesión</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
