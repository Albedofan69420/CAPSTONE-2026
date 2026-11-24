import { Tabs } from "expo-router";

import { useTabBar } from "@/components/tab-bar";
import { useCitas } from "@/providers/CitasProvider";

const PSYCHOLOGIST_TAB_LABEL = "Mi psicólogo";
const PSYCHOLOGIST_TAB_WEIGHT = 1.4;

export default function TabsLayout() {
  // La pestaña aparece cuando el profesional ya agendó al menos una cita.
  const { totalCitas } = useCitas();
  const conCitas = totalCitas > 0;
  // Estilo de la barra compartido con el menú del profesional (src/components/tab-bar.tsx)
  const { screenOptions, tabIcon } = useTabBar(conCitas ? 4 : 3, PSYCHOLOGIST_TAB_WEIGHT);

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: tabIcon("home", "home-outline"),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: PSYCHOLOGIST_TAB_LABEL,
          tabBarAccessibilityLabel: PSYCHOLOGIST_TAB_LABEL,
          tabBarLabel: () => null,
          tabBarItemStyle: { flex: PSYCHOLOGIST_TAB_WEIGHT },
          tabBarIcon: tabIcon("person-circle", "person-circle-outline", PSYCHOLOGIST_TAB_LABEL),
        }}
      />

      {/* Agenda e historial de citas del paciente. */}
      <Tabs.Screen
        name="citas"
        options={{
          title: "Citas",
          tabBarIcon: tabIcon("calendar", "calendar-outline"),
          // Se oculta solo el botón. Con href: null, Expo Router 58 trata la pestaña como oculta y
          // redirige a Inicio a quien esté en ella (por ejemplo, mientras carga el resumen de citas)
          tabBarItemStyle: conCitas ? undefined : { display: "none" },
        }}
      />

      {/* Para agregar una pestaña se hace en (tabs) y luego se agrega aquí. */}
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: tabIcon("person", "person-outline"),
        }}
      />
    </Tabs>
  );
}
