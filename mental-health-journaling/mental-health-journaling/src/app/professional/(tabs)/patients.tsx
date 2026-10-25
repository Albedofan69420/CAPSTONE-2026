import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";

const s = appStyles.professionalTabs;

// TODO: listar a los pacientes del profesional
export default function Pacientes() {
  const c = useTheme();

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <Text style={[s.title, { color: c.text }]}>Pacientes</Text>

      <View style={s.emptyState}>
        <Ionicons name="people-outline" size={48} color={c.textSecondary} />
        <Text style={[s.emptyText, { color: c.textSecondary }]}>
          Aún no tienes pacientes.
        </Text>
      </View>
    </SafeAreaView>
  );
}
