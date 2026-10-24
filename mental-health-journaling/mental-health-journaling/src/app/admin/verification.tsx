import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";

const s = appStyles.admin;

// TODO: listar a los profesionales pendientes de verificación
export default function VerificacionProfesionales() {
  const c = useTheme();

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <View style={s.topBar}>
        <Pressable
          style={s.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={28} color={c.text} />
        </Pressable>
        <Text style={[s.topBarTitle, { color: c.text }]}>Verificación de profesionales</Text>
        <View style={s.backButton} />
      </View>

      <View style={s.emptyState}>
        <Ionicons name="shield-checkmark-outline" size={48} color={c.textSecondary} />
        <Text style={[s.emptyText, { color: c.textSecondary }]}>
          Esta sección estará disponible pronto.
        </Text>
      </View>
    </SafeAreaView>
  );
}
