import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { Dropdown } from "@/components/dropdown";
import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
import { REGIONES, comunasDe } from "@/constants/regiones";

const s = appStyles.filtros;

// Opciones provisorias, reemplazar por las obtenidas desde el backend.
// Las regiones y comunas son las mismas que elige el profesional (src/constants/regiones.ts)
const TIPOS_ATENCION = ["Presencial", "Online", "Presencial y online"];
const ESPECIALIDADES = ["Psicología clínica", "Psiquiatría", "Terapia de pareja", "Psicología infantojuvenil"];

export default function Filtros() {
  const c = useTheme();
  const [region, setRegion] = useState<string | null>(null);
  const [comuna, setComuna] = useState<string | null>(null);
  const [tipoAtencion, setTipoAtencion] = useState<string | null>(null);
  const [especialidad, setEspecialidad] = useState<string | null>(null);

  // La comuna depende de la región, así que se limpia al cambiarla
  const cambiarRegion = (nueva: string | null) => {
    setRegion(nueva);
    setComuna(null);
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
    </SafeAreaView>
  );
}
