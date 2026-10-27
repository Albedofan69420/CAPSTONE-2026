import { ComponentProps } from "react";
import { ColorValue, StyleSheet, useWindowDimensions, View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/use-theme";

type IconName = ComponentProps<typeof Ionicons>["name"];
// Opciones de <Tabs screenOptions={...}> en su forma de objeto (no de función)
type TabOptions = Exclude<
  NonNullable<ComponentProps<typeof Tabs>["screenOptions"]>,
  (...args: never[]) => unknown
>;

const ICON_SIZE = 28;
const BAR_MARGIN = 40;
const PILL_MAX_WIDTH = 110;

/**
 * Estilo de la barra inferior flotante, compartido por el usuario común y el profesional.
 * `visibleTabs` ajusta el ancho del fondo del ícono para que quepan 4 pestañas en pantallas chicas.
 */
export function useTabBar(visibleTabs = 3) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const pillWidth = Math.min(PILL_MAX_WIDTH, (width - BAR_MARGIN * 2 - 16) / visibleTabs - 8);

  const tabIcon = (active: IconName, inactive: IconName) =>
    function TabIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
      return (
        <View style={[styles.pill, { width: pillWidth }, focused && { backgroundColor: `${c.accent}26` }]}>
          <Ionicons
            name={focused ? active : inactive}
            size={ICON_SIZE}
            color={color as string}
          />
        </View>
      );
    };

  const screenOptions: TabOptions = {
    headerShown: false,
    tabBarActiveTintColor: c.accent,
    tabBarInactiveTintColor: c.textSecondary,
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: "600",
    },
    // Círculo rojo con los mensajes por leer (tabBarBadge en cada pestaña)
    tabBarBadgeStyle: {
      backgroundColor: c.badge,
      color: c.badgeText,
      fontSize: 11,
      fontWeight: "700",
    },
    tabBarStyle: {
      position: "absolute",
      left: BAR_MARGIN,
      right: BAR_MARGIN,
      bottom: Math.max(insets.bottom, 12),
      height: 80,
      borderRadius: 40,
      borderTopWidth: 0,
      paddingTop: 20,
      paddingBottom: 10,
      paddingHorizontal: 8,
      backgroundColor: c.backgroundElement,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 10,
    },
  };

  return { screenOptions, tabIcon };
}

const styles = StyleSheet.create({
  pill: {
    height: 55,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
