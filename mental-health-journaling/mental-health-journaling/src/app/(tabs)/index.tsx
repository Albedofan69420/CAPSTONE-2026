import { useCallback, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

import { CalendarModal } from "@/components/calendar-modal";
import { CitaCard } from "@/components/cita-card";
import { WeekStrip, aYMD } from "@/components/week-strip";
import { useTheme } from "@/hooks/use-theme";

import { router, useFocusEffect } from "expo-router";
import { appStyles } from "@/constants/app-styles";
import { obtenerResumenRegistros, type RegistroDiario } from "@/lib/diario";
import { listarPublicados, urlImagen, type Articulo } from "@/lib/articulos";
import { listarMisCitas, type Cita } from "@/lib/citas";
import { useAuth } from "@/providers/AuthProvider";
import { useCitas } from "@/providers/CitasProvider";

const s = appStyles.inicio;

export default function Inicio() {
  const c = useTheme();
  const { session } = useAuth();
  const { version } = useCitas();
  const [fecha, setFecha] = useState(new Date());
  const [calendarioAbierto, setCalendarioAbierto] = useState(false);
  const [registros, setRegistros] = useState<Pick<RegistroDiario, "fecha" | "emocion">[]>([]);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [proximaCita, setProximaCita] = useState<Cita | null>(null);

  // Se recarga cada vez que se vuelve a esta pestaña (por ejemplo, después de guardar en el diario)
  useFocusEffect(
    useCallback(() => {
      if (!session) return;
      void version;

      obtenerResumenRegistros(session.user.id)
        .then(setRegistros)
        .catch((e) => console.log("Error al cargar los registros:", e.message));

      listarPublicados()
        .then(setArticulos)
        .catch((e) => console.log("Error al cargar los artículos:", e.message));

      listarMisCitas()
        .then((citas) => {
          const proxima = citas
            .filter((cita) => cita.estado === "confirmada" && cita.fecha_confirmada && new Date(cita.fecha_confirmada) >= new Date())
            .sort((a, b) => a.fecha_confirmada!.localeCompare(b.fecha_confirmada!))[0] ?? null;
          setProximaCita(proxima);
        })
        .catch((e) => console.log("Error al cargar la próxima cita:", e.message));
    }, [session, version])
  );

  const fechasConRegistro = registros.map((r) => r.fecha);
  const yaRegistrado = fechasConRegistro.includes(aYMD(fecha));

  const registrarEnDiario = () => {
    router.push({
      pathname: "/journal",
      params: {
        fecha: aYMD(fecha),
      },
    });
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <WeekStrip
          selectedDate={fecha}
          onSelectDate={setFecha}
          markedDates={fechasConRegistro}
          onExpand={() => setCalendarioAbierto(true)}
        />

        {/* Vista ampliada con los días que tienen registro en el diario */}
        <CalendarModal
          visible={calendarioAbierto}
          onClose={() => setCalendarioAbierto(false)}
          selectedDate={fecha}
          onSelectDate={setFecha}
          markedDates={fechasConRegistro}
        />

        {proximaCita && (
          <View style={s.nextAppointment}>
            <View style={s.sectionHeader}>
              <Text style={[s.sectionTitle, { color: c.text }]}>Próxima cita</Text>
            </View>
            <CitaCard cita={proximaCita} />
          </View>
        )}

        <Pressable
          style={({ pressed }) => [
            s.button,
            { backgroundColor: c.accent },
            pressed && { opacity: 0.8 },
          ]}
          onPress={registrarEnDiario}
          accessibilityRole="button"
        >
          <Text style={[s.buttonText, { color: c.accentText }]}>
            {yaRegistrado ? "Ver mi registro" : "Registrar en mi diario"}
          </Text>
        </Pressable>

        {/* Solo se muestra si el administrador ha publicado artículos */}
        {articulos.length > 0 && (
          <>
            <View style={s.sectionHeader}>
              <Text style={[s.sectionTitle, { color: c.text }]}>Artículos de interés</Text>
            </View>

            <FlatList
              horizontal
              data={articulos}
              keyExtractor={(item) => item.id}
              style={s.articleList}
              contentContainerStyle={s.articleListContent}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => {
                const imagen = urlImagen(item.imagen_path);
                return (
                  <Pressable
                    style={({ pressed }) => [
                      s.articleCard,
                      { backgroundColor: c.backgroundElement },
                      pressed && { opacity: 0.8 },
                    ]}
                    onPress={() => router.push({ pathname: "/article", params: { id: item.id } })}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.titulo}, por ${item.autor}`}
                  >
                    {imagen ? (
                      <Image source={{ uri: imagen }} style={s.articleImage} contentFit="cover" />
                    ) : (
                      <View style={[s.articleImage, { backgroundColor: c.backgroundSelected }]}>
                        <Ionicons name="image-outline" size={36} color={c.textSecondary} />
                      </View>
                    )}
                    <View style={s.articleInfo}>
                      <Text style={[s.articleTitle, { color: c.text }]} numberOfLines={2}>
                        {item.titulo}
                      </Text>
                      <Text style={[s.articleSubtitle, { color: c.textSecondary }]} numberOfLines={2}>
                        Por {item.autor}
                      </Text>
                    </View>
                  </Pressable>
                );
              }}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
