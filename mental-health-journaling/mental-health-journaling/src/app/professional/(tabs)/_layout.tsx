import { Tabs } from "expo-router";

import { useTabBar } from "@/components/tab-bar";

// Menú inferior del profesional: igual al del usuario común, con "Pacientes" en lugar de "Profesionales"
export default function ProfessionalTabsLayout() {
  const { screenOptions, tabIcon } = useTabBar();

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
