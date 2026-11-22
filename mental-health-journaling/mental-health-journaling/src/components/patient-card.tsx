import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { appStyles } from "@/constants/app-styles";
import { useTheme } from "@/hooks/use-theme";
import type { PacienteVinculado } from "@/lib/vinculaciones";

const s = appStyles.patientCard;

export const nombrePaciente = (paciente: PacienteVinculado) =>
  [paciente.nombre, paciente.apellido].filter(Boolean).join(" ") || paciente.email;

export function PatientCard({ paciente }: { paciente: PacienteVinculado }) {
  const c = useTheme();
  const activo = paciente.estado === "activa";
  const nombre = nombrePaciente(paciente);

  return (
    <Pressable
      style={({ pressed }) => [
        s.card,
        { backgroundColor: c.backgroundElement },
        !activo && s.inactive,
        pressed && { opacity: 0.8 },
      ]}
      onPress={() =>
        router.push({ pathname: "/professional/patient-details", params: { id: paciente.id } })
      }
      accessibilityRole="button"
      accessibilityLabel={`Ver paciente ${nombre}, vínculo ${activo ? "activo" : "finalizado"}`}
    >
      <View style={[s.avatar, { backgroundColor: c.backgroundSelected }]}>
        <Ionicons name="person" size={25} color={c.textSecondary} />
      </View>
      <View style={s.info}>
        <Text style={[s.name, { color: c.text }]} numberOfLines={1}>{nombre}</Text>
        <Text style={[s.email, { color: c.textSecondary }]} numberOfLines={1}>{paciente.email}</Text>
      </View>
      <View style={s.side}>
        <View style={[s.badge, { backgroundColor: activo ? `${c.accent}26` : c.backgroundSelected }]}>
          <Text style={[s.badgeText, { color: activo ? c.accent : c.textSecondary }]}>
            {activo ? "Activo" : "Finalizado"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={c.textSecondary} />
      </View>
    </Pressable>
  );
}
