import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function SignIn() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 12 }}>
      <Text>Iniciar sesión</Text>

      {/* inserte c formulario acá */}

      <Link href="/signup">¿No tienes cuenta? Regístrate papu</Link>
    </View>
  );
}