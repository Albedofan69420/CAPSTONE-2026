import { ComponentProps, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";

import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
import { obtenerMiFoto, subirFotoPerfil, urlFotoPerfil } from "@/lib/foto-perfil";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";

// Mismo diseño que el perfil del usuario común (src/app/(tabs)/perfil.tsx)
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
    descripcion: "Nombre, correo electrónico y descripción profesional",
    icono: "person-circle-outline",
    ruta: "/personal-data",
  },
  {
    id: "certificados",
    titulo: "Certificados",
    descripcion: "Prestador Individual de Salud e inhabilitación para trabajar con menores",
    icono: "document-text-outline",
    ruta: "/professional/certificates",
  },
  {
    id: "notificaciones",
    titulo: "Notificaciones",
    descripcion: "Avisos sobre tus pacientes y tu cuenta",
    icono: "notifications-outline",
  },
  {
    id: "privacidad",
    titulo: "Privacidad y seguridad",
    descripcion: "Contraseña y bloqueo de la app",
    icono: "lock-closed-outline",
  },
];

export default function PerfilProfesional() {
  const c = useTheme();
  const { session } = useAuth();

  const metadata = session?.user.user_metadata ?? {};
  const nombre =
    [metadata.nombre, metadata.apellido].filter(Boolean).join(" ") ||
    session?.user.email ||
    "";

  const userId = session?.user.id;
  const [fotoPath, setFotoPath] = useState<string | null>(null);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const fotoUrl = urlFotoPerfil(fotoPath);

  useEffect(() => {
    if (!userId) return;
    obtenerMiFoto(userId)
      .then(setFotoPath)
      .catch((e) => console.log("Error al cargar la foto de perfil:", e.message));
  }, [userId]);

  const cambiarFoto = async () => {
    if (!userId) return;

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (resultado.canceled) return;

    const asset = resultado.assets[0];
    setSubiendoFoto(true);
    try {
      setFotoPath(await subirFotoPerfil(userId, asset.uri, asset.mimeType, fotoPath));
    } catch (e) {
      Alert.alert("No se pudo cambiar la foto", (e as Error).message);
    } finally {
      setSubiendoFoto(false);
    }
  };

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
          <Pressable
            style={s.avatarWrapper}
            onPress={cambiarFoto}
            disabled={subiendoFoto}
            accessibilityRole="button"
            accessibilityLabel="Cambiar foto de perfil"
          >
            <View style={[s.avatar, s.avatarClip, { backgroundColor: c.backgroundElement }]}>
              {fotoUrl ? (
                <Image source={{ uri: fotoUrl }} style={s.avatarImage} contentFit="cover" />
              ) : (
                <Ionicons name="person" size={64} color={c.textSecondary} />
              )}
              {subiendoFoto && (
                <View style={s.avatarLoading}>
                  <ActivityIndicator color="#fff" />
                </View>
              )}
            </View>
            <View style={[s.editBadge, { backgroundColor: c.accent, borderColor: c.background }]}>
              <Ionicons name="pencil" size={16} color={c.accentText} />
            </View>
          </Pressable>

          <Text style={[s.name, { color: c.text }]}>{nombre}</Text>

          <Pressable onPress={cambiarFoto} disabled={subiendoFoto} hitSlop={8} accessibilityRole="button">
            <Text style={[s.changePhoto, { color: c.accent }]}>
              {subiendoFoto ? "Subiendo foto..." : "Cambiar foto de perfil"}
            </Text>
          </Pressable>
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
