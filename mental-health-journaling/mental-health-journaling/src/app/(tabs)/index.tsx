import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { WeekStrip } from "@/components/week-strip";
import { useTheme } from "@/hooks/use-theme";

import { router } from "expo-router";
import { aYMD } from "@/components/week-strip";

export default function Inicio() {
  const c = useTheme();
  const [fecha, setFecha] = useState(new Date());

  const registrarEnDiario = () => {
    router.push({
      pathname: "/journal",
      params: {
        fecha: aYMD(fecha),
      },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <WeekStrip
        selectedDate={fecha}
        onSelectDate={setFecha}
        markedDates={[]}
      />

      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: c.accent },
          pressed && { opacity: 0.8 },
        ]}
        onPress={registrarEnDiario}
        accessibilityRole="button"
      >
        <Text style={[styles.buttonText, { color: c.accentText }]}>
          Registrar en mi diario
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 24,
  },
  button: {
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});