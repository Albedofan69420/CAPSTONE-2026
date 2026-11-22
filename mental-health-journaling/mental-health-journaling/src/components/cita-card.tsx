import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";

import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
import { urlFotoPerfil } from "@/lib/foto-perfil";
import { fechaHoraTexto, nombreOtro, type Cita } from "@/lib/citas";

const s = appStyles.citaCard;

/** Tarjeta de una cita, compartida por la pestaña Citas (usuario) y Pacientes (profesional). */
export function CitaCard({ cita }: { cita: Cita }) {
  const c = useTheme();
  const nombre = nombreOtro(cita);
  const foto = urlFotoPerfil(cita.otro_foto_path);

  const detalle = cita.fecha_confirmada ? fechaHoraTexto(cita.fecha_confirmada) : "Sin horario";
  const proxima = cita.estado === "confirmada" && !!cita.fecha_confirmada && new Date(cita.fecha_confirmada) >= new Date();
  const estado = cita.estado === "cancelada" ? "Cancelada" : proxima ? "Próxima" : "Realizada";

  return (
    <Pressable
      style={({ pressed }) => [
        s.card,
        { backgroundColor: c.backgroundElement },
        !proxima && { opacity: 0.72 },
        pressed && { opacity: 0.8 },
      ]}
      onPress={() => router.push({ pathname: "/cita", params: { id: cita.id } })}
      accessibilityRole="button"
      accessibilityLabel={`${nombre}, ${estado}, ${detalle}`}
    >
      <View style={[s.avatar, { backgroundColor: c.backgroundSelected }]}>
        {foto ? (
          <Image source={{ uri: foto }} style={s.avatarImage} contentFit="cover" />
        ) : (
          <Ionicons name="person" size={24} color={c.textSecondary} />
        )}
      </View>

      <View style={s.info}>
        <Text style={[s.name, { color: c.text }]} numberOfLines={1}>
          {nombre}
        </Text>
        <Text style={[s.detail, { color: c.textSecondary }]} numberOfLines={1}>
          {detalle}
        </Text>
      </View>

      <View style={s.side}>
        <View style={[s.badge, { backgroundColor: proxima ? `${c.accent}26` : c.backgroundSelected }]}>
          <Text style={[s.badgeText, { color: proxima ? c.accent : c.textSecondary }]}>
            {estado}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
