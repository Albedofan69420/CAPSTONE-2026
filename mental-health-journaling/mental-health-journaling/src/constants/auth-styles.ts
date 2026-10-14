import { StyleSheet } from "react-native";

/**
 * Estilos repetidos en signin, signup y sus pasos.
 * Los colores NO van aquí: dependen del tema y se aplican en cada pantalla con useTheme().
 */
export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  form: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    gap: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  error: {
    fontSize: 14,
  },
  button: {
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  passwordInput: {
    paddingRight: 84,
  },
  toggle: {
    position: "absolute",
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  box: {
    flex: 1,
    maxWidth: 76,
    aspectRatio: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    fontSize: 26,
    fontWeight: "700",
  },
});