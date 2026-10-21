import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { EmotionSelector, type EmotionId } from "@/components/journal/emotion-selector";

export default function JournalScreen() {
  const c = useTheme();
  const { fecha } = useLocalSearchParams<{ fecha: string }>();

  const [emotion, setEmotion] = useState<EmotionId | null>(null);
  const [reason, setReason] = useState("");
  const [goodThings, setGoodThings] = useState("");
  const [badThings, setBadThings] = useState("");
  const [achievedGoal, setAchievedGoal] = useState("");
  const [improvementAreas, setImprovementAreas] = useState("");
  const [actionPlan, setActionPlan] = useState("");

  const fechaFormateada = (() => {
    if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return "";

    const [year, month, day] = fecha.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return "";
    }

    return new Intl.DateTimeFormat("es-CL", {
      day: "numeric",
      month: "long",
    }).format(date);
  })();

  const handleSave = () => {
    if (!emotion) {
      Alert.alert(
        "Emoción requerida",
        "Selecciona cómo te sientes hoy antes de guardar."
      );
      return;
    }

    Alert.alert(
      "Diario Guardado",
      "Se ha registrado correctamente su diario."
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >

        <View style={styles.header}>
          <Pressable onPress={() => router.back()} accessibilityLabel="Cerrar diario">
            <Text style={[styles.closeButton, { color: c.text }]}>×</Text>
          </Pressable>

          <Text style={[styles.headerDate, { color: c.text }]}>
            {fechaFormateada}
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.emotionSection}>
          <EmotionSelector value={emotion} onChange={setEmotion} />
        </View>

        <View style={styles.fieldSection}>
          <Text style={[styles.fieldLabel, { color: c.text }]}>
            ¿Por qué me siento así?
          </Text>

          <TextInput
            style={[styles.textArea, { color: c.text, borderColor: c.border }]}
            placeholder="Me siento así porque..."
            placeholderTextColor={c.textSecondary}
            value={reason}
            onChangeText={setReason}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.row}>

          <View style={styles.column}>
            <Text style={[styles.fieldLabel, { color: c.text }]}>
              Cosas buenas del día
            </Text>

            <TextInput
              style={[styles.textArea, { color: c.text, borderColor: c.border }]}
              placeholder="El día de hoy..."
              placeholderTextColor={c.textSecondary}
              value={goodThings}
              onChangeText={setGoodThings}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.column}>
            <Text style={[styles.fieldLabel, { color: c.text }]}>
              Cosas malas del día
            </Text>

            <TextInput
              style={[styles.textArea, { color: c.text, borderColor: c.border }]}
              placeholder="El día de hoy..."
              placeholderTextColor={c.textSecondary}
              value={badThings}
              onChangeText={setBadThings}
              multiline
              textAlignVertical="top"
            />
          </View>

        </View>
        <View style={styles.fieldSection}>
          <Text style={[styles.fieldLabel, { color: c.text }]}>
            ¿Cumplí algún objetivo?
          </Text>

          <TextInput
            style={[styles.textArea, { color: c.text, borderColor: c.border }]}
            placeholder="Hoy logré..."
            placeholderTextColor={c.textSecondary}
            value={achievedGoal}
            onChangeText={setAchievedGoal}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.fieldSection}>
          <Text style={[styles.fieldLabel, { color: c.text }]}>
            Cosas en las que me gustaría trabajar
          </Text>

          <TextInput
            style={[styles.textArea, { color: c.text, borderColor: c.border }]}
            placeholder="Me gustaría..."
            placeholderTextColor={c.textSecondary}
            value={improvementAreas}
            onChangeText={setImprovementAreas}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.fieldSection}>
          <Text style={[styles.fieldLabel, { color: c.text }]}>
            ¿Cómo puedo trabajar en ello?
          </Text>

          <TextInput
            style={[styles.textArea, { color: c.text, borderColor: c.border }]}
            placeholder="Podría comenzar por..."
            placeholderTextColor={c.textSecondary}
            value={actionPlan}
            onChangeText={setActionPlan}
            multiline
            textAlignVertical="top"
          />
        </View>

      </ScrollView>
      <Pressable
        style={[styles.button, { backgroundColor: c.accent }]}
        onPress={handleSave}
      >
        <Text style={[styles.buttonText, { color: c.accentText }]}>
          Guardar
        </Text>
      </Pressable>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  scrollContent: {
    gap: 10,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  closeButton: {
    fontSize: 30,
    fontWeight: "400",
    width: 35,
    textAlign: "center",
  },
  headerDate: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  headerSpacer: {
    width: 35,
  },
  emotionSection: {
    marginTop: 10,
    marginBottom: 10,
  },
  fieldSection: {
    gap: 10,
    marginTop: 15,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  textArea: {
    minHeight: 110,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 15,
  },
  column: {
    flex: 1,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
