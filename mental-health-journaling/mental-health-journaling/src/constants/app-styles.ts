import { StyleSheet } from "react-native";

export const appStyles = {
  // src/app/(tabs)/index.tsx
  inicio: StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      paddingBottom: 110,
      gap: 24,
    },
    button: {
      height: 48,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "700",
    },
  }),

  // journal.tsx
  journal: StyleSheet.create({
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
  }),
};