import { ComponentProps } from "react";
import { ColorValue, StyleSheet, Text, useWindowDimensions, View } from "react-native";
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
export function useTabBar(visibleTabs = 3, wideTabWeight = 1) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const tabWidth = (width - BAR_MARGIN * 2 - 16) / (visibleTabs - 1 + wideTabWeight);

  const tabIcon = (active: IconName, inactive: IconName, label?: string) =>
    function TabIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
      const pillWidth = Math.min(PILL_MAX_WIDTH, tabWidth * (label ? wideTabWeight : 1) - (label ? 4 : 8));
      return (
        <View style={[styles.pill, { width: pillWidth }, label && styles.labeledPill, focused && { backgroundColor: `${c.accent}26` }]}>
          <Ionicons
            name={focused ? active : inactive}
            size={ICON_SIZE}
            color={color as string}
          />
          {label && (
            <Text style={[styles.label, { color }]} numberOfLines={1} adjustsFontSizeToFit>
              {label}
            </Text>
          )}
        </View>
      );
    };

  const screenOptions: TabOptions = {
    headerShown: false,
    tabBarActiveTintColor: c.accent,
    tabBarInactiveTintColor: c.textSecondary,
    tabBarLabelStyle: styles.label,
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
  labeledPill: {
    height: 58,
    paddingHorizontal: 4,
    gap: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
});
