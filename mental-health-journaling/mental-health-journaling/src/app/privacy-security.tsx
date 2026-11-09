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
  peligro?: boolean;
};

const ACCESO: Opcion[] = [
  {
    titulo: "Cambiar contraseña",
    descripcion: "Recibirás un correo seguro para crear una nueva contraseña.",
    icono: "key-outline",
  },
  {
    titulo: "PIN de la aplicación",
    descripcion: "Configura o cambia el código que protege la app al abrirla.",
    icono: "lock-closed-outline",
  },
];

const PRIVACIDAD: Opcion[] = [
  {
    titulo: "Mi diario",
    descripcion: "Tus registros diarios son privados y solo tú puedes verlos.",
    icono: "book-outline",
  },
];

const DATOS: Opcion[] = [
  {
    titulo: "Eliminar mi cuenta",
    descripcion: "Elimina de forma permanente tu cuenta y tus datos.",
    icono: "trash-outline",
    peligro: true,
  },
];

function Grupo({ titulo, opciones }: { titulo: string; opciones: Opcion[] }) {
  const c = useTheme();

  return (
    <View style={s.section}>
      <Text style={[s.sectionTitle, { color: c.text }]}>{titulo}</Text>
      <View style={s.list}>
        {opciones.map((opcion) => (
          <View key={opcion.titulo} style={[s.card, { backgroundColor: c.backgroundElement }]}>
            <View style={[s.icon, { backgroundColor: opcion.peligro ? `${c.error}1F` : `${c.accent}1F` }]}>
              <Ionicons name={opcion.icono} size={22} color={opcion.peligro ? c.error : c.accent} />
            </View>
            <View style={s.cardInfo}>
              <Text style={[s.cardTitle, { color: opcion.peligro ? c.error : c.text }]}>{opcion.titulo}</Text>
              <Text style={[s.cardDescription, { color: c.textSecondary }]}>{opcion.descripcion}</Text>
            </View>
            <Text style={[s.soon, { color: c.textSecondary, backgroundColor: c.backgroundSelected }]}>Próximamente</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/** Vista previa de los controles de privacidad. Aún no realiza cambios en la cuenta. */
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
        <Grupo titulo="Acceso a tu cuenta" opciones={ACCESO} />
        <Grupo titulo="Privacidad" opciones={PRIVACIDAD} />
        <Grupo titulo="Tus datos" opciones={DATOS} />
      </ScrollView>
    </SafeAreaView>
  );
}
