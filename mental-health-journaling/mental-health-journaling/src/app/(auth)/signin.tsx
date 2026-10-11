import { useRef, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View,} from "react-native";
import { Link } from "expo-router";

import { supabase } from "@/lib/supabase";
import { useTheme } from "@/hooks/use-theme";

export default function SignIn() {
  const c = useTheme();

  const passwordRef = useRef<TextInput>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      setError("Ingresa tu correo y tu contraseña.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "El correo o la contraseña son incorrectos."
          : signInError.message
      );
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: c.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.form}>
        <Text style={[styles.title, { color: c.text }]}>Inicia sesión</Text>
        <Text style={[styles.subtitle, { color: c.textSecondary }]}>
          Usa tu correo y contraseña para entrar.
        </Text>

        <View style={styles.field}>
          <Text style={[styles.label, { color: c.text }]}>Correo</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: c.backgroundElement, borderColor: c.border, color: c.text },
            ]}
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

        <View style={styles.field}>
          <Text style={[styles.label, { color: c.text }]}>Contraseña</Text>
          <View>
            <TextInput
              ref={passwordRef}
              style={[
                styles.input,
                styles.passwordInput,
                { backgroundColor: c.backgroundElement, borderColor: c.border, color: c.text },
              ]}
              value={password}
              onChangeText={setPassword}
              placeholder="Tu contraseña"
              placeholderTextColor={c.textSecondary}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
              returnKeyType="done"
              onSubmitEditing={handleSignIn}
            />
            <Pressable
              style={styles.toggle}
              onPress={() => setShowPassword((v) => !v)}
              accessibilityRole="button"
              accessibilityLabel={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              hitSlop={8}
            >
              <Text style={{ color: c.accent, fontWeight: "600" }}>
                {showPassword ? "Ocultar" : "Mostrar"}
              </Text>
            </Pressable>
          </View>
        </View>

        {error && (
          <Text style={[styles.error, { color: c.error }]} accessibilityRole="alert">
            {error}
          </Text>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: c.accent },
            (pressed || loading) && { opacity: 0.8 },
          ]}
          onPress={handleSignIn}
          disabled={loading}
          accessibilityRole="button"
        >
          {loading ? (
            <ActivityIndicator color={c.accentText} />
          ) : (
            <Text style={[styles.buttonText, { color: c.accentText }]}>
              Iniciar sesión
            </Text>
          )}
        </Pressable>

        <View style={styles.footer}>
          <Text style={{ color: c.textSecondary }}>¿No tienes cuenta? </Text>
          <Link href="/signup" style={{ color: c.accent, fontWeight: "600" }}>
            Regístrate
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  form: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    gap: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  passwordInput: {
    paddingRight: 84,
  },
  toggle: {
    position: "absolute",
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  error: {
    fontSize: 14,
  },
  button: {
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
});