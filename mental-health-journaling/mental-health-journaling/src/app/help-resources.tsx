import { ComponentProps } from "react";
import { Alert, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { appStyles } from "@/constants/app-styles";
import { useTheme } from "@/hooks/use-theme";

const s = appStyles.helpResources;

type Recurso = {
  nombre: string;
  numero: string;
  telefono: string;
  descripcion: string;
  horario: string;
  icono: ComponentProps<typeof Ionicons>["name"];
  urgente?: boolean;
};

const RECURSOS: Recurso[] = [
  {
    nombre: "Prevención del suicidio",
    numero: "*4141",
    telefono: "+564141",
    descripcion: "Apoyo emocional especializado para personas en crisis o con pensamientos suicidas.",
    horario: "Gratis, confidencial y disponible 24/7",
    icono: "heart-outline",
    urgente: true,
  },
  {
    nombre: "SAMU",
    numero: "131",
    telefono: "131",
    descripcion: "Emergencias médicas o situaciones con riesgo vital que requieren atención inmediata.",
    horario: "Gratis y disponible 24/7",
    icono: "medical-outline",
    urgente: true,
  },
  {
    nombre: "Salud Responde",
    numero: "600 360 7777",
    telefono: "6003607777",
    descripcion: "Información, orientación y apoyo de profesionales de la salud.",
    horario: "Disponible las 24 horas, todos los días",
    icono: "call-outline",
  },
  {
    nombre: "Fono Drogas y Alcohol SENDA",
    numero: "1412",
    telefono: "1412",
    descripcion: "Orientación confidencial por consumo de alcohol u otras drogas, para la persona o su familia.",
    horario: "Gratis, confidencial y disponible 24/7",
    icono: "chatbubble-ellipses-outline",
  },
];

const llamar = (recurso: Recurso) => {
  Alert.alert(
    `Llamar al ${recurso.numero}`,
    recurso.urgente
      ? "Se abrirá la aplicación de teléfono para realizar la llamada."
      : `Se abrirá la aplicación de teléfono para llamar a ${recurso.nombre}.`,
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Llamar",
        onPress: () => {
          Linking.openURL(`tel:${recurso.telefono}`).catch(() =>
            Alert.alert("No se pudo abrir el teléfono", `Marca manualmente ${recurso.numero}.`)
          );
        },
      },
    ]
  );
};

export default function RecursosDeAyuda() {
  const c = useTheme();

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <View style={s.header}>
        <Pressable style={s.headerButton} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Volver">
          <Ionicons name="chevron-back" size={28} color={c.text} />
        </Pressable>
        <Text style={[s.headerTitle, { color: c.text }]}>Ayuda y emergencias</Text>
        <View style={s.headerButton} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={[s.emergencyNotice, { backgroundColor: `${c.error}18`, borderColor: c.error }]}>
          <Ionicons name="warning-outline" size={25} color={c.error} />
          <View style={s.emergencyInfo}>
            <Text style={[s.emergencyTitle, { color: c.error }]}>Si existe peligro inmediato</Text>
            <Text style={[s.emergencyText, { color: c.text }]}>Llama al SAMU 131 o acude al servicio de urgencias más cercano.</Text>
          </View>
        </View>

        <View style={s.intro}>
          <Text style={[s.introTitle, { color: c.text }]}>No tienes que enfrentarlo a solas</Text>
          <Text style={[s.introText, { color: c.textSecondary }]}>Estos servicios chilenos pueden entregar apoyo y orientación. Esta sección no reemplaza una atención profesional.</Text>
        </View>

        <View style={s.list}>
          {RECURSOS.map((recurso) => (
            <View key={recurso.numero} style={[s.card, { backgroundColor: c.backgroundElement }]}>
              <View style={s.cardHeader}>
                <View style={[s.icon, { backgroundColor: recurso.urgente ? `${c.error}18` : `${c.accent}1F` }]}>
                  <Ionicons name={recurso.icono} size={24} color={recurso.urgente ? c.error : c.accent} />
                </View>
                <View style={s.cardTitleGroup}>
                  <Text style={[s.cardTitle, { color: c.text }]}>{recurso.nombre}</Text>
                  <Text style={[s.number, { color: recurso.urgente ? c.error : c.accent }]}>{recurso.numero}</Text>
                </View>
              </View>
              <Text style={[s.description, { color: c.textSecondary }]}>{recurso.descripcion}</Text>
              <Text style={[s.schedule, { color: c.textSecondary }]}>{recurso.horario}</Text>
              <Pressable
                style={({ pressed }) => [s.callButton, { backgroundColor: recurso.urgente ? c.error : c.accent }, pressed && { opacity: 0.8 }]}
                onPress={() => llamar(recurso)}
                accessibilityRole="button"
                accessibilityLabel={`Llamar a ${recurso.nombre}, ${recurso.numero}`}
              >
                <Ionicons name="call" size={19} color={recurso.urgente ? "#FFFFFF" : c.accentText} />
                <Text style={[s.callButtonText, { color: recurso.urgente ? "#FFFFFF" : c.accentText }]}>Llamar</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <Text style={[s.footer, { color: c.textSecondary }]}>Números oficiales para Chile. Antes de publicar la app, conviene revisar periódicamente que sigan vigentes.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
