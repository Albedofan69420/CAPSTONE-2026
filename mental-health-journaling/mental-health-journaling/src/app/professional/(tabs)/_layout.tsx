import { Tabs } from "expo-router";

import { useTabBar } from "@/components/tab-bar";
import { useCitas } from "@/providers/CitasProvider";

// Menú inferior del profesional: igual al del usuario común, con "Pacientes" en lugar de "Profesionales"
export default function ProfessionalTabsLayout() {
  const { screenOptions, tabIcon } = useTabBar();
  const { noLeidos } = useCitas();

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
        name="patients"
        options={{
          title: "Pacientes",
          tabBarIcon: tabIcon("people", "people-outline"),
          // Círculo rojo con los mensajes por leer de las solicitudes
          tabBarBadge: noLeidos > 0 ? (noLeidos > 99 ? "99+" : noLeidos) : undefined,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: tabIcon("person", "person-outline"),
        }}
      />
    </Tabs>
  );
}
