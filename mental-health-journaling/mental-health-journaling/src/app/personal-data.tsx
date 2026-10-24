import { useState } from "react";
import {
  Alert,
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
import { router } from "expo-router";

import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";

const s = appStyles.datosPersonales;

// Fecha desde la que se puede volver a cambiar el nombre: un mes después del último cambio.
// El trigger de supabase/migrations/..._limitar_cambio_nombre.sql aplica la misma regla en el servidor.
const proximoCambioPermitido = (ultimoCambio: string | undefined) => {
  if (!ultimoCambio) return null;
  const fecha = new Date(ultimoCambio);
  fecha.setMonth(fecha.getMonth() + 1);
  return fecha > new Date() ? fecha : null;
};

const formatoFecha = (fecha: Date) =>
  new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long", year: "numeric" }).format(fecha);

export default function DatosPersonales() {
  const c = useTheme();
  const { session } = useAuth();
  const user = session?.user;
  const metadata = user?.user_metadata ?? {};

  const [nombre, setNombre] = useState<string>(metadata.nombre ?? "");
  const [apellido, setApellido] = useState<string>(metadata.apellido ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [guardandoNombre, setGuardandoNombre] = useState(false);
  const [guardandoEmail, setGuardandoEmail] = useState(false);

  const bloqueadoHasta = proximoCambioPermitido(user?.app_metadata.nombre_actualizado_en);
  const nombreCambio =
    nombre.trim() !== (metadata.nombre ?? "") || apellido.trim() !== (metadata.apellido ?? "");
  const emailCambio = email.trim().toLowerCase() !== (user?.email ?? "").toLowerCase();
  // Supabase guarda aquí el correo nuevo mientras no se confirme
  const emailPendiente = user?.new_email;

  const guardarNombre = () => {
    if (!nombre.trim() || !apellido.trim()) {
      Alert.alert("Datos incompletos", "Ingresa tu nombre y apellido.");
      return;
    }

    Alert.alert(
      "¿Cambiar tu nombre?",
      "Después de este cambio no podrás volver a modificarlo durante un mes.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cambiar",
          onPress: async () => {
            setGuardandoNombre(true);
            const { error } = await supabase.auth.updateUser({
              data: { nombre: nombre.trim(), apellido: apellido.trim() },
            });
            setGuardandoNombre(false);

            if (error) {
              Alert.alert("No se pudo cambiar el nombre", error.message);
              return;
            }
            Alert.alert("Nombre actualizado", "Tu nombre se cambió correctamente.");
          },
        },
      ]
    );
  };

  const guardarEmail = async () => {
    if (!email.includes("@")) {
      Alert.alert("Correo inválido", "Ingresa un correo electrónico válido.");
      return;
    }

    setGuardandoEmail(true);
    // El correo no cambia hasta que se confirme desde el enlace enviado por Supabase
    const { error } = await supabase.auth.updateUser({ email: email.trim() });
    setGuardandoEmail(false);

    if (error) {
      Alert.alert("No se pudo cambiar el correo", error.message);
      return;
    }

    Alert.alert(
      "Confirma tu nuevo correo",
      "Te enviamos un enlace de confirmación. Tu correo se actualizará cuando lo abras."
    );
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <View style={s.header}>
        <Pressable
          style={s.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={28} color={c.text} />
        </Pressable>
        <Text style={[s.title, { color: c.text }]}>Datos personales</Text>
        <View style={s.backButton} />
      </View>

      <KeyboardAvoidingView
        style={s.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={s.section}>
            <Text style={[s.sectionTitle, { color: c.text }]}>Nombre</Text>

            <View style={s.field}>
              <Text style={[s.label, { color: c.text }]}>Nombre</Text>
              <TextInput
                style={[s.input, { color: c.text, borderColor: c.border }, bloqueadoHasta && s.inputDisabled]}
                value={nombre}
                onChangeText={setNombre}
                editable={!bloqueadoHasta}
                autoCapitalize="words"
                placeholder="Tu nombre"
                placeholderTextColor={c.textSecondary}
              />
            </View>

            <View style={s.field}>
              <Text style={[s.label, { color: c.text }]}>Apellido</Text>
              <TextInput
                style={[s.input, { color: c.text, borderColor: c.border }, bloqueadoHasta && s.inputDisabled]}
                value={apellido}
                onChangeText={setApellido}
                editable={!bloqueadoHasta}
                autoCapitalize="words"
                placeholder="Tu apellido"
                placeholderTextColor={c.textSecondary}
              />
            </View>

            <View style={[s.notice, { backgroundColor: c.backgroundElement }]}>
              <Ionicons
                name={bloqueadoHasta ? "lock-closed-outline" : "information-circle-outline"}
                size={18}
                color={c.textSecondary}
              />
              <Text style={[s.noticeText, { color: c.textSecondary }]}>
                {bloqueadoHasta
                  ? `Podrás volver a cambiar tu nombre a partir del ${formatoFecha(bloqueadoHasta)}.`
                  : "Solo puedes cambiar tu nombre una vez al mes."}
              </Text>
            </View>

            <Pressable
              style={[
                s.button,
                { backgroundColor: c.accent },
                (!!bloqueadoHasta || !nombreCambio || guardandoNombre) && s.buttonDisabled,
              ]}
              onPress={guardarNombre}
              disabled={!!bloqueadoHasta || !nombreCambio || guardandoNombre}
              accessibilityRole="button"
            >
              <Text style={[s.buttonText, { color: c.accentText }]}>
                {guardandoNombre ? "Guardando..." : "Guardar nombre"}
              </Text>
            </Pressable>
          </View>

          <View style={s.section}>
            <Text style={[s.sectionTitle, { color: c.text }]}>Correo electrónico</Text>

            <View style={s.field}>
              <Text style={[s.label, { color: c.text }]}>Correo</Text>
              <TextInput
                style={[s.input, { color: c.text, borderColor: c.border }]}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                placeholder="tucorreo@ejemplo.com"
                placeholderTextColor={c.textSecondary}
              />
            </View>

            <View style={[s.notice, { backgroundColor: c.backgroundElement }]}>
              <Ionicons
                name={emailPendiente ? "mail-unread-outline" : "information-circle-outline"}
                size={18}
                color={c.textSecondary}
              />
              <Text style={[s.noticeText, { color: c.textSecondary }]}>
                {emailPendiente
                  ? `Cambio pendiente a ${emailPendiente}. Abre el enlace que te enviamos para confirmarlo.`
                  : "Te enviaremos un enlace para confirmar el nuevo correo antes de cambiarlo."}
              </Text>
            </View>

            <Pressable
              style={[
                s.button,
                { backgroundColor: c.accent },
                (!emailCambio || guardandoEmail) && s.buttonDisabled,
              ]}
              onPress={guardarEmail}
              disabled={!emailCambio || guardandoEmail}
              accessibilityRole="button"
            >
              <Text style={[s.buttonText, { color: c.accentText }]}>
                {guardandoEmail ? "Enviando..." : "Cambiar correo"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
