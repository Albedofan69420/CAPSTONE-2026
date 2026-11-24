import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, type Href } from "expo-router";

import { appStyles } from "@/constants/app-styles";
import { useTheme } from "@/hooks/use-theme";
import {
  aceptarInvitacionPaciente,
  guardarInvitacionPendiente,
  limpiarInvitacionPendiente,
  verInvitacionPaciente,
  type CredencialInvitacion,
  type VistaInvitacion,
} from "@/lib/vinculaciones";
import { useAuth } from "@/providers/AuthProvider";

const s = appStyles.aceptarInvitacion;

const nombreProfesional = (vista: VistaInvitacion) =>
  [vista.nombre, vista.apellido].filter(Boolean).join(" ") || "Profesional de la salud";

const fechaExpiracion = (fecha: string) =>
  new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(fecha));

export default function AceptarInvitacion() {
  const c = useTheme();
  const { session, hasPin, locked } = useAuth();
  const { token, codigo: codigoPendiente } = useLocalSearchParams<{ token?: string; codigo?: string }>();
  const [codigo, setCodigo] = useState("");
  const [vista, setVista] = useState<VistaInvitacion | null>(null);
  const [credencial, setCredencial] = useState<CredencialInvitacion | null>(null);
  const [consultando, setConsultando] = useState(false);
  const [aceptando, setAceptando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completada, setCompletada] = useState(false);
  const invitacionConsultada = useRef<string | null>(null);

  const esProfesional = session?.user.user_metadata.tipo_usuario === "profesional";
  const esAdmin = session?.user.app_metadata.rol === "admin";
  const puedeUsar = !!session && hasPin === true && !locked && !esProfesional && !esAdmin;

  const tokenEnlace = useMemo(() => (typeof token === "string" && token.trim() ? token.trim() : null), [token]);

  useEffect(() => {
    if (!tokenEnlace) return;
    guardarInvitacionPendiente({ token: tokenEnlace }).catch(() => {});
  }, [tokenEnlace]);

  const consultar = async (valor: CredencialInvitacion) => {
    setConsultando(true);
    setError(null);
    try {
      const resultado = await verInvitacionPaciente(valor);
      setCredencial(valor);
      setVista(resultado);
      await guardarInvitacionPendiente(valor);
    } catch (e) {
      setVista(null);
      setError((e as Error).message);
    } finally {
      setConsultando(false);
    }
  };

  useEffect(() => {
    if (!puedeUsar) return;
    const codigoGuardado = typeof codigoPendiente === "string" ? codigoPendiente : null;
    const identificador = tokenEnlace ?? codigoGuardado;
    if (!identificador || invitacionConsultada.current === identificador) return;
    const timer = setTimeout(() => {
      invitacionConsultada.current = identificador;
      void consultar(tokenEnlace ? { token: tokenEnlace } : { codigo: identificador });
    }, 0);
    return () => clearTimeout(timer);
  }, [puedeUsar, tokenEnlace, codigoPendiente]);

  const consultarCodigo = () => {
    if (codigo.length !== 8) {
      setError("El código debe tener 8 caracteres.");
      return;
    }
    consultar({ codigo });
  };

  const aceptar = async () => {
    if (!credencial || aceptando) return;
    setAceptando(true);
    setError(null);
    try {
      await aceptarInvitacionPaciente(credencial);
      await limpiarInvitacionPendiente();
      setCompletada(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setAceptando(false);
    }
  };

  const volver = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/" as Href);
  };

  if (!session) {
    return (
      <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
        <View style={s.header}>
          <Pressable style={s.backButton} onPress={volver} accessibilityRole="button" accessibilityLabel="Volver">
            <Ionicons name="chevron-back" size={28} color={c.text} />
          </Pressable>
          <Text style={[s.headerTitle, { color: c.text }]}>Invitación</Text>
          <View style={s.backButton} />
        </View>
        <View style={s.centerContent}>
          <View style={[s.heroIcon, { backgroundColor: `${c.accent}1F` }]}>
            <Ionicons name="link-outline" size={34} color={c.accent} />
          </View>
          <Text style={[s.title, { color: c.text }]}>Recibiste una invitación</Text>
          <Text style={[s.subtitle, { color: c.textSecondary }]}>
            Inicia sesión o crea una cuenta personal para revisar quién te invitó y aceptar la vinculación.
          </Text>
          <Pressable
            style={[s.primaryButton, { backgroundColor: c.accent }]}
            onPress={() => router.push("/signin" as Href)}
            accessibilityRole="button"
          >
            <Text style={[s.primaryButtonText, { color: c.accentText }]}>Iniciar sesión</Text>
          </Pressable>
          <Pressable
            style={[s.secondaryButton, { borderColor: c.border }]}
            onPress={() => router.push("/signup" as Href)}
            accessibilityRole="button"
          >
            <Text style={[s.secondaryButtonText, { color: c.accent }]}>Crear cuenta</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPin !== true || locked) {
    return (
      <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
        <View style={s.centerContent}>
          <ActivityIndicator color={c.accent} />
          <Text style={[s.subtitle, { color: c.textSecondary }]}>Completa el acceso seguro a tu cuenta.</Text>
          <Pressable
            style={[s.primaryButton, { backgroundColor: c.accent }]}
            onPress={() => router.replace((hasPin === false ? "/create-pin" : "/unlock") as Href)}
            accessibilityRole="button"
          >
            <Text style={[s.primaryButtonText, { color: c.accentText }]}>Continuar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (esProfesional || esAdmin) {
    return (
      <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
        <View style={s.centerContent}>
          <Ionicons name="alert-circle-outline" size={52} color={c.error} />
          <Text style={[s.title, { color: c.text }]}>Cuenta no compatible</Text>
          <Text style={[s.subtitle, { color: c.textSecondary }]}>
            Las invitaciones de pacientes solo pueden aceptarse con una cuenta de uso personal.
          </Text>
          <Pressable style={[s.secondaryButton, { borderColor: c.border }]} onPress={volver} accessibilityRole="button">
            <Text style={[s.secondaryButtonText, { color: c.text }]}>Volver</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (completada) {
    return (
      <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
        <View style={s.centerContent}>
          <Ionicons name="checkmark-circle" size={72} color={c.accent} />
          <Text style={[s.title, { color: c.text }]}>Vinculación completada</Text>
          <Text style={[s.subtitle, { color: c.textSecondary }]}>
            Ya estás vinculado con {vista ? nombreProfesional(vista) : "tu psicólogo"}.
          </Text>
          <Pressable
            style={[s.primaryButton, { backgroundColor: c.accent }]}
            onPress={() => router.replace("/" as Href)}
            accessibilityRole="button"
          >
            <Text style={[s.primaryButtonText, { color: c.accentText }]}>Ir al inicio</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <View style={s.header}>
        <Pressable style={s.backButton} onPress={volver} accessibilityRole="button" accessibilityLabel="Volver">
          <Ionicons name="chevron-back" size={28} color={c.text} />
        </Pressable>
        <Text style={[s.headerTitle, { color: c.text }]}>Vinculación terapéutica</Text>
        <View style={s.backButton} />
      </View>

      <ScrollView contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled">
        {!vista ? (
          <>
            <View style={s.intro}>
              <View style={[s.heroIcon, { backgroundColor: `${c.accent}1F` }]}>
                <Ionicons name="people-outline" size={34} color={c.accent} />
              </View>
              <Text style={[s.title, { color: c.text }]}>Ingresa tu invitación</Text>
              <Text style={[s.subtitle, { color: c.textSecondary }]}>
                Escribe el código que te entregó tu psicólogo para revisar y aceptar la vinculación.
              </Text>
            </View>

            <View style={s.field}>
              <Text style={[s.label, { color: c.text }]}>Código de invitación</Text>
              <TextInput
                style={[s.codeInput, { color: c.text, borderColor: error ? c.error : c.border }]}
                value={codigo}
                onChangeText={(texto) => {
                  setCodigo(texto.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 8));
                  setError(null);
                }}
                placeholder="AB12CD34"
                placeholderTextColor={c.textSecondary}
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={8}
                accessibilityLabel="Código de invitación"
              />
            </View>

            {error && <Text style={[s.error, { color: c.error }]}>{error}</Text>}

            <Pressable
              style={[s.primaryButton, { backgroundColor: c.accent }, (consultando || codigo.length !== 8) && s.disabled]}
              onPress={consultarCodigo}
              disabled={consultando || codigo.length !== 8}
              accessibilityRole="button"
            >
              {consultando ? (
                <ActivityIndicator color={c.accentText} />
              ) : (
                <Text style={[s.primaryButtonText, { color: c.accentText }]}>Revisar invitación</Text>
              )}
            </Pressable>
          </>
        ) : (
          <View style={s.confirmation}>
            <View style={[s.professionalCard, { backgroundColor: c.backgroundElement }]}>
              <View style={[s.avatar, { backgroundColor: c.backgroundSelected }]}>
                <Ionicons name="person" size={30} color={c.textSecondary} />
              </View>
              <View style={s.professionalInfo}>
                <Text style={[s.professionalLabel, { color: c.textSecondary }]}>Te invitó</Text>
                <Text style={[s.professionalName, { color: c.text }]}>{nombreProfesional(vista)}</Text>
                <Text style={[s.expiration, { color: c.textSecondary }]}>Vence el {fechaExpiracion(vista.expira_at)}</Text>
              </View>
            </View>

            <View style={[s.notice, { backgroundColor: c.backgroundElement }]}>
              <Ionicons name="information-circle-outline" size={20} color={c.accent} />
              <Text style={[s.noticeText, { color: c.textSecondary }]}>
                Al aceptar, este profesional quedará vinculado a tu cuenta. Solo puedes tener un psicólogo activo.
              </Text>
            </View>

            {error && <Text style={[s.error, { color: c.error }]}>{error}</Text>}

            <Pressable
              style={[s.primaryButton, { backgroundColor: c.accent }, aceptando && s.disabled]}
              onPress={aceptar}
              disabled={aceptando}
              accessibilityRole="button"
            >
              {aceptando ? (
                <ActivityIndicator color={c.accentText} />
              ) : (
                <Text style={[s.primaryButtonText, { color: c.accentText }]}>Aceptar vinculación</Text>
              )}
            </Pressable>
            <Pressable
              style={[s.secondaryButton, { borderColor: c.border }]}
              onPress={() => {
                setVista(null);
                setCredencial(null);
                setError(null);
              }}
              accessibilityRole="button"
            >
              <Text style={[s.secondaryButtonText, { color: c.text }]}>Usar otro código</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

