import { useRef, useState } from "react";
import { Link, router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";

import { useTheme } from "@/hooks/use-theme";

export default function Signup() {
    const c = useTheme();

    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const passwordRef = useRef<TextInput>(null);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignUp = () => {
      router.push("/signup/signup-pin");
    };

    return (
        <KeyboardAvoidingView
              style={[styles.container, { backgroundColor: c.background }]}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <View style={styles.form}>
                <Text style={[styles.title, { color: c.text }]}>Registrate</Text>
                <Text style={[styles.subtitle, { color: c.textSecondary }]}>
                  Rellena los campos para crear tu cuenta.
                </Text>

                <View style={styles.field}>
                    <Text style={[styles.label, { color: c.text }]}>Nombre</Text>
                    <TextInput
                      style={[
                        styles.input,
                        { backgroundColor: c.backgroundElement, borderColor: c.border, color: c.text },
                      ]}
                      value={name}
                      onChangeText={setName}
                      placeholder="Tu nombre"
                      placeholderTextColor={c.textSecondary}
                      autoCapitalize="words"
                      returnKeyType="next"
                    />
                </View>

                <View style={styles.field}>
                    <Text style={[styles.label, { color: c.text }]}>Apellido</Text>
                    <TextInput
                      style={[
                        styles.input,
                        { backgroundColor: c.backgroundElement, borderColor: c.border, color: c.text },
                      ]}
                      value={lastName}
                      onChangeText={setLastName}
                      placeholder="Tu apellido"
                      placeholderTextColor={c.textSecondary}
                      autoCapitalize="words"
                      returnKeyType="next"
                    />
                </View>
        
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
                      onSubmitEditing={handleSignUp}
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
                  onPress={handleSignUp}
                  disabled={loading}
                  accessibilityRole="button"
                >
                  {loading ? (
                    <ActivityIndicator color={c.accentText} />
                  ) : (
                    <Text style={[styles.buttonText, { color: c.accentText }]}>
                      Siguiente
                    </Text>
                  )}
                </Pressable>
        
              </View>
            </KeyboardAvoidingView>
    )
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
  },field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  error: {
    fontSize: 14,
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