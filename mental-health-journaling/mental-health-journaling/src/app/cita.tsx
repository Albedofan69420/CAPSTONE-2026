import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
import {
  ESTADO_CITA_LABEL,
  MENSAJE_MAX,
  MODALIDAD_LABEL,
  RESPUESTAS_RAPIDAS,
  aceptarHorario,
  cancelarCita,
  enviarMensaje,
  escucharCita,
  fechaHoraTexto,
  formatearHoraEscrita,
  listarMensajes,
  marcarCitaLeida,
  nombreOtro,
  obtenerCita,
  proponerHorario,
  rechazarCita,
  textoAFechaHora,
  tieneRiesgo,
  type Cita,
  type Mensaje,
} from "@/lib/citas";
import { formatearFechaEscrita } from "@/lib/profesionales";
import { useAuth } from "@/providers/AuthProvider";

const s = appStyles.chat;

const hora = (fecha: string) =>
  new Intl.DateTimeFormat("es-CL", { hour: "2-digit", minute: "2-digit" }).format(new Date(fecha));

// Chat limitado a coordinar la reserva. Lo usan el usuario y el profesional: solo se puede escribir
// mientras la solicitud está pendiente (lo exige la base de datos, ver supabase/migrations)
export default function ChatCita() {
  const c = useTheme();
  const { session } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [cita, setCita] = useState<Cita | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  // Sin id no hay nada que cargar: se muestra "No encontramos esta cita" en vez de cargar sin fin
  const [cargando, setCargando] = useState(!!id);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  // Formulario para que el profesional proponga un horario
  const [proponiendo, setProponiendo] = useState(false);
  const [fechaTexto, setFechaTexto] = useState("");
  const [horaTexto, setHoraTexto] = useState("");

  const recargarCita = useCallback(() => {
    if (!id) return;
    obtenerCita(id)
      .then(setCita)
      .catch((e) => console.log("Error al cargar la cita:", e.message));
  }, [id]);

  useEffect(() => {
    if (!id) return;

    Promise.all([obtenerCita(id), listarMensajes(id)])
      .then(([citaCargada, lista]) => {
        setCita(citaCargada);
        setMensajes(lista);
      })
      .catch((e) => Alert.alert("No se pudo cargar la cita", e.message))
      .finally(() => setCargando(false));

    // Con el chat abierto todo queda leído: al entrar y con cada mensaje que llega
    const marcarLeida = () =>
      marcarCitaLeida(id).catch((e) => console.log("Error al marcar la cita como leída:", e.message));
    marcarLeida();

    // Mensajes y cambios de estado en vivo (por ejemplo, cuando el otro propone o acepta un horario)
    return escucharCita(
      id,
      (nuevo) => {
        setMensajes((lista) => (lista.some((m) => m.id === nuevo.id) ? lista : [...lista, nuevo]));
        if (nuevo.autor_id !== session?.user.id) marcarLeida();
      },
      recargarCita
    );
  }, [id, recargarCita, session?.user.id]);

  // La lista va invertida para que empiece desde abajo, como en cualquier chat
  const invertidos = useMemo(() => [...mensajes].reverse(), [mensajes]);

  const abierta = cita?.estado === "pendiente";
  const esProfesional = !!cita?.soy_profesional;
  const horarioVigente =
    !!cita?.fecha_propuesta && new Date(cita.fecha_propuesta) > new Date();

  const enviar = async (contenido = texto) => {
    if (!id || !contenido.trim() || enviando) return;

    setEnviando(true);
    try {
      const nuevo = await enviarMensaje(id, contenido);
      setMensajes((lista) => (lista.some((m) => m.id === nuevo.id) ? lista : [...lista, nuevo]));
      setTexto("");
    } catch (e) {
      Alert.alert("No se pudo enviar el mensaje", (e as Error).message);
    } finally {
      setEnviando(false);
    }
  };

  // Ejecuta una acción sobre la cita y luego muestra el estado nuevo
  const ejecutar = async (accion: () => Promise<void>, errorTitulo: string) => {
    setOcupado(true);
    try {
      await accion();
      recargarCita();
    } catch (e) {
      Alert.alert(errorTitulo, (e as Error).message);
    } finally {
      setOcupado(false);
    }
  };

  const enviarPropuesta = () => {
    const fecha = textoAFechaHora(fechaTexto, horaTexto);
    if (!fecha) {
      Alert.alert("Horario no válido", "Escribe una fecha (DD/MM/AAAA) y una hora (HH:MM) futuras.");
      return;
    }
    ejecutar(async () => {
      await proponerHorario(cita!.id, fecha);
      setProponiendo(false);
      setFechaTexto("");
      setHoraTexto("");
    }, "No se pudo proponer el horario");
  };

  const confirmarAceptar = () => {
    Alert.alert(
      "Confirmar cita",
      `¿Aceptas la cita del ${fechaHoraTexto(cita!.fecha_propuesta!)}?`,
      [
        { text: "Volver", style: "cancel" },
        { text: "Aceptar", onPress: () => ejecutar(() => aceptarHorario(cita!.id), "No se pudo confirmar la cita") },
      ]
    );
  };

  const confirmarRechazo = () => {
    Alert.alert("Rechazar solicitud", "El chat se cerrará y el usuario verá la solicitud como rechazada.", [
      { text: "Volver", style: "cancel" },
      {
        text: "Rechazar",
        style: "destructive",
        onPress: () => ejecutar(() => rechazarCita(cita!.id), "No se pudo rechazar la solicitud"),
      },
    ]);
  };

  const confirmarCancelacion = () => {
    Alert.alert(
      cita?.estado === "confirmada" ? "Cancelar cita" : "Cancelar solicitud",
      "Esta acción no se puede deshacer.",
      [
        { text: "Volver", style: "cancel" },
        {
          text: "Cancelar",
          style: "destructive",
          onPress: () => ejecutar(() => cancelarCita(cita!.id), "No se pudo cancelar"),
        },
      ]
    );
  };

  const panel = () => {
    if (!cita) return null;

    if (cita.estado === "confirmada" && cita.fecha_confirmada) {
      return (
        <>
          <Text style={[s.panelTitle, { color: c.text }]}>Cita confirmada</Text>
          <Text style={[s.panelText, { color: c.textSecondary }]}>
            {fechaHoraTexto(cita.fecha_confirmada)} · {MODALIDAD_LABEL[cita.modalidad]}
          </Text>
          <View style={s.actions}>
            <Pressable
              style={[s.action, s.actionOutline, { borderColor: c.error }, ocupado && { opacity: 0.5 }]}
              onPress={confirmarCancelacion}
              disabled={ocupado}
              accessibilityRole="button"
            >
              <Text style={[s.actionText, { color: c.error }]}>Cancelar cita</Text>
            </Pressable>
          </View>
        </>
      );
    }

    if (!abierta) {
      return (
        <>
          <Text style={[s.panelTitle, { color: c.text }]}>{ESTADO_CITA_LABEL[cita.estado]}</Text>
          <Text style={[s.panelText, { color: c.textSecondary }]}>
            Esta solicitud está cerrada.{esProfesional ? "" : " Puedes enviar una nueva desde el perfil del profesional."}
          </Text>
        </>
      );
    }

    if (esProfesional) {
      return (
        <>
          <Text style={[s.panelTitle, { color: c.text }]}>
            Solicitud {MODALIDAD_LABEL[cita.modalidad].toLowerCase()}
          </Text>
          <Text style={[s.panelText, { color: c.textSecondary }]}>
            {horarioVigente
              ? `Propusiste el ${fechaHoraTexto(cita.fecha_propuesta!)}. Falta que el usuario lo acepte.`
              : "Coordina con el usuario y propón un horario para la cita."}
          </Text>

          {proponiendo ? (
            <>
              <View style={s.proposeRow}>
                <TextInput
                  style={[s.proposeInput, { color: c.text, borderColor: c.border }]}
                  value={fechaTexto}
                  onChangeText={(t) => setFechaTexto(formatearFechaEscrita(t))}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor={c.textSecondary}
                  keyboardType="number-pad"
                  maxLength={10}
                  accessibilityLabel="Fecha de la cita"
                />
                <TextInput
                  style={[s.proposeInput, { color: c.text, borderColor: c.border }]}
                  value={horaTexto}
                  onChangeText={(t) => setHoraTexto(formatearHoraEscrita(t))}
                  placeholder="HH:MM"
                  placeholderTextColor={c.textSecondary}
                  keyboardType="number-pad"
                  maxLength={5}
                  accessibilityLabel="Hora de la cita"
                />
              </View>
              <View style={s.actions}>
                <Pressable
                  style={[s.action, s.actionOutline, { borderColor: c.border }]}
                  onPress={() => setProponiendo(false)}
                  accessibilityRole="button"
                >
                  <Text style={[s.actionText, { color: c.textSecondary }]}>Volver</Text>
                </Pressable>
                <Pressable
                  style={[s.action, { backgroundColor: c.accent }, ocupado && { opacity: 0.5 }]}
                  onPress={enviarPropuesta}
                  disabled={ocupado}
                  accessibilityRole="button"
                >
                  <Text style={[s.actionText, { color: c.accentText }]}>Enviar horario</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <View style={s.actions}>
              <Pressable
                style={[s.action, s.actionOutline, { borderColor: c.error }, ocupado && { opacity: 0.5 }]}
                onPress={confirmarRechazo}
                disabled={ocupado}
                accessibilityRole="button"
              >
                <Text style={[s.actionText, { color: c.error }]}>Rechazar</Text>
              </Pressable>
              <Pressable
                style={[s.action, { backgroundColor: c.accent }]}
                onPress={() => setProponiendo(true)}
                accessibilityRole="button"
              >
                <Text style={[s.actionText, { color: c.accentText }]}>
                  {horarioVigente ? "Proponer otro horario" : "Proponer horario"}
                </Text>
              </Pressable>
            </View>
          )}
        </>
      );
    }

    return (
      <>
        <Text style={[s.panelTitle, { color: c.text }]}>
          {horarioVigente ? "Horario propuesto" : "Esperando un horario"}
        </Text>
        <Text style={[s.panelText, { color: c.textSecondary }]}>
          {horarioVigente
            ? `${fechaHoraTexto(cita.fecha_propuesta!)} · ${MODALIDAD_LABEL[cita.modalidad]}`
            : "Cuéntale al profesional qué días te acomodan y te propondrá un horario."}
        </Text>
        <View style={s.actions}>
          <Pressable
            style={[s.action, s.actionOutline, { borderColor: c.error }, ocupado && { opacity: 0.5 }]}
            onPress={confirmarCancelacion}
            disabled={ocupado}
            accessibilityRole="button"
          >
            <Text style={[s.actionText, { color: c.error }]}>Cancelar solicitud</Text>
          </Pressable>
          {horarioVigente && (
            <Pressable
              style={[s.action, { backgroundColor: c.accent }, ocupado && { opacity: 0.5 }]}
              onPress={confirmarAceptar}
              disabled={ocupado}
              accessibilityRole="button"
            >
              <Text style={[s.actionText, { color: c.accentText }]}>Aceptar horario</Text>
            </Pressable>
          )}
        </View>
      </>
    );
  };

  const renderMensaje = ({ item }: { item: Mensaje }) => {
    if (item.tipo === "sistema") {
      return <Text style={[s.systemText, { color: c.textSecondary }]}>{item.texto}</Text>;
    }

    const mio = item.autor_id === session?.user.id;
    return (
      <View
        style={[
          s.bubble,
          mio ? s.bubbleMine : s.bubbleOther,
          { backgroundColor: mio ? c.accent : c.backgroundElement },
        ]}
      >
        <Text style={[s.bubbleText, { color: mio ? c.accentText : c.text }]}>{item.texto}</Text>
        <Text style={[s.bubbleTime, { color: mio ? c.accentText : c.textSecondary }]}>
          {hora(item.created_at)}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <View style={[s.header, { borderBottomColor: c.border }]}>
        <Pressable
          style={s.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={28} color={c.text} />
        </Pressable>
        <View style={s.headerInfo}>
          <Text style={[s.headerName, { color: c.text }]} numberOfLines={1}>
            {cita ? nombreOtro(cita) : "Cita"}
          </Text>
          {cita && (
            <Text style={[s.headerDetail, { color: c.textSecondary }]}>
              {ESTADO_CITA_LABEL[cita.estado]}
            </Text>
          )}
        </View>
      </View>

      {cargando ? (
        <ActivityIndicator style={{ marginTop: 32 }} color={c.accent} />
      ) : !cita ? (
        <Text style={[s.notFound, { color: c.textSecondary }]}>No encontramos esta cita.</Text>
      ) : (
        <KeyboardAvoidingView
          style={s.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={[s.panel, { backgroundColor: c.backgroundElement }]}>{panel()}</View>

          <FlatList
            style={s.list}
            contentContainerStyle={s.listContent}
            data={invertidos}
            keyExtractor={(m) => String(m.id)}
            renderItem={renderMensaje}
            inverted
            keyboardShouldPersistTaps="handled"
          />

          {abierta ? (
            <>
              <Text style={[s.disclaimer, { color: c.textSecondary }]}>
                Este chat es solo para coordinar tu cita. No es un canal de atención ni de urgencias.
              </Text>

              {/* Solo informa: el mensaje se puede enviar igual */}
              {tieneRiesgo(texto) && (
                <View style={[s.crisis, { borderColor: c.error, backgroundColor: c.backgroundElement }]}>
                  <Ionicons name="heart-outline" size={18} color={c.error} />
                  <Text style={[s.crisisText, { color: c.text }]}>
                    Si estás pasando por un momento difícil, pide ayuda ahora: llama al *4141
                    (prevención del suicidio, gratis las 24 horas) o al 131 (SAMU) si es una emergencia.
                  </Text>
                </View>
              )}

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.quickReplies}
                keyboardShouldPersistTaps="handled"
              >
                {RESPUESTAS_RAPIDAS[esProfesional ? "profesional" : "paciente"].map((respuesta) => (
                  <Pressable
                    key={respuesta}
                    style={({ pressed }) => [s.quickReply, { borderColor: c.border }, pressed && { opacity: 0.6 }]}
                    onPress={() => enviar(respuesta)}
                    disabled={enviando}
                    accessibilityRole="button"
                  >
                    <Text style={[s.quickReplyText, { color: c.text }]}>{respuesta}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              <View style={[s.composer, { borderTopColor: c.border }]}>
                <TextInput
                  style={[s.input, { color: c.text, borderColor: c.border }]}
                  value={texto}
                  onChangeText={setTexto}
                  placeholder="Escribe un mensaje"
                  placeholderTextColor={c.textSecondary}
                  maxLength={MENSAJE_MAX}
                  multiline
                />
                <Pressable
                  style={[s.send, { backgroundColor: c.accent }, (!texto.trim() || enviando) && { opacity: 0.5 }]}
                  onPress={() => enviar()}
                  disabled={!texto.trim() || enviando}
                  accessibilityRole="button"
                  accessibilityLabel="Enviar mensaje"
                >
                  <Ionicons name="send" size={18} color={c.accentText} />
                </Pressable>
              </View>
              {texto.length > MENSAJE_MAX - 50 && (
                <Text style={[s.counter, { color: c.textSecondary }]}>
                  {texto.length}/{MENSAJE_MAX}
                </Text>
              )}
            </>
          ) : (
            <Text style={[s.closed, { color: c.textSecondary, borderTopColor: c.border }]}>
              El chat se cerró porque la solicitud ya no está pendiente.
            </Text>
          )}
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
