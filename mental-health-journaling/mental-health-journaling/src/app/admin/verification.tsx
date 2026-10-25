import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";

import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
import { formatearRun } from "@/lib/run";
import { listarSolicitudes, nombreCompleto, type Solicitud } from "@/lib/verificacion";

const s = appStyles.admin;

const FILTROS: { estado: Solicitud["estado"]; label: string }[] = [
  { estado: "en_revision", label: "En revisión" },
  { estado: "aprobado", label: "Aprobados" },
  { estado: "rechazado", label: "Rechazados" },
];

const formatoFecha = (fecha: string) =>
  new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(fecha)
  );

export default function VerificacionProfesionales() {
  const c = useTheme();
  const [filtro, setFiltro] = useState<Solicitud["estado"]>("en_revision");
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [cargando, setCargando] = useState(true);

  // Se recarga al cambiar de filtro y al volver del detalle (después de aprobar o rechazar)
  useFocusEffect(
    useCallback(() => {
      setCargando(true);
      listarSolicitudes(filtro)
        .then(setSolicitudes)
        .catch((e) => console.log("Error al cargar las solicitudes:", e.message))
        .finally(() => setCargando(false));
    }, [filtro])
  );

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

      <View style={s.filters}>
        {FILTROS.map(({ estado, label }) => {
          const activo = filtro === estado;
          return (
            <Pressable
              key={estado}
              style={[
                s.filterChip,
                { borderColor: activo ? c.accent : c.border },
                activo && { backgroundColor: c.accent },
              ]}
              onPress={() => setFiltro(estado)}
              accessibilityRole="button"
              accessibilityState={{ selected: activo }}
            >
              <Text style={[s.filterText, { color: activo ? c.accentText : c.text }]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={solicitudes}
        keyExtractor={(item) => item.user_id}
        contentContainerStyle={s.scrollContent}
        ItemSeparatorComponent={() => <View style={s.separator} />}
        ListEmptyComponent={
          cargando ? (
            <ActivityIndicator color={c.accent} />
          ) : (
            <Text style={[s.emptyText, { color: c.textSecondary }]}>
              No hay solicitudes en esta categoría.
            </Text>
          )
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              s.card,
              { backgroundColor: c.backgroundElement },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() =>
              router.push({ pathname: "/admin/verification-detail", params: { id: item.user_id } })
            }
            accessibilityRole="button"
          >
            <Ionicons name="person-circle-outline" size={36} color={c.accent} />
            <View style={s.cardInfo}>
              <Text style={[s.cardTitle, { color: c.text }]}>{nombreCompleto(item)}</Text>
              <Text style={[s.cardSubtitle, { color: c.textSecondary }]}>
                RUN {formatearRun(item.run)} · {formatoFecha(item.updated_at)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={c.textSecondary} />
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
