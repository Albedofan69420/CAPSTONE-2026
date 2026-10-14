import { useRef, useState } from "react";
import { Link, router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { authStyles as s } from "@/constants/auth-styles";

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
              style={[s.container, { backgroundColor: c.background }]}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <View style={s.form}>
                <Text style={[s.title, { color: c.text }]}>Registrate</Text>
                <Text style={[s.subtitle, { color: c.textSecondary }]}>
                  Rellena los campos para crear tu cuenta.
                </Text>

                <View style={s.field}>
                    <Text style={[s.label, { color: c.text }]}>Nombre</Text>
                    <TextInput
                      style={[
                        s.input,
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

                <View style={s.field}>
                    <Text style={[s.label, { color: c.text }]}>Apellido</Text>
                    <TextInput
                      style={[
                        s.input,
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
                      onSubmitEditing={handleSignUp}
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
                  onPress={handleSignUp}
                  disabled={loading}
                  accessibilityRole="button"
                >
                  {loading ? (
                    <ActivityIndicator color={c.accentText} />
                  ) : (
                    <Text style={[s.buttonText, { color: c.accentText }]}>
                      Siguiente
                    </Text>
                  )}
                </Pressable>
        
              </View>
            </KeyboardAvoidingView>
    )
}