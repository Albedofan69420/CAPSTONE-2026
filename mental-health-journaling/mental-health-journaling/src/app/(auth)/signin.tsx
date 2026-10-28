import { useRef, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, TextInputInstance, View,} from "react-native";
import { Link } from "expo-router";

import { supabase } from "@/lib/supabase";
import { useTheme } from "@/hooks/use-theme";
import { authStyles as s } from "@/constants/auth-styles";

export default function SignIn() {
  const c = useTheme();

  const passwordRef = useRef<TextInputInstance>(null);
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
      style={[s.container, { backgroundColor: c.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={s.form}>
        <Text style={[s.title, { color: c.text }]}>Inicia sesión</Text>
        <Text style={[s.subtitle, { color: c.textSecondary }]}>
          Usa tu correo y contraseña para entrar.
        </Text>

        <View style={s.field}>
          <Text style={[s.label, { color: c.text }]}>Correo</Text>
          <TextInput
            style={[
              s.input,
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

        <View style={s.field}>
          <Text style={[s.label, { color: c.text }]}>Contraseña</Text>
          <View>
            <TextInput
              ref={passwordRef}
              style={[
                s.input,
                s.passwordInput,
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
              style={s.toggle}
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
          onPress={handleSignIn}
          disabled={loading}
          accessibilityRole="button"
        >
          {loading ? (
            <ActivityIndicator color={c.accentText} />
          ) : (
            <Text style={[s.buttonText, { color: c.accentText }]}>
              Iniciar sesión
            </Text>
          )}
        </Pressable>

        <View style={s.footer}>
          <Text style={{ color: c.textSecondary }}>¿No tienes cuenta? </Text>
          <Link href="/signup" style={{ color: c.accent, fontWeight: "600" }}>
            Regístrate
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}