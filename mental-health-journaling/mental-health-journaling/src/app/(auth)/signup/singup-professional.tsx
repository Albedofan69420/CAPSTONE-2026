import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';

export default function ProfesionalScreen() {
  const [run, setRun] = useState('');
  const [registro, setRegistro] = useState('');

  function continuar() {
    if (!run.trim() || !registro.trim()) {
      Alert.alert(
        'Campos obligatorios',
        'Ingresa tu RUN y número de registro profesional.'
      );
      return;
    }

    // Guardaremos los datos y avanzaremos
    // al siguiente paso del registro.
    router.push('/(auth)/signup/signup-info');
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.title}>
          Confirmación de identidad
        </Text>

        <Text style={styles.subtitle}>
          Verificaremos tu identidad en el sistema
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>RUN</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej.: 12.345.678-9"
            placeholderTextColor="#7A7A7A"
            value={run}
            onChangeText={setRun}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>
            Número de registro profesional
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu registro"
            placeholderTextColor="#7A7A7A"
            value={registro}
            onChangeText={setRegistro}
          />
        </View>

        <Pressable
          style={styles.button}
          onPress={continuar}
        >
          <Text style={styles.buttonText}>
            Siguiente
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000000',
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 28,
  },
  form: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: '#B0B0B0',
    marginTop: 4,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#2A2A2C',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#FFFFFF',
    backgroundColor: '#1C1C1E',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4DB6A0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#0B0B0B',
    fontWeight: '800',
    fontSize: 15,
  },
});