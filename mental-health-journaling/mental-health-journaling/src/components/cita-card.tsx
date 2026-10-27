import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";

import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
import { urlFotoPerfil } from "@/lib/foto-perfil";
import {
  ESTADO_CITA_LABEL,
  MODALIDAD_LABEL,
  fechaHoraTexto,
  nombreOtro,
  type Cita,
} from "@/lib/citas";

const s = appStyles.citaCard;

/** Tarjeta de una cita, compartida por la pestaña Citas (usuario) y Pacientes (profesional). */
export function CitaCard({ cita }: { cita: Cita }) {
  const c = useTheme();
  const nombre = nombreOtro(cita);
  const foto = urlFotoPerfil(cita.otro_foto_path);

  const detalle = cita.fecha_confirmada
    ? fechaHoraTexto(cita.fecha_confirmada)
    : cita.fecha_propuesta && cita.estado === "pendiente"
      ? `Propuesta: ${fechaHoraTexto(cita.fecha_propuesta)}`
      : MODALIDAD_LABEL[cita.modalidad];

  const destacada = cita.estado === "pendiente" || cita.estado === "confirmada";

  return (
    <Pressable
      style={({ pressed }) => [
        s.card,
        { backgroundColor: c.backgroundElement },
        !destacada && { opacity: 0.7 },
        pressed && { opacity: 0.8 },
      ]}
      onPress={() => router.push({ pathname: "/cita", params: { id: cita.id } })}
      accessibilityRole="button"
      accessibilityLabel={`${nombre}, ${ESTADO_CITA_LABEL[cita.estado]}, ${detalle}${
        cita.no_leidos > 0 ? `, ${cita.no_leidos} mensajes por leer` : ""
      }`}
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
        <View style={[s.badge, { backgroundColor: destacada ? `${c.accent}26` : c.backgroundSelected }]}>
          <Text style={[s.badgeText, { color: destacada ? c.accent : c.textSecondary }]}>
            {ESTADO_CITA_LABEL[cita.estado]}
          </Text>
        </View>
        {/* Círculo rojo con los mensajes por leer de esta cita */}
        {cita.no_leidos > 0 && (
          <View style={[s.unread, { backgroundColor: c.badge }]}>
            <Text style={[s.unreadText, { color: c.badgeText }]}>
              {cita.no_leidos > 99 ? "99+" : cita.no_leidos}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
