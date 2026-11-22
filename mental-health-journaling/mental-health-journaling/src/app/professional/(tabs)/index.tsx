import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";

import { CalendarModal } from "@/components/calendar-modal";
import { CitaCard } from "@/components/cita-card";
import { DayAppointments } from "@/components/day-appointments";
import { WeekStrip, aYMD } from "@/components/week-strip";
import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
import { mensajePlazo, obtenerEstadoProfesional, type EstadoProfesional } from "@/lib/certificados";
import { listarMisCitas, type Cita } from "@/lib/citas";
import { useAuth } from "@/providers/AuthProvider";
import { useCitas } from "@/providers/CitasProvider";

const s = appStyles.professionalTabs;

const PROXIMAS_CITAS = 3;

export default function InicioProfesional() {
  const c = useTheme();
  const { session } = useAuth();
  const { version } = useCitas();
  const [estado, setEstado] = useState<EstadoProfesional | null>(null);
  const [fecha, setFecha] = useState(new Date());
  const [calendarioAbierto, setCalendarioAbierto] = useState(false);
  const [citas, setCitas] = useState<Cita[]>([]);

  // Se recarga al volver, por ejemplo después de subir los certificados desde Perfil
  useFocusEffect(
    useCallback(() => {
      if (!session) return;
      obtenerEstadoProfesional(session.user.id)
        .then(setEstado)
        .catch((e) => console.log("Error al cargar el estado del profesional:", e.message));
    }, [session])
  );

  const recargarCitas = useCallback(() => {
    listarMisCitas()
      .then(setCitas)
      .catch((e) => console.log("Error al cargar las citas:", e.message));
  }, []);

  // Al entrar a la pestaña y cada vez que cambia una cita.
  useFocusEffect(recargarCitas);
  useEffect(recargarCitas, [version, recargarCitas]);

  // Los días con citas confirmadas se marcan en el calendario
  const diasConCita = citas
    .filter((cita) => cita.estado === "confirmada" && cita.fecha_confirmada)
    .map((cita) => aYMD(new Date(cita.fecha_confirmada!)));

  const proximasCitas = citas
    .filter((cita) => cita.estado === "confirmada" && cita.fecha_confirmada && new Date(cita.fecha_confirmada) >= new Date())
    .sort((a, b) => a.fecha_confirmada!.localeCompare(b.fecha_confirmada!))
    .slice(0, PROXIMAS_CITAS);

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={s.homeContent} showsVerticalScrollIndicator={false}>
        <WeekStrip
          selectedDate={fecha}
          onSelectDate={setFecha}
          markedDates={diasConCita}
          onExpand={() => setCalendarioAbierto(true)}
        />

        <CalendarModal
          visible={calendarioAbierto}
          onClose={() => setCalendarioAbierto(false)}
          selectedDate={fecha}
          onSelectDate={setFecha}
          markedDates={diasConCita}
          dayDetail={
            <DayAppointments
              date={fecha}
              citas={citas}
              onOpenCita={(cita) => {
                setCalendarioAbierto(false);
                router.push({ pathname: "/cita", params: { id: cita.id } });
              }}
            />
          }
        />

        {/* Solo mientras no haya enviado sus dos certificados a revisión */}
        {estado?.estado === "pendiente_documentos" && (
          <Pressable
            style={({ pressed }) => [
              s.reminder,
              { backgroundColor: c.backgroundElement, borderColor: c.accent },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/professional/certificates")}
            accessibilityRole="button"
            accessibilityLabel={`Sube tus certificados. ${mensajePlazo(estado.created_at)}`}
          >
            <Ionicons name="time-outline" size={22} color={c.accent} />
            <View style={s.reminderInfo}>
              <Text style={[s.reminderTitle, { color: c.text }]}>Sube tus certificados</Text>
              <Text style={[s.reminderText, { color: c.textSecondary }]}>
                {mensajePlazo(estado.created_at)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={c.textSecondary} />
          </Pressable>
        )}

        <Pressable
          style={({ pressed }) => [s.homeButton, { backgroundColor: c.accent }, pressed && { opacity: 0.8 }]}
          onPress={() => setCalendarioAbierto(true)}
          accessibilityRole="button"
        >
          <Text style={[s.homeButtonText, { color: c.accentText }]}>Ver mi agenda</Text>
        </Pressable>

        <View style={s.homeSection}>
          <Text style={[s.sectionLabel, { color: c.text }]}>Próximas citas</Text>

          {proximasCitas.length === 0 ? (
            <Text style={[s.homeEmpty, { color: c.textSecondary }]}>
              Aún no tienes citas próximas. Puedes agendarlas desde la ficha de un paciente.
            </Text>
          ) : (
            proximasCitas.map((cita) => <CitaCard key={cita.id} cita={cita} />)
          )}

          <Pressable
            style={({ pressed }) => [s.homeLink, pressed && { opacity: 0.6 }]}
            onPress={() => router.push("/professional/(tabs)/patients")}
            accessibilityRole="button"
          >
            <Text style={[s.homeLinkText, { color: c.accent }]}>Ir a mis pacientes</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
