import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import { Dropdown } from "@/components/dropdown";
import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
import { REGIONES, comunasDe } from "@/constants/regiones";

const s = appStyles.filtros;

// Las regiones y comunas son las mismas que elige el profesional (src/constants/regiones.ts).
const TIPOS_ATENCION = ["Presencial", "Online", "Presencial y online"];
const ESPECIALIDADES = ["Psicología clínica", "Psiquiatría", "Terapia de pareja", "Psicología infantojuvenil"];

export default function Filtros() {
  const c = useTheme();
  const params = useLocalSearchParams<{
    region?: string;
    comuna?: string;
    tipoAtencion?: string;
    especialidad?: string;
  }>();
  const [region, setRegion] = useState<string | null>(params.region ?? null);
  const [comuna, setComuna] = useState<string | null>(params.comuna ?? null);
  const [tipoAtencion, setTipoAtencion] = useState<string | null>(params.tipoAtencion ?? null);
  const [especialidad, setEspecialidad] = useState<string | null>(params.especialidad ?? null);

  // La comuna depende de la región, así que se limpia al cambiarla
  const cambiarRegion = (nueva: string | null) => {
    setRegion(nueva);
    setComuna(null);
  };

  const aplicar = () => {
    router.replace({
      pathname: "/explore",
      params: {
        ...(region ? { region } : {}),
        ...(comuna ? { comuna } : {}),
        ...(tipoAtencion ? { tipoAtencion } : {}),
        ...(especialidad ? { especialidad } : {}),
      },
    });
  };

  const limpiar = () => {
    setRegion(null);
    setComuna(null);
    setTipoAtencion(null);
    setEspecialidad(null);
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <View style={s.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Cerrar filtros"
          hitSlop={8}
        >
          <Text style={[s.closeButton, { color: c.text }]}>×</Text>
        </Pressable>

        <Text style={[s.title, { color: c.text }]}>Filtros</Text>

        <View style={s.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled">
        <Dropdown
          label="Región"
          placeholder="Selecciona una región"
          options={REGIONES}
          value={region}
          onChange={cambiarRegion}
        />

        <Dropdown
          label="Comuna"
          placeholder={region ? "Selecciona una comuna" : "Primero elige una región"}
          options={comunasDe(region)}
          value={comuna}
          onChange={setComuna}
          disabled={!region}
        />

        <Dropdown
          label="Tipo de atención"
          placeholder="Selecciona el tipo de atención"
          options={TIPOS_ATENCION}
          value={tipoAtencion}
          onChange={setTipoAtencion}
        />

        <Dropdown
          label="Especialidad"
          placeholder="Selecciona una especialidad"
          options={ESPECIALIDADES}
          value={especialidad}
          onChange={setEspecialidad}
        />
      </ScrollView>

      <View style={[s.actions, { borderTopColor: c.border, backgroundColor: c.background }]}>
        <Pressable
          style={({ pressed }) => [s.clearButton, pressed && { opacity: 0.7 }]}
          onPress={limpiar}
          accessibilityRole="button"
        >
          <Text style={[s.clearButtonText, { color: c.accent }]}>Limpiar</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [s.applyButton, { backgroundColor: c.accent }, pressed && { opacity: 0.8 }]}
          onPress={aplicar}
          accessibilityRole="button"
        >
          <Text style={[s.applyButtonText, { color: c.accentText }]}>Aplicar filtros</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
