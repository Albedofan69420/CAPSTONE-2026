import { useRef, useState } from "react";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { authStyles as s } from "@/constants/auth-styles";
import { supabase } from "@/lib/supabase";
import { formatearRun, limpiarRun, runValido } from "@/lib/run";
import { useSignup } from "@/providers/SignupProvider";

export default function SignupProfesional() {
  const { reset } = useSignup();
  const c = useTheme();

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  // Se guarda sin puntos ni guion (ej.: 123456789) y se muestra con formato
  const [run, setRun] = useState("");
  const [email, setEmail] = useState("");

  const runRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (!name.trim() || !lastName.trim() || !email.includes("@") || password.length < 6) {
      setError("Rellena todos los campos. La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (!runValido(run)) {
      setError("El RUN no es válido. Revisa los números y el dígito verificador.");
      return;
    }

    setLoading(true);
    setError(null);

    // Un trigger en Supabase crea la fila en public.profesionales con este RUN
    const { data: result, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          nombre: name.trim(),
          apellido: lastName.trim(),
          tipo_usuario: "profesional",
          run,
        },
      },
    });

    if (signUpError) {
      setError(
        signUpError.message === "User already registered"
          ? "Ya existe una cuenta con ese correo."
          : // El RUN es único: si ya está registrado, el trigger falla y Supabase devuelve un error de base de datos
            signUpError.message.includes("Database error")
            ? "No pudimos crear la cuenta. Es posible que este RUN ya esté registrado."
            : signUpError.message
      );
      setLoading(false);
      return;
    }

    reset();

    //Con "Confirm email" activo no hay sesión hasta confirmar el correo
    if (!result.session) {
      Alert.alert(
        "Revisa tu correo",
        "Te enviamos un enlace para confirmar tu cuenta. Al iniciar sesión podrás subir tus certificados."
      );
      router.replace("/signin");
    }
    //Si hay una sesión, el layout raíz lleva a subir los certificados
  };

  const inputStyle = [
    s.input,
    { backgroundColor: c.backgroundElement, borderColor: c.border, color: c.text },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: c.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={s.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={s.form}>
          <Text style={[s.title, { color: c.text }]}>Registrate</Text>
          <Text style={[s.subtitle, { color: c.textSecondary }]}>
            Rellena los campos para crear tu cuenta profesional.
          </Text>

          <View style={s.field}>
            <Text style={[s.label, { color: c.text }]}>Nombre</Text>
            <TextInput
              style={inputStyle}
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre"
              placeholderTextColor={c.textSecondary}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          <View style={s.field}>
            <Text style={[s.label, { color: c.text }]}>Apellido</Text>
            <TextInput
              style={inputStyle}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Tu apellido"
              placeholderTextColor={c.textSecondary}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => runRef.current?.focus()}
            />
          </View>

          <View style={s.field}>
            <Text style={[s.label, { color: c.text }]}>RUN</Text>
            <TextInput
              ref={runRef}
              style={inputStyle}
              value={formatearRun(run)}
              onChangeText={(texto) => setRun(limpiarRun(texto))}
              placeholder="Ej.: 12.345.678-9"
              placeholderTextColor={c.textSecondary}
              autoCapitalize="characters"
              autoCorrect={false}
              keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "default"}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />
            <Text style={[s.hint, { color: c.textSecondary }]}>
              Incluye el dígito verificador. Si es K, escríbela al final.
            </Text>
          </View>

          <View style={s.field}>
            <Text style={[s.label, { color: c.text }]}>Correo</Text>
            <TextInput
              ref={emailRef}
              style={inputStyle}
              value={email}
              onChangeText={setEmail}
              placeholder="nombre@correo.com"
              placeholderTextColor={c.textSecondary}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
          </View>

          <View style={s.field}>
            <Text style={[s.label, { color: c.text }]}>Contraseña</Text>
            <View>
              <TextInput
                ref={passwordRef}
                style={[...inputStyle, s.passwordInput]}
                value={password}
                onChangeText={setPassword}
                placeholder="Tu contraseña"
                placeholderTextColor={c.textSecondary}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                returnKeyType="done"
                onSubmitEditing={handleSignUp}
              />
              <Pressable
                style={s.toggle}
                onPress={() => setShowPassword((v) => !v)}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                hitSlop={8}
              >
                <Text style={{ color: c.accent, fontWeight: "600" }}>
                  {showPassword ? "Ocultar" : "Mostrar"}
                </Text>
              </Pressable>
            </View>
          </View>

          {error && (
            <Text style={[s.error, { color: c.error }]} accessibilityRole="alert">
              {error}
            </Text>
          )}

          <Pressable
            style={({ pressed }) => [
              s.button,
              { backgroundColor: c.accent },
              (pressed || loading) && { opacity: 0.8 },
            ]}
            onPress={handleSignUp}
            disabled={loading}
            accessibilityRole="button"
          >
            {loading ? (
              <ActivityIndicator color={c.accentText} />
            ) : (
              <Text style={[s.buttonText, { color: c.accentText }]}>Siguiente</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
