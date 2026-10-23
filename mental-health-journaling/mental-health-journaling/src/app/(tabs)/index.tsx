import { useState } from "react";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { WeekStrip } from "@/components/week-strip";
import { useTheme } from "@/hooks/use-theme";

import { router } from "expo-router";
import { aYMD } from "@/components/week-strip";
import { appStyles } from "@/constants/app-styles";

const s = appStyles.inicio;

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
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <WeekStrip
        selectedDate={fecha}
        onSelectDate={setFecha}
        markedDates={[]}
      />

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
          Registrar en mi diario
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}