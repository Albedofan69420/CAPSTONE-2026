import { View, Text, TextInput, Pressable, ScrollView, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/use-theme";
import { useEffect, useState } from "react";
import { EmotionSelector, type EmotionId } from "@/components/journal/emotion-selector";
import { appStyles } from "@/constants/app-styles";
import { guardarRegistro, obtenerRegistro } from "@/lib/diario";
import { useAuth } from "@/providers/AuthProvider";

const s = appStyles.journal;

export default function JournalScreen() {
  const c = useTheme();
  const { session } = useAuth();
  const { fecha } = useLocalSearchParams<{ fecha: string }>();
  const [saving, setSaving] = useState(false);

  const [emotion, setEmotion] = useState<EmotionId | null>(null);
  const [reason, setReason] = useState("");
  const [goodThings, setGoodThings] = useState("");
  const [badThings, setBadThings] = useState("");
  const [achievedGoal, setAchievedGoal] = useState("");
  const [improvementAreas, setImprovementAreas] = useState("");
  const [actionPlan, setActionPlan] = useState("");

  // Al estar dentro de (tabs) la pantalla no se desmonta al salir, así que se limpia el
  // formulario al cambiar de fecha. Si ya hay un registro, se cargan sus datos para editarlos.
  useEffect(() => {
    setEmotion(null);
    setReason("");
    setGoodThings("");
    setBadThings("");
    setAchievedGoal("");
    setImprovementAreas("");
    setActionPlan("");
    setSaving(false);

    if (!session || !fecha) return;

    obtenerRegistro(session.user.id, fecha)
      .then((registro) => {
        if (!registro) return;
        setEmotion(registro.emocion);
        setReason(registro.motivo);
        setGoodThings(registro.cosas_buenas);
        setBadThings(registro.cosas_malas);
        setAchievedGoal(registro.objetivo_cumplido);
        setImprovementAreas(registro.areas_mejora);
        setActionPlan(registro.plan_accion);
      })
      .catch((e) => console.log("Error al cargar el registro:", e.message));
  }, [session, fecha]);

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

  const handleSave = async () => {
    if (!emotion) {
      Alert.alert(
        "Emoción requerida",
        "Selecciona cómo te sientes hoy antes de guardar."
      );
      return;
    }

    if (!session || !fechaFormateada || saving) return;

    setSaving(true);

    try {
      await guardarRegistro(session.user.id, {
        fecha,
        emocion: emotion,
        motivo: reason.trim(),
        cosas_buenas: goodThings.trim(),
        cosas_malas: badThings.trim(),
        objetivo_cumplido: achievedGoal.trim(),
        areas_mejora: improvementAreas.trim(),
        plan_accion: actionPlan.trim(),
      });
    } catch (e) {
      Alert.alert("No se pudo guardar", (e as Error).message);
      setSaving(false);
      return;
    }

    setSaving(false);
    Alert.alert(
      "Diario Guardado",
      "Se ha registrado correctamente su diario."
    );
    router.back();
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: c.background }]}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={s.scrollContent}
      >

        <View style={s.header}>
          <Pressable onPress={() => router.back()} accessibilityLabel="Cerrar diario">
            <Text style={[s.closeButton, { color: c.text }]}>×</Text>
          </Pressable>

          <Text style={[s.headerDate, { color: c.text }]}>
            {fechaFormateada}
          </Text>

          <View style={s.headerSpacer} />
        </View>

        <View style={s.emotionSection}>
          <EmotionSelector value={emotion} onChange={setEmotion} />
        </View>

        <View style={s.fieldSection}>
          <Text style={[s.fieldLabel, { color: c.text }]}>
            ¿Por qué me siento así?
          </Text>

          <TextInput
            style={[s.textArea, { color: c.text, borderColor: c.border }]}
            placeholder="Me siento así porque..."
            placeholderTextColor={c.textSecondary}
            value={reason}
            onChangeText={setReason}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={s.row}>

          <View style={s.column}>
            <Text style={[s.fieldLabel, { color: c.text }]}>
              Cosas buenas del día
            </Text>

            <TextInput
              style={[s.textArea, { color: c.text, borderColor: c.border }]}
              placeholder="El día de hoy..."
              placeholderTextColor={c.textSecondary}
              value={goodThings}
              onChangeText={setGoodThings}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={s.column}>
            <Text style={[s.fieldLabel, { color: c.text }]}>
              Cosas malas del día
            </Text>

            <TextInput
              style={[s.textArea, { color: c.text, borderColor: c.border }]}
              placeholder="El día de hoy..."
              placeholderTextColor={c.textSecondary}
              value={badThings}
              onChangeText={setBadThings}
              multiline
              textAlignVertical="top"
            />
          </View>

        </View>
        <View style={s.fieldSection}>
          <Text style={[s.fieldLabel, { color: c.text }]}>
            ¿Cumplí algún objetivo?
          </Text>

          <TextInput
            style={[s.textArea, { color: c.text, borderColor: c.border }]}
            placeholder="Hoy logré..."
            placeholderTextColor={c.textSecondary}
            value={achievedGoal}
            onChangeText={setAchievedGoal}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={s.fieldSection}>
          <Text style={[s.fieldLabel, { color: c.text }]}>
            Cosas en las que me gustaría trabajar
          </Text>

          <TextInput
            style={[s.textArea, { color: c.text, borderColor: c.border }]}
            placeholder="Me gustaría..."
            placeholderTextColor={c.textSecondary}
            value={improvementAreas}
            onChangeText={setImprovementAreas}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={s.fieldSection}>
          <Text style={[s.fieldLabel, { color: c.text }]}>
            ¿Cómo puedo trabajar en ello?
          </Text>

          <TextInput
            style={[s.textArea, { color: c.text, borderColor: c.border }]}
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
        style={[s.button, { backgroundColor: c.accent }, saving && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={[s.buttonText, { color: c.accentText }]}>
          {saving ? "Guardando..." : "Guardar"}
        </Text>
      </Pressable>

    </SafeAreaView>
  );
}