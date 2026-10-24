import { ComponentProps } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";

import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
import { supabase } from "@/lib/supabase";

const s = appStyles.admin;

type Opcion = {
  titulo: string;
  descripcion: string;
  icono: ComponentProps<typeof Ionicons>["name"];
  ruta: Href;
};

const OPCIONES: Opcion[] = [
  {
    titulo: "Gestionar Artículos de interés",
    descripcion: "Crea, edita, publica u oculta los artículos que ven los usuarios",
    icono: "newspaper-outline",
    ruta: "/admin/articles",
  },
  {
    titulo: "Gestionar verificación de profesionales",
    descripcion: "Revisa y aprueba a los profesionales registrados",
    icono: "shield-checkmark-outline",
    ruta: "/admin/verification",
  },
];

export default function AdminInicio() {
  const c = useTheme();

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
          <Text style={[s.title, { color: c.text }]}>Panel de administración</Text>
          <Text style={[s.subtitle, { color: c.textSecondary }]}>
            Elige qué quieres gestionar.
          </Text>
        </View>

        <View style={s.list}>
          {OPCIONES.map((opcion) => (
            <Pressable
              key={opcion.titulo}
              style={({ pressed }) => [
                s.card,
                { backgroundColor: c.backgroundElement },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => router.push(opcion.ruta)}
              accessibilityRole="button"
            >
              <Ionicons name={opcion.icono} size={30} color={c.accent} />
              <View style={s.cardInfo}>
                <Text style={[s.cardTitle, { color: c.text }]}>{opcion.titulo}</Text>
                <Text style={[s.cardSubtitle, { color: c.textSecondary }]}>
                  {opcion.descripcion}
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
