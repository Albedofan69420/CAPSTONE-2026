import { Tabs } from "expo-router";

import { useTabBar } from "@/components/tab-bar";

export default function TabsLayout() {
  // Estilo de la barra compartido con el menú del profesional (src/components/tab-bar.tsx)
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
        name="explore"
        options={{
          title: "Profesionales",
          tabBarIcon: tabIcon("search", "search-outline"),
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

      {/* Pantalla del diario: no aparece como pestaña y oculta la barra inferior */}
      <Tabs.Screen
        name="journal"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
