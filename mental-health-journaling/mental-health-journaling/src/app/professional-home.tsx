import { Alert, Pressable, Text, View } from "react-native";

import { authStyles as s } from "@/constants/auth-styles";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/lib/supabase";

// Vista provisoria del profesional mientras se construyen sus funciones
export default function InicioProfesional() {
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
    <View style={[s.container, { backgroundColor: c.background }]}>
      <View style={s.form}>
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
      </View>
    </View>
  );
}
