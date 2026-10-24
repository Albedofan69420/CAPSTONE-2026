import { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import { useTheme } from "@/hooks/use-theme";
import { appStyles } from "@/constants/app-styles";
import { PROFESIONALES } from "@/lib/profesionales";

const s = appStyles.profesionales;

export default function Profesionales() {
  const c = useTheme();
  const [busqueda, setBusqueda] = useState("");

  const filtrados = PROFESIONALES.filter((p) =>
    `${p.nombre} ${p.profesion}`.toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>
      <Text style={[s.title, { color: c.text }]}>Profesionales</Text>

      <View style={s.searchRow}>
        <View style={[s.searchBar, { backgroundColor: c.backgroundElement }]}>
          <Ionicons name="search" size={20} color={c.textSecondary} />
          <TextInput
            style={[s.searchInput, { color: c.text }]}
            placeholder="Buscar profesional"
            placeholderTextColor={c.textSecondary}
            value={busqueda}
            onChangeText={setBusqueda}
            returnKeyType="search"
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            s.filterButton,
            { backgroundColor: c.accent },
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => router.push("/filters")}
          accessibilityRole="button"
          accessibilityLabel="Filtrar"
        >
          <Ionicons name="options-outline" size={22} color={c.accentText} />
        </Pressable>
      </View>

      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              s.card,
              { backgroundColor: c.backgroundElement },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() =>
              router.push({ pathname: "/professional-profile", params: { id: item.id } })
            }
            accessibilityRole="button"
            accessibilityLabel={`Ver perfil de ${item.nombre}, ${item.profesion}`}
          >
            <Image source={{ uri: item.foto }} style={s.photo} contentFit="cover" />
            <View style={s.cardInfo}>
              <Text style={[s.name, { color: c.text }]}>{item.nombre}</Text>
              <Text style={[s.profession, { color: c.textSecondary }]}>
                {item.profesion}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={c.textSecondary} />
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
