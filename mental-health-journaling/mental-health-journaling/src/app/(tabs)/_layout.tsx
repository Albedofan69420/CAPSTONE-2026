import { Tabs } from "expo-router";

import { useTabBar } from "@/components/tab-bar";
import { useCitas } from "@/providers/CitasProvider";

export default function TabsLayout() {
  // La pestaña Citas aparece cuando el usuario ya solicitó al menos una cita
  const { totalCitas, noLeidos } = useCitas();
  const conCitas = totalCitas > 0;
  // Estilo de la barra compartido con el menú del profesional (src/components/tab-bar.tsx)
  const { screenOptions, tabIcon } = useTabBar(conCitas ? 4 : 3);

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

      {/* Chats de las citas, con el círculo rojo de mensajes por leer */}
      <Tabs.Screen
        name="citas"
        options={{
          title: "Citas",
          tabBarIcon: tabIcon("chatbubbles", "chatbubbles-outline"),
          tabBarBadge: noLeidos > 0 ? (noLeidos > 99 ? "99+" : noLeidos) : undefined,
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
